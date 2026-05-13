from typing import Literal
from typing import Optional

from pydantic import BaseModel, Field

AssetSymbol = Literal["VTI", "VXUS", "BND", "VNQ", "GLD", "Cash"]


class AllocationInput(BaseModel):
    symbol: AssetSymbol
    weight: float = Field(ge=0, le=1)


class PortfolioAnalyzeInput(BaseModel):
    allocations: list[AllocationInput] = Field(min_length=1)
    lookback_years: int = Field(default=10, ge=1, le=40)


class PortfolioAnalyzeOutput(BaseModel):
    expected_return: float
    volatility: float
    diversification_score: int
    return_source: str = "static assumptions"
    data_as_of: Optional[str] = None
    sample_count: Optional[int] = None
    symbols_used: list[str] = []
