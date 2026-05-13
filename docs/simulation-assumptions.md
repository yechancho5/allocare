# Simulation Assumptions

Current MVP assumptions are derived from Alpha Vantage weekly adjusted price history where market data exists.

| Symbol | Asset class | Expected return | Volatility |
| --- | --- | ---: | ---: |
| VTI | US equities | Historical weekly adjusted returns | Historical weekly adjusted covariance |
| VXUS | International equities | Historical weekly adjusted returns | Historical weekly adjusted covariance |
| BND | Bonds | Historical weekly adjusted returns | Historical weekly adjusted covariance |
| VNQ | Real estate | Historical weekly adjusted returns | Historical weekly adjusted covariance |
| GLD | Gold | Historical weekly adjusted returns | Historical weekly adjusted covariance |
| Cash | Cash | 2.0% | 1.0% |

The FastAPI Monte Carlo engine:

- Fetches and caches Alpha Vantage `TIME_SERIES_WEEKLY_ADJUSTED` data.
- Computes weekly adjusted-close returns.
- Annualizes expected returns and covariance.
- Converts annualized assumptions to monthly simulation inputs.
- Applies monthly contributions.
- Generates seeded random return paths for reproducibility.
- Returns p10, p50, and p90 percentile paths.
- Calculates success probability against the target amount.
- Estimates drawdown from path-level running peaks.

Future versions should add inflation-adjusted outputs, explicit rebalancing intervals, paid daily-adjusted data support, and scheduled refresh jobs.
