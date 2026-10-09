"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  Bookmark,
  Check,
  X,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { speakEnglishSentence, stopSpeaking } from "@/lib/speech/tts";

interface DefinitionData {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningVi: string;
  explanationEn: string;
  exampleEn: string;
}

export function TextSelectionTooltip() {
  const [selectedText, setSelectedText] = useState("");
  const [contextSentence, setContextSentence] = useState("");
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [placement, setPlacement] = useState<"top" | "bottom">("top");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [definition, setDefinition] = useState<DefinitionData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const tooltipRef = useRef<HTMLDivElement>(null);

  // 1. Listen for mouse up / text selection across document
  useEffect(() => {
    function handleSelection(e: MouseEvent | TouchEvent) {
      // If clicking inside the tooltip, don't trigger re-selection
      if (tooltipRef.current && tooltipRef.current.contains(e.target as Node)) {
        return;
      }

      // Check if target is an interactive form element (input/textarea)
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Small delay so selection is finalized
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          return;
        }

        const rawText = selection.toString().trim();
        // Clean text (remove leading/trailing symbols)
        const cleaned = rawText.replace(/^[“"'`(\[\{]+|[.,!?;:״”"')\]\}]+$/g, "").trim();

        // Only activate if valid text: 1 to 6 words, >= 2 chars, letters/apostrophe/hyphen
        const wordCount = cleaned.split(/\s+/).length;
        if (!cleaned || cleaned.length < 2 || wordCount > 6) {
          return;
        }

        // Get context sentence surrounding the selection
        let context = "";
        try {
          const anchorNode = selection.anchorNode;
          if (anchorNode && anchorNode.textContent) {
            context = anchorNode.textContent.trim().slice(0, 160);
          }
        } catch {
          // ignore
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width === 0 && rect.height === 0) return;

        // Calculate Tooltip Coordinates
        const tooltipWidth = 320;
        const tooltipHeight = 180;
        const viewportWidth = window.innerWidth;

        let left = rect.left + rect.width / 2 - tooltipWidth / 2;
        // Clamp to screen edges
        left = Math.max(16, Math.min(viewportWidth - tooltipWidth - 16, left));

        let top = 0;
        let chosenPlacement: "top" | "bottom" = "top";

        if (rect.top > tooltipHeight + 20) {
          // Position above selection
          top = rect.top - tooltipHeight - 8 + window.scrollY;
          chosenPlacement = "top";
        } else {
          // Position below selection
          top = rect.bottom + 8 + window.scrollY;
          chosenPlacement = "bottom";
        }

        setSelectedText(cleaned);
        setContextSentence(context);
        setPosition({ top, left });
        setPlacement(chosenPlacement);
        setIsOpen(true);
        setSaved(false);

        // Fetch definition
        fetchDefinition(cleaned, context);
      }, 50);
    }

    // Dismiss on click outside
    function handleClickOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        // Also ensure user didn't just select new text
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setIsOpen(false);
          stopSpeaking();
        }
      }
    }

    // Dismiss on Escape key
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        stopSpeaking();
      }
    }

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function fetchDefinition(text: string, context: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/dictionary/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setDefinition(data.data);
      } else {
        setDefinition({
          word: text,
          phonetic: "",
          partOfSpeech: "phrase",
          meaningVi: "Tra cứu nghĩa theo ngữ cảnh bài học.",
          explanationEn: text,
          exampleEn: context,
        });
      }
    } catch {
      setDefinition({
        word: text,
        phonetic: "",
        partOfSpeech: "phrase",
        meaningVi: "Không thể kết nối từ điển lúc này.",
        explanationEn: text,
        exampleEn: context,
      });
    } finally {
      setLoading(false);
    }
  }

  // Handle Audio Pronunciation
  function handlePronounce() {
    if (!selectedText) return;
    speakEnglishSentence(selectedText, { rate: 0.9, lang: "en-US" });
  }

  // Handle Save to Vocabulary Bank
  async function handleSaveVocabulary() {
    if (!definition || saving || saved) return;
    setSaving(true);
    try {
      const res = await fetch("/api/vocabulary/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: definition.word,
          meaningVi: definition.meaningVi,
          exampleEn: definition.exampleEn || contextSentence || definition.word,
          topic: "Quick Lookup",
        }),
      });

      if (res.ok) {
        setSaved(true);
      } else {
        alert("Vui lòng đăng nhập để lưu từ vựng.");
      }
    } catch {
      alert("Lỗi khi lưu từ vựng.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen || !position) return null;

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: "320px",
      }}
      className="z-50 bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-[14px] shadow-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150 text-[var(--foreground)] backdrop-blur-md"
    >
      {/* Header: Word, Phonetic, Part of speech, Audio button & Close */}
      <div className="flex items-start justify-between gap-2 border-b border-[var(--border)] pb-2.5">
        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base text-[var(--foreground)] tracking-tight truncate max-w-[200px]">
              {definition?.word || selectedText}
            </span>

            {definition?.partOfSpeech && (
              <span className="px-1.5 py-0.5 rounded-[4px] bg-[var(--surface-hover)] border border-[var(--border)] text-[10px] font-mono text-[var(--muted)] font-semibold uppercase">
                {definition.partOfSpeech}
              </span>
            )}
          </div>

          {definition?.phonetic && (
            <span className="block text-xs font-mono text-[var(--muted)]">
              {definition.phonetic}
            </span>
          )}
        </div>

        {/* Action icons: Audio & Close */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handlePronounce}
            title="Nghe phát âm chuẩn (US)"
            className="p-1.5 rounded-[6px] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <Volume2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            title="Đóng"
            className="p-1.5 rounded-[6px] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body: Meaning & Explanation */}
      <div className="space-y-2">
        {loading ? (
          <div className="py-3 flex items-center justify-center gap-2 text-xs text-[var(--muted)] font-mono">
            <Loader2 size={14} className="animate-spin" />
            <span>Đang tra cứu nghĩa AI...</span>
          </div>
        ) : (
          <>
            {/* Vietnamese Meaning */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
                Nghĩa tiếng Việt:
              </span>
              <p className="text-sm font-semibold text-[var(--foreground)] leading-snug">
                {definition?.meaningVi}
              </p>
            </div>

            {/* Simple English explanation if available */}
            {definition?.explanationEn && (
              <p className="text-xs text-[var(--muted)] italic leading-relaxed pt-1 border-t border-[var(--border)]">
                "{definition.explanationEn}"
              </p>
            )}
          </>
        )}
      </div>

      {/* Footer: Save to Vocabulary Button & Quick Link */}
      <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
        <Link
          href="/vocabulary"
          onClick={() => setIsOpen(false)}
          className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--muted-subtle)] hover:text-[var(--foreground)] transition-colors"
        >
          <span>Sổ từ vựng</span>
          <ExternalLink size={10} />
        </Link>

        <button
          type="button"
          onClick={handleSaveVocabulary}
          disabled={loading || saving || saved}
          className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            saved
              ? "bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)] cursor-default"
              : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[#262626] shadow-xs"
          } disabled:opacity-75`}
        >
          {saving ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : saved ? (
            <>
              <Check size={13} className="text-emerald-500" />
              <span>Đã lưu vào Sổ từ</span>
            </>
          ) : (
            <>
              <Bookmark size={12} className="fill-current" />
              <span>Lưu từ này</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
