import math
import numpy as np

from app.core.allocation_presets import ASSET_ASSUMPTIONS
from app.schemas.portfolio import AllocationInput
from app.schemas.market_data import MarketAssumptions


def validate_weights_sum_to_one(allocations: list[AllocationInput]) -> None:
    total = sum(item.weight for item in allocations)
    if not math.isclose(total, 1.0, abs_tol=0.001):
        raise ValueError(f"Allocation weights must sum to 1.0; received {total:.4f}")


def calculate_portfolio_return(allocations: list[AllocationInput]) -> float:
    validate_weights_sum_to_one(allocations)
    return sum(item.weight * ASSET_ASSUMPTIONS[item.symbol]["expected_return"] for item in allocations)


def calculate_portfolio_volatility(allocations: list[AllocationInput]) -> float:
    validate_weights_sum_to_one(allocations)
    variance = sum(
        (item.weight * ASSET_ASSUMPTIONS[item.symbol]["volatility"]) ** 2
        for item in allocations
    )
    return math.sqrt(variance) * 1.35


def calculate_diversification_score(allocations: list[AllocationInput]) -> int:
    validate_weights_sum_to_one(allocations)
    weights = {item.symbol: item.weight for item in allocations}
    largest_weight = max(weights.values())
    meaningful_assets = sum(1 for weight in weights.values() if weight >= 0.03)
    score = meaningful_assets * 1.45 - largest_weight / 0.22 + weights.get("BND", 0) / 0.28 + weights.get("VXUS", 0) / 0.28
    return max(1, min(10, round(score)))


def calculate_market_portfolio_return(allocations: list[AllocationInput], assumptions: MarketAssumptions) -> float:
    validate_weights_sum_to_one(allocations)
    returns = {item.symbol: item.annual_return for item in assumptions.asset_assumptions}
    return sum(item.weight * returns[item.symbol] for item in allocations)


def calculate_market_portfolio_volatility(allocations: list[AllocationInput], assumptions: MarketAssumptions) -> float:
    validate_weights_sum_to_one(allocations)
    symbols = [item.symbol for item in allocations]
    weights = np.array([item.weight for item in allocations], dtype="float64")
    covariance = np.array(
        [
            [assumptions.covariance_matrix[row_symbol][column_symbol] for column_symbol in symbols]
            for row_symbol in symbols
        ],
        dtype="float64",
    )
    covariance = covariance + np.eye(len(symbols)) * 1e-10
    return float(np.sqrt(weights.T @ covariance @ weights))
