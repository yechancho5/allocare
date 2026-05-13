"use client";

import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { analyzePortfolio, generateRecommendations, runSimulation } from "@/lib/api";
import { Allocation, UserProfile } from "@/lib/finance";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";

export function RecommendationList({
  riskScore,
  profile,
  allocation,
  targetAmount
}: {
  riskScore: number;
  profile: UserProfile;
  allocation: Allocation;
  targetAmount: number;
}) {
  const totalAllocation = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  const analysisQuery = useQuery({
    queryKey: ["portfolio-analysis", allocation],
    queryFn: () => analyzePortfolio(allocation),
    enabled: totalAllocation === 100,
    retry: false
  });
  const simulationQuery = useQuery({
    queryKey: ["simulation", profile, allocation, targetAmount],
    queryFn: () => runSimulation(profile, allocation, targetAmount),
    enabled: totalAllocation === 100,
    retry: false
  });
  const recommendationQuery = useQuery({
    queryKey: ["recommendations", riskScore, allocation, analysisQuery.data, simulationQuery.data],
    queryFn: () => generateRecommendations(riskScore, allocation, analysisQuery.data!, simulationQuery.data!),
    enabled: Boolean(analysisQuery.data && simulationQuery.data),
    retry: false
  });

  const error = analysisQuery.error?.message ?? simulationQuery.error?.message ?? recommendationQuery.error?.message;

  return (
    <Panel title="Personalized Guidance" eyebrow="Educational recommendations">
      {error ? (
        <EmptyState title="Recommendations unavailable" detail={error} />
      ) : recommendationQuery.data ? (
        <div className="space-y-3">
          {[recommendationQuery.data.explanation, ...recommendationQuery.data.action_items].map((note) => (
            <div className="flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4" key={note}>
              <ArrowRight className="mt-1 shrink-0 text-blue-200" size={17} />
              <p className="text-sm leading-6 text-slate-300">{note}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">{recommendationQuery.data.disclaimer}</div>
        </div>
      ) : (
        <EmptyState title="Generating guidance" detail="Allocare is combining your profile, portfolio metrics, and simulation result." />
      )}
    </Panel>
  );
}
