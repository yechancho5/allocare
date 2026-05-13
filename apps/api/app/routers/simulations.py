from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.monte_carlo import run_market_monte_carlo_simulation
from app.database import get_db
from app.schemas.simulation import MonteCarloInput, MonteCarloOutput
from app.services.market_data_service import MarketDataUnavailable, calculate_market_assumptions

router = APIRouter(prefix="/simulations", tags=["simulations"])


@router.post("/run", response_model=MonteCarloOutput)
def run_simulation(input_data: MonteCarloInput, db: Session = Depends(get_db)) -> dict:
    try:
        assumptions = calculate_market_assumptions(
            db,
            [item.symbol for item in input_data.allocations],
            input_data.lookback_years,
        )
        return run_market_monte_carlo_simulation(input_data, assumptions)
    except MarketDataUnavailable as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
