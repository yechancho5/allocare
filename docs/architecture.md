# Architecture

Allocare uses a monorepo with a Next.js frontend and FastAPI backend.

```txt
apps/web  -> dashboard UI, onboarding, charts, education, recommendations
apps/api  -> profile scoring, portfolio math, Monte Carlo simulation, recommendation findings
```

The backend keeps finance calculations in `core/` so simulation logic can be tested without API, database, or AI dependencies.

## API Boundaries

- `POST /market/refresh` fetches and caches Alpha Vantage weekly adjusted prices.
- `GET /market/assets` lists supported market symbols.
- `GET /market/history/{symbol}` returns cached adjusted price history.
- `POST /users/profile` calculates risk score and baseline portfolio.
- `POST /risk/score` returns a risk-only response.
- `POST /portfolios/analyze` validates allocation weights and returns real-data expected return, volatility, diversification score, and source metadata.
- `POST /simulations/run` runs deterministic-seeded Monte Carlo simulations using cached market assumptions.
- `POST /recommendations/generate` converts structured findings into education-first guidance.
- `GET /education/modules` returns starter learning modules.

## Future Integrations

- Supabase or Neon Postgres for persisted users, portfolios, simulations, education progress, and market data.
- Supabase Auth, Clerk, or Auth.js for user authentication.
- A scheduled job for daily `POST /market/refresh`.
- OpenAI or Claude for structured explanation generation after backend facts are calculated.
