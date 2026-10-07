"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Flame,
  Award,
  Check,
  Undo2,
} from "lucide-react";
import { Mistake } from "@/server/db/storage";
import { EvaluationResult } from "@/server/ai/gemini";
import { AudioButton } from "@/components/audio/AudioButton";
import { MicButton } from "@/components/audio/MicButton";
import { useLanguage } from "@/i18n/LanguageContext";

interface MistakesClientProps {
  initialMistakes: Mistake[];
}

export function MistakesClient({ initialMistakes }: MistakesClientProps) {
  const { t } = useLanguage();
  const [mistakes, setMistakes] = useState<Mistake[]>(initialMistakes);
  const [activeTab, setActiveTab] = useState<"needs_practice" | "mastered" | "all">("needs_practice");

  // Practice session state
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceQueue, setPracticeQueue] = useState<Mistake[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const needsPracticeList = mistakes.filter((m) => !m.mastered);
  const masteredList = mistakes.filter((m) => m.mastered);

  const displayedList =
    activeTab === "needs_practice"
      ? needsPracticeList
      : activeTab === "mastered"
      ? masteredList
      : mistakes;

  // Start practicing all unmastered mistakes (or single)
  function startPractice(selectedMistake?: Mistake) {
    const queue = selectedMistake
      ? [selectedMistake]
      : needsPracticeList.length > 0
      ? [...needsPracticeList]
      : [...mistakes];

    if (queue.length === 0) return;

    setPracticeQueue(queue);
    setCurrentIndex(0);
    setAnswer("");
    setEvaluation(null);
    setSessionCompleted(false);
    setIsPracticing(true);
  }

  // Toggle mastered status from list
  async function handleToggleMastered(mistakeId: string) {
    try {
      const res = await fetch("/api/mistakes/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mistakeId, action: "toggle" }),
      });
      const data = await res.json();
      if (res.ok && data.mistake) {
        setMistakes((prev) =>
          prev.map((m) => (m.id === mistakeId ? { ...m, ...data.mistake } : m))
        );
      }
    } catch {
      alert("Unable to update mistake status.");
    }
  }

  // Submit answer in practice runner
  async function handleCheckAnswer(e: React.FormEvent) {
    e.preventDefault();
    const current = practiceQueue[currentIndex];
    if (!answer.trim() || loading || !current) return;

    setLoading(true);
    setEvaluation(null);

    try {
      const res = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: current.exerciseId,
          lessonId: "mistake-practice",
          promptVi: current.promptVi || current.explanation,
          answer: answer.trim(),
          referenceAnswers: current.referenceAnswers || [current.correction],
        }),
      });

      const data = await res.json();
      if (res.ok && data.evaluation) {
        setEvaluation(data.evaluation);

        // If score >= 85, automatically resolve this mistake in DB!
        if (data.evaluation.score >= 85) {
          fetch("/api/mistakes/resolve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mistakeId: current.id }),
          });

          // Update local state
          setMistakes((prev) =>
            prev.map((m) => (m.id === current.id ? { ...m, mastered: true } : m))
          );
        }
      } else {
        alert(data.error || "Unable to evaluate answer. Please try again.");
      }
    } catch {
      alert("Network error. Please try checking again.");
    } finally {
      setLoading(false);
    }
  }

  function handleNextPractice() {
    setEvaluation(null);
    setAnswer("");
    if (currentIndex + 1 < practiceQueue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  }

  // --- VIEW 1: PRACTICE RUNNER MODE ---
  if (isPracticing) {
    const current = practiceQueue[currentIndex];
    const progressPercent = Math.round(((currentIndex + 1) / practiceQueue.length) * 100);

    if (sessionCompleted || !current) {
      return (
        <div className="p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-[600px] bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-8 space-y-6 text-center shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-[var(--status-success-fg)]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {t("allMistakesMastered")}
              </h1>
              <p className="text-sm text-[var(--muted)]">
                You reviewed and corrected {practiceQueue.length} past mistake{practiceQueue.length > 1 ? "s" : ""}. Reviewing errors is the fastest path to natural fluency.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsPracticing(false)}
                className="w-full sm:w-auto px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors cursor-pointer"
              >
                <span>{t("backToNotebook")}</span>
                <ArrowRight size={16} />
              </button>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 h-[44px] rounded-[10px] border border-[var(--border)] text-[var(--foreground)] text-sm font-semibold flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <span>{t("backToDashboard")}</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center py-6 px-4 md:px-6">
        <div className="w-full max-w-[760px] space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <button
              type="button"
              onClick={() => setIsPracticing(false)}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>{t("backToNotebook")}</span>
            </button>

            <span className="text-xs font-semibold text-[var(--foreground)] truncate max-w-[240px]">
              {t("practiceMistakes")}
            </span>

            <span className="text-xs font-mono font-semibold text-[var(--muted-subtle)]">
              {currentIndex + 1} / {practiceQueue.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-[6px] w-full bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Prompt & Past Error Card */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
                {t("translateThisSentence")}
              </span>
              <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-[var(--status-error-bg)] text-[var(--status-error-fg)] border border-[var(--status-error-border)] font-semibold">
                {current.category || "Grammar"}
              </span>
            </div>

            <h2 className="text-[22px] md:text-[26px] font-semibold leading-[1.4] text-[var(--foreground)] tracking-tight">
              {current.promptVi}
            </h2>

            {/* Reminder of past error */}
            <div className="p-3.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[var(--muted-subtle)]">
                  {t("pastError")}:
                </span>
                <span className="text-[11px] text-[var(--muted)]">Lesson: {current.lessonTitle}</span>
              </div>
              <p className="text-sm font-medium text-[var(--status-error-fg)] line-through">
                "{current.original}"
              </p>
              <p className="text-xs text-[var(--muted)] pt-0.5">
                Note: {current.explanation}
              </p>
            </div>
          </div>

          {/* Input Area with Mic Button */}
          <form onSubmit={handleCheckAnswer} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                  {t("yourEnglishAnswer")}
                </label>
                <MicButton
                  onTranscript={(spoken) => setAnswer(spoken)}
                  label={t("speakAnswer")}
                />
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading || evaluation !== null}
                placeholder="Type your corrected English sentence..."
                rows={4}
                className="w-full min-h-[130px] p-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface-raised)] text-base md:text-[17px] leading-[1.65] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors resize-y disabled:opacity-80"
              />
            </div>

            {!evaluation && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleNextPractice}
                  disabled={loading}
                  className="px-4 h-[44px] rounded-[10px] text-xs font-semibold text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                >
                  Skip
                </button>

                <button
                  type="submit"
                  disabled={!answer.trim() || loading}
                  className="px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center gap-2 hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>{t("evaluatingWithAI")}</span>
                  ) : (
                    <>
                      <span>{t("recheckWithAI")}</span>
                      <Sparkles size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Evaluation Result */}
          {evaluation && (
            <div className="bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-[14px] p-6 space-y-5 animate-in fade-in-50 duration-200 shadow-xs">
              {/* Header with Score and Mastered Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  {evaluation.score >= 85 ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[var(--status-success-bg)] text-[var(--status-success-fg)] border border-[var(--status-success-border)] font-semibold text-xs">
                      <CheckCircle2 size={16} />
                      <span>{t("masteredBadge")} ✓</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[var(--status-warning-bg)] text-[var(--status-warning-fg)] border border-[var(--status-warning-border)] font-semibold text-xs">
                      <AlertTriangle size={16} />
                      <span>Needs More Practice</span>
                    </div>
                  )}
                </div>
                <span className="text-xs font-mono text-[var(--muted-subtle)]">
                  Score: <strong>{evaluation.score}/100</strong>
                </span>
              </div>

              {evaluation.score >= 85 && (
                <div className="p-3 rounded-[8px] bg-[var(--status-success-bg)] text-[var(--status-success-fg)] border border-[var(--status-success-border)] text-xs font-semibold">
                  🎉 {t("congratsMastered")}
                </div>
              )}

              {/* Answer Comparison with Audio */}
              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[var(--muted)] uppercase font-semibold">
                    {t("yourEnglishAnswer")}
                  </span>
                  <div className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[8px]">
                    <p className="font-medium text-[var(--foreground)]">{answer}</p>
                    <AudioButton text={answer} compact />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-[var(--muted)] uppercase font-semibold">
                    Suggested reference:
                  </span>
                  <div className="flex items-center justify-between p-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded-[8px]">
                    <p className="font-medium text-[var(--foreground)]">
                      {evaluation.correctedSentence}
                    </p>
                    <AudioButton text={evaluation.correctedSentence} compact />
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] space-y-1 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                  {t("explanation")}:
                </span>
                <p className="text-sm leading-relaxed text-[var(--foreground)]">
                  {evaluation.explanationVi}
                </p>
              </div>

              {/* Next Button */}
              <div className="pt-3 border-t border-[var(--border)] flex justify-end">
                <button
                  type="button"
                  onClick={handleNextPractice}
                  className="px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center gap-2 hover:bg-[#262626] transition-colors cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < practiceQueue.length
                      ? "Next mistake"
                      : "Finish review session"}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VIEW 2: NOTEBOOK LIST VIEW ---
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {t("mistakesTitle")}
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {t("mistakesSubtitle")}
          </p>
        </div>

        {/* Primary CTA: Practice Mistakes */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {needsPracticeList.length > 0 && (
            <button
              type="button"
              onClick={() => startPractice()}
              className="inline-flex items-center gap-2 px-5 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[#262626] transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <RotateCcw size={15} />
              <span>{t("practiceMistakes")} ({needsPracticeList.length})</span>
            </button>
          )}

          <Link
            href="/review"
            className="inline-flex items-center gap-1.5 px-4 h-[44px] rounded-[10px] border border-[var(--border)] text-[var(--foreground)] text-xs font-semibold hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <span>Spaced Review</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-4 space-y-1">
          <span className="text-xs font-medium text-[var(--muted)]">{t("totalMistakesLogged")}</span>
          <p className="text-2xl font-bold">{mistakes.length}</p>
        </div>

        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-4 space-y-1">
          <span className="text-xs font-medium text-[var(--muted)]">{t("tabNeedsPractice")}</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {needsPracticeList.length}
          </p>
        </div>

        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-4 space-y-1">
          <span className="text-xs font-medium text-[var(--muted)]">{t("tabMastered")}</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {masteredList.length}
          </p>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-1 bg-[var(--surface-hover)] border border-[var(--border)] p-1 rounded-[10px] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("needs_practice")}
          className={`px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "needs_practice"
              ? "bg-[var(--surface-raised)] text-[var(--foreground)] shadow-xs"
              : "text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
          }`}
        >
          {t("tabNeedsPractice")} ({needsPracticeList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mastered")}
          className={`px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "mastered"
              ? "bg-[var(--surface-raised)] text-[var(--foreground)] shadow-xs"
              : "text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
          }`}
        >
          {t("tabMastered")} ({masteredList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "all"
              ? "bg-[var(--surface-raised)] text-[var(--foreground)] shadow-xs"
              : "text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
          }`}
        >
          {t("tabAllMistakes")} ({mistakes.length})
        </button>
      </div>

      {/* Mistakes List */}
      {displayedList.length === 0 ? (
        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-12 text-center space-y-3">
          <BookMarked size={36} className="mx-auto text-[var(--muted)]" />
          <h2 className="text-lg font-bold">
            {activeTab === "needs_practice"
              ? "All caught up! No active mistakes pending."
              : t("noMistakesTitle")}
          </h2>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
            {t("noMistakesSubtitle")}
          </p>
          <div className="pt-2">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              <span>{t("exploreAllLessons")}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((m) => (
            <div
              key={m.id}
              className={`bg-[var(--surface-raised)] border rounded-[14px] p-5 space-y-3.5 transition-colors ${
                m.mastered
                  ? "border-[var(--border)] opacity-85"
                  : "border-[var(--border)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase font-semibold border ${
                      m.mastered
                        ? "bg-[var(--status-success-bg)] text-[var(--status-success-fg)] border-[var(--status-success-border)]"
                        : "bg-[var(--status-error-bg)] text-[var(--status-error-fg)] border-[var(--status-error-border)]"
                    }`}
                  >
                    {m.mastered ? "Mastered ✓" : m.category || "Grammar"}
                  </span>
                  <span className="text-xs text-[var(--muted)] font-medium">
                    {m.lessonTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-mono text-[var(--muted)]">
                    {new Date(m.createdAt).toLocaleDateString("en-US")}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleMastered(m.id)}
                    title={m.mastered ? t("markNeedsPractice") : t("markMastered")}
                    className={`px-2.5 py-1 rounded-[6px] text-xs font-medium border transition-colors cursor-pointer ${
                      m.mastered
                        ? "bg-[var(--surface-hover)] border-[var(--border)] text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
                        : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted-subtle)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {m.mastered ? t("markNeedsPractice") : t("markMastered")}
                  </button>
                </div>
              </div>

              {/* Prompt if exists */}
              {m.promptVi && (
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {m.promptVi}
                </p>
              )}

              {/* Error vs Correction */}
              <div className="space-y-2 text-xs md:text-sm">
                <div className="p-3 rounded-[8px] bg-[var(--status-error-bg)] text-[var(--status-error-fg)] border border-[var(--status-error-border)] space-y-0.5">
                  <span className="font-mono text-[10px] uppercase font-semibold opacity-75">
                    {t("yourAttempt")}:
                  </span>
                  <p className="font-medium line-through">{m.original}</p>
                </div>

                <div className="p-3 rounded-[8px] bg-[var(--status-success-bg)] text-[var(--status-success-fg)] border border-[var(--status-success-border)] flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] uppercase font-semibold opacity-75">
                      {t("correctedSentence")}:
                    </span>
                    <p className="font-medium">{m.correction}</p>
                  </div>
                  <AudioButton text={m.correction} compact />
                </div>
              </div>

              {/* Explanation & Practice Button */}
              <div className="pt-2 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-[var(--muted-subtle)] leading-relaxed flex-1">
                  <strong>{t("explanationNotes")}:</strong> {m.explanation}
                </p>

                <button
                  type="button"
                  onClick={() => startPractice(m)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--border-strong)] text-xs font-semibold text-[var(--foreground)] transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>{t("practiceThisMistake")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
