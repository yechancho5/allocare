from datetime import date
from typing import Optional

import httpx


class AlphaVantageError(RuntimeError):
    pass


class AlphaVantageClient:
    base_url = "https://www.alphavantage.co/query"

    def __init__(self, api_key: Optional[str]):
        if not api_key:
            raise AlphaVantageError("ALPHA_VANTAGE_API_KEY is required to refresh market data.")
        self.api_key = api_key

    def fetch_weekly_adjusted(self, symbol: str) -> list[dict]:
        response = httpx.get(
            self.base_url,
            params={
                "function": "TIME_SERIES_WEEKLY_ADJUSTED",
                "symbol": symbol,
                "apikey": self.api_key,
            },
            timeout=30,
        )
        response.raise_for_status()
        return parse_weekly_adjusted_response(symbol, response.json())


def parse_weekly_adjusted_response(symbol: str, payload: dict) -> list[dict]:
    if "Note" in payload:
        raise AlphaVantageError(payload["Note"])
    if "Information" in payload:
        raise AlphaVantageError(payload["Information"])
    if "Error Message" in payload:
        raise AlphaVantageError(payload["Error Message"])

    series = payload.get("Weekly Adjusted Time Series")
    if not isinstance(series, dict):
        raise AlphaVantageError(f"Alpha Vantage did not return weekly adjusted data for {symbol}.")

    prices = []
    for raw_date, values in series.items():
        prices.append(
            {
                "price_date": date.fromisoformat(raw_date),
                "open": float(values["1. open"]),
                "high": float(values["2. high"]),
                "low": float(values["3. low"]),
                "close": float(values["4. close"]),
                "adjusted_close": float(values["5. adjusted close"]),
                "volume": int(values["6. volume"]),
                "dividend_amount": float(values["7. dividend amount"]),
            }
        )

    return sorted(prices, key=lambda item: item["price_date"])
