"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { runSimulation, simulationRows } from "@/lib/api";
import { Allocation, formatCurrency, UserProfile } from "@/lib/finance";
import { EmptyState } from "@/components/ui/empty-state";
import { NumberField } from "@/components/ui/number-field";
import { Panel } from "@/components/ui/panel";

export function SimulationPanel({
  profile,
  allocation,
  targetAmount,
  setTargetAmount
}: {
  profile: UserProfile;
  allocation: Allocation;
  targetAmount: number;
  setTargetAmount: (value: number) => void;
}) {
  const totalAllocation = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  const simulationQuery = useQuery({
    queryKey: ["simulation", profile, allocation, targetAmount],
    queryFn: () => runSimulation(profile, allocation, targetAmount),
    enabled: totalAllocation === 100,
    retry: false
  });
  const rows = useMemo(() => simulationRows(simulationQuery.data, profile.age), [simulationQuery.data, profile.age]);

  return (
    <Panel title="Monte Carlo Simulation" eyebrow="Projection">
      {totalAllocation !== 100 ? (
        <EmptyState title="Allocation incomplete" detail="Set portfolio weights to 100% before running a simulation." />
      ) : simulationQuery.error ? (
        <EmptyState title="Simulation unavailable" detail={simulationQuery.error.message} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} stroke="#a1a1aa" />
                <YAxis tickLine={false} axisLine={false} stroke="#a1a1aa" tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`} width={62} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(label) => `Age ${label}`} />
                <Area type="monotone" dataKey="high" stroke="#60a5fa" fill="rgba(96,165,250,0.16)" strokeWidth={2} name="90th percentile" />
                <Area type="monotone" dataKey="median" stroke="#34d399" fill="rgba(52,211,153,0.14)" strokeWidth={3} name="Median" />
                <Area type="monotone" dataKey="low" stroke="#c084fc" fill="rgba(192,132,252,0.12)" strokeWidth={2} name="10th percentile" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <NumberField label="Target portfolio" value={targetAmount} min={50000} max={5000000} step={25000} money onChange={setTargetAmount} />
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
              <p className="text-sm text-slate-400">Goal success probability</p>
              <p className="mt-2 text-4xl font-semibold text-white">{simulationQuery.data ? Math.round(simulationQuery.data.success_probability * 100) : 0}%</p>
              <div className="mt-4 h-3 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-emerald-300" style={{ width: `${simulationQuery.data ? simulationQuery.data.success_probability * 100 : 0}%` }} />
              </div>
            </div>
            {simulationQuery.data ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">
                Median outcome: {formatCurrency(simulationQuery.data.median_outcome)}. 10th percentile: {formatCurrency(simulationQuery.data.p10_outcome)}.
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-sm text-slate-400">Loading real market simulation.</div>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}
