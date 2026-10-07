"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { DailyPlan } from "@/server/db/storage";
import { useLanguage } from "@/i18n/LanguageContext";

interface PlannerClientProps {
  initialPlan: DailyPlan;
  localDate: string;
}

export function PlannerClient({ initialPlan, localDate }: PlannerClientProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");
  const [plan, setPlan] = useState<DailyPlan>(initialPlan);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  async function handleToggleItem(itemId: string) {
    setLoadingItemId(itemId);
    try {
      const res = await fetch("/api/planner/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planItemId: itemId }),
      });
      const data = await res.json();
      if (res.ok && data.plan) {
        setPlan(data.plan);
      }
    } catch {
      alert("Unable to update plan item at this time.");
    } finally {
      setLoadingItemId(null);
    }
  }

  const completedCount = plan.items.filter((i) => i.completed).length;
  const totalCount = plan.items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const weekSchedule = [
    { day: "Monday", topic: "Present Simple & Daily Habits", status: "completed" },
    { day: "Tuesday", topic: "Work Updates (Present Perfect)", status: "completed" },
    { day: "Wednesday (Today)", topic: "Tech & Developer Bugs (Conditionals)", status: "current" },
    { day: "Thursday", topic: "Travel & Reservations (Polite Requests)", status: "upcoming" },
    { day: "Friday", topic: "Meeting Discussions & Action Items", status: "upcoming" },
    { day: "Saturday", topic: "System Architecture & Trade-offs", status: "upcoming" },
    { day: "Sunday", topic: "Weekly Review & Spaced Repetition (No new lesson)", status: "review" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <Calendar size={13} />
            <span>Timezone Asia/Ho_Chi_Minh • {localDate}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {t("plannerTitle")}
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {t("plannerSubtitle")}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[var(--surface-hover)] border border-[var(--border)] p-1 rounded-[10px] self-start md:self-auto">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-4 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "today"
                ? "bg-[var(--surface-raised)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab("week")}
            className={`px-4 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "week"
                ? "bg-[var(--surface-raised)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
            }`}
          >
            7-Day Plan
          </button>
        </div>
      </div>

      {activeTab === "today" ? (
        <div className="space-y-6">
          {/* Daily Status Banner */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
                  Today's Progress
                </span>
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  {completedCount === totalCount
                    ? "Well done! You have completed all objectives today"
                    : `${completedCount} of ${totalCount} items completed`}
                </h2>
              </div>
              <span className="text-xs font-mono text-[var(--muted)]">
                {progressPercent}% completed
              </span>
            </div>

            <div className="h-[6px] w-full bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Plan items list */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
              Today's Action Items
            </h3>

            {plan.items.map((item) => (
              <div
                key={item.id}
                className={`bg-[var(--surface-raised)] border rounded-[14px] p-5 flex items-start justify-between gap-4 transition-colors ${
                  item.completed
                    ? "border-[var(--border)] opacity-70"
                    : "border-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleItem(item.id)}
                    disabled={loadingItemId === item.id}
                    title="Toggle completion"
                    className="mt-0.5 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                  >
                    {item.completed ? (
                      <CheckCircle2 size={20} className="text-[var(--status-success-fg)]" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)] font-medium">
                        {item.kind === "lesson"
                          ? "New Lesson"
                          : item.kind === "practice"
                          ? "Practice"
                          : "Spaced Review"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                        <Clock size={12} />
                        {item.estimatedMinutes} mins
                      </span>
                    </div>

                    <h4
                      className={`text-base font-semibold leading-snug ${
                        item.completed ? "line-through text-[var(--muted)]" : "text-[var(--foreground)]"
                      }`}
                    >
                      {item.title}
                    </h4>
                  </div>
                </div>

                <Link
                  href={item.kind === "review" ? "/review" : `/learn/${item.resourceId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors shrink-0 cursor-pointer"
                >
                  <span>{item.completed ? "Review" : "Start"}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Weekly Schedule Tab */
        <div className="space-y-4">
          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-2">
            <h2 className="text-lg font-bold">7-Day Curriculum Timeline</h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Missed days never pile up. Overdue reviews are prioritized before introducing new lessons, preventing study fatigue.
            </p>
          </div>

          <div className="space-y-3">
            {weekSchedule.map((day, idx) => (
              <div
                key={idx}
                className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-28 text-xs font-mono font-semibold text-[var(--muted-subtle)]">
                    {day.day}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{day.topic}</p>
                    <p className="text-xs text-[var(--muted)]">25 mins planned</p>
                  </div>
                </div>

                <div>
                  {day.status === "completed" && (
                    <span className="px-2.5 py-1 rounded-[6px] text-xs font-medium bg-[var(--status-success-bg)] text-[var(--status-success-fg)] border border-[var(--status-success-border)]">
                      Completed
                    </span>
                  )}
                  {day.status === "current" && (
                    <span className="px-2.5 py-1 rounded-[6px] text-xs font-semibold bg-[var(--surface-hover)] text-[var(--foreground)] border border-[var(--border-strong)]">
                      Today
                    </span>
                  )}
                  {day.status === "upcoming" && (
                    <span className="px-2.5 py-1 rounded-[6px] text-xs font-medium text-[var(--muted)] border border-[var(--border)]">
                      Planned
                    </span>
                  )}
                  {day.status === "review" && (
                    <span className="px-2.5 py-1 rounded-[6px] text-xs font-medium bg-[var(--surface)] text-[var(--muted-subtle)] border border-[var(--border)]">
                      Sunday Review
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
