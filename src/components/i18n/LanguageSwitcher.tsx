"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-0.5 text-xs font-mono shadow-xs"
    >
      {!compact && (
        <span className="flex items-center pl-1.5 pr-1 text-[var(--muted)]" title="Select language">
          <Globe size={13} strokeWidth={2} />
        </span>
      )}
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`px-2 py-1 rounded-[6px] font-semibold transition-all cursor-pointer ${
          language === "en"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("vi")}
        aria-pressed={language === "vi"}
        className={`px-2 py-1 rounded-[6px] font-semibold transition-all cursor-pointer ${
          language === "vi"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
      >
        VI
      </button>
    </div>
  );
}
