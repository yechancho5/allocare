from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class MarketAsset(Base):
    __tablename__ = "market_assets"

    symbol: Mapped[str] = mapped_column(String(16), primary_key=True)
    provider_symbol: Mapped[str] = mapped_column(String(16), nullable=False)
    asset_class: Mapped[str] = mapped_column(String(64), nullable=False)
    provider: Mapped[str] = mapped_column(String(32), nullable=False, default="alpha_vantage")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class MarketPrice(Base):
    __tablename__ = "market_prices"
    __table_args__ = (
        UniqueConstraint("symbol", "price_date", "provider", "interval", name="uq_market_price_symbol_date_provider_interval"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(16), index=True, nullable=False)
    price_date: Mapped[date] = mapped_column(Date, index=True, nullable=False)
    open: Mapped[float] = mapped_column(Float, nullable=False)
    high: Mapped[float] = mapped_column(Float, nullable=False)
    low: Mapped[float] = mapped_column(Float, nullable=False)
    close: Mapped[float] = mapped_column(Float, nullable=False)
    adjusted_close: Mapped[float] = mapped_column(Float, nullable=False)
    volume: Mapped[int] = mapped_column(Integer, nullable=False)
    dividend_amount: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    provider: Mapped[str] = mapped_column(String(32), nullable=False, default="alpha_vantage")
    interval: Mapped[str] = mapped_column(String(32), nullable=False, default="weekly_adjusted")
    fetched_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class MarketAssumption(Base):
    __tablename__ = "market_assumptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbols_key: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    lookback_years: Mapped[int] = mapped_column(Integer, nullable=False)
    return_source: Mapped[str] = mapped_column(String(64), nullable=False)
    data_as_of: Mapped[date] = mapped_column(Date, nullable=False)
    sample_count: Mapped[int] = mapped_column(Integer, nullable=False)
    payload_json: Mapped[str] = mapped_column(Text, nullable=False)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
