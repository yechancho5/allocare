from app.core.risk_models import baseline_portfolio_type, calculate_risk_score
from app.schemas.user import UserProfileInput


def test_risk_score_is_bounded() -> None:
    profile = UserProfileInput(
        age=25,
        annual_income=60000,
        monthly_savings=500,
        current_savings=10000,
        debt_amount=0,
        investment_horizon_years=30,
        retirement_target_age=60,
        primary_goal="Wealth growth",
        risk_answers=[7, 7, 7, 7],
    )

    score = calculate_risk_score(profile)

    assert 1 <= score <= 10
    assert baseline_portfolio_type(score) == "Aggressive"
