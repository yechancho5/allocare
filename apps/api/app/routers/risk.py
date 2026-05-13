from fastapi import APIRouter
from typing import Union

from app.core.risk_models import baseline_portfolio_type, calculate_risk_score
from app.schemas.user import UserProfileInput

router = APIRouter(prefix="/risk", tags=["risk"])


@router.post("/score")
def score_risk(profile: UserProfileInput) -> dict[str, Union[int, str]]:
    risk_score = calculate_risk_score(profile)
    return {
        "risk_score": risk_score,
        "recommended_baseline_portfolio": baseline_portfolio_type(risk_score),
    }
