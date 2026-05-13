import type { ReactNode } from "react";

export function Panel({
  title,
  eyebrow,
  children,
  action
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.14em] text-blue-200/80">{eyebrow}</p> : null}
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.01em] text-white">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
