from fastapi import APIRouter

from app.core.risk_models import baseline_portfolio_type, calculate_risk_score
from app.schemas.user import UserProfileInput, UserProfileOutput

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/profile", response_model=UserProfileOutput)
def create_profile(profile: UserProfileInput) -> UserProfileOutput:
    risk_score = calculate_risk_score(profile)
    return UserProfileOutput(
        **profile.model_dump(),
        risk_score=risk_score,
        recommended_baseline_portfolio=baseline_portfolio_type(risk_score),
    )
