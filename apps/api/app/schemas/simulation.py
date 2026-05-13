from typing import Optional

from pydantic import BaseModel, Field

from app.schemas.portfolio import AllocationInput


class MonteCarloInput(BaseModel):
    initial_value: float = Field(ge=0)
    monthly_contribution: float = Field(ge=0)
    time_horizon_years: int = Field(ge=1, le=60)
    target_amount: float = Field(gt=0)
    num_simulations: int = Field(default=5000, ge=100, le=20000)
    allocations: list[AllocationInput] = Field(min_length=1)
    lookback_years: int = Field(default=10, ge=1, le=40)
    random_seed: int = 42


class MonteCarloOutput(BaseModel):
    median_outcome: float
    p10_outcome: float
    p90_outcome: float
    success_probability: float
    max_drawdown_estimate: float
    percentile_paths: dict[str, list[float]]
    assumptions: dict[str, object]
    return_source: str = "static assumptions"
    data_as_of: Optional[str] = None
    sample_count: Optional[int] = None
    symbols_used: list[str] = []
