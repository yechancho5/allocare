from pydantic import BaseModel

from app.schemas.portfolio import AllocationInput


class RecommendationInput(BaseModel):
    risk_score: int
    expected_return: float
    volatility: float
    success_probability: float
    allocations: list[AllocationInput]


class RecommendationOutput(BaseModel):
    summary: str
    explanation: str
    action_items: list[str]
    disclaimer: str
