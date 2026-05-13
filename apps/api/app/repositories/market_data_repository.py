import json
from datetime import date, datetime
from typing import Optional

from sqlalchemy import and_, func, select
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import Session

from app.core.allocation_presets import ASSET_ASSUMPTIONS
from app.models.market_data import MarketAsset, MarketAssumption, MarketPrice


SUPPORTED_MARKET_SYMBOLS = ["VTI", "VXUS", "BND", "VNQ", "GLD"]
PROVIDER = "alpha_vantage"
INTERVAL = "weekly_adjusted"


def seed_market_assets(db: Session) -> None:
    for symbol in SUPPORTED_MARKET_SYMBOLS:
        existing = db.get(MarketAsset, symbol)
        if existing:
            continue
        db.add(
            MarketAsset(
                symbol=symbol,
                provider_symbol=symbol,
                asset_class=ASSET_ASSUMPTIONS[symbol]["asset_class"],
                provider=PROVIDER,
            )
        )
    db.commit()


def list_market_assets(db: Session) -> list[MarketAsset]:
    seed_market_assets(db)
    return list(db.scalars(select(MarketAsset).order_by(MarketAsset.symbol)).all())


def latest_fetched_at(db: Session, symbol: str) -> Optional[datetime]:
    return db.scalar(
        select(func.max(MarketPrice.fetched_at)).where(
            and_(
                MarketPrice.symbol == symbol,
                MarketPrice.provider == PROVIDER,
                MarketPrice.interval == INTERVAL,
            )
        )
    )


def latest_price_date(db: Session, symbol: str) -> Optional[date]:
    return db.scalar(
        select(func.max(MarketPrice.price_date)).where(
            and_(
                MarketPrice.symbol == symbol,
                MarketPrice.provider == PROVIDER,
                MarketPrice.interval == INTERVAL,
            )
        )
    )


def upsert_prices(db: Session, symbol: str, prices: list[dict]) -> int:
    inserted_or_updated = 0
    fetched_at = datetime.utcnow()

    for price in prices:
        values = {
            "symbol": symbol,
            "price_date": price["price_date"],
            "open": price["open"],
            "high": price["high"],
            "low": price["low"],
            "close": price["close"],
            "adjusted_close": price["adjusted_close"],
            "volume": price["volume"],
            "dividend_amount": price["dividend_amount"],
            "provider": PROVIDER,
            "interval": INTERVAL,
            "fetched_at": fetched_at,
        }
        if db.bind and db.bind.dialect.name == "sqlite":
            statement = sqlite_insert(MarketPrice).values(**values)
            statement = statement.on_conflict_do_update(
                index_elements=["symbol", "price_date", "provider", "interval"],
                set_=values,
            )
            db.execute(statement)
        else:
            existing = db.scalar(
                select(MarketPrice).where(
                    and_(
                        MarketPrice.symbol == symbol,
                        MarketPrice.price_date == price["price_date"],
                        MarketPrice.provider == PROVIDER,
                        MarketPrice.interval == INTERVAL,
                    )
                )
            )
            if existing:
                for key, value in values.items():
                    setattr(existing, key, value)
            else:
                db.add(MarketPrice(**values))
        inserted_or_updated += 1

    db.commit()
    return inserted_or_updated


def load_adjusted_prices(db: Session, symbols: list[str], since: date) -> dict[str, list[MarketPrice]]:
    rows = db.scalars(
        select(MarketPrice)
        .where(
            and_(
                MarketPrice.symbol.in_(symbols),
                MarketPrice.price_date >= since,
                MarketPrice.provider == PROVIDER,
                MarketPrice.interval == INTERVAL,
            )
        )
        .order_by(MarketPrice.symbol, MarketPrice.price_date)
    ).all()

    grouped: dict[str, list[MarketPrice]] = {symbol: [] for symbol in symbols}
    for row in rows:
        grouped[row.symbol].append(row)
    return grouped


def save_market_assumptions(db: Session, symbols: list[str], lookback_years: int, payload: dict) -> None:
    db.add(
        MarketAssumption(
            symbols_key=",".join(sorted(symbols)),
            lookback_years=lookback_years,
            return_source=payload["return_source"],
            data_as_of=payload["data_as_of"],
            sample_count=payload["sample_count"],
            payload_json=json.dumps(payload, default=str),
        )
    )
    db.commit()
