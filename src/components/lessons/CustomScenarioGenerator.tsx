"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Wand2,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { SeedLesson } from "@/server/db/seeds";

interface CustomScenarioGeneratorProps {
  onLessonCreated?: (lesson: SeedLesson) => void;
}

export function CustomScenarioGenerator({
  onLessonCreated,
}: CustomScenarioGeneratorProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [prompt, setPrompt] = useState("");
  const [level, setLevel] = useState<"A2" | "B1" | "B2">("B1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdLesson, setCreatedLesson] = useState<SeedLesson | null>(null);

  const suggestions = [
    {
      label: t("suggestionInterview"),
      level: "B1" as const,
      text: "Tôi sắp có buổi phỏng vấn vị trí Senior Fullstack Developer. Tôi cần luyện các câu giải thích về tối ưu hóa hiệu năng, xử lý race condition và quyết định kiến trúc hệ thống.",
    },
    {
      label: t("suggestionSalary"),
      level: "B2" as const,
      text: "Tôi muốn viết email và trao đổi trực tiếp với HR để thương lượng mức lương cạnh tranh hơn cùng gói cổ phần và quyền làm việc remote linh hoạt.",
    },
    {
      label: t("suggestionDeadline"),
      level: "B1" as const,
      text: "Tôi cần gửi tin nhắn cho Product Manager người Mỹ giải thích lý do cần dời ngày release dự án thêm 3 ngày để hoàn tất security audit.",
    },
    {
      label: t("suggestionBaggage"),
      level: "A2" as const,
      text: "Tôi đang ở sân bay nước ngoài và phát hiện hành lý ký gửi bị thất lạc. Tôi cần đến quầy Lost & Found để khai báo đặc điểm vali và thông tin liên hệ.",
    },
    {
      label: t("suggestionRestaurant"),
      level: "A2" as const,
      text: "Tôi đi ăn tại nhà hàng phương Tây, muốn hỏi kỹ xem món súp có chứa hải sản hay bột mì không vì tôi bị dị ứng nặng.",
    },
  ];

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/lessons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioPrompt: prompt.trim(),
          level,
        }),
      });

      const data = await res.json();

      if (res.ok && data.lesson) {
        setCreatedLesson(data.lesson);
        if (onLessonCreated) {
          onLessonCreated(data.lesson);
        }
        // Auto-navigate after a brief moment or user can click
        setTimeout(() => {
          router.push(`/learn/${data.lesson.slug}`);
        }, 1200);
      } else {
        setError(data.error || "Could not generate lesson. Please try again.");
      }
    } catch {
      setError("Network connection issue. Please check and retry.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectSuggestion(sug: (typeof suggestions)[0]) {
    setPrompt(sug.text);
    setLevel(sug.level);
    setError(null);
  }

  return (
    <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 md:p-8 space-y-6 shadow-xs">
      {/* Title & Description */}
      <div className="space-y-1.5 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)]">
            <Wand2 size={16} />
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-[var(--foreground)]">
            {t("customScenarioTitle")}
          </h2>
        </div>
        <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
          {t("customScenarioSubtitle")}
        </p>
      </div>

      {/* Suggestion Chips */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted-subtle)] font-semibold flex items-center gap-1.5">
          <Lightbulb size={13} />
          <span>{t("quickSuggestions")}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectSuggestion(sug)}
              disabled={loading}
              className="px-3 py-1.5 rounded-[8px] text-xs font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer select-none text-left"
            >
              {sug.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Form */}
      <form onSubmit={handleGenerate} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
            Describe Your Situation:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            rows={3}
            placeholder={t("scenarioPlaceholder")}
            className="w-full p-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-sm md:text-base text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors resize-y disabled:opacity-75"
          />
        </div>

        {/* Level Selector Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase font-mono">
              {t("targetLevel")}
            </span>
            <div className="inline-flex rounded-[8px] p-1 bg-[var(--surface)] border border-[var(--border)]">
              {(["A2", "B1", "B2"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  disabled={loading}
                  className={`px-3 py-1 text-xs font-mono font-semibold rounded-[6px] transition-all cursor-pointer ${
                    level === lvl
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                      : "text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="w-full sm:w-auto px-6 h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{t("generatingLesson")}</span>
              </>
            ) : (
              <>
                <span>{t("generateScenarioBtn")}</span>
                <Sparkles size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-[10px] bg-[var(--status-error-bg)]/25 border border-[var(--status-error-border)] flex items-center gap-2.5 text-xs text-[var(--status-error-fg)] font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Notification Banner */}
      {createdLesson && (
        <div className="p-4 rounded-[12px] bg-[var(--status-success-bg)]/25 border border-[var(--status-success-border)] space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--status-success-fg)] font-semibold text-sm">
              <CheckCircle2 size={18} />
              <span>Lesson Created Successfully!</span>
            </div>
            <span className="text-xs font-mono text-[var(--muted-subtle)]">
              Redirecting...
            </span>
          </div>

          <p className="text-sm font-semibold text-[var(--foreground)]">
            "{createdLesson.title}"
          </p>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => router.push(`/learn/${createdLesson.slug}`)}
              className="px-4 py-2 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#262626] transition-colors cursor-pointer"
            >
              <span>Start Practicing Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
