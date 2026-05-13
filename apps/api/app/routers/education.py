from fastapi import APIRouter

from app.schemas.education import EducationModule

router = APIRouter(prefix="/education", tags=["education"])

MODULES = [
    EducationModule(
        id="investing-basics",
        title="What is investing?",
        description="Understand ownership, risk, return, and compounding.",
        difficulty="Beginner",
        estimated_minutes=5,
    ),
    EducationModule(
        id="stocks-vs-etfs",
        title="Stocks vs ETFs",
        description="Learn why diversified funds can reduce single-company risk.",
        difficulty="Beginner",
        estimated_minutes=6,
    ),
    EducationModule(
        id="bonds-cash",
        title="Bonds and cash",
        description="See how stabilizers affect downside risk and liquidity.",
        difficulty="Beginner",
        estimated_minutes=5,
    ),
    EducationModule(
        id="market-volatility",
        title="Market volatility",
        description="Prepare for drawdowns before they happen.",
        difficulty="Beginner",
        estimated_minutes=7,
    ),
]


@router.get("/modules", response_model=list[EducationModule])
def list_modules() -> list[EducationModule]:
    return MODULES
