"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  BookmarkPlus,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Headphones,
  Mic,
  PenTool,
  RotateCcw,
  Puzzle,
  SquareCode,
} from "lucide-react";
import { SeedLesson } from "@/server/db/seeds";
import { EvaluationResult } from "@/server/ai/gemini";
import { AITutorWidget } from "@/components/chat/AITutorWidget";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { AudioButton } from "@/components/audio/AudioButton";
import { MicButton } from "@/components/audio/MicButton";
import { SentenceBuilder } from "@/components/exercises/SentenceBuilder";
import { FillInBlank } from "@/components/exercises/FillInBlank";
import { useLanguage } from "@/i18n/LanguageContext";

interface LessonClientProps {
  lesson: SeedLesson;
  userId: string;
}

function calculateSimilarity(str1: string, str2: string): number {
  const clean1 = str1.toLowerCase().replace(/[.,!?;:]/g, "").trim().split(/\s+/).filter(Boolean);
  const clean2 = str2.toLowerCase().replace(/[.,!?;:]/g, "").trim().split(/\s+/).filter(Boolean);
  if (clean1.length === 0 || clean2.length === 0) return 0;

  let matchCount = 0;
  clean1.forEach((w) => {
    if (clean2.includes(w)) matchCount++;
  });
  return Math.min(100, Math.round((matchCount / Math.max(clean1.length, clean2.length)) * 100));
}

