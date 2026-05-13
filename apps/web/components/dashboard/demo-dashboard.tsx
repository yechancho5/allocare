import { BarChart3, BookOpen, Gauge, Goal, PieChart, Settings, Sparkles, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { Panel } from "@/components/ui/panel";

const demoBars = [24, 30, 39, 48, 62, 73, 84, 96, 108, 119];
const allocationRows = [
  ["US equities", "45%", "bg-blue-300"],
  ["International", "20%", "bg-sky-300"],
  ["Bonds", "22%", "bg-emerald-300"],
  ["Cash buffer", "3%", "bg-slate-400"]
];

export function DemoDashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard demo"
        description="A polished preview of the Allocare workspace with clearly marked placeholder planning states."
        action={
          <Link href="/onboarding">
            <Button>Start onboarding</Button>
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<Gauge />} label="Risk score" value="6/10" detail="Placeholder moderate profile" />
        <MetricCard icon={<Target />} label="Target" value="$900k" detail="Demo retirement horizon" />
        <MetricCard icon={<BarChart3 />} label="Goal odds" value="73%" detail="Demo simulation output" />
        <MetricCard icon={<PieChart />} label="Median outcome" value="$912k" detail="Placeholder projection" />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <Panel title="Monte Carlo Preview" eyebrow="Demo state">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm leading-6 text-slate-400">Demo confidence band for a 30-year plan. Connect the API to replace this with live simulation paths.</p>
            <TrendingUp className="shrink-0 text-emerald-300" size={24} />
          </div>
          <div className="flex h-72 items-end gap-2 rounded-2xl border border-white/[0.08] bg-slate-950/55 p-4">
            {demoBars.map((height, index) => (
              <div className="flex flex-1 items-end" key={height}>
                <div className={`w-full rounded-t-lg ${index > 7 ? "bg-emerald-300/85" : "bg-blue-300/75"}`} style={{ height: `${Math.min(height, 100)}%` }} />
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Allocation" eyebrow="Placeholder">
            <div className="space-y-4">
              {allocationRows.map(([label, value, color]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs text-slate-400">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className={`h-2 rounded-full ${color}`} style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Workspace Status" eyebrow="Tabs">
            <div className="grid gap-2 text-sm text-slate-300">
              {[
                ["Overview", Gauge],
                ["Simulations", BarChart3],
                ["Portfolio", PieChart],
                ["Learn", BookOpen],
                ["Settings", Settings]
              ].map(([label, Icon]) => (
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2" key={label as string}>
                  <Icon className="text-blue-200" size={16} />
                  <span>{label as string} has a complete empty/demo state</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-2">
        <Panel title="Learning Path" eyebrow="Education">
          <div className="grid gap-3">
            {["Investing basics", "Stocks vs ETFs", "Bonds and cash"].map((title) => (
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-4" key={title}>
                <Sparkles className="text-blue-200" size={18} />
                <span className="font-semibold text-white">{title}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Goals" eyebrow="Planning">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5">
            <Goal className="text-emerald-300" size={22} />
            <p className="mt-4 font-semibold text-white">Retirement readiness placeholder</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Goal cards are demo UI until a real goal model is connected.</p>
          </div>
        </Panel>
      </section>
    </>
  );
}
