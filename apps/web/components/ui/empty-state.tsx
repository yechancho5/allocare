import { AlertCircle } from "lucide-react";

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.035] p-6 text-center backdrop-blur">
      <AlertCircle className="mx-auto text-blue-200/80" size={24} />
      <p className="mt-3 font-semibold text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  );
}
