"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RotateCcw,
  Undo2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  Puzzle,
} from "lucide-react";
import {
  getExerciseBuilderPool,
  validateBuilderSentence,
} from "@/lib/exercises/exercise-modes";
import { AudioButton } from "@/components/audio/AudioButton";
import { useLanguage } from "@/i18n/LanguageContext";

interface SentenceBuilderProps {
  exerciseId: string;
  promptVi: string;
  referenceAnswers: string[];
  grammarCategory?: string;
  onSuccess: (assembledSentence: string) => void;
  onNext: () => void;
  isLastSentence: boolean;
}

interface TokenItem {
  id: string;
  text: string;
}

export function SentenceBuilder({
  exerciseId,
  promptVi,
  referenceAnswers,
  grammarCategory,
  onSuccess,
  onNext,
  isLastSentence,
}: SentenceBuilderProps) {
  const { t } = useLanguage();

  // Words available in pool
  const [availableTokens, setAvailableTokens] = useState<TokenItem[]>([]);
  // Words placed into the sentence
  const [placedTokens, setPlacedTokens] = useState<TokenItem[]>([]);
  // Validation state: null | "correct" | "incorrect"
  const [status, setStatus] = useState<"correct" | "incorrect" | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Initialize pool on exerciseId change
  useEffect(() => {
    const { initialPool } = getExerciseBuilderPool(
      exerciseId,
      referenceAnswers[0]
    );
    const mapped: TokenItem[] = initialPool.map((token, index) => ({
      id: `${token}-${index}-${Date.now()}`,
      text: token,
    }));
    setAvailableTokens(mapped);
    setPlacedTokens([]);
    setStatus(null);
    setShowHint(false);
  }, [exerciseId, referenceAnswers]);

  // Click word in pool -> move to placed
  function handleSelectToken(token: TokenItem) {
    if (status === "correct") return;
    setAvailableTokens((prev) => prev.filter((t) => t.id !== token.id));
    setPlacedTokens((prev) => [...prev, token]);
    if (status === "incorrect") setStatus(null);
  }

  // Click word in placed -> return to pool
  function handleRemoveToken(token: TokenItem) {
    if (status === "correct") return;
    setPlacedTokens((prev) => prev.filter((t) => t.id !== token.id));
    setAvailableTokens((prev) => [...prev, token]);
    if (status === "incorrect") setStatus(null);
  }

  // Undo: remove last placed token
  function handleUndo() {
    if (placedTokens.length === 0 || status === "correct") return;
    const last = placedTokens[placedTokens.length - 1];
    setPlacedTokens((prev) => prev.slice(0, prev.length - 1));
    setAvailableTokens((prev) => [...prev, last]);
    if (status === "incorrect") setStatus(null);
  }

  // Clear all: return all placed tokens to pool
  function handleClearAll() {
    if (placedTokens.length === 0 || status === "correct") return;
    setAvailableTokens((prev) => [...prev, ...placedTokens]);
    setPlacedTokens([]);
    setStatus(null);
  }

  // Validate answer
  function handleCheck() {
    if (placedTokens.length === 0) return;
    const assembled = placedTokens.map((t) => t.text).join(" ");
    const isCorrect = validateBuilderSentence(assembled, referenceAnswers);

    if (isCorrect) {
      setStatus("correct");
      onSuccess(assembled);
    } else {
      setStatus("incorrect");
    }
  }

  const assembledSentence = placedTokens.map((t) => t.text).join(" ");

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Context Card */}
      <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5">
            <Puzzle size={14} />
            <span>{t("modeBuilder")}</span>
          </span>
          {grammarCategory && (
            <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-mono bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)]">
              {grammarCategory}
            </span>
          )}
        </div>

        {/* Vietnamese Meaning Prompt */}
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase text-[var(--muted)]">
            {t("translateThisSentence")}
          </span>
          <p className="text-xl md:text-2xl font-semibold text-[var(--foreground)] tracking-tight leading-snug">
            {promptVi}
          </p>
        </div>

        <p className="text-xs text-[var(--muted)] italic">
          {t("builderInstruction")}
        </p>
      </div>

      {/* Assembled Sentence Drop Zone */}
      <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted-subtle)] font-semibold">
            {t("builderYourSentence")}
          </span>

          {placedTokens.length > 0 && status !== "correct" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndo}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1 px-2 py-1 rounded-[6px] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                title="Undo last word"
              >
                <Undo2 size={13} />
                <span>{t("builderUndo")}</span>
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1 px-2 py-1 rounded-[6px] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                title="Clear all"
              >
                <RotateCcw size={13} />
                <span>{t("builderClear")}</span>
              </button>
            </div>
          )}
        </div>

        {/* Sentence Slot Area */}
        <div
          className={`min-h-[96px] p-4 rounded-[12px] border-2 transition-all flex flex-wrap items-center gap-2 ${
            status === "correct"
              ? "border-[var(--status-success-border)] bg-[var(--status-success-bg)]/20"
              : status === "incorrect"
              ? "border-[var(--status-error-border)] bg-[var(--status-error-bg)]/20"
              : placedTokens.length > 0
              ? "border-[var(--border-strong)] bg-[var(--surface)]"
              : "border-dashed border-[var(--border)] bg-[var(--surface)]/50"
          }`}
        >
          {placedTokens.length === 0 ? (
            <p className="text-sm text-[var(--muted)] select-none italic px-2">
              {t("builderPlaceholder")}
            </p>
          ) : (
            placedTokens.map((token, idx) => (
              <button
                key={token.id}
                type="button"
                onClick={() => handleRemoveToken(token)}
                disabled={status === "correct"}
                className={`group px-3 py-1.5 rounded-[8px] font-mono text-sm md:text-base font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  status === "correct"
                    ? "bg-[var(--status-success-bg)] text-[var(--status-success-fg)] border border-[var(--status-success-border)] cursor-default"
                    : "bg-[var(--foreground)] text-[var(--background)] hover:opacity-85 shadow-2xs active:scale-95"
                }`}
                title={status !== "correct" ? t("builderClickToRemove") : undefined}
              >
                <span>{token.text}</span>
                {status !== "correct" && (
                  <span className="text-[11px] opacity-60 group-hover:opacity-100 font-sans">
                    ×
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {placedTokens.length > 0 && status !== "correct" && (
          <p className="text-[11px] text-[var(--muted)] text-right">
            {t("builderClickToRemove")}
          </p>
        )}
      </div>

      {/* Available Word Bank */}
      <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted-subtle)] font-semibold">
            {t("builderWordBank")}
          </span>
          <span className="text-xs font-mono text-[var(--muted)]">
            {availableTokens.length} {availableTokens.length === 1 ? "word" : "words"} remaining
          </span>
        </div>

        {/* Word Chips */}
        <div className="flex flex-wrap gap-2.5 min-h-[50px] items-center p-2 rounded-[10px] bg-[var(--surface)] border border-[var(--border)]">
          {availableTokens.length === 0 ? (
            <span className="text-xs text-[var(--muted)] italic p-2 select-none">
              All words have been placed into the sentence above.
            </span>
          ) : (
            availableTokens.map((token) => (
              <button
                key={token.id}
                type="button"
                onClick={() => handleSelectToken(token)}
                disabled={status === "correct"}
                className="px-3.5 py-2 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] font-mono text-sm font-medium hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] active:scale-95 transition-all shadow-2xs cursor-pointer select-none"
              >
                {token.text}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Feedback & Actions */}
      {status === "correct" ? (
        <div className="p-6 rounded-[14px] bg-[var(--status-success-bg)]/30 border border-[var(--status-success-border)] space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--status-success-fg)] font-semibold text-sm">
              <CheckCircle2 size={18} />
              <span>{t("builderCorrectTitle")}</span>
            </div>
            <span className="text-xs font-mono font-bold text-[var(--status-success-fg)]">
              Score: 100/100
            </span>
          </div>

          <p className="text-xs text-[var(--foreground)]">
            {t("builderCorrectSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)]">
            <p className="font-semibold text-base text-[var(--foreground)]">
              "{assembledSentence}"
            </p>
            <AudioButton text={assembledSentence} label="Listen (1.0x)" size="sm" />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onNext}
              className="px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center gap-2 hover:bg-[#262626] transition-colors cursor-pointer"
            >
              <span>{isLastSentence ? t("finishLesson") : t("nextSentence")}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : status === "incorrect" ? (
        <div className="p-5 rounded-[14px] bg-[var(--status-error-bg)]/20 border border-[var(--status-error-border)] space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--status-error-fg)] font-semibold text-sm">
              <XCircle size={18} />
              <span>{t("builderIncorrectTitle")}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle size={13} />
              <span>{showHint ? "Hide Hint" : "Need Hint?"}</span>
            </button>
          </div>

          <p className="text-xs text-[var(--foreground)]">
            {t("builderIncorrectSubtitle")}
          </p>

          {showHint && (
            <div className="p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)]">
              <p className="font-semibold text-[var(--muted)]">Suggested Reference:</p>
              <p className="font-medium pt-1">"{referenceAnswers[0]}"</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-4 h-[40px] rounded-[8px] border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              Reset & Try Again
            </button>
            <button
              type="button"
              onClick={handleCheck}
              disabled={placedTokens.length === 0}
              className="px-6 h-[40px] rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>{t("checkAnswerBtn")}</span>
              <Sparkles size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Default Action Buttons */
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onNext}
            className="px-4 h-[44px] rounded-[10px] text-xs font-semibold text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            Skip
          </button>

          <button
            type="button"
            onClick={handleCheck}
            disabled={placedTokens.length === 0}
            className="px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center gap-2 hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <span>{t("checkAnswerBtn")}</span>
            <Sparkles size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
