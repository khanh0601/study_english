"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { speakEnglishSentence, stopSpeaking } from "@/lib/speech/tts";

interface AudioButtonProps {
  text: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  compact?: boolean;
  className?: string;
}

export function AudioButton({
  text,
  size = "md",
  label,
  compact = false,
  className = "",
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState<number>(1.0); // 1.0 = normal, 0.8 = slow

  function handlePlay(e: React.MouseEvent, targetRate: number) {
    e.stopPropagation();
    e.preventDefault();

    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setRate(targetRate);
    setIsPlaying(true);
    speakEnglishSentence(
      text,
      { rate: targetRate, lang: "en-US" },
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  }

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18,
  };

  const currentIconSize = iconSizes[size];

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <button
          type="button"
          onClick={(e) => handlePlay(e, 1.0)}
          title={`Listen to pronunciation (${rate}x)`}
          aria-label={`Listen to ${text}`}
          className={`p-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)] transition-all cursor-pointer ${
            isPlaying ? "border-[var(--foreground)] bg-[var(--surface-hover)] ring-1 ring-[var(--foreground)]" : ""
          }`}
        >
          <Volume2
            size={currentIconSize}
            className={isPlaying ? "animate-pulse text-[var(--foreground)]" : "text-[var(--muted-subtle)]"}
          />
        </button>

        {/* Small 0.8x slow speed button */}
        <button
          type="button"
          onClick={(e) => handlePlay(e, 0.8)}
          title="Listen slowly (0.8x) to hear word endings and linked sounds"
          className="px-1.5 py-0.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface)] text-[10px] font-mono text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
        >
          0.8x
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={(e) => handlePlay(e, 1.0)}
        title="Listen to native pronunciation (1.0x)"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)] transition-all cursor-pointer ${
          isPlaying ? "border-[var(--foreground)] bg-[var(--surface-hover)] ring-1 ring-[var(--foreground)]" : ""
        }`}
      >
        <Volume2
          size={currentIconSize}
          className={isPlaying ? "animate-pulse text-[var(--foreground)]" : "text-[var(--muted-subtle)]"}
        />
        <span>{label || "Listen (1.0x)"}</span>
      </button>

      <button
        type="button"
        onClick={(e) => handlePlay(e, 0.8)}
        title="Listen slowly (0.8x) for clear pronunciation & ending sounds"
        className="px-2 py-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
      >
        0.8x
      </button>
    </div>
  );
}
