from datetime import date, datetime

from pydantic import BaseModel, Field


class MarketAssetOutput(BaseModel):
    symbol: str
    provider_symbol: str
    asset_class: str
    provider: str


class MarketPriceOutput(BaseModel):
    symbol: str
    price_date: date
    adjusted_close: float
    provider: str
    interval: str
    fetched_at: datetime


class MarketRefreshOutput(BaseModel):
    refreshed_symbols: list[str]
    skipped_symbols: list[str]
    failed_symbols: dict[str, str]
    provider: str = "alpha_vantage"
    interval: str = "weekly_adjusted"


class AssetAssumption(BaseModel):
    symbol: str
    annual_return: float
    annual_volatility: float


class MarketAssumptions(BaseModel):
    asset_assumptions: list[AssetAssumption]
    covariance_matrix: dict[str, dict[str, float]]
    return_source: str
    data_as_of: date
    sample_count: int
    symbols_used: list[str]
    lookback_years: int = Field(ge=1, le=40)
