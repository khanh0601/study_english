import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getSession } from "@/server/auth/session";
import { getAllLessons } from "@/server/db/storage";
import { AppShell } from "@/components/layout/AppShell";
import { CustomScenarioGenerator } from "@/components/lessons/CustomScenarioGenerator";

export default async function LearnListPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const lessons = getAllLessons();

  return (
    <AppShell user={session}>
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-1 border-b border-[var(--border)] pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Curriculum Library & Sentence Practice
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Choose lessons across practical domains (Daily, Work, Developer, Travel) or generate a personalized lesson on demand.
          </p>
        </div>

        {/* AI Custom Scenario Generator */}
        <CustomScenarioGenerator />

        {/* Section Title */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
            Curriculum Tracks & Custom Lessons
          </h2>
          <span className="text-xs font-mono text-[var(--muted)]">
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} available
          </span>
        </div>

        {/* Lesson Cards List */}
        <div className="space-y-4">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4 hover:border-[var(--border-strong)] transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-[6px] text-xs font-mono font-semibold bg-[var(--surface-hover)] border border-[var(--border)]">
                    Lesson 0{idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-[6px] text-xs font-mono font-medium text-[var(--muted-subtle)] bg-[var(--surface)] border border-[var(--border)]">
                    {lesson.topic}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-[6px] text-xs font-mono font-medium text-[var(--muted)] bg-[var(--surface)]">
                    CEFR {lesson.level}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--muted)] font-mono">
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {lesson.estimatedMinutes} mins
                  </span>
                  <span>•</span>
                  <span>{lesson.exercises.length} sentences</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)]">
                  {lesson.title}
                </h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              {/* Objectives */}
              <div className="pt-2 border-t border-[var(--border)] flex flex-wrap gap-2 text-xs text-[var(--muted-subtle)]">
                {lesson.objectives.map((obj, i) => (
                  <span key={i} className="inline-flex items-center gap-1">
                    <span className="text-[var(--foreground)] font-bold">✓</span> {obj}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <Link
                  href={`/learn/${lesson.slug}`}
                  className="inline-flex items-center gap-2 px-5 h-[40px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[#262626] transition-colors cursor-pointer"
                >
                  <span>Start Lesson</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