export function LessonClient({ lesson, userId }: LessonClientProps) {
  const { t } = useLanguage();
  const [practiceMode, setPracticeMode] = useState<
    "translate" | "builder" | "cloze" | "dictation" | "shadowing"
  >("translate");
  const [showTheory, setShowTheory] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [savedPhraseIds, setSavedPhraseIds] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [history, setHistory] = useState<
    Array<{ promptVi: string; answer: string; score: number; verdict: string }>
  >([]);

  // Shadowing state
  const [shadowingTranscript, setShadowingTranscript] = useState("");
  const [shadowingScore, setShadowingScore] = useState<number | null>(null);

  const currentExercise = lesson.exercises[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / lesson.exercises.length) * 100);

  async function handleCheckAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || loading) return;

    setLoading(true);
    setEvaluation(null);

    try {
      const res = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: currentExercise.id,
          lessonId: lesson.slug,
          promptVi: currentExercise.promptVi,
          answer: answer.trim(),
          referenceAnswers: currentExercise.referenceAnswers,
        }),
      });

      const data = await res.json();
      if (res.ok && data.evaluation) {
        setEvaluation(data.evaluation);
        setHistory((prev) => [
          ...prev,
          {
            promptVi: currentExercise.promptVi,
            answer: answer.trim(),
            score: data.evaluation.score,
            verdict: data.evaluation.verdict,
          },
        ]);
      } else {
        alert(data.error || "Unable to evaluate answer. Please try again.");
      }
    } catch {
      alert("Network error. Your drafted answer was preserved to retry.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePhrase(phrase: string, meaningVi: string, exampleEn: string) {
    try {
      const res = await fetch("/api/vocabulary/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase,
          meaningVi,
          exampleEn,
          topic: lesson.topic,
        }),
      });
      if (res.ok) {
        setSavedPhraseIds((prev) => ({ ...prev, [phrase]: true }));
      }
    } catch {
      alert("Could not save phrase at this time.");
    }
  }

  function handleNext() {
    setEvaluation(null);
    setAnswer("");
    setShadowingTranscript("");
    setShadowingScore(null);
    if (currentIndex + 1 < lesson.exercises.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }

  function handleSkip() {
    handleNext();
  }

  function handleShadowingSpeech(transcript: string) {
    setShadowingTranscript(transcript);
    const target = currentExercise.referenceAnswers[0];
    const score = calculateSimilarity(transcript, target);
    setShadowingScore(score);
  }

  function handleBuilderSuccess(assembled: string) {
    setHistory((prev) => [
      ...prev,
      {
        promptVi: currentExercise.promptVi,
        answer: assembled,
        score: 100,
        verdict: "correct",
      },
    ]);
    fetch("/api/ai/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseId: currentExercise.id,
        lessonId: lesson.slug,
        promptVi: currentExercise.promptVi,
        answer: assembled,
        referenceAnswers: currentExercise.referenceAnswers,
      }),
    }).catch(() => {});
  }

  function handleClozeSuccess(completedSentence: string) {
    setHistory((prev) => [
      ...prev,
      {
        promptVi: currentExercise.promptVi,
        answer: completedSentence,
        score: 100,
        verdict: "correct",
      },
    ]);
    fetch("/api/ai/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseId: currentExercise.id,
        lessonId: lesson.slug,
        promptVi: currentExercise.promptVi,
        answer: completedSentence,
        referenceAnswers: currentExercise.referenceAnswers,
      }),
    }).catch(() => {});
  }

  function handleClozeFailure(completedSentence: string) {
    setHistory((prev) => [
      ...prev,
      {
        promptVi: currentExercise.promptVi,
        answer: completedSentence,
        score: 0,
        verdict: "needs_improvement",
      },
    ]);
    fetch("/api/ai/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseId: currentExercise.id,
        lessonId: lesson.slug,
        promptVi: currentExercise.promptVi,
        answer: completedSentence,
        referenceAnswers: currentExercise.referenceAnswers,
      }),
    }).catch(() => {});
  }

  if (isCompleted) {
    const avgScore =
      history.length > 0
        ? Math.round(history.reduce((acc, h) => acc + h.score, 0) / history.length)
        : 0;

    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-[600px] bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-[var(--status-success-fg)]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{t("lessonCompletedTitle")}</h1>
            <p className="text-sm text-[var(--muted)]">
              {t("lessonCompletedSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-[var(--border)]">
            <div className="space-y-1">
              <span className="text-xs text-[var(--muted)] uppercase font-mono">{t("sentencesPracticed")}</span>
              <p className="text-2xl font-bold">{lesson.exercises.length}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[var(--muted)] uppercase font-mono">{t("averageScore")}</span>
              <p className="text-2xl font-bold">{avgScore}/100</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors cursor-pointer"
            >
              <span>{t("backToDashboard")}</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/learn"
              className="w-full sm:w-auto px-6 h-[44px] rounded-[10px] border border-[var(--border)] text-[var(--foreground)] font-semibold text-sm flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              <span>{t("exploreAllLessons")}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center py-6 px-4 md:px-6">
      {/* 760px Focus Container as per design.md section 7.2 */}
      <div className="w-full max-w-[760px] space-y-6">
        {/* Top bar: Back, Lesson Name, Progress & Language Switcher */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>{t("exitFocusMode")}</span>
          </Link>

          <span className="text-xs font-semibold text-[var(--foreground)] truncate max-w-[240px]">
            {lesson.topic}
          </span>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-[var(--muted-subtle)]">
              {currentIndex + 1} / {lesson.exercises.length}
            </span>
            <LanguageSwitcher compact />
          </div>
        </div>

        {/* 6px Progress Bar */}
        <div className="h-[6px] w-full bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 3 Learning Modes Switcher (Translate / Dictation / Shadowing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-[12px]">
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-0.5">
            <button
              type="button"
              onClick={() => {
                setPracticeMode("translate");
                setAnswer("");
                setEvaluation(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                practiceMode === "translate"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              <PenTool size={13} />
              <span>{t("modeTranslate")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPracticeMode("builder");
                setAnswer("");
                setEvaluation(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                practiceMode === "builder"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              <Puzzle size={13} />
              <span>{t("modeBuilder")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPracticeMode("cloze");
                setAnswer("");
                setEvaluation(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                practiceMode === "cloze"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              <SquareCode size={13} />
              <span>{t("modeCloze")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPracticeMode("dictation");
                setAnswer("");
                setEvaluation(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                practiceMode === "dictation"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              <Headphones size={13} />
              <span>{t("modeDictation")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPracticeMode("shadowing");
                setAnswer("");
                setEvaluation(null);
                setShadowingTranscript("");
                setShadowingScore(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                practiceMode === "shadowing"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              <Mic size={13} />
              <span>{t("modeShadowing")}</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-[var(--muted)] pr-2 hidden sm:inline">
            Sentence #{currentIndex + 1}
          </span>
        </div>

        {/* Theory Accordion Toggle */}
        <div className="border border-[var(--border)] rounded-[10px] overflow-hidden bg-[var(--surface-raised)]">
          <button
            onClick={() => setShowTheory(!showTheory)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-[var(--muted-subtle)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <BookOpen size={14} />
              {t("grammarTheory")}
            </span>
            {showTheory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showTheory && (
            <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--surface)] text-xs space-y-3">
              <div className="whitespace-pre-line leading-relaxed text-[var(--foreground)]">
                {lesson.theory}
              </div>
              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <p className="font-semibold text-[var(--muted-subtle)]">{t("realWorldExamples")}:</p>
                {lesson.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)]"
                  >
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="text-[var(--foreground)] font-medium">"{ex.en}"</span>
                      <span className="text-[var(--muted)]">→ {ex.vi}</span>
                    </div>
                    <AudioButton text={ex.en} compact />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODE 1: TRANSLATE (Default) */}
        {practiceMode === "translate" && (
          <>
            {/* Prompt Card */}
            <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
                  {t("translateThisSentence")}
                </span>
                {currentExercise.grammarCategory && (
                  <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-mono bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)]">
                    {currentExercise.grammarCategory}
                  </span>
                )}
              </div>

              <h2 className="text-[22px] md:text-[26px] font-semibold leading-[1.4] text-[var(--foreground)] tracking-tight">
                {currentExercise.promptVi}
              </h2>

              {currentExercise.hint && (
                <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                  <HelpCircle size={13} />
                  <span>
                    {t("hintLabel")}:{" "}
                    <code className="font-mono bg-[var(--surface)] px-1 py-0.5 rounded border border-[var(--border)]">
                      {currentExercise.hint}
                    </code>
                  </span>
                </p>
              )}
            </div>

            {/* Answer Input Area with Voice Mic Button */}
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
                  placeholder={t("yourEnglishAnswer")}
                  rows={4}
                  className="w-full min-h-[144px] p-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface-raised)] text-base md:text-[17px] leading-[1.65] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors resize-y disabled:opacity-80"
                />
              </div>

              {!evaluation && (
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleSkip}
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
                        <span>{t("checkAnswerBtn")}</span>
                        <Sparkles size={16} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </>
        )}

        {/* MODE 2: LISTENING & DICTATION */}
        {practiceMode === "dictation" && (
          <div className="space-y-4">
            <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5">
                  <Headphones size={14} />
                  <span>{t("modeDictation")}</span>
                </span>
                <span className="text-[11px] font-mono text-[var(--muted)]">
                  {currentExercise.grammarCategory}
                </span>
              </div>

              <div className="p-4 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] space-y-3">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {t("dictationPrompt")}
                </p>
                <div className="flex items-center gap-3">
                  <AudioButton
                    text={currentExercise.referenceAnswers[0]}
                    label="Play Audio (1.0x)"
                    size="lg"
                  />
                </div>
                <p className="text-xs text-[var(--muted)] italic">
                  {t("dictationHint")}
                </p>
              </div>

              {/* Collapsible Vietnamese Meaning Hint */}
              <details className="text-xs text-[var(--muted-subtle)] cursor-pointer">
                <summary className="hover:text-[var(--foreground)] font-medium">
                  Need Vietnamese context hint? (Click to view)
                </summary>
                <p className="mt-2 p-2.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-medium">
                  {currentExercise.promptVi}
                </p>
              </details>
            </div>

            {/* Answer Input Area for Dictation */}
            <form onSubmit={handleCheckAnswer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                  {t("yourEnglishAnswer")}
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={loading || evaluation !== null}
                  placeholder="Type the English sentence you heard..."
                  rows={4}
                  className="w-full min-h-[120px] p-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface-raised)] text-base md:text-[17px] leading-[1.65] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors resize-y disabled:opacity-80"
                />
              </div>

              {!evaluation && (
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleSkip}
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
                        <span>{t("checkAnswerBtn")}</span>
                        <Sparkles size={16} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* MODE 3: VOICE SHADOWING */}
        {practiceMode === "shadowing" && (
          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5">
                <Mic size={14} />
                <span>{t("modeShadowing")}</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--muted)]">
                Target Native Speech
              </span>
            </div>

            {/* Target Sentence Box */}
            <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] space-y-3">
              <span className="text-xs font-mono uppercase text-[var(--muted)] font-semibold">
                Target Sentence:
              </span>
              <p className="text-xl md:text-2xl font-bold text-[var(--foreground)] leading-snug">
                "{currentExercise.referenceAnswers[0]}"
              </p>
              <div className="flex items-center gap-2 pt-1">
                <AudioButton
                  text={currentExercise.referenceAnswers[0]}
                  label="Listen Native (1.0x)"
                  size="md"
                />
              </div>
            </div>

            {/* Speech Recording Section */}
            <div className="p-5 rounded-[12px] border border-[var(--border)] bg-[var(--surface-raised)] space-y-4 text-center">
              <p className="text-xs text-[var(--muted)]">
                {t("shadowingPrompt")}
              </p>

              <div className="flex justify-center">
                <MicButton
                  onTranscript={handleShadowingSpeech}
                  label="Click to Speak & Shadow"
                  className="px-6 py-2.5 text-sm"
                />
              </div>

              {shadowingTranscript && (
                <div className="space-y-2 pt-2 text-left border-t border-[var(--border)]">
                  <span className="text-xs font-mono text-[var(--muted)] uppercase font-semibold">
                    What we heard:
                  </span>
                  <p className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-sm font-medium text-[var(--foreground)]">
                    "{shadowingTranscript}"
                  </p>

                  {shadowingScore !== null && (
                    <div className="flex items-center justify-between p-3 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)]">
                      <span className="text-xs font-semibold text-[var(--foreground)]">
                        {t("pronunciationMatch")}:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold font-mono text-[var(--foreground)]">
                          {shadowingScore}%
                        </span>
                        {shadowingScore >= 80 ? (
                          <span className="text-xs text-[var(--status-success-fg)] font-semibold">
                            ✓ Excellent!
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--muted)]">
                            Try speaking clearly again
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center gap-2 hover:bg-[#262626] transition-colors cursor-pointer"
              >
                <span>
                  {currentIndex + 1 < lesson.exercises.length
                    ? t("nextSentence")
                    : t("finishLesson")}
                </span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* MODE 4: SENTENCE BUILDER */}
        {practiceMode === "builder" && (
          <SentenceBuilder
            key={`builder-${currentExercise.id}`}
            exerciseId={currentExercise.id}
            promptVi={currentExercise.promptVi}
            referenceAnswers={currentExercise.referenceAnswers}
            grammarCategory={currentExercise.grammarCategory}
            onSuccess={handleBuilderSuccess}
            onNext={handleNext}
            isLastSentence={currentIndex + 1 >= lesson.exercises.length}
          />
        )}

        {/* MODE 5: FILL IN THE BLANK (CLOZE) */}
        {practiceMode === "cloze" && (
          <FillInBlank
            key={`cloze-${currentExercise.id}`}
            exerciseId={currentExercise.id}
            promptVi={currentExercise.promptVi}
            referenceAnswers={currentExercise.referenceAnswers}
            grammarCategory={currentExercise.grammarCategory}
            onSuccess={handleClozeSuccess}
            onFailure={handleClozeFailure}
            onNext={handleNext}
            isLastSentence={currentIndex + 1 >= lesson.exercises.length}
          />
        )}

        {/* Evaluation Feedback Block (For Translate & Dictation modes) */}
        {evaluation && (
          <div className="bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-[14px] p-6 space-y-6 animate-in fade-in-50 duration-200 shadow-xs">
            {/* Header: Verdict status + Score */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                {evaluation.verdict === "correct" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[var(--status-success-bg)] border border-[var(--status-success-border)] text-[var(--status-success-fg)] font-semibold text-xs">
                    <CheckCircle2 size={16} />
                    <span>Correct</span>
                  </div>
                )}
                {evaluation.verdict === "acceptable" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[var(--status-warning-bg)] border border-[var(--status-warning-border)] text-[var(--status-warning-fg)] font-semibold text-xs">
                    <AlertTriangle size={16} />
                    <span>Acceptable</span>
                  </div>
                )}
                {evaluation.verdict === "needs_improvement" && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[var(--status-error-bg)] border border-[var(--status-error-border)] text-[var(--status-error-fg)] font-semibold text-xs">
                    <XCircle size={16} />
                    <span>Needs Review</span>
                  </div>
                )}
              </div>
              <span className="text-xs font-mono text-[var(--muted-subtle)]">
                {t("accuracyScore")}: <strong>{evaluation.score}/100</strong>
              </span>
            </div>

            {/* Answer Comparison with Audio Buttons */}
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

              {evaluation.naturalAlternative && evaluation.naturalAlternative !== evaluation.correctedSentence && (
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[var(--muted)] uppercase font-semibold">
                    {t("naturalAlternative")}:
                  </span>
                  <div className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[8px]">
                    <p className="font-medium text-[var(--muted-subtle)]">
                      {evaluation.naturalAlternative}
                    </p>
                    <AudioButton text={evaluation.naturalAlternative} compact />
                  </div>
                </div>
              )}
            </div>

            {/* Explanation */}
            <div className="space-y-1.5 p-4 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                {t("explanation")}:
              </span>
              <p className="text-sm leading-relaxed text-[var(--foreground)]">
                {evaluation.explanationVi}
              </p>
            </div>

            {/* Error details if any */}
            {evaluation.errors && evaluation.errors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                  {t("actionableCorrections")}:
                </span>
                <div className="space-y-2">
                  {evaluation.errors.map((err, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] text-xs space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold px-1.5 py-0.5 bg-[var(--surface-hover)] border border-[var(--border)] rounded">
                          {err.category}
                        </span>
                        {err.suggestion && (
                          <span className="text-[var(--foreground)] font-medium">
                            Suggestion: "{err.suggestion}"
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--muted-subtle)]">{err.explanationVi}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Useful Phrases with Audio + Save Button */}
            {evaluation.phrases && evaluation.phrases.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                  {t("usefulPhrases")}:
                </span>
                <div className="space-y-2">
                  {evaluation.phrases.map((phrase, i) => {
                    const isSaved = savedPhraseIds[phrase.phrase];
                    return (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] gap-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-[var(--foreground)]">
                              {phrase.phrase}
                            </p>
                            <AudioButton text={phrase.phrase} compact />
                          </div>
                          <p className="text-[var(--muted)]">→ {phrase.meaningVi}</p>
                          {phrase.exampleEn && (
                            <p className="text-[var(--muted-subtle)] italic">
                              "{phrase.exampleEn}"
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={isSaved}
                          onClick={() =>
                            handleSavePhrase(
                              phrase.phrase,
                              phrase.meaningVi,
                              phrase.exampleEn
                            )
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] font-semibold text-xs border transition-colors self-start sm:self-auto cursor-pointer ${
                            isSaved
                              ? "bg-[var(--surface-hover)] text-[var(--muted)] border-[var(--border)]"
                              : "bg-[var(--surface-raised)] text-[var(--foreground)] border-[var(--border-strong)] hover:bg-[var(--surface-hover)]"
                          }`}
                        >
                          <BookmarkPlus size={13} />
                          <span>{isSaved ? t("savedToBank") : t("saveToPhraseBank")}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dominant Next Action CTA */}
            <div className="pt-4 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center gap-2 hover:bg-[#262626] transition-colors cursor-pointer"
              >
                <span>
                  {currentIndex + 1 < lesson.exercises.length
                    ? t("nextSentence")
                    : t("finishLesson")}
                </span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating AI Coach with current exercise context */}
      <AITutorWidget
        currentContext={`Lesson: "${lesson.title}" (${lesson.topic}). Prompt: "${currentExercise.promptVi}". Ref: "${currentExercise.referenceAnswers[0]}".`}
      />
    </div>
  );
}
