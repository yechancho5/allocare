from datetime import date, timedelta

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.repositories.market_data_repository import upsert_prices
from app.schemas.portfolio import AllocationInput
from app.services.market_data_service import calculate_market_assumptions
from app.core.portfolio_math import calculate_market_portfolio_return, calculate_market_portfolio_volatility


def test_market_assumptions_are_derived_from_cached_adjusted_prices() -> None:
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    session_factory = sessionmaker(bind=engine)
    db = session_factory()
    symbols = ["VTI", "BND"]
    start = date.today() - timedelta(weeks=90)

    for symbol, base in [("VTI", 100.0), ("BND", 80.0)]:
        prices = []
        for week in range(90):
            adjusted_close = base * (1 + 0.001 * (week + 1))
            prices.append(
                {
                    "price_date": start + timedelta(weeks=week),
                    "open": adjusted_close,
                    "high": adjusted_close,
                    "low": adjusted_close,
                    "close": adjusted_close,
                    "adjusted_close": adjusted_close,
                    "volume": 1000,
                    "dividend_amount": 0,
                }
            )
        upsert_prices(db, symbol, prices)

    assumptions = calculate_market_assumptions(db, symbols, lookback_years=2)
    allocations = [
        AllocationInput(symbol="VTI", weight=0.6),
        AllocationInput(symbol="BND", weight=0.4),
    ]

    assert assumptions.return_source == "alpha_vantage_weekly_adjusted"
    assert assumptions.sample_count >= 52
    assert calculate_market_portfolio_return(allocations, assumptions) > 0
    assert calculate_market_portfolio_volatility(allocations, assumptions) >= 0
