"use client";

import { PageHeader } from "@/components/layout/page-header";
import { RecommendationList } from "@/components/recommendations/recommendation-list";
import { EmptyState } from "@/components/ui/empty-state";
import { useAllocareState } from "@/hooks/use-allocare-state";
import { scoreRisk } from "@/lib/finance";

export default function RecommendationsPage() {
  const { ready, profile, allocation, targetAmount } = useAllocareState();
  if (!ready) {
    return (
      <>
        <PageHeader title="Recommendations" description="Loading recommendation inputs." />
        <EmptyState title="Loading guidance" detail="Allocare is preparing your profile, allocation, and simulation inputs." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Recommendations" description="Explainable educational guidance generated from calculated profile, allocation, and simulation facts." />
      <RecommendationList riskScore={scoreRisk(profile)} profile={profile} allocation={allocation} targetAmount={targetAmount} />
    </>
  );
}
