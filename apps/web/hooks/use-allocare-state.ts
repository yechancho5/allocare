"use client";

import { useMemo } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Allocation, AssetKey, presetAllocations, starterProfile, UserProfile } from "@/lib/finance";

const PROFILE_KEY = "allocare.profile";
const ALLOCATION_KEY = "allocare.allocation";
const TARGET_KEY = "allocare.targetAmount";
const COMPLETE_KEY = "allocare.onboardingComplete";
const assetKeys: AssetKey[] = ["VTI", "VXUS", "BND", "VNQ", "GLD", "Cash"];

function sanitizeAllocation(value: Allocation): Allocation {
  const fallback = presetAllocations.Moderate;
  return assetKeys.reduce((next, key) => {
    const raw = Number(value?.[key]);
    next[key] = Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : fallback[key];
    return next;
  }, {} as Allocation);
}

function sanitizeProfile(value: UserProfile): UserProfile {
  const riskAnswers = Array.isArray(value?.riskAnswers) && value.riskAnswers.length > 0 ? value.riskAnswers : starterProfile.riskAnswers;
  return {
    ...starterProfile,
    ...value,
    age: Number.isFinite(Number(value?.age)) ? Number(value.age) : starterProfile.age,
    income: Number.isFinite(Number(value?.income)) ? Number(value.income) : starterProfile.income,
    monthlySavings: Number.isFinite(Number(value?.monthlySavings)) ? Number(value.monthlySavings) : starterProfile.monthlySavings,
    currentInvestments: Number.isFinite(Number(value?.currentInvestments)) ? Number(value.currentInvestments) : starterProfile.currentInvestments,
    debt: Number.isFinite(Number(value?.debt)) ? Number(value.debt) : starterProfile.debt,
    timelineYears: Number.isFinite(Number(value?.timelineYears)) ? Number(value.timelineYears) : starterProfile.timelineYears,
    retirementAge: Number.isFinite(Number(value?.retirementAge)) ? Number(value.retirementAge) : starterProfile.retirementAge,
    riskAnswers: riskAnswers.map((answer) => Math.max(1, Math.min(7, Number(answer) || 1)))
  };
}

export function useAllocareState() {
  const [profile, setProfile, profileReady] = useLocalStorage<UserProfile>(PROFILE_KEY, starterProfile);
  const [allocation, setAllocation, allocationReady] = useLocalStorage<Allocation>(ALLOCATION_KEY, presetAllocations.Moderate);
  const [targetAmount, setTargetAmount, targetReady] = useLocalStorage<number>(TARGET_KEY, 900000);
  const [onboardingComplete, setOnboardingComplete, completeReady] = useLocalStorage<boolean>(COMPLETE_KEY, false);

  const ready = profileReady && allocationReady && targetReady && completeReady;
  const safeProfile = useMemo(() => sanitizeProfile(profile), [profile]);
  const safeAllocation = useMemo(() => sanitizeAllocation(allocation), [allocation]);
  const safeTargetAmount = Number.isFinite(Number(targetAmount)) ? Number(targetAmount) : 900000;

  return useMemo(
    () => ({
      ready,
      profile: safeProfile,
      setProfile,
      allocation: safeAllocation,
      setAllocation,
      targetAmount: safeTargetAmount,
      setTargetAmount,
      onboardingComplete: Boolean(onboardingComplete),
      setOnboardingComplete
    }),
    [allocationReady, completeReady, onboardingComplete, profileReady, ready, safeAllocation, safeProfile, safeTargetAmount, setAllocation, setOnboardingComplete, setProfile, setTargetAmount, targetReady]
  );
}
