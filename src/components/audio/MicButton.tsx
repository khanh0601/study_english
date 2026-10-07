"use client";

import React, { useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface MicButtonProps {
  onTranscript: (text: string) => void;
  lang?: string;
  className?: string;
  label?: string;
}

export function MicButton({
  onTranscript,
  lang = "en-US",
  className = "",
  label,
}: MicButtonProps) {
  const { isListening, transcript, isSupported, startListening, stopListening, error } =
    useSpeechRecognition(lang);

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!isSupported) {
    return null; // Gracefully hidden if browser doesn't support Web Speech Recognition
  }

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isListening ? "Listening... Click to stop speaking" : "Speak your sentence (Voice Input & Shadowing)"}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold border transition-all cursor-pointer ${
        isListening
          ? "bg-[var(--surface-hover)] border-[var(--foreground)] text-[var(--foreground)] ring-1 ring-[var(--foreground)] animate-pulse"
          : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]"
      } ${className}`}
    >
      {isListening ? (
        <>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <Mic size={14} className="text-red-500" />
          <span>{label || "Listening..."}</span>
        </>
      ) : (
        <>
          <Mic size={14} />
          <span>{label || "Speak"}</span>
        </>
      )}
    </button>
  );
}
