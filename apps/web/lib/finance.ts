export type Goal = "Retirement" | "Wealth growth" | "House" | "Emergency fund";
export type PortfolioPreset = "Conservative" | "Moderate" | "Aggressive" | "Custom";

export type UserProfile = {
  age: number;
  income: number;
  monthlySavings: number;
  currentInvestments: number;
  debt: number;
  timelineYears: number;
  retirementAge: number;
  goal: Goal;
  riskAnswers: number[];
};

export type AssetKey = "VTI" | "VXUS" | "BND" | "VNQ" | "GLD" | "Cash";

export type AssetAssumption = {
  label: string;
  className: string;
  color: string;
};

export type Allocation = Record<AssetKey, number>;

export const assets: Record<AssetKey, AssetAssumption> = {
  VTI: { label: "VTI", className: "US equities", color: "#245545" },
  VXUS: { label: "VXUS", className: "International", color: "#4f7d95" },
  BND: { label: "BND", className: "Bonds", color: "#d69b2d" },
  VNQ: { label: "VNQ", className: "Real estate", color: "#9f6a45" },
  GLD: { label: "GLD", className: "Gold", color: "#c7a33f" },
  Cash: { label: "Cash", className: "Cash", color: "#8b948d" }
};

export const presetAllocations: Record<PortfolioPreset, Allocation> = {
  Conservative: { VTI: 28, VXUS: 12, BND: 42, VNQ: 4, GLD: 4, Cash: 10 },
  Moderate: { VTI: 45, VXUS: 20, BND: 22, VNQ: 6, GLD: 4, Cash: 3 },
  Aggressive: { VTI: 62, VXUS: 25, BND: 5, VNQ: 5, GLD: 2, Cash: 1 },
  Custom: { VTI: 45, VXUS: 20, BND: 22, VNQ: 6, GLD: 4, Cash: 3 }
};

const assetKeys = Object.keys(assets) as AssetKey[];

export function scoreRisk(profile: UserProfile) {
  const answerScore = profile.riskAnswers.reduce((sum, answer) => sum + answer, 0) / profile.riskAnswers.length;
  const horizonScore = profile.timelineYears >= 30 ? 10 : profile.timelineYears >= 20 ? 8 : profile.timelineYears >= 10 ? 6 : 4;
  const debtRatio = profile.income > 0 ? profile.debt / profile.income : 1;
  const debtPenalty = debtRatio > 1 ? 2 : debtRatio > 0.4 ? 1 : 0;
  const savingsRate = profile.income > 0 ? (profile.monthlySavings * 12) / profile.income : 0;
  const savingsBoost = savingsRate >= 0.2 ? 1 : savingsRate >= 0.1 ? 0.5 : 0;

  return Math.max(1, Math.min(10, Math.round(answerScore * 1.45 + horizonScore * 0.28 + savingsBoost - debtPenalty)));
}

export function baselinePreset(riskScore: number): PortfolioPreset {
  if (riskScore <= 4) return "Conservative";
  if (riskScore <= 7) return "Moderate";
  return "Aggressive";
}

export function normalizeAllocation(allocation: Allocation): Allocation {
  const total = assetKeys.reduce((sum, key) => sum + allocation[key], 0);
  if (total === 100) return allocation;
  const normalized = { ...allocation };
  const diff = 100 - total;
  normalized.Cash = Math.max(0, normalized.Cash + diff);
  return normalized;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function percent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

export const starterProfile: UserProfile = {
  age: 27,
  income: 78000,
  monthlySavings: 650,
  currentInvestments: 18500,
  debt: 12000,
  timelineYears: 30,
  retirementAge: 60,
  goal: "Wealth growth",
  riskAnswers: [5, 6, 6, 5]
};

export const lessons = [
  {
    title: "Investing Basics",
    status: "Complete",
    summary: "How ownership, time, and compounding work together."
  },
  {
    title: "Stocks vs ETFs",
    status: "Suggested",
    summary: "Why broad funds can reduce single-company risk."
  },
  {
    title: "Bonds and Cash",
    status: "Next",
    summary: "How stabilizers change downside and liquidity."
  },
  {
    title: "Market Volatility",
    status: "Locked",
    summary: "What drawdowns mean before they happen."
  }
];
