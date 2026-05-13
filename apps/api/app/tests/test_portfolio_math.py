import pytest

from app.core.portfolio_math import calculate_diversification_score, calculate_portfolio_return
from app.schemas.portfolio import AllocationInput


def test_portfolio_return_requires_weights_to_sum_to_one() -> None:
    allocations = [
        AllocationInput(symbol="VTI", weight=0.5),
        AllocationInput(symbol="BND", weight=0.2),
    ]

    with pytest.raises(ValueError):
        calculate_portfolio_return(allocations)


def test_diversification_score_returns_scale_value() -> None:
    allocations = [
        AllocationInput(symbol="VTI", weight=0.45),
        AllocationInput(symbol="VXUS", weight=0.20),
        AllocationInput(symbol="BND", weight=0.22),
        AllocationInput(symbol="VNQ", weight=0.06),
        AllocationInput(symbol="GLD", weight=0.04),
        AllocationInput(symbol="Cash", weight=0.03),
    ]

    assert 1 <= calculate_diversification_score(allocations) <= 10
