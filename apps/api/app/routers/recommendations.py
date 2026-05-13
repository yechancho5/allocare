from fastapi import APIRouter

from app.core.disclaimers import EDUCATIONAL_DISCLAIMER
from app.schemas.recommendation import RecommendationInput, RecommendationOutput

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.post("/generate", response_model=RecommendationOutput)
def generate_recommendation(input_data: RecommendationInput) -> RecommendationOutput:
    weights = {item.symbol: item.weight for item in input_data.allocations}
    largest_symbol, largest_weight = max(weights.items(), key=lambda item: item[1])
    action_items = [
        "Compare this allocation against the recommended baseline before changing anything.",
        "Review diversification and volatility lessons to understand the tradeoffs.",
        "Run a scenario with a higher monthly contribution to compare savings impact.",
    ]

    findings = []
    if largest_weight >= 0.75:
        findings.append(f"The portfolio is concentrated in {largest_symbol}.")
    if weights.get("Cash", 0) >= 0.15:
        findings.append("Cash is high enough to reduce long-term compounding potential.")
    if input_data.success_probability < 0.5:
        findings.append("The goal success probability is below 50% in the current simulation.")
    if not findings:
        findings.append("The allocation is reasonably diversified for a first-pass beginner portfolio.")

    return RecommendationOutput(
        summary="Your simulation has clear tradeoffs between growth potential, volatility, and goal confidence.",
        explanation=" ".join(
            [
                "Historically framed metrics suggest this portfolio has",
                f"an expected return near {input_data.expected_return:.1%}",
                f"and volatility near {input_data.volatility:.1%}.",
                *findings,
            ]
        ),
        action_items=action_items,
        disclaimer=EDUCATIONAL_DISCLAIMER,
    )
