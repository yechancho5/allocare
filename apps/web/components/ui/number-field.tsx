"use client";

import { formatCurrency } from "@/lib/finance";

export function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  money,
  suffix,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  money?: boolean;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-300">
      <span className="flex justify-between gap-3">
        {label}
        <span className="font-semibold text-white">{money ? formatCurrency(value) : `${value}${suffix ? ` ${suffix}` : ""}`}</span>
      </span>
      <input className="range mt-2 w-full" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
