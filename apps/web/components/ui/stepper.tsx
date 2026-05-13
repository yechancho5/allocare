export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {steps.map((step, index) => (
        <div className="flex items-center gap-2" key={step}>
          <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-semibold ${index <= current ? "bg-white text-slate-950" : "border border-white/[0.08] bg-white/[0.055] text-slate-500"}`}>
            {index + 1}
          </span>
          <span className={`text-sm font-medium ${index === current ? "text-white" : "text-slate-500"}`}>{step}</span>
        </div>
      ))}
    </div>
  );
}
