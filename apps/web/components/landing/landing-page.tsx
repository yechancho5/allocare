"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Goal,
  Landmark,
  PieChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
  WalletCards
} from "lucide-react";
import Link from "next/link";
import { AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const navLinks = [
  ["Features", "#features"],
  ["How it works", "#how-it-works"],
  ["FAQ", "#faq"]
];

const features = [
  ["Monte Carlo simulations", "Project thousands of potential outcomes so users see ranges, not false certainty.", BarChart3],
  ["Portfolio diversification analysis", "Compare allocation concentration, asset mix, and exposure in plain language.", PieChart],
  ["Risk profile quiz", "Turn beginner-friendly questions into a transparent risk score and baseline portfolio.", ClipboardCheck],
  ["AI-generated explanations", "Translate portfolio math into simple educational guidance without stock-picking.", Bot],
  ["Financial literacy modules", "Teach compound growth, volatility, bonds, ETFs, inflation, and retirement basics.", BookOpen],
  ["Goal-based investing plans", "Connect monthly savings, target dates, and portfolio design to concrete goals.", Goal]
];

const personas = [
  ["New grad", "I know I should invest, but I do not know how much risk I can handle."],
  ["Young professional", "I want to compare outcomes before changing my portfolio."],
  ["First-time saver", "I need investing explained without jargon or pressure."]
];

const faqs = [
  ["Is Allocare financial advice?", "No. Allocare is designed for educational planning, simulation, and portfolio understanding. It does not guarantee results or tell users to buy or sell specific securities."],
  ["Where does market data come from?", "The MVP uses cached Alpha Vantage weekly adjusted market history to estimate returns, volatility, and simulation inputs."],
  ["Can I use it without connecting brokerage accounts?", "Yes. The MVP supports manual portfolio entry so beginners can learn and simulate before any brokerage integration."],
  ["What makes this different from a calculator?", "Allocare combines onboarding, risk scoring, simulations, educational modules, and AI-style explanations into one guided workflow."]
];

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(16,185,129,0.1),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-40" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#07111f] to-transparent" />
      </div>

      <Navbar />
      <Hero />
      <Problem />
      <FeatureGrid />
      <HowItWorks />
      <Trust />
      <Personas />
      <PricingCta />
      <Faq />
      <Footer />
    </main>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07111f]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white text-slate-950 shadow-lg shadow-blue-500/10">
            <Landmark size={18} />
          </div>
          <span className="text-base font-semibold tracking-tight">Allocare</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-400 md:flex">
          {navLinks.map(([label, href]) => (
            <a className="transition hover:text-white" href={href} key={label}>
              {label}
            </a>
          ))}
        </nav>
        <Link href="/onboarding">
          <Button className="min-h-9 rounded-full bg-white px-4 text-slate-950 hover:bg-zinc-200">Join waitlist</Button>
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative z-10 mx-auto flex min-h-[740px] max-w-6xl flex-col items-center px-5 pb-16 pt-24 text-center lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <Badge className="border-blue-300/15 bg-blue-300/[0.08] text-blue-100">
          <Sparkles size={14} /> Allocare AI financial planning
        </Badge>
      </motion.div>
      <motion.h1
        className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.65 }}
      >
        A calmer way to plan, simulate, and understand your portfolio.
      </motion.h1>
      <motion.p
        className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.6 }}
      >
        Allocare turns goals, risk, and allocation into clear planning signals. No hype, no stock picks, no guaranteed outcomes.
      </motion.p>
      <motion.div
        className="mt-9 flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.55 }}
      >
        <Link href="/onboarding">
          <Button className="min-h-12 rounded-full bg-white px-6 text-slate-950 hover:bg-zinc-200">
            Join waitlist <ArrowRight size={17} />
          </Button>
        </Link>
        <Link href="/demo">
          <Button className="min-h-12 rounded-full border-white/[0.12] bg-white/[0.07] px-6 text-white hover:bg-white/[0.12]" variant="secondary">
            View demo
          </Button>
        </Link>
      </motion.div>
      <motion.div
        className="mt-14 w-full"
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.34, duration: 0.75 }}
      >
        <HeroDashboard />
      </motion.div>
    </section>
  );
}

