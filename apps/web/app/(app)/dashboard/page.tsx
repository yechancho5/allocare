"use client";

import { BarChart3, Bot, Gauge, PieChart, RefreshCw, Target } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { Panel } from "@/components/ui/panel";
import { getMarketStatus, runSimulation } from "@/lib/api";
import { AssetKey, assets, baselinePreset, formatCurrency, scoreRisk } from "@/lib/finance";
import { useAllocareState } from "@/hooks/use-allocare-state";

export default function DashboardPage() {
  const { ready, profile, allocation, targetAmount, onboardingComplete } = useAllocareState();
  const riskScore = scoreRisk(profile);
  const projectedProgress = Math.min(100, Math.round((profile.currentInvestments / Math.max(targetAmount, 1)) * 100));
  const allocationRows = (Object.entries(allocation) as [AssetKey, number][]).filter(([symbol, value]) => assets[symbol] && value > 0);
  const marketStatusQuery = useQuery({ queryKey: ["market-status"], queryFn: getMarketStatus, retry: false });
  const simulationQuery = useQuery({
    queryKey: ["simulation", profile, allocation, targetAmount],
    queryFn: () => runSimulation(profile, allocation, targetAmount),
    enabled: ready && Object.values(allocation).reduce((sum, value) => sum + value, 0) === 100,
    retry: false
  });

  if (!ready) {
    return (
      <>
        <PageHeader title="Dashboard" description="Loading your local planning workspace." />
        <EmptyState title="Loading dashboard" detail="Allocare is preparing your stored profile, allocation, and target settings." />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Financial command center"
        description="A consolidated view of your risk profile, allocation, goal progress, and planning signals."
        action={
          <Link href="/onboarding">
            <Button variant="secondary">Edit profile</Button>
          </Link>
        }
      />

      {!onboardingComplete ? (
        <div className="mb-6">
          <EmptyState title="Complete your investor profile" detail="Once onboarding is finished, Allocare will personalize these planning panels with your goals, risk answers, and allocation." />
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<Gauge />} label="Portfolio health" value={`${riskScore}/10`} detail={`Risk-aligned baseline: ${baselinePreset(riskScore)}`} />
        <MetricCard icon={<Target />} label="Target" value={formatCurrency(targetAmount)} detail={`${profile.timelineYears} year horizon`} />
        <MetricCard icon={<BarChart3 />} label="Goal confidence" value={simulationQuery.data ? `${Math.round(simulationQuery.data.success_probability * 100)}%` : "Pending"} detail="Appears after simulation data loads" />
        <MetricCard icon={<PieChart />} label="Median projection" value={simulationQuery.data ? formatCurrency(simulationQuery.data.median_outcome) : "Pending"} detail="Based on connected market data" />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Monte Carlo projection" eyebrow="Scenario analysis">
          <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
            <div>
              <div className="relative h-80 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/45 p-5">
                <div className="absolute inset-x-8 top-20 h-28 rounded-full bg-blue-400/10 blur-2xl" />
                <div className="relative flex h-full items-end gap-2">
                  {(simulationQuery.data?.percentile_paths.p50.slice(0, 14) ?? [18, 22, 29, 35, 44, 52, 61, 68, 76, 83, 89, 94, 98, 100]).map((value, index, rows) => {
                    const max = Math.max(...rows.map(Number));
                    const height = simulationQuery.data ? Math.max(12, (Number(value) / max) * 100) : Number(value);
                    return (
                      <div className="flex flex-1 items-end" key={`${value}-${index}`}>
                        <div className="w-full rounded-t-md bg-blue-300/75" style={{ height: `${height}%` }} />
                      </div>
                    );
                  })}
                </div>
                <div className="absolute bottom-6 left-5 right-5 h-px bg-white/10" />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {simulationQuery.data ? "Projection reflects the latest simulation response." : "Placeholder visualization shown until the local API returns simulation data."}
              </p>
            </div>
            <div className="space-y-3">
              <DashboardStat label="Projected range" value={simulationQuery.data ? `${formatCurrency(simulationQuery.data.p10_outcome)} - ${formatCurrency(simulationQuery.data.p90_outcome)}` : "Connect API"} />
              <DashboardStat label="Downside estimate" value={simulationQuery.data ? `${Math.round(simulationQuery.data.max_drawdown_estimate * 100)}%` : "Pending"} />
              <DashboardStat label="Data source" value={simulationQuery.data?.return_source ?? "Demo state"} />
            </div>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Goal tracking" eyebrow="Progress">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">{profile.goal}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-white">{projectedProgress}% funded</p>
                </div>
                <Target className="text-emerald-300/90" size={22} />
              </div>
              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-emerald-300/80" style={{ width: `${projectedProgress}%` }} />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">Progress compares current savings and investments against your target amount.</p>
            </div>
          </Panel>

          <Panel title="AI advisor note" eyebrow="Educational">
            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.055] p-4">
              <div className="flex items-center gap-2 text-emerald-200">
                <Bot size={17} />
                <p className="text-sm font-semibold">Review before changing allocation</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Your current profile maps to a {baselinePreset(riskScore).toLowerCase()} baseline. Use simulations to compare downside range before increasing risk exposure.
              </p>
            </div>
          </Panel>
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Allocation breakdown" eyebrow="Portfolio">
          <div className="space-y-4">
            {allocationRows.map(([symbol, value]) => (
              <div key={symbol}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-white">{assets[symbol].className}</span>
                  <span className="text-slate-400">{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-blue-300/75" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Next best actions" eyebrow="Workflow">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Review portfolio", "Validate allocation weights and concentration.", "/portfolio"],
              ["Run simulation", "Compare target probability and downside range.", "/simulations"],
              ["Read guidance", "Review educational recommendations.", "/recommendations"]
            ].map(([title, copy, href]) => (
              <Link className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition hover:border-white/15 hover:bg-white/[0.06]" href={href} key={title}>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
              </Link>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-5">
        <Panel title="Market data status" eyebrow="Cache">
          {marketStatusQuery.error ? (
            <EmptyState title="Market data not connected" detail="Start the FastAPI server on port 8000 to populate live cache status and replace placeholder states." />
          ) : (
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {Object.entries(marketStatusQuery.data ?? {}).map(([symbol, date]) => (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3" key={symbol}>
                  <span className="font-semibold text-white">{symbol}</span>
                  <p className="mt-1 text-xs text-slate-500">{date ?? "Missing"}</p>
                </div>
              ))}
              {marketStatusQuery.isLoading ? <EmptyState title="Checking data cache" detail="Allocare is trying to reach the local market data endpoint." /> : null}
              <p className="flex items-center gap-2 text-xs leading-5 text-slate-500 md:col-span-3 xl:col-span-6">
                <RefreshCw size={14} /> Refresh from the API with `POST /market/refresh` when data is stale.
              </p>
            </div>
          )}
        </Panel>
      </section>
    </>
  );
}

function DashboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.01em] text-white">{value}</p>
    </div>
  );
}
