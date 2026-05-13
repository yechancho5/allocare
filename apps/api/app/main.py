from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import education, health, market_data, portfolios, recommendations, risk, simulations, users

app = FastAPI(title="Allocare API", version="0.1.0")


@app.on_event("startup")
def startup() -> None:
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(users.router)
app.include_router(risk.router)
app.include_router(portfolios.router)
app.include_router(simulations.router)
app.include_router(recommendations.router)
app.include_router(education.router)
app.include_router(market_data.router)
