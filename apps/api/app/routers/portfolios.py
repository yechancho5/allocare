from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.portfolio_math import (
    calculate_diversification_score,
    calculate_market_portfolio_return,
    calculate_market_portfolio_volatility,
    calculate_portfolio_return,
    calculate_portfolio_volatility,
)
from app.schemas.portfolio import PortfolioAnalyzeInput, PortfolioAnalyzeOutput
from app.services.market_data_service import MarketDataUnavailable, calculate_market_assumptions

router = APIRouter(prefix="/portfolios", tags=["portfolios"])


@router.post("/analyze", response_model=PortfolioAnalyzeOutput)
def analyze_portfolio(input_data: PortfolioAnalyzeInput, db: Session = Depends(get_db)) -> PortfolioAnalyzeOutput:
    try:
        assumptions = calculate_market_assumptions(
            db,
            [item.symbol for item in input_data.allocations],
            input_data.lookback_years,
        )
        return PortfolioAnalyzeOutput(
            expected_return=calculate_market_portfolio_return(input_data.allocations, assumptions),
            volatility=calculate_market_portfolio_volatility(input_data.allocations, assumptions),
            diversification_score=calculate_diversification_score(input_data.allocations),
            return_source=assumptions.return_source,
            data_as_of=assumptions.data_as_of.isoformat(),
            sample_count=assumptions.sample_count,
            symbols_used=assumptions.symbols_used,
        )
    except MarketDataUnavailable as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
