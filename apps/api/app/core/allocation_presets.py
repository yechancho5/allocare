ASSET_ASSUMPTIONS = {
    "VTI": {"asset_class": "US equities", "expected_return": 0.074, "volatility": 0.18},
    "VXUS": {"asset_class": "International equities", "expected_return": 0.064, "volatility": 0.19},
    "BND": {"asset_class": "Bonds", "expected_return": 0.034, "volatility": 0.055},
    "VNQ": {"asset_class": "Real estate", "expected_return": 0.060, "volatility": 0.21},
    "GLD": {"asset_class": "Gold", "expected_return": 0.035, "volatility": 0.16},
    "Cash": {"asset_class": "Cash", "expected_return": 0.020, "volatility": 0.01},
}

PRESET_ALLOCATIONS = {
    "Conservative": {"VTI": 0.28, "VXUS": 0.12, "BND": 0.42, "VNQ": 0.04, "GLD": 0.04, "Cash": 0.10},
    "Moderate": {"VTI": 0.45, "VXUS": 0.20, "BND": 0.22, "VNQ": 0.06, "GLD": 0.04, "Cash": 0.03},
    "Aggressive": {"VTI": 0.62, "VXUS": 0.25, "BND": 0.05, "VNQ": 0.05, "GLD": 0.02, "Cash": 0.01},
}
