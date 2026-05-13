import type { ReactNode } from "react";

export function PageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}
