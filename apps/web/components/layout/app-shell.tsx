"use client";

import { BarChart3, BookOpen, Bot, Gauge, Landmark, PieChart, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/simulations", label: "Simulations", icon: BarChart3 },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/recommendations", label: "Recommendations", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#07111f] text-white page-grid">
      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-5 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-5 rounded-2xl border border-white/[0.08] bg-slate-950/45 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <Link className="mb-6 flex items-center gap-3" href="/">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white text-slate-950 shadow-lg shadow-blue-500/10">
                <Landmark size={21} />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">Allocare</p>
                <p className="text-xs text-slate-500">Planning workspace</p>
              </div>
            </Link>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${active ? "bg-white text-slate-950 shadow-sm shadow-blue-500/10" : "text-slate-400 hover:bg-white/[0.06] hover:text-white"}`}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="mb-4 rounded-2xl border border-white/[0.08] bg-slate-950/45 p-3 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <Link className="flex items-center gap-2 font-semibold text-white" href="/">
                <Landmark size={20} /> Allocare
              </Link>
              <Link className="rounded-xl border border-white/[0.08] bg-white/[0.055] p-2 text-slate-300" href="/onboarding" aria-label="Profile">
                <UserRound size={18} />
              </Link>
            </div>
            <nav className="flex gap-2 overflow-x-auto pb-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium ${active ? "bg-white text-slate-950" : "bg-white/[0.055] text-slate-400"}`}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          {children}
        </div>
      </div>
    </main>
  );
}
