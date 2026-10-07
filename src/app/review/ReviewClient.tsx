"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { ReviewItem } from "@/server/db/storage";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { AudioButton } from "@/components/audio/AudioButton";
import { MicButton } from "@/components/audio/MicButton";

interface ReviewClientProps {
  initialReviews: ReviewItem[];
}

export function ReviewClient({ initialReviews }: ReviewClientProps) {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [userDraft, setUserDraft] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentItem = reviews[currentIndex];

  async function handleRate(rating: "again" | "hard" | "good" | "easy") {
    if (!currentItem || loading) return;
    setLoading(true);

    try {
      await fetch("/api/reviews/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: currentItem.id, rating }),
      });

      setRevealed(false);
      setUserDraft("");
      if (currentIndex + 1 < reviews.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    } catch {
      alert("Error saving review rating.");
    } finally {
      setLoading(false);
    }
  }

  if (reviews.length === 0 || isFinished) {
    return (
      <div className="p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-[600px] bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-[var(--status-success-fg)]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {reviews.length === 0
                ? "No reviews due today!"
                : "Review session completed!"}
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Spaced Repetition intervals have been recalculated based on your responses (1 / 3 / 7 / 14 / 30 days).
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors cursor-pointer"
            >
              <span>Back to Dashboard</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/learn"
              className="w-full sm:w-auto px-6 h-[44px] rounded-[10px] border border-[var(--border)] text-[var(--foreground)] text-sm font-semibold flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              <span>Practice New Lessons</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-[680px] space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>{t("backToDashboard")}</span>
          </Link>

          <span className="text-xs font-semibold text-[var(--foreground)]">
            {t("reviewTitle")}
          </span>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-[var(--muted-subtle)]">
              {currentIndex + 1} / {reviews.length} {t("sentencesCount")}
            </span>
            <LanguageSwitcher compact />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
              Recall and formulate the English sentence:
            </span>
            <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)]">
              Interval: {currentItem.intervalDays}d
            </span>
          </div>

          <h2 className="text-[20px] md:text-[24px] font-semibold text-[var(--foreground)] leading-snug">
            {currentItem.promptVi}
          </h2>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                {t("yourEnglishAnswer")}
              </span>
              <MicButton
                onTranscript={(spoken) => setUserDraft(spoken)}
                label={t("speakAnswer")}
              />
            </div>
            <textarea
              value={userDraft}
              onChange={(e) => setUserDraft(e.target.value)}
              placeholder="Type or speak your translation to self-check..."
              rows={3}
              className="w-full p-3 rounded-[8px] border border-[var(--border)] text-sm text-[var(--foreground)] bg-transparent focus:border-[var(--border-strong)] focus:outline-none transition-colors"
            />
          </div>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full h-[44px] rounded-[10px] bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--foreground)] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Eye size={15} />
              <span>{t("flipCardPrompt")}</span>
            </button>
          ) : (
            <div className="space-y-4 pt-3 border-t border-[var(--border)] animate-in fade-in-50">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[var(--muted)] uppercase font-semibold">
                  Reference answer:
                </span>
                <div className="flex items-center justify-between p-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded-[8px]">
                  <p className="font-medium text-sm text-[var(--foreground)]">
                    {currentItem.expectedAnswer}
                  </p>
                  <AudioButton text={currentItem.expectedAnswer} compact />
                </div>
              </div>

              {currentItem.notes && (
                <p className="text-xs text-[var(--muted-subtle)] italic">
                  Note: {currentItem.notes}
                </p>
              )}

              {/* Rating Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                  How easily did you recall this sentence?
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRate("again")}
                    disabled={loading}
                    className="p-2.5 rounded-[8px] border border-[var(--border)] hover:bg-[var(--status-error-bg)] hover:text-[var(--status-error-fg)] hover:border-[var(--status-error-border)] text-xs font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span>Again</span>
                    <span className="text-[10px] opacity-75 font-mono">1 day</span>
                  </button>

                  <button
                    onClick={() => handleRate("hard")}
                    disabled={loading}
                    className="p-2.5 rounded-[8px] border border-[var(--border)] hover:bg-[var(--status-warning-bg)] hover:text-[var(--status-warning-fg)] hover:border-[var(--status-warning-border)] text-xs font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span>Hard</span>
                    <span className="text-[10px] opacity-75 font-mono">2-3 days</span>
                  </button>

                  <button
                    onClick={() => handleRate("good")}
                    disabled={loading}
                    className="p-2.5 rounded-[8px] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span>Good</span>
                    <span className="text-[10px] opacity-75 font-mono">7 days</span>
                  </button>

                  <button
                    onClick={() => handleRate("easy")}
                    disabled={loading}
                    className="p-2.5 rounded-[8px] border border-[var(--border)] hover:bg-[var(--status-success-bg)] hover:text-[var(--status-success-fg)] hover:border-[var(--status-success-border)] text-xs font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span>Easy</span>
                    <span className="text-[10px] opacity-75 font-mono">14 days</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
