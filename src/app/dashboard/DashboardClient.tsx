"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  RotateCcw,
  Flame,
  Award,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { DailyPlan } from "@/server/db/storage";
import { SeedLesson } from "@/server/db/seeds";

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    level: string;
    dailyMinutes: number;
  };
  todayPlan: DailyPlan;
  stats: {
    streakDays: number;
    totalSentences: number;
    accuracy: number;
    reviewsDueCount: number;
  };
  lessons: SeedLesson[];
}

export function DashboardClient({
  user,
  todayPlan,
  stats,
  lessons,
}: DashboardClientProps) {
  const { t, language } = useLanguage();

  const completedCount = todayPlan.items.filter((i) => i.completed).length;
  const totalItems = todayPlan.items.length;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const todayFormatted = new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());

  const nextUnfinishedItem = todayPlan.items.find((i) => !i.completed) || todayPlan.items[0];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Top Header: Greeting, date & level */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <Calendar size={13} />
            <span className="capitalize">{todayFormatted}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {t("greeting", { name: user.name })}
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {t("greetingSubtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3 py-1 bg-[var(--surface-hover)] border border-[var(--border)] rounded-[8px] text-xs font-semibold text-[var(--foreground)] font-mono">
            {t("level")}: {user.level}
          </span>
          <span className="px-3 py-1 bg-[var(--surface-hover)] border border-[var(--border)] rounded-[8px] text-xs font-semibold text-[var(--muted-subtle)] font-mono">
            {t("dailyGoal")}: {user.dailyMinutes}{t("minsPerDay")}
          </span>
        </div>
      </div>

      {/* Primary CTA Card: Today's Plan Banner */}
      <div className="bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-[14px] p-6 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
              {t("todaysLearningPlan")}
            </span>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              {completedCount}/{totalItems} {t("itemsCompleted")}
            </h2>
          </div>
          {nextUnfinishedItem && (
            <Link
              href={
                nextUnfinishedItem.kind === "review"
                  ? "/review"
                  : `/learn/${nextUnfinishedItem.resourceId}`
              }
              className="inline-flex items-center justify-center gap-2 px-5 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-sm hover:bg-[#262626] transition-colors self-start md:self-auto cursor-pointer shadow-sm hover:shadow"
            >
              <span>
                {completedCount === 0
                  ? `${t("startHere")}: ${nextUnfinishedItem.title.split(":")[0]}`
                  : `${t("continueAction")}: ${nextUnfinishedItem.title.split(":")[0]}`}
              </span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* 6px Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-[6px] w-full bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--muted)]">
            <span>{t("dailyProgress")} ({progressPercent}%)</span>
            <span>{user.dailyMinutes} {t("minsPlanned")}</span>
          </div>
        </div>
      </div>

      {/* KPIs row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-4 space-y-1">
          <div className="flex items-center justify-between text-[var(--muted)]">
            <span className="text-xs font-medium">{t("practiceStreak")}</span>
            <Flame size={16} className="text-[var(--foreground)]" />
          </div>
          <p className="text-2xl font-bold">{stats.streakDays} {t("days")}</p>
          <p className="text-[11px] text-[var(--muted)]">{t("consistentHabit")}</p>
        </div>

        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-4 space-y-1">
          <div className="flex items-center justify-between text-[var(--muted)]">
            <span className="text-xs font-medium">{t("sentencesPracticed")}</span>
            <BookOpen size={16} className="text-[var(--foreground)]" />
          </div>
          <p className="text-2xl font-bold">{stats.totalSentences}</p>
          <p className="text-[11px] text-[var(--muted)]">{t("aiEvaluated")}</p>
        </div>

        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-4 space-y-1">
          <div className="flex items-center justify-between text-[var(--muted)]">
            <span className="text-xs font-medium">{t("accuracyRate")}</span>
            <Award size={16} className="text-[var(--foreground)]" />
          </div>
          <p className="text-2xl font-bold">{stats.accuracy > 0 ? `${stats.accuracy}%` : "—"}</p>
          <p className="text-[11px] text-[var(--muted)]">{t("preservedMeaning")}</p>
        </div>

        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-4 space-y-1">
          <div className="flex items-center justify-between text-[var(--muted)]">
            <span className="text-xs font-medium">{t("dueForReview")}</span>
            <RotateCcw size={16} className="text-[var(--foreground)]" />
          </div>
          <p className="text-2xl font-bold">{stats.reviewsDueCount}</p>
          <p className="text-[11px] text-[var(--muted)]">{t("spacedRepetition")}</p>
        </div>
      </div>

      {/* Daily Activities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">{t("todaysActionItems")}</h2>
          <Link
            href="/planner"
            className="text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] font-medium flex items-center gap-1"
          >
            <span>{t("viewFullPlanner")}</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todayPlan.items.map((item, idx) => {
            const isFirstPending = !item.completed && todayPlan.items.slice(0, idx).every((prev) => prev.completed);
            return (
              <div
                key={item.id}
                className={`bg-[var(--surface-raised)] border rounded-[14px] p-5 flex flex-col justify-between space-y-4 transition-colors ${
                  isFirstPending
                    ? "border-[var(--foreground)] ring-1 ring-[var(--foreground)]"
                    : "border-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-mono font-bold bg-[var(--primary)] text-[var(--primary-foreground)]">
                        {t("step")} {idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-mono uppercase bg-[var(--surface)] border border-[var(--border)] text-[var(--muted-subtle)] font-medium">
                        {item.kind === "lesson"
                          ? t("theoryAndExamples")
                          : item.kind === "practice"
                          ? t("sentencePractice")
                          : t("spacedRepetition")}
                      </span>
                      {isFirstPending && (
                        <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {t("recommendedNext")}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                      <Clock size={13} />
                      {item.estimatedMinutes} {t("mins")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base leading-snug">{item.title}</h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                  <span className="text-xs text-[var(--muted)]">
                    {item.completed ? t("completedStatus") : t("pendingStatus")}
                  </span>
                  <Link
                    href={
                      item.kind === "review" ? "/review" : `/learn/${item.resourceId}`
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline"
                  >
                    <span>{item.completed ? t("reviewAction") : t("startNow")}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Curriculum Topics */}
      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">{t("curriculumTracks")}</h2>
          <Link
            href="/learn"
            className="text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] font-medium flex items-center gap-1"
          >
            <span>{t("exploreAllLessons")}</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/learn/${lesson.slug}`}
              className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-4 flex flex-col justify-between space-y-3 hover:border-[var(--border-strong)] transition-colors group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[var(--muted)] font-semibold">
                    CEFR {lesson.level}
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    {lesson.exercises.length} {t("sentencesCount")}
                  </span>
                </div>
                <h4 className="font-semibold text-sm leading-snug group-hover:text-[var(--primary)]">
                  {lesson.title}
                </h4>
                <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                  {lesson.description}
                </p>
              </div>
              <div className="text-xs font-medium text-[var(--muted-subtle)] flex items-center gap-1 pt-2">
                <span>{t("startLesson")}</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