function HeroDashboard() {
  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-white/[0.1] bg-white/[0.045] p-2 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#0a1422]/90 text-left">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
          </div>
          <p className="text-xs font-medium text-slate-500">Allocare advisor workspace</p>
        </div>
        <div className="grid gap-0 lg:grid-cols-[230px_1fr]">
          <div className="hidden border-r border-white/[0.08] bg-white/[0.025] p-5 lg:block">
            <p className="text-sm font-semibold text-white">Planning</p>
            <div className="mt-5 space-y-2">
              {["Overview", "Portfolio", "Simulations", "Guidance"].map((item, index) => (
                <div className={`rounded-xl px-3 py-2 text-sm ${index === 0 ? "bg-white text-slate-950" : "text-slate-500"}`} key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_300px] lg:p-6">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {[["Risk", "Moderate"], ["Confidence", "73%"], ["Projected range", "$640k-$1.2M"]].map(([label, value]) => (
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4" key={label}>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-200/80">Projection</p>
                    <p className="mt-1 text-lg font-semibold text-white">30-year confidence band</p>
                  </div>
                  <TrendingUp className="text-emerald-300" size={22} />
                </div>
                <div className="relative h-60 overflow-hidden rounded-xl border border-white/[0.08] bg-slate-950/60 p-4">
                  <div className="absolute inset-x-6 top-12 h-28 rounded-full bg-blue-400/10 blur-xl" />
                  <div className="relative flex h-full items-end gap-2">
                    {[24, 30, 39, 48, 62, 73, 84, 96, 108, 119].map((height, index) => (
                      <div className="flex flex-1 items-end" key={height}>
                        <div className={`w-full rounded-t-md ${index > 7 ? "bg-emerald-300/80" : "bg-blue-300/75"}`} style={{ height: `${Math.min(height, 100)}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 h-px bg-white/10" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">Goal progress</p>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[58%] rounded-full bg-emerald-300/80" />
                    </div>
                  </div>
                  <p className="text-xs leading-5 text-slate-400">Demo data shown for product preview. Actual projections depend on user inputs and market data.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-white">Portfolio allocation</p>
                <div className="mt-5 space-y-3">
                  {[["US equities", "45%", "bg-blue-300"], ["International", "20%", "bg-sky-300"], ["Bonds", "22%", "bg-emerald-300"], ["Cash", "3%", "bg-slate-400"]].map(([label, value, color]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs text-slate-400">
                        <span>{label}</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className={`h-2 rounded-full ${color}`} style={{ width: value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-5">
                <div className="flex items-center gap-2 text-emerald-200">
                  <Bot size={18} />
                  <p className="text-sm font-semibold">Advisor note</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Your growth exposure looks aligned with a long horizon. Consider reviewing downside tolerance before increasing equity weight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Problem() {
  return (
    <Section eyebrow="Why it matters" title="Financial planning should feel clear before it feels complex." description="Allocare keeps the decision surface simple, then explains the assumptions behind risk, allocation, and projected outcomes.">
      <div className="grid gap-4 md:grid-cols-3">
        {["Translate risk into plain language.", "Show ranges instead of single-point certainty.", "Keep recommendations educational and transparent."].map((copy) => (
          <Card className="p-6" key={copy}>
            <ShieldCheck className="text-blue-200" size={22} />
            <p className="mt-5 text-base font-medium leading-7 text-slate-200">{copy}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function FeatureGrid() {
  return (
    <Section id="features" eyebrow="Product" title="The core tools for thoughtful investing decisions." description="A focused workspace for portfolio understanding, not a trading terminal.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([title, copy, Icon]) => (
          <motion.div key={title as string} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
              <Card className="h-full transition duration-200 hover:border-white/15 hover:bg-white/[0.06]">
              <CardHeader>
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.08] text-blue-200">
                  <Icon size={21} />
                </div>
                <CardTitle>{title as string}</CardTitle>
                <CardDescription>{copy as string}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  return (
    <Section id="how-it-works" eyebrow="Workflow" title="From profile to plan in a few calm steps." description="The onboarding stays lightweight, while the workspace turns each answer into practical planning context.">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Set your goals", "Choose your timeline, target amount, retirement age, and savings capacity.", Goal],
          ["Enter your portfolio", "Use presets or sliders to compare VTI, VXUS, BND, VNQ, GLD, and cash.", WalletCards],
          ["Get simulations and explanations", "See percentile outcomes and read plain-language AI guidance.", BrainCircuit]
        ].map(([title, copy, Icon], index) => (
          <Card className="relative overflow-hidden p-6" key={title as string}>
            <p className="text-sm font-semibold text-blue-300">0{index + 1}</p>
            <Icon className="mt-8 text-emerald-300" size={26} />
            <h3 className="mt-5 text-xl font-semibold">{title as string}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy as string}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Trust() {
  return (
    <Section eyebrow="Trust" title="Built around transparency, not overconfidence." description="Allocare explains scenarios and tradeoffs without promising returns or making buy/sell calls.">
      <Card className="grid gap-6 p-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Badge className="border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-100">Educational planning</Badge>
          <h3 className="mt-5 text-2xl font-semibold">Explain the path, show the uncertainty.</h3>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Recommendations are generated from backend-calculated facts, source metadata, and clear assumptions. The product frames outcomes as educational scenarios.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {["Not personalized financial advice", "No guaranteed returns", "Transparent market data source", "No direct buy/sell stock calls"].map((item) => (
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-4" key={item}>
              <Check className="text-emerald-300" size={18} />
              <span className="text-sm text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

function Personas() {
  return (
    <Section eyebrow="Audience" title="For investors who want clarity before action." description="Designed for people building confidence with long-term investing decisions.">
      <div className="grid gap-4 md:grid-cols-3">
        {personas.map(([title, quote]) => (
          <Card className="p-6" key={title}>
            <UserRoundCheck className="text-blue-300" size={24} />
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-400">&ldquo;{quote}&rdquo;</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function PricingCta() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-5 py-20 lg:px-8">
      <Card className="overflow-hidden p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.12),transparent_32%),radial-gradient(circle_at_80%_40%,rgba(16,185,129,0.1),transparent_28%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <Badge className="border-blue-300/15 bg-blue-300/[0.08] text-blue-100">Private beta</Badge>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.03em] md:text-5xl">Try Allocare’s calmer financial planning workspace.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">Free MVP access includes onboarding, portfolio analysis, education modules, and scenario previews.</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-slate-950/30 p-5">
            <div className="flex items-center gap-3">
              <CircleDollarSign className="text-emerald-300" size={24} />
              <p className="text-lg font-semibold">Free while in beta</p>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {["Basic portfolio analysis", "Monte Carlo scenario previews", "Financial literacy modules"].map((item) => (
                <li className="flex items-center gap-2" key={item}>
                  <Check size={16} className="text-emerald-300" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/onboarding">
              <Button className="mt-6 w-full rounded-full bg-white text-slate-950 hover:bg-zinc-200">
                Join waitlist <ChevronRight size={17} />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}

function Faq() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Questions beginner investors ask first." description="Clear answers before asking users to trust a simulation.">
      <Card className="px-6">
        {faqs.map(([question, answer]) => (
          <AccordionItem answer={answer} key={question} question={question} />
        ))}
      </Card>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-slate-500 sm:flex-row">
        <p>© 2026 Allocare. Educational planning tools for beginner investors.</p>
        <div className="flex gap-5">
          <Link className="hover:text-white" href="/onboarding">Join waitlist</Link>
          <Link className="hover:text-white" href="/demo">Demo</Link>
          <a className="hover:text-white" href="#faq">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

function Section({
  id,
  eyebrow,
  title,
  description,
  children
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-5 py-20 lg:px-8" id={id}>
      <div className="mb-10 max-w-3xl">
        <Badge className="mb-5">{eyebrow}</Badge>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">{title}</h2>
        <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">{description}</p>
      </div>
      {children}
    </section>
  );
}
