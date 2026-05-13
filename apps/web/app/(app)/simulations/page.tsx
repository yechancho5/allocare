"use client";

import { PageHeader } from "@/components/layout/page-header";
import { SimulationPanel } from "@/components/simulation/simulation-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { useAllocareState } from "@/hooks/use-allocare-state";

export default function SimulationsPage() {
  const { ready, profile, allocation, targetAmount, setTargetAmount } = useAllocareState();
  if (!ready) {
    return (
      <>
        <PageHeader title="Simulations" description="Loading your projection inputs." />
        <EmptyState title="Loading simulations" detail="Allocare is preparing your profile, allocation, and target amount." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Simulations" description="Estimate long-term portfolio outcomes with an Alpha Vantage-backed Monte Carlo projection." />
      <SimulationPanel profile={profile} allocation={allocation} targetAmount={targetAmount} setTargetAmount={setTargetAmount} />
    </>
  );
}
