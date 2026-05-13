from datetime import date, datetime, timedelta
from time import sleep

import numpy as np
import pandas as pd
from sqlalchemy.orm import Session

from app.config import settings
from app.repositories.market_data_repository import (
    INTERVAL,
    PROVIDER,
    SUPPORTED_MARKET_SYMBOLS,
    latest_fetched_at,
    list_market_assets,
    load_adjusted_prices,
    save_market_assumptions,
    upsert_prices,
)
from app.schemas.market_data import AssetAssumption, MarketAssumptions
from app.services.alpha_vantage_client import AlphaVantageClient

CASH_RETURN = 0.02
CASH_VOLATILITY = 0.01


class MarketDataUnavailable(RuntimeError):
    pass


def refresh_market_data(db: Session, force: bool = False) -> dict:
    client = AlphaVantageClient(settings.alpha_vantage_api_key or settings.market_data_api_key)
    refreshed_symbols: list[str] = []
    skipped_symbols: list[str] = []
    failed_symbols: dict[str, str] = {}
    max_age = timedelta(hours=settings.market_cache_max_age_hours)

    list_market_assets(db)
    for index, symbol in enumerate(SUPPORTED_MARKET_SYMBOLS):
        if index > 0:
            sleep(1.2)
        fetched_at = latest_fetched_at(db, symbol)
        if fetched_at and not force and datetime.utcnow() - fetched_at < max_age:
            skipped_symbols.append(symbol)
            continue

        try:
            prices = client.fetch_weekly_adjusted(symbol)
            upsert_prices(db, symbol, prices)
            refreshed_symbols.append(symbol)
        except Exception as error:  # Provider errors should not block other symbols.
            failed_symbols[symbol] = str(error)

    return {
        "refreshed_symbols": refreshed_symbols,
        "skipped_symbols": skipped_symbols,
        "failed_symbols": failed_symbols,
        "provider": PROVIDER,
        "interval": INTERVAL,
    }


def calculate_market_assumptions(db: Session, symbols: list[str], lookback_years: int) -> MarketAssumptions:
    market_symbols = sorted(symbol for symbol in set(symbols) if symbol != "Cash")
    invalid_symbols = [symbol for symbol in market_symbols if symbol not in SUPPORTED_MARKET_SYMBOLS]
    if invalid_symbols:
        raise MarketDataUnavailable(f"Unsupported market symbols: {', '.join(invalid_symbols)}")

    if not market_symbols and "Cash" in symbols:
        payload = MarketAssumptions(
            asset_assumptions=[
                AssetAssumption(symbol="Cash", annual_return=CASH_RETURN, annual_volatility=CASH_VOLATILITY)
            ],
            covariance_matrix={"Cash": {"Cash": CASH_VOLATILITY**2}},
            return_source="cash_assumption",
            data_as_of=date.today(),
            sample_count=0,
            symbols_used=symbols,
            lookback_years=lookback_years,
        )
        save_market_assumptions(db, symbols, lookback_years, payload.model_dump())
        return payload

    since = date.today() - timedelta(days=lookback_years * 365)
    grouped = load_adjusted_prices(db, market_symbols, since)
    missing = [symbol for symbol, prices in grouped.items() if len(prices) < 52]
    if missing:
        raise MarketDataUnavailable(
            "Market cache is missing enough weekly adjusted history for "
            f"{', '.join(missing)}. Run POST /market/refresh first."
        )

    frame = pd.DataFrame(
        {
            symbol: pd.Series(
                {price.price_date: price.adjusted_close for price in prices},
                dtype="float64",
            )
            for symbol, prices in grouped.items()
        }
    ).sort_index()
    returns = frame.pct_change(fill_method=None).dropna(how="any")
    if len(returns) < 52:
        raise MarketDataUnavailable("Aligned market history has fewer than 52 weekly return observations.")

    annual_returns = ((1 + returns.mean()) ** 52) - 1
    annual_covariance = returns.cov() * 52
    annual_volatility = np.sqrt(np.diag(annual_covariance))

    asset_assumptions = [
        AssetAssumption(
            symbol=symbol,
            annual_return=float(annual_returns[symbol]),
            annual_volatility=float(annual_volatility[index]),
        )
        for index, symbol in enumerate(returns.columns)
    ]

    if "Cash" in symbols:
        asset_assumptions.append(
            AssetAssumption(symbol="Cash", annual_return=CASH_RETURN, annual_volatility=CASH_VOLATILITY)
        )

    covariance_matrix: dict[str, dict[str, float]] = {}
    for row_symbol in returns.columns:
        covariance_matrix[row_symbol] = {
            column_symbol: float(annual_covariance.loc[row_symbol, column_symbol])
            for column_symbol in returns.columns
        }

    if "Cash" in symbols:
        covariance_matrix["Cash"] = {symbol: 0.0 for symbol in symbols}
        covariance_matrix["Cash"]["Cash"] = CASH_VOLATILITY**2
        for symbol in symbols:
            covariance_matrix.setdefault(symbol, {})["Cash"] = 0.0

    payload = MarketAssumptions(
        asset_assumptions=asset_assumptions,
        covariance_matrix=covariance_matrix,
        return_source="alpha_vantage_weekly_adjusted",
        data_as_of=max(frame.index),
        sample_count=len(returns),
        symbols_used=symbols,
        lookback_years=lookback_years,
    )
    save_market_assumptions(db, symbols, lookback_years, payload.model_dump())
    return payload
