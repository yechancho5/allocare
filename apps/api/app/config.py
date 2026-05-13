import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


def _load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


api_dir = Path(__file__).resolve().parents[1]
repo_root = Path(__file__).resolve().parents[3]
_load_env_file(repo_root / ".env")
_load_env_file(api_dir / ".env")


@dataclass
class Settings:
    app_name: str = "Allocare API"
    database_url: Optional[str] = os.getenv("DATABASE_URL", "sqlite:///./allocare.db")
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
    market_data_api_key: Optional[str] = os.getenv("MARKET_DATA_API_KEY")
    alpha_vantage_api_key: Optional[str] = os.getenv("ALPHA_VANTAGE_API_KEY")
    admin_token: Optional[str] = os.getenv("ADMIN_TOKEN")
    market_cache_max_age_hours: int = int(os.getenv("MARKET_CACHE_MAX_AGE_HOURS", "24"))


settings = Settings()
