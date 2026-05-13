import type { ReactNode } from "react";

export function MetricCard({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-4 text-blue-200/90">{icon}</div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}
