from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import require_admin_token
from app.database import get_db
from app.repositories.market_data_repository import latest_price_date, list_market_assets
from app.schemas.market_data import MarketAssetOutput, MarketPriceOutput, MarketRefreshOutput
from app.services.alpha_vantage_client import AlphaVantageError
from app.services.market_data_service import refresh_market_data

router = APIRouter(prefix="/market", tags=["market"])


@router.get("/assets", response_model=list[MarketAssetOutput])
def assets(db: Session = Depends(get_db)) -> list[dict]:
    return [
        {
            "symbol": asset.symbol,
            "provider_symbol": asset.provider_symbol,
            "asset_class": asset.asset_class,
            "provider": asset.provider,
        }
        for asset in list_market_assets(db)
    ]


@router.get("/history/{symbol}", response_model=list[MarketPriceOutput])
def history(symbol: str, db: Session = Depends(get_db)) -> list[MarketPriceOutput]:
    from sqlalchemy import select

    from app.models.market_data import MarketPrice

    rows = db.scalars(
        select(MarketPrice)
        .where(MarketPrice.symbol == symbol)
        .order_by(MarketPrice.price_date.desc())
        .limit(260)
    ).all()
    return [
        MarketPriceOutput(
            symbol=row.symbol,
            price_date=row.price_date,
            adjusted_close=row.adjusted_close,
            provider=row.provider,
            interval=row.interval,
            fetched_at=row.fetched_at,
        )
        for row in rows
    ]


@router.post("/refresh", response_model=MarketRefreshOutput, dependencies=[Depends(require_admin_token)])
def refresh(force: bool = False, db: Session = Depends(get_db)) -> dict:
    try:
        result = refresh_market_data(db, force)
    except AlphaVantageError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    if result["failed_symbols"] and not result["refreshed_symbols"] and not result["skipped_symbols"]:
        raise HTTPException(status_code=502, detail=result)
    return result


@router.get("/status")
def status(db: Session = Depends(get_db)) -> dict:
    return {
        symbol: latest_price_date(db, symbol).isoformat() if latest_price_date(db, symbol) else None
        for symbol in ["VTI", "VXUS", "BND", "VNQ", "GLD"]
    }
