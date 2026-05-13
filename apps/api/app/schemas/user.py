from typing import Literal

from pydantic import BaseModel, Field

PrimaryGoal = Literal["Retirement", "Wealth growth", "House", "Emergency fund"]


class UserProfileInput(BaseModel):
    age: int = Field(ge=18, le=100)
    annual_income: float = Field(ge=0)
    monthly_savings: float = Field(ge=0)
    current_savings: float = Field(ge=0)
    debt_amount: float = Field(ge=0)
    investment_horizon_years: int = Field(ge=1, le=60)
    retirement_target_age: int = Field(ge=40, le=100)
    primary_goal: PrimaryGoal
    risk_answers: list[int] = Field(min_length=4, max_length=8)


class UserProfileOutput(UserProfileInput):
    risk_score: int
    recommended_baseline_portfolio: str
