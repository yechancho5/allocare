import numpy as np

from app.core.portfolio_math import calculate_portfolio_return, calculate_portfolio_volatility
from app.core.portfolio_math import calculate_market_portfolio_return, calculate_market_portfolio_volatility
from app.schemas.market_data import MarketAssumptions
from app.schemas.simulation import MonteCarloInput


def run_monte_carlo_simulation(input_data: MonteCarloInput) -> dict:
    annual_return = calculate_portfolio_return(input_data.allocations)
    annual_volatility = calculate_portfolio_volatility(input_data.allocations)
    months = input_data.time_horizon_years * 12
    monthly_return = (1 + annual_return) ** (1 / 12) - 1
    monthly_volatility = annual_volatility / np.sqrt(12)
    rng = np.random.default_rng(input_data.random_seed)

    paths = np.zeros((input_data.num_simulations, months + 1))
    paths[:, 0] = input_data.initial_value

    for month in range(1, months + 1):
        sampled_returns = rng.normal(monthly_return, monthly_volatility, input_data.num_simulations)
        paths[:, month] = np.maximum(0, paths[:, month - 1] * (1 + sampled_returns) + input_data.monthly_contribution)

    final_values = paths[:, -1]
    percentile_paths = {
        "p10": np.percentile(paths, 10, axis=0).round(2).tolist(),
        "p50": np.percentile(paths, 50, axis=0).round(2).tolist(),
        "p90": np.percentile(paths, 90, axis=0).round(2).tolist(),
    }

    running_peaks = np.maximum.accumulate(paths, axis=1)
    drawdowns = np.divide(paths - running_peaks, running_peaks, out=np.zeros_like(paths), where=running_peaks != 0)

    return {
        "median_outcome": float(np.percentile(final_values, 50)),
        "p10_outcome": float(np.percentile(final_values, 10)),
        "p90_outcome": float(np.percentile(final_values, 90)),
        "success_probability": float(np.mean(final_values >= input_data.target_amount)),
        "max_drawdown_estimate": float(abs(np.percentile(drawdowns.min(axis=1), 10))),
        "percentile_paths": percentile_paths,
        "assumptions": {
            "rebalance_frequency": "annual",
            "return_source": "static MVP assumptions",
            "inflation_adjusted": False,
        },
    }


def run_market_monte_carlo_simulation(input_data: MonteCarloInput, assumptions: MarketAssumptions) -> dict:
    annual_return = calculate_market_portfolio_return(input_data.allocations, assumptions)
    annual_volatility = calculate_market_portfolio_volatility(input_data.allocations, assumptions)
    symbols = [item.symbol for item in input_data.allocations]
    weights = np.array([item.weight for item in input_data.allocations], dtype="float64")
    returns_by_symbol = {item.symbol: item.annual_return for item in assumptions.asset_assumptions}
    monthly_means = np.array([(1 + returns_by_symbol[symbol]) ** (1 / 12) - 1 for symbol in symbols], dtype="float64")
    monthly_covariance = (
        np.array(
            [
                [assumptions.covariance_matrix[row_symbol][column_symbol] for column_symbol in symbols]
                for row_symbol in symbols
            ],
            dtype="float64",
        )
        / 12
    )
    monthly_covariance = monthly_covariance + np.eye(len(symbols)) * 1e-10
    months = input_data.time_horizon_years * 12
    monthly_return = (1 + annual_return) ** (1 / 12) - 1
    monthly_volatility = annual_volatility / np.sqrt(12)
    rng = np.random.default_rng(input_data.random_seed)

    paths = np.zeros((input_data.num_simulations, months + 1))
    paths[:, 0] = input_data.initial_value

    for month in range(1, months + 1):
        try:
            asset_returns = rng.multivariate_normal(monthly_means, monthly_covariance, input_data.num_simulations)
            sampled_returns = asset_returns @ weights
        except np.linalg.LinAlgError:
            sampled_returns = rng.normal(monthly_return, monthly_volatility, input_data.num_simulations)
        paths[:, month] = np.maximum(0, paths[:, month - 1] * (1 + sampled_returns) + input_data.monthly_contribution)

    final_values = paths[:, -1]
    percentile_paths = {
        "p10": np.percentile(paths, 10, axis=0).round(2).tolist(),
        "p50": np.percentile(paths, 50, axis=0).round(2).tolist(),
        "p90": np.percentile(paths, 90, axis=0).round(2).tolist(),
    }
    running_peaks = np.maximum.accumulate(paths, axis=1)
    drawdowns = np.divide(paths - running_peaks, running_peaks, out=np.zeros_like(paths), where=running_peaks != 0)

    return {
        "median_outcome": float(np.percentile(final_values, 50)),
        "p10_outcome": float(np.percentile(final_values, 10)),
        "p90_outcome": float(np.percentile(final_values, 90)),
        "success_probability": float(np.mean(final_values >= input_data.target_amount)),
        "max_drawdown_estimate": float(abs(np.percentile(drawdowns.min(axis=1), 10))),
        "percentile_paths": percentile_paths,
        "assumptions": {
            "rebalance_frequency": "annual",
            "return_source": assumptions.return_source,
            "inflation_adjusted": False,
            "lookback_years": assumptions.lookback_years,
        },
        "return_source": assumptions.return_source,
        "data_as_of": assumptions.data_as_of.isoformat(),
        "sample_count": assumptions.sample_count,
        "symbols_used": assumptions.symbols_used,
    }
