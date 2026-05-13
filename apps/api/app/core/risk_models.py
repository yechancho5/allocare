from app.schemas.user import UserProfileInput


def calculate_risk_score(profile: UserProfileInput) -> int:
    answer_score = sum(profile.risk_answers) / len(profile.risk_answers)
    horizon_score = 10 if profile.investment_horizon_years >= 30 else 8 if profile.investment_horizon_years >= 20 else 6 if profile.investment_horizon_years >= 10 else 4
    debt_ratio = profile.debt_amount / profile.annual_income if profile.annual_income else 1
    debt_penalty = 2 if debt_ratio > 1 else 1 if debt_ratio > 0.4 else 0
    savings_rate = (profile.monthly_savings * 12) / profile.annual_income if profile.annual_income else 0
    savings_boost = 1 if savings_rate >= 0.2 else 0.5 if savings_rate >= 0.1 else 0
    return max(1, min(10, round(answer_score * 1.45 + horizon_score * 0.28 + savings_boost - debt_penalty)))


def baseline_portfolio_type(risk_score: int) -> str:
    if risk_score <= 4:
        return "Conservative"
    if risk_score <= 7:
        return "Moderate"
    return "Aggressive"
