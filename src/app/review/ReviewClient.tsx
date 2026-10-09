"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Eye,
  Sparkles,
  Send,
  HelpCircle,
  RotateCcw,
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
  const [reviews] = useState<ReviewItem[]>(initialReviews);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-item state dictionaries keyed by ReviewItem.id
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});
  const [ratedMap, setRatedMap] = useState<Record<string, "again" | "hard" | "good" | "easy">>({});

  // AI Q&A per-item state
  const [aiChats, setAiChats] = useState<Record<string, Array<{ role: "user" | "assistant"; content: string }>>>({});
  const [aiInputs, setAiInputs] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  const [isFinished, setIsFinished] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);

  const currentItem = reviews[currentIndex];
  const currentId = currentItem?.id;
  const currentDraft = (currentId && drafts[currentId]) || "";
  const isRevealed = Boolean(currentId && revealedMap[currentId]);
  const currentAIMessages = (currentId && aiChats[currentId]) || [];
  const currentAIInput = (currentId && aiInputs[currentId]) || "";
  const isCurrentAILoading = Boolean(currentId && aiLoading[currentId]);
  const currentRating = currentId ? ratedMap[currentId] : undefined;

  // Navigation handlers
  function handleGoTo(index: number) {
    if (index >= 0 && index < reviews.length) {
      setCurrentIndex(index);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function handleNext() {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const allRated = reviews.every((r) => ratedMap[r.id]);
      if (allRated) {
        setIsFinished(true);
      }
    }
  }

  // Ask AI in context of this sentence
  async function handleAskAI(customQuestion?: string) {
    if (!currentItem || !currentId) return;
    const text = (customQuestion || currentAIInput).trim();
    if (!text || isCurrentAILoading) return;

    const previousMessages = currentAIMessages;
    const newMessages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...previousMessages,
      { role: "user", content: text },
    ];

    setAiChats((prev) => ({ ...prev, [currentId]: newMessages }));
    setAiInputs((prev) => ({ ...prev, [currentId]: "" }));
    setAiLoading((prev) => ({ ...prev, [currentId]: true }));

    const sentenceContext = [
      `Câu tiếng Việt cần dịch: "${currentItem.promptVi}"`,
      `Đáp án mẫu tiếng Anh chuẩn: "${currentItem.expectedAnswer}"`,
      currentDraft.trim() ? `Câu người học tự gõ: "${currentDraft.trim()}"` : `(Người học chưa gõ câu dịch)`,
      currentItem.notes ? `Ghi chú ngữ pháp: "${currentItem.notes}"` : ``,
      `Ngữ cảnh: Người học đang trong chế độ Spaced Repetition (Ôn tập ngắt quãng) và cần giải đáp thắc mắc về ngữ pháp, từ vựng hoặc cách dịch câu này. Hãy trả lời trọng tâm, súc tích, dễ hiểu và tự nhiên bằng tiếng Việt.`
    ].filter(Boolean).join("\n");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: sentenceContext,
        }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setAiChats((prev) => ({
          ...prev,
          [currentId]: [...newMessages, data.message],
        }));
      } else {
        setAiChats((prev) => ({
          ...prev,
          [currentId]: [
            ...newMessages,
            {
              role: "assistant",
              content: data.error || "Rất tiếc, AI tạm thời không phản hồi. Bạn vui lòng thử lại nhé.",
            },
          ],
        }));
      }
    } catch {
      setAiChats((prev) => ({
        ...prev,
        [currentId]: [
          ...newMessages,
          {
            role: "assistant",
            content: "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.",
          },
        ],
      }));
    } finally {
      setAiLoading((prev) => ({ ...prev, [currentId]: false }));
    }
  }

  // Rate item and save to DB
  async function handleRate(rating: "again" | "hard" | "good" | "easy") {
    if (!currentItem || rateLoading) return;
    setRateLoading(true);

    try {
      await fetch("/api/reviews/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: currentItem.id, rating }),
      });

      const updatedRatedMap = { ...ratedMap, [currentItem.id]: rating };
      setRatedMap(updatedRatedMap);

      // Check next unrated sentence starting from currentIndex + 1
      const nextUnratedIndex = reviews.findIndex(
        (r, idx) => idx > currentIndex && !updatedRatedMap[r.id]
      );

      if (nextUnratedIndex !== -1) {
        setCurrentIndex(nextUnratedIndex);
      } else {
        // Check if there are any unrated sentences before currentIndex
        const anyUnratedIndex = reviews.findIndex((r) => !updatedRatedMap[r.id]);
        if (anyUnratedIndex !== -1) {
          setCurrentIndex(anyUnratedIndex);
        } else {
          // All sentences rated!
          setIsFinished(true);
        }
      }
    } catch {
      alert("Error saving review rating.");
    } finally {
      setRateLoading(false);
    }
  }

  if (reviews.length === 0 || isFinished) {
    const ratedCount = Object.keys(ratedMap).length;
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-[600px] bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-[var(--status-success-fg)]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              {reviews.length === 0
                ? t("noReviewsDueTitle")
                : t("allSentencesReviewed")}
            </h1>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {reviews.length === 0
                ? t("noReviewsDueSubtitle")
                : `Bạn đã ôn tập và xếp lịch thành công ${ratedCount}/${reviews.length} câu. Khoảng thời gian ngắt quãng (Spaced Repetition) đã được tính toán lại theo thuật toán SM-2.`}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {reviews.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsFinished(false);
                  setCurrentIndex(0);
                }}
                className="w-full sm:w-auto px-5 h-[44px] rounded-[10px] border border-[var(--border)] text-[var(--foreground)] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>{t("reviewAgain")}</span>
              </button>
            )}

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors cursor-pointer"
            >
              <span>{t("backToDashboard")}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/learn"
              className="w-full sm:w-auto px-6 h-[44px] rounded-[10px] border border-[var(--border)] text-[var(--foreground)] text-sm font-semibold flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              <span>{t("navLessons")}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-[680px] space-y-5">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">{t("backToDashboard")}</span>
          </Link>

          <span className="text-xs font-semibold text-[var(--foreground)] truncate px-2">
            {t("reviewTitle")}
          </span>

          <div className="flex items-center gap-3">
            {/* Sentence Stepper Controls */}
            <div className="flex items-center gap-1 bg-[var(--surface-hover)] p-0.5 rounded-[8px] border border-[var(--border)]">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                title={t("prevSentence")}
                aria-label={t("prevSentence")}
                className="p-1 rounded-[6px] text-[var(--foreground)] hover:bg-[var(--surface-raised)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-mono font-semibold text-[var(--foreground)] px-2">
                {currentIndex + 1} / {reviews.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= reviews.length - 1}
                title={t("nextSentenceNav")}
                aria-label={t("nextSentenceNav")}
                className="p-1 rounded-[6px] text-[var(--foreground)] hover:bg-[var(--surface-raised)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <LanguageSwitcher compact />
          </div>
        </div>

        {/* Quick Sentence Selector Dots / Pills */}
        {reviews.length > 1 && (
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
              {reviews.map((rev, idx) => {
                const isCurrent = idx === currentIndex;
                const isItemRated = Boolean(ratedMap[rev.id]);
                return (
                  <button
                    key={rev.id}
                    type="button"
                    onClick={() => handleGoTo(idx)}
                    className={`h-7 px-2.5 rounded-[6px] text-xs font-mono transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      isCurrent
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs"
                        : isItemRated
                        ? "bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)]"
                        : "bg-transparent text-[var(--muted)] hover:bg-[var(--surface-hover)] border border-transparent"
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isItemRated && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Next/Skip button */}
            {currentIndex < reviews.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1 text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] font-medium transition-colors shrink-0 cursor-pointer"
              >
                <span>{t("skipSentence")}</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
              Recall and formulate the English sentence:
            </span>
            <div className="flex items-center gap-2">
              {currentRating && (
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {t("ratedBadge")}: {currentRating}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)]">
                Interval: {currentItem.intervalDays}d
              </span>
            </div>
          </div>

          {/* Vietnamese Sentence */}
          <h2 className="text-[20px] md:text-[24px] font-semibold text-[var(--foreground)] leading-snug">
            {currentItem.promptVi}
          </h2>

          {/* User Formulation Draft */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                {t("yourEnglishAnswer")}
              </span>
              <MicButton
                onTranscript={(spoken) => {
                  setDrafts((prev) => ({
                    ...prev,
                    [currentId]: prev[currentId] ? `${prev[currentId]} ${spoken}` : spoken,
                  }));
                }}
                label={t("speakAnswer")}
              />
            </div>
            <textarea
              value={currentDraft}
              onChange={(e) => {
                const val = e.target.value;
                setDrafts((prev) => ({ ...prev, [currentId]: val }));
              }}
              placeholder="Type or speak your translation to self-check..."
              rows={3}
              className="w-full p-3 rounded-[8px] border border-[var(--border)] text-sm text-[var(--foreground)] bg-transparent focus:border-[var(--border-strong)] focus:outline-none transition-colors"
            />
          </div>

          {/* Reveal Button or Answer Details */}
          {!isRevealed ? (
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRevealedMap((prev) => ({ ...prev, [currentId]: true }))}
                className="flex-1 h-[44px] rounded-[10px] bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--foreground)] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Eye size={15} />
                <span>{t("flipCardPrompt")}</span>
              </button>

              {reviews.length > 1 && currentIndex < reviews.length - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  title={t("skipSentence")}
                  className="h-[44px] px-4 rounded-[10px] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--muted-subtle)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span>{t("nextSentenceNav")}</span>
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 pt-3 border-t border-[var(--border)] animate-in fade-in-50">
              {/* Reference Answer */}
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

              {/* Grammar Note */}
              {currentItem.notes && (
                <div className="p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted-subtle)] space-y-1">
                  <span className="font-semibold text-[var(--foreground)]">Note: </span>
                  <span>{currentItem.notes}</span>
                </div>
              )}

              {/* AI Q&A Section: Giải đáp thắc mắc về câu này */}
              <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-[var(--foreground)]" />
                    <span className="text-xs font-semibold text-[var(--foreground)]">
                      {t("askAIAboutSentence")}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--muted)] font-mono">
                    Gemini 3.5 Flash Coach
                  </span>
                </div>

                {/* AI Chat History for this item */}
                {currentAIMessages.length > 0 && (
                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {currentAIMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`p-3 rounded-[10px] text-xs leading-relaxed max-w-[90%] whitespace-pre-line ${
                            msg.role === "user"
                              ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
                              : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] shadow-xs"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}

                    {isCurrentAILoading && (
                      <div className="flex items-center gap-2 text-xs text-[var(--muted)] bg-[var(--surface-raised)] border border-[var(--border)] p-2.5 rounded-[10px] w-fit">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce" />
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce delay-150" />
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce delay-300" />
                        <span className="ml-1">AI đang giải đáp câu hỏi của bạn...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Suggestion Chips */}
                {currentAIMessages.length === 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleAskAI("Giải thích cấu trúc ngữ pháp và điểm cần lưu ý của câu này.")}
                      className="px-2.5 py-1 text-[11px] rounded-[6px] border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-[var(--muted-subtle)] transition-colors cursor-pointer text-left"
                    >
                      {t("quickAskGrammar")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAskAI("Có những cách dịch hoặc diễn đạt nào khác tự nhiên hơn cho câu này?")}
                      className="px-2.5 py-1 text-[11px] rounded-[6px] border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-[var(--muted-subtle)] transition-colors cursor-pointer text-left"
                    >
                      {t("quickAskAlternatives")}
                    </button>
                    {currentDraft.trim() && (
                      <button
                        type="button"
                        onClick={() =>
                          handleAskAI(
                            `So sánh câu tôi vừa viết: "${currentDraft.trim()}" với câu mẫu: "${currentItem.expectedAnswer}". Câu của tôi có đúng ngữ pháp và tự nhiên không?`
                          )
                        }
                        className="px-2.5 py-1 text-[11px] rounded-[6px] border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-[var(--muted-subtle)] transition-colors cursor-pointer text-left"
                      >
                        {t("quickAskCheckDraft")}
                      </button>
                    )}
                  </div>
                )}

                {/* Question Input */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={currentAIInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAiInputs((prev) => ({ ...prev, [currentId]: val }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAskAI();
                      }
                    }}
                    placeholder={t("askAIPlaceholder")}
                    disabled={isCurrentAILoading}
                    className="w-full h-[40px] pl-3 pr-10 rounded-[8px] border border-[var(--border)] bg-[var(--surface-raised)] text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleAskAI()}
                    disabled={!currentAIInput.trim() || isCurrentAILoading}
                    title={t("send")}
                    className="absolute right-1.5 p-1.5 rounded-[6px] bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[#262626] transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>

              {/* Rating Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                  {t("howWellDidYouRemember")}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRate("again")}
                    disabled={rateLoading}
                    className={`p-2.5 rounded-[8px] border text-xs font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                      currentRating === "again"
                        ? "bg-[var(--status-error-bg)] text-[var(--status-error-fg)] border-[var(--status-error-border)] ring-1 ring-[var(--status-error-border)]"
                        : "border-[var(--border)] hover:bg-[var(--status-error-bg)] hover:text-[var(--status-error-fg)] hover:border-[var(--status-error-border)]"
                    }`}
                  >
                    <span>{t("ratingAgain")}</span>
                    <span className="text-[10px] opacity-75 font-mono">1 day</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRate("hard")}
                    disabled={rateLoading}
                    className={`p-2.5 rounded-[8px] border text-xs font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                      currentRating === "hard"
                        ? "bg-[var(--status-warning-bg)] text-[var(--status-warning-fg)] border-[var(--status-warning-border)] ring-1 ring-[var(--status-warning-border)]"
                        : "border-[var(--border)] hover:bg-[var(--status-warning-bg)] hover:text-[var(--status-warning-fg)] hover:border-[var(--status-warning-border)]"
                    }`}
                  >
                    <span>{t("ratingHard")}</span>
                    <span className="text-[10px] opacity-75 font-mono">2-3 days</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRate("good")}
                    disabled={rateLoading}
                    className={`p-2.5 rounded-[8px] border text-xs font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                      currentRating === "good"
                        ? "bg-[var(--surface-hover)] border-[var(--border-strong)] text-[var(--foreground)] ring-1 ring-[var(--border-strong)]"
                        : "border-[var(--border)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <span>{t("ratingGood")}</span>
                    <span className="text-[10px] opacity-75 font-mono">7 days</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRate("easy")}
                    disabled={rateLoading}
                    className={`p-2.5 rounded-[8px] border text-xs font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                      currentRating === "easy"
                        ? "bg-[var(--status-success-bg)] text-[var(--status-success-fg)] border-[var(--status-success-border)] ring-1 ring-[var(--status-success-border)]"
                        : "border-[var(--border)] hover:bg-[var(--status-success-bg)] hover:text-[var(--status-success-fg)] hover:border-[var(--status-success-border)]"
                    }`}
                  >
                    <span>{t("ratingEasy")}</span>
                    <span className="text-[10px] opacity-75 font-mono">14 days</span>
                  </button>
                </div>
              </div>

              {/* Bottom Navigation Links */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 text-[var(--muted-subtle)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>{t("prevSentence")}</span>
                </button>

                {currentIndex < reviews.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 text-[var(--foreground)] font-semibold hover:underline transition-colors cursor-pointer"
                  >
                    <span>{t("nextSentenceNav")}</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsFinished(true)}
                    className="inline-flex items-center gap-1.5 text-[var(--foreground)] font-semibold hover:underline transition-colors cursor-pointer"
                  >
                    <span>{t("finishLesson")}</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
