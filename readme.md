# Allocare

Beginner-first AI financial planning MVP focused on education, simulation, portfolio intelligence, and explainable guidance.

## Repository Layout

```txt
apps/web   Next.js + React + TypeScript + Tailwind + Recharts
apps/api   FastAPI + Pydantic + NumPy simulation service
docs       Architecture, compliance, and simulation notes
```

## Run Locally

```bash
npm install
npm run dev
```

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Real Market Data

Allocare now uses backend-calculated market assumptions instead of frontend dummy return data.

1. Create `.env` values for the API:

```bash
ALPHA_VANTAGE_API_KEY=your_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/allocare
ADMIN_TOKEN=local-dev-token
```

2. Start Postgres and the API:

```bash
docker compose up -d db
cd apps/api
uvicorn app.main:app --reload
```

3. Refresh Alpha Vantage weekly adjusted data:

```bash
curl -X POST "http://localhost:8000/market/refresh?force=true" \
  -H "X-Admin-Token: local-dev-token"
```

The dashboard calls the API for portfolio analysis, simulations, and recommendations. If the cache is empty, the UI shows an explicit market-data error instead of using fake fallback assumptions.

## MVP Scope

- Onboarding and financial profile inputs
- Risk score and baseline portfolio recommendation
- Portfolio allocation builder for VTI, VXUS, BND, VNQ, GLD, and Cash
- Simulation dashboard with Alpha Vantage-backed percentile paths and goal probability
- Beginner education modules
- Explainable recommendation endpoint with educational disclaimer
