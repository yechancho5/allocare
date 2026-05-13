from fastapi import Header, HTTPException
from typing import Optional

from app.config import settings


def require_admin_token(x_admin_token: Optional[str] = Header(default=None)) -> None:
    if not settings.admin_token:
        return
    if x_admin_token != settings.admin_token:
        raise HTTPException(status_code=401, detail="Invalid admin token.")
