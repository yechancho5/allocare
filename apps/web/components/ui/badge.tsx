import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.055] px-3 py-1 text-xs font-medium text-slate-200 shadow-sm backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
