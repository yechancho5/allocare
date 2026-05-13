"use client";

import { useQuery } from "@tanstack/react-query";
import { analyzePortfolio } from "@/lib/api";
import { Allocation, AssetKey, assets, percent, presetAllocations } from "@/lib/finance";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";

const assetKeys = Object.keys(assets) as AssetKey[];

export function PortfolioBuilder({
  allocation,
  setAllocation
}: {
  allocation: Allocation;
  setAllocation: (allocation: Allocation) => void;
}) {
  const totalAllocation = assetKeys.reduce((sum, key) => sum + allocation[key], 0);
  const allocationIsValid = totalAllocation === 100;
  const analysisQuery = useQuery({
    queryKey: ["portfolio-analysis", allocation],
    queryFn: () => analyzePortfolio(allocation),
    enabled: allocationIsValid,
    retry: false
  });

  function setAsset(key: AssetKey, value: number) {
    setAllocation({ ...allocation, [key]: value });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Panel title="Portfolio Builder" eyebrow="Allocation">
        <div className="mb-5 flex flex-wrap gap-2">
          {(["Conservative", "Moderate", "Aggressive"] as const).map((preset) => (
            <Button key={preset} variant="secondary" onClick={() => setAllocation(presetAllocations[preset])}>
              {preset}
            </Button>
          ))}
        </div>
        <div className="space-y-4">
          {assetKeys.map((key) => (
            <label className="grid gap-2 sm:grid-cols-[72px_1fr_52px]" key={key}>
              <span className="text-sm font-semibold text-white">{key}</span>
              <input className="range w-full" type="range" min={0} max={90} value={allocation[key]} onChange={(event) => setAsset(key, Number(event.target.value))} />
              <span className="text-right text-sm text-slate-300">{allocation[key]}%</span>
            </label>
          ))}
        </div>
        <div className={`mt-5 rounded-2xl border p-3 text-sm ${allocationIsValid ? "border-white/[0.08] bg-white/[0.035] text-slate-300" : "border-orange-300/30 bg-orange-300/10 text-orange-200"}`}>
          Allocation total: {totalAllocation}%. Adjust sliders until the total equals 100%.
        </div>
      </Panel>

      <Panel title="Analysis" eyebrow="Real data">
        {!allocationIsValid ? (
          <EmptyState title="Allocation incomplete" detail="Your allocation must total 100% before Allocare can analyze it." />
        ) : analysisQuery.error ? (
          <EmptyState title="Market data unavailable" detail={analysisQuery.error.message} />
        ) : (
          <div className="grid gap-3">
            <Stat label="Expected return" value={analysisQuery.data ? percent(analysisQuery.data.expected_return) : "Loading"} />
            <Stat label="Volatility" value={analysisQuery.data ? percent(analysisQuery.data.volatility) : "Loading"} />
            <Stat label="Diversification" value={analysisQuery.data ? `${analysisQuery.data.diversification_score}/10` : "Loading"} />
            {analysisQuery.data?.data_as_of ? (
              <p className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3 text-xs leading-5 text-slate-400">
                Alpha Vantage weekly adjusted data through {analysisQuery.data.data_as_of}; {analysisQuery.data.sample_count} weekly samples.
              </p>
            ) : null}
          </div>
        )}
      </Panel>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
