import type { Allocation, AssetKey, UserProfile } from "@/lib/finance";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const assetKeys: AssetKey[] = ["VTI", "VXUS", "BND", "VNQ", "GLD", "Cash"];

export type PortfolioAnalysis = {
  expected_return: number;
  volatility: number;
  diversification_score: number;
  return_source: string;
  data_as_of: string | null;
  sample_count: number | null;
  symbols_used: string[];
};

export type SimulationOutput = {
  median_outcome: number;
  p10_outcome: number;
  p90_outcome: number;
  success_probability: number;
  max_drawdown_estimate: number;
  percentile_paths: {
    p10: number[];
    p50: number[];
    p90: number[];
  };
  return_source: string;
  data_as_of: string | null;
  sample_count: number | null;
  symbols_used: string[];
};

export type RecommendationOutput = {
  summary: string;
  explanation: string;
  action_items: string[];
  disclaimer: string;
};

export type MarketStatus = Record<string, string | null>;

export function toApiAllocations(allocation: Allocation) {
  return assetKeys.map((symbol) => ({
    symbol,
    weight: allocation[symbol] / 100
  }));
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const detail = payload?.detail;
    throw new Error(typeof detail === "string" ? detail : `Request failed with status ${response.status}`);
  }

  return response.json();
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export function getMarketStatus() {
  return getJson<MarketStatus>("/market/status");
}

export function analyzePortfolio(allocation: Allocation, lookbackYears = 10) {
  return postJson<PortfolioAnalysis>("/portfolios/analyze", {
    allocations: toApiAllocations(allocation),
    lookback_years: lookbackYears
  });
}

export function runSimulation(profile: UserProfile, allocation: Allocation, targetAmount: number, lookbackYears = 10) {
  return postJson<SimulationOutput>("/simulations/run", {
    initial_value: profile.currentInvestments,
    monthly_contribution: profile.monthlySavings,
    time_horizon_years: profile.timelineYears,
    target_amount: targetAmount,
    num_simulations: 5000,
    allocations: toApiAllocations(allocation),
    lookback_years: lookbackYears
  });
}

export function generateRecommendations(
  riskScore: number,
  allocation: Allocation,
  analysis: PortfolioAnalysis,
  simulation: SimulationOutput
) {
  return postJson<RecommendationOutput>("/recommendations/generate", {
    risk_score: riskScore,
    expected_return: analysis.expected_return,
    volatility: analysis.volatility,
    success_probability: simulation.success_probability,
    allocations: toApiAllocations(allocation)
  });
}

export function simulationRows(simulation: SimulationOutput | undefined, startAge: number) {
  if (!simulation) return [];
  const months = simulation.percentile_paths.p50.length;
  const rows = [];
  for (let month = 0; month < months; month += 12) {
    rows.push({
      year: startAge + month / 12,
      low: Math.round(simulation.percentile_paths.p10[month]),
      median: Math.round(simulation.percentile_paths.p50[month]),
      high: Math.round(simulation.percentile_paths.p90[month])
    });
  }
  return rows;
}
