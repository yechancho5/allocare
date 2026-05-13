import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.08)] hover:bg-slate-200",
    secondary: "border border-white/[0.1] bg-white/[0.055] text-white hover:border-white/20 hover:bg-white/[0.09]",
    ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white"
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
