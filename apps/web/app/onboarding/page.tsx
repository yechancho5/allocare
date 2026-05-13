"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Landmark } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NumberField } from "@/components/ui/number-field";
import { Panel } from "@/components/ui/panel";
import { Stepper } from "@/components/ui/stepper";
import { useAllocareState } from "@/hooks/use-allocare-state";
import { baselinePreset, formatCurrency, scoreRisk, UserProfile } from "@/lib/finance";

const steps = ["Basics", "Goals", "Risk", "Review"];

export default function OnboardingPage() {
  const router = useRouter();
  const { ready, profile, setProfile, targetAmount, setTargetAmount, setOnboardingComplete } = useAllocareState();
  const [step, setStep] = useState(0);

  if (!ready) {
    return <main className="min-h-screen bg-[#07111f]" />;
  }

  function updateProfile<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  const riskScore = scoreRisk(profile);
  const baseline = baselinePreset(riskScore);

  function finish() {
    setOnboardingComplete(true);
    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(16,185,129,0.1),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-40" />
      <header className="relative z-10 border-b border-white/[0.08] bg-[#07111f]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <Link className="flex items-center gap-3" href="/">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-950 shadow-lg shadow-blue-500/10">
              <Landmark size={21} />
            </div>
            <div>
              <p className="text-xl font-semibold">Allocare</p>
              <p className="text-sm text-slate-400">Onboarding</p>
            </div>
          </Link>
          <Link className="text-sm font-semibold text-slate-400 transition hover:text-white" href="/dashboard">
            Skip for now
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-5 py-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold text-blue-300">Profile setup</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">Build your investor profile.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Answer a few beginner-friendly questions so Allocare can estimate risk tolerance, baseline allocation, and long-term scenarios.
          </p>
        </div>
        <Stepper steps={steps} current={step} />
        <div className="mt-6">
          <Panel title={steps[step]} eyebrow="Profile setup">
            {step === 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                <NumberField label="Age" value={profile.age} min={18} max={70} onChange={(value) => updateProfile("age", value)} />
                <NumberField label="Annual income" value={profile.income} min={0} max={400000} step={1000} money onChange={(value) => updateProfile("income", value)} />
                <NumberField label="Monthly savings capacity" value={profile.monthlySavings} min={0} max={8000} step={50} money onChange={(value) => updateProfile("monthlySavings", value)} />
                <NumberField label="Current savings/investments" value={profile.currentInvestments} min={0} max={1000000} step={500} money onChange={(value) => updateProfile("currentInvestments", value)} />
                <NumberField label="Debt amount" value={profile.debt} min={0} max={300000} step={500} money onChange={(value) => updateProfile("debt", value)} />
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-5 md:grid-cols-2">
                <NumberField label="Investment timeline" value={profile.timelineYears} min={1} max={45} suffix="years" onChange={(value) => updateProfile("timelineYears", value)} />
                <NumberField label="Retirement target age" value={profile.retirementAge} min={40} max={80} onChange={(value) => updateProfile("retirementAge", value)} />
                <NumberField label="Target portfolio value" value={targetAmount} min={50000} max={5000000} step={25000} money onChange={setTargetAmount} />
                <label className="block text-sm font-medium text-slate-300">
                  Primary financial goal
                  <select className="mt-2 w-full rounded-xl border border-white/[0.08] bg-slate-950/80 px-3 py-2 text-white" value={profile.goal} onChange={(event) => updateProfile("goal", event.target.value as UserProfile["goal"])}>
                    {["Retirement", "Wealth growth", "House", "Emergency fund"].map((goal) => (
                      <option key={goal}>{goal}</option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-5">
                {["I can stay calm during market drops", "I prefer long-term growth over short-term stability", "My income feels stable enough to invest consistently", "I am comfortable learning about investment risk"].map((label, index) => (
                  <label className="block" key={label}>
                    <span className="flex justify-between text-sm font-medium text-slate-300">
                      {label}
                      <span>{profile.riskAnswers[index]}/7</span>
                    </span>
                    <input
                      className="range mt-2 w-full"
                      type="range"
                      min={1}
                      max={7}
                      value={profile.riskAnswers[index]}
                      onChange={(event) => {
                        const next = [...profile.riskAnswers];
                        next[index] = Number(event.target.value);
                        updateProfile("riskAnswers", next);
                      }}
                    />
                  </label>
                ))}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-4 md:grid-cols-3">
                <ReviewCard label="Risk score" value={`${riskScore}/10`} />
                <ReviewCard label="Baseline portfolio" value={baseline} />
                <ReviewCard label="Target" value={formatCurrency(targetAmount)} />
                <ReviewCard label="Monthly savings" value={formatCurrency(profile.monthlySavings)} />
                <ReviewCard label="Timeline" value={`${profile.timelineYears} years`} />
                <ReviewCard label="Goal" value={profile.goal} />
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <Button variant="secondary" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>
                <ArrowLeft size={16} /> Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>
                  Continue <ArrowRight size={16} />
                </Button>
              ) : (
                <Button onClick={finish}>
                  Finish setup <CheckCircle2 size={16} />
                </Button>
              )}
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}

function ReviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 shadow-sm">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
