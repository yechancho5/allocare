"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { PortfolioBuilder } from "@/components/portfolio/portfolio-builder";
import { useAllocareState } from "@/hooks/use-allocare-state";

export default function PortfolioPage() {
  const { ready, allocation, setAllocation } = useAllocareState();
  if (!ready) {
    return (
      <>
        <PageHeader title="Portfolio" description="Loading your saved allocation workspace." />
        <EmptyState title="Loading portfolio" detail="Allocare is preparing the portfolio builder and stored allocation sliders." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Portfolio" description="Build a diversified allocation, compare presets, and analyze return, volatility, and diversification from cached market history." />
      <PortfolioBuilder allocation={allocation} setAllocation={setAllocation} />
    </>
  );
}
