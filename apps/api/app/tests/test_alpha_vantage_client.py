from datetime import date

import pytest

from app.services.alpha_vantage_client import AlphaVantageError, parse_weekly_adjusted_response


def test_parse_weekly_adjusted_response_uses_adjusted_close() -> None:
    payload = {
        "Weekly Adjusted Time Series": {
            "2024-01-12": {
                "1. open": "100.00",
                "2. high": "110.00",
                "3. low": "99.00",
                "4. close": "108.00",
                "5. adjusted close": "107.50",
                "6. volume": "12345",
                "7. dividend amount": "0.1200",
            }
        }
    }

    prices = parse_weekly_adjusted_response("VTI", payload)

    assert prices[0]["price_date"] == date(2024, 1, 12)
    assert prices[0]["adjusted_close"] == 107.5
    assert prices[0]["close"] == 108


def test_parse_weekly_adjusted_response_surfaces_provider_note() -> None:
    with pytest.raises(AlphaVantageError):
        parse_weekly_adjusted_response("VTI", {"Note": "rate limited"})
