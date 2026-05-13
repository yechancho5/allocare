from app.core.monte_carlo import run_monte_carlo_simulation
from app.schemas.portfolio import AllocationInput
from app.schemas.simulation import MonteCarloInput


def test_monte_carlo_output_shape() -> None:
    input_data = MonteCarloInput(
        initial_value=10000,
        monthly_contribution=500,
        time_horizon_years=5,
        target_amount=75000,
        num_simulations=250,
        allocations=[
            AllocationInput(symbol="VTI", weight=0.45),
            AllocationInput(symbol="VXUS", weight=0.20),
            AllocationInput(symbol="BND", weight=0.22),
            AllocationInput(symbol="VNQ", weight=0.06),
            AllocationInput(symbol="GLD", weight=0.04),
            AllocationInput(symbol="Cash", weight=0.03),
        ],
    )

    output = run_monte_carlo_simulation(input_data)

    assert set(output["percentile_paths"]) == {"p10", "p50", "p90"}
    assert len(output["percentile_paths"]["p50"]) == 61
    assert 0 <= output["success_probability"] <= 1
