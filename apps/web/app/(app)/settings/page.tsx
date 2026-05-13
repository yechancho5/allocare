"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { useAllocareState } from "@/hooks/use-allocare-state";
import { formatCurrency } from "@/lib/finance";

export default function SettingsPage() {
  const { ready, profile, targetAmount, onboardingComplete } = useAllocareState();
  if (!ready) {
    return (
      <>
        <PageHeader title="Settings" description="Loading local profile settings." />
        <EmptyState title="Loading settings" detail="Allocare is reading the MVP profile stored in this browser." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Settings" description="Review stored MVP profile state and update onboarding inputs." />
      <Panel
        title="Local Profile"
        eyebrow="Stored in browser"
        action={
          <Link href="/onboarding">
            <Button variant="secondary">Edit onboarding</Button>
          </Link>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          <Setting label="Onboarding" value={onboardingComplete ? "Complete" : "Incomplete"} />
          <Setting label="Age" value={`${profile.age}`} />
          <Setting label="Goal" value={profile.goal} />
          <Setting label="Monthly savings" value={formatCurrency(profile.monthlySavings)} />
          <Setting label="Current savings" value={formatCurrency(profile.currentInvestments)} />
          <Setting label="Target" value={formatCurrency(targetAmount)} />
        </div>
      </Panel>
    </>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}
