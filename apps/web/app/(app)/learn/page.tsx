import { BookOpen, CheckCircle2, Lock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { lessons } from "@/lib/finance";

export default function LearnPage() {
  return (
    <>
      <PageHeader title="Learn" description="Short education modules designed to explain the concepts behind each recommendation before users act." />
      <Panel title="Financial Literacy Path" eyebrow="Education">
        <div className="grid gap-4 md:grid-cols-2">
          {lessons.map((lesson) => {
            const Icon = lesson.status === "Complete" ? CheckCircle2 : lesson.status === "Locked" ? Lock : BookOpen;
            return (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4" key={lesson.title}>
                <div className="flex items-center justify-between gap-3">
                  <Icon className="text-blue-200" size={20} />
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.055] px-2 py-1 text-xs font-semibold text-slate-300">{lesson.status}</span>
                </div>
                <h3 className="mt-4 font-semibold text-white">{lesson.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{lesson.summary}</p>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}
