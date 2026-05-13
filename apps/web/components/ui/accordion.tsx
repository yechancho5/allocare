"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.08]">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-white transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {question}
        <ChevronDown className={cn("shrink-0 text-slate-500 transition", open && "rotate-180 text-slate-200")} size={18} />
      </button>
      {open ? <p className="pb-5 text-sm leading-6 text-slate-400">{answer}</p> : null}
    </div>
  );
}
