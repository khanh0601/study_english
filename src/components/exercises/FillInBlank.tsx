"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  SquareCode,
} from "lucide-react";
import {
  getExerciseClozeQuestion,
  ClozeQuestion,
} from "@/lib/exercises/exercise-modes";
import { AudioButton } from "@/components/audio/AudioButton";
import { useLanguage } from "@/i18n/LanguageContext";

interface FillInBlankProps {
  exerciseId: string;
  promptVi: string;
  referenceAnswers: string[];
  grammarCategory?: string;
  onSuccess: (completedSentence: string) => void;
  onFailure?: (attempt: string) => void;
  onNext: () => void;
  isLastSentence: boolean;
}

export function FillInBlank({
  exerciseId,
  promptVi,
  referenceAnswers,
  grammarCategory,
  onSuccess,
  onFailure,
  onNext,
  isLastSentence,
}: FillInBlankProps) {
  const { language, t } = useLanguage();

  const [question, setQuestion] = useState<ClozeQuestion>(() =>
    getExerciseClozeQuestion(exerciseId, referenceAnswers[0])
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    setQuestion(getExerciseClozeQuestion(exerciseId, referenceAnswers[0]));
    setSelectedOption(null);
    setStatus(null);
  }, [exerciseId, referenceAnswers]);

  function handleSelectOption(opt: string) {
    if (status === "correct") return;
    setSelectedOption(opt);
    if (status === "incorrect") setStatus(null);
  }

  function handleCheck() {
    if (!selectedOption) return;

    const isCorrect = selectedOption.trim() === question.correctAnswer.trim();
    const completedSentence = question.sentenceWithBlank.replace(
      "___",
      selectedOption
    );

    if (isCorrect) {
      setStatus("correct");
      onSuccess(completedSentence);
    } else {
      setStatus("incorrect");
      if (onFailure) onFailure(completedSentence);
    }
  }

  const completedCorrectSentence = question.sentenceWithBlank.replace(
    "___",
    question.correctAnswer
  );

  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Context Card */}
      <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5">
            <SquareCode size={14} />
            <span>{t("modeCloze")}</span>
          </span>
          {grammarCategory && (
            <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-mono bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)]">
              {grammarCategory}
            </span>
          )}
        </div>

        {/* Vietnamese Prompt Context */}
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase text-[var(--muted)]">
            Vietnamese Meaning:
          </span>
          <p className="text-lg md:text-xl font-medium text-[var(--muted-subtle)] leading-snug">
            {promptVi}
          </p>
        </div>

        {/* Sentence with Blank Banner */}
        <div className="p-5 rounded-[12px] bg-[var(--surface)] border-2 border-[var(--border-strong)] space-y-2">
          <span className="text-xs font-mono text-[var(--muted)] uppercase font-semibold">
            {t("clozeInstruction")}
          </span>
          <p className="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-tight leading-relaxed">
            {question.sentenceWithBlank.split("___").map((part, i, arr) => (
              <React.Fragment key={i}>
                <span>{part}</span>
                {i < arr.length - 1 && (
                  <span
                    className={`inline-block px-3 py-0.5 mx-1 rounded-[6px] border-2 font-mono text-lg md:text-xl font-bold transition-all ${
                      selectedOption
                        ? status === "correct"
                          ? "bg-[var(--status-success-bg)] text-[var(--status-success-fg)] border-[var(--status-success-border)]"
                          : status === "incorrect"
                          ? "bg-[var(--status-error-bg)] text-[var(--status-error-fg)] border-[var(--status-error-border)] line-through"
                          : "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent"
                        : "bg-[var(--surface-raised)] border-dashed border-[var(--border-strong)] text-[var(--muted)] px-6"
                    }`}
                  >
                    {selectedOption || " ? "}
                  </span>
                )}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* Multiple-Choice Options Grid */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted-subtle)] font-semibold">
          Select Option:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isTheCorrectOne = opt.trim() === question.correctAnswer.trim();

            let borderStyle = "border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface-raised)]";
            let badgeStyle = "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]";

            if (status === "correct" && isSelected) {
              borderStyle = "border-[var(--status-success-border)] bg-[var(--status-success-bg)]/25";
              badgeStyle = "bg-[var(--status-success-fg)] text-[var(--primary-foreground)]";
            } else if (status === "incorrect" && isSelected) {
              borderStyle = "border-[var(--status-error-border)] bg-[var(--status-error-bg)]/20";
              badgeStyle = "bg-[var(--status-error-fg)] text-[var(--primary-foreground)]";
            } else if (status === "incorrect" && isTheCorrectOne) {
              borderStyle = "border-[var(--status-success-border)] bg-[var(--surface-raised)]";
              badgeStyle = "bg-[var(--status-success-border)] text-[var(--status-success-fg)]";
            } else if (isSelected) {
              borderStyle = "border-[var(--foreground)] bg-[var(--surface-hover)] shadow-xs";
              badgeStyle = "bg-[var(--foreground)] text-[var(--background)] font-bold";
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={status === "correct"}
                className={`p-4 rounded-[12px] border-2 text-left flex items-center justify-between transition-all cursor-pointer ${borderStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-[6px] flex items-center justify-center text-xs font-mono font-semibold ${badgeStyle}`}
                  >
                    {optionLetters[idx]}
                  </span>
                  <span className="text-base font-medium text-[var(--foreground)] font-mono">
                    {opt}
                  </span>
                </div>

                {status === "correct" && isSelected && (
                  <CheckCircle2 size={18} className="text-[var(--status-success-fg)]" />
                )}
                {status === "incorrect" && isSelected && (
                  <XCircle size={18} className="text-[var(--status-error-fg)]" />
                )}
                {status === "incorrect" && isTheCorrectOne && (
                  <span className="text-xs text-[var(--status-success-fg)] font-semibold">
                    Correct Answer
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Grammar Explanation Card */}
      {status !== null && (
        <div
          className={`p-5 rounded-[14px] border space-y-4 animate-in fade-in-50 duration-200 ${
            status === "correct"
              ? "bg-[var(--status-success-bg)]/25 border-[var(--status-success-border)]"
              : "bg-[var(--status-error-bg)]/20 border-[var(--status-error-border)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 font-semibold text-sm ${
                status === "correct"
                  ? "text-[var(--status-success-fg)]"
                  : "text-[var(--status-error-fg)]"
              }`}
            >
              {status === "correct" ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>{t("clozeCorrectTitle")}</span>
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  <span>{t("clozeIncorrectTitle")}</span>
                </>
              )}
            </div>

            <span className="text-xs font-mono font-bold">
              {status === "correct" ? "Score: 100/100" : "Score: 0/100"}
            </span>
          </div>

          {/* Native Audio for Completed Sentence */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)]">
            <div>
              <span className="text-[11px] font-mono text-[var(--muted)] uppercase font-semibold block">
                Completed Sentence:
              </span>
              <p className="font-semibold text-base text-[var(--foreground)] pt-0.5">
                "{completedCorrectSentence}"
              </p>
            </div>
            <AudioButton text={completedCorrectSentence} label="Listen (1.0x)" size="sm" />
          </div>

          {/* Grammar Explanation Box */}
          <div className="p-3.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] space-y-1.5">
            <span className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
              <BookOpen size={13} className="text-[var(--muted)]" />
              <span>{t("clozeExplanationTitle")}:</span>
            </span>
            <p className="text-xs leading-relaxed text-[var(--muted-subtle)]">
              {language === "vi" ? question.explanationVi : question.explanationEn}
            </p>
          </div>

          <div className="flex justify-end pt-1">
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
      )}

      {/* Action Buttons when answering */}
      {status === null && (
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
            disabled={!selectedOption}
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
