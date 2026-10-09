"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Volume2,
  Mic,
  ChevronRight,
  ChevronLeft,
  BookmarkPlus,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Tv,
  Check,
} from "lucide-react";
import { VideoLesson, VideoSentence } from "@/server/db/video-seeds";
import { MicButton } from "@/components/audio/MicButton";
import { AudioButton } from "@/components/audio/AudioButton";
import { useLanguage } from "@/i18n/LanguageContext";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

interface VideoPlayerClientProps {
  video: VideoLesson;
  userId: string;
}

// Compare target sentence with spoken transcript word-by-word
function analyzePronunciationDiff(
  target: string,
  transcript: string
): {
  score: number;
  wordDiff: Array<{ word: string; status: "correct" | "missing" | "extra" }>;
} {
  const cleanTargetWords = target
    .toLowerCase()
    .replace(/[.,!?;:'"״“”—\-]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const cleanSpokenWords = transcript
    .toLowerCase()
    .replace(/[.,!?;:'"״“”—\-]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (cleanTargetWords.length === 0) {
    return { score: 0, wordDiff: [] };
  }

  let matchCount = 0;
  const wordDiff: Array<{
    word: string;
    status: "correct" | "missing" | "extra";
  }> = [];

  const spokenSet = [...cleanSpokenWords];

  cleanTargetWords.forEach((word) => {
    const foundIndex = spokenSet.indexOf(word);
    if (foundIndex !== -1) {
      matchCount++;
      wordDiff.push({ word, status: "correct" });
      spokenSet.splice(foundIndex, 1);
    } else {
      wordDiff.push({ word, status: "missing" });
    }
  });

  const score = Math.min(
    100,
    Math.round((matchCount / cleanTargetWords.length) * 100)
  );

  return { score, wordDiff };
}

export function VideoPlayerClient({ video, userId }: VideoPlayerClientProps) {
  const { t } = useLanguage();

  // YouTube Player instance
  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Active sentence index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Control toggles
  const [isLooping, setIsLooping] = useState(false);
  const [isAutoPause, setIsAutoPause] = useState(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  // Practice Mode on active sentence: "shadowing" | "dictation" | "translate"
  const [sentenceMode, setSentenceMode] = useState<
    "shadowing" | "dictation" | "translate"
  >("shadowing");

  // Shadowing state
  const [shadowingTranscript, setShadowingTranscript] = useState("");
  const [shadowingScore, setShadowingScore] = useState<number | null>(null);
  const [wordDiff, setWordDiff] = useState<
    Array<{ word: string; status: "correct" | "missing" | "extra" }>
  >([]);

  // Dictation state
  const [dictationInput, setDictationInput] = useState("");
  const [dictationResult, setDictationResult] = useState<
    "correct" | "incorrect" | null
  >(null);

  // Saved vocabulary tracker
  const [savedPhrases, setSavedPhrases] = useState<Record<string, boolean>>({});

  const activeSentence: VideoSentence = video.sentences[currentIndex] || video.sentences[0];

  // 1. Load YouTube IFrame API Script
  useEffect(() => {
    // Check if script already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(`youtube-player-${video.youtubeId}`, {
          videoId: video.youtubeId,
          playerVars: {
            playsinline: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            origin: typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true);
              if (video.sentences && video.sentences.length > 0) {
                event.target.seekTo(video.sentences[0].start, true);
              }
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING, 2 = PAUSED
              setIsPlaying(event.data === 1);
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [video.youtubeId]);

  // 2. Real-time time updater & sentence boundary enforcement
  useEffect(() => {
    if (!playerReady) return;

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        try {
          const time = playerRef.current.getCurrentTime();
          setCurrentTime(time);

          // Handle sentence loop or auto-pause
          if (activeSentence) {
            if (time >= activeSentence.end) {
              if (isLooping) {
                playerRef.current.seekTo(activeSentence.start, true);
                playerRef.current.playVideo();
              } else if (isAutoPause && isPlaying) {
                playerRef.current.pauseVideo();
              }
            }
          }

          // Auto-detect sentence if playing freely
          if (!isLooping) {
            const foundIdx = video.sentences.findIndex(
              (s) => time >= s.start && time < s.end
            );
            if (foundIdx !== -1 && foundIdx !== currentIndex) {
              setCurrentIndex(foundIdx);
              // Reset per-sentence states
              setShadowingTranscript("");
              setShadowingScore(null);
              setDictationInput("");
              setDictationResult(null);
            }
          }
        } catch {
          // ignore transient player read errors
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, [playerReady, activeSentence, isLooping, isAutoPause, isPlaying, currentIndex, video.sentences]);

  // Seek video to specific sentence
  function seekToSentence(index: number, autoPlay: boolean = true) {
    if (index < 0 || index >= video.sentences.length) return;
    const target = video.sentences[index];
    setCurrentIndex(index);
    setShadowingTranscript("");
    setShadowingScore(null);
    setDictationInput("");
    setDictationResult(null);

    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(target.start, true);
      if (autoPlay) {
        playerRef.current.playVideo();
      }
    }
  }

  function handleReplayCurrent() {
    seekToSentence(currentIndex, true);
  }

  function handleNextSentence() {
    if (currentIndex + 1 < video.sentences.length) {
      seekToSentence(currentIndex + 1, true);
    }
  }

  function handlePrevSentence() {
    if (currentIndex > 0) {
      seekToSentence(currentIndex - 1, true);
    }
  }

  function handleTogglePlay() {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }

  function handleChangeSpeed(rate: number) {
    setPlaybackRate(rate);
    if (playerRef.current && playerRef.current.setPlaybackRate) {
      playerRef.current.setPlaybackRate(rate);
    }
  }

  // Handle Speech Recognition transcript in Shadowing mode
  function handleShadowingSpeech(transcript: string) {
    setShadowingTranscript(transcript);
    const { score, wordDiff: diff } = analyzePronunciationDiff(
      activeSentence.textEn,
      transcript
    );
    setShadowingScore(score);
    setWordDiff(diff);
  }

  // Handle Dictation validation
  function handleCheckDictation(e: React.FormEvent) {
    e.preventDefault();
    if (!dictationInput.trim()) return;

    const cleanInput = dictationInput
      .toLowerCase()
      .replace(/[.,!?;:'"״“”—\-]/g, "")
      .trim();
    const cleanTarget = activeSentence.textEn
      .toLowerCase()
      .replace(/[.,!?;:'"״“”—\-]/g, "")
      .trim();

    if (cleanInput === cleanTarget) {
      setDictationResult("correct");
    } else {
      setDictationResult("incorrect");
    }
  }

  // Save phrase to Vocabulary Bank
  async function handleSavePhrase(phrase: string, meaningVi: string) {
    try {
      const res = await fetch("/api/vocabulary/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase,
          meaningVi,
          exampleEn: activeSentence.textEn,
          topic: video.topic,
        }),
      });
      if (res.ok) {
        setSavedPhrases((prev) => ({ ...prev, [phrase]: true }));
      }
    } catch {
      alert("Unable to save phrase at this time.");
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center py-6 px-4 md:px-6">
      <div className="w-full max-w-7xl space-y-6">
        {/* Top Header: Back Link, Title, CEFR badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <Link
            href="/watch"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Thư viện Video (Library)</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-mono bg-[var(--surface-hover)] border border-[var(--border)] font-semibold text-[var(--foreground)]">
              CEFR {video.level}
            </span>
            <span className="text-xs font-mono text-[var(--muted)]">
              {video.topic}
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left Video & Practice, Right Transcript List */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">
          {/* LEFT COLUMN: Player & Active Sentence Practice Runner */}
          <div className="space-y-6">
            {/* Embedded YouTube Container */}
            <div className="relative aspect-video w-full rounded-[14px] overflow-hidden border border-[var(--border)] bg-black shadow-sm">
              <div
                id={`youtube-player-${video.youtubeId}`}
                className="w-full h-full"
              />
            </div>

            {/* Custom Control Toolbar */}
            <div className="p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-[12px] flex flex-wrap items-center justify-between gap-3">
              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSentence}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-[8px] border border-[var(--border)] hover:bg-[var(--surface-hover)] disabled:opacity-30 transition-colors cursor-pointer"
                  title="Previous sentence"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="px-4 py-2 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#262626] transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReplayCurrent}
                  className="px-3 py-2 rounded-[8px] border border-[var(--border)] text-xs font-semibold flex items-center gap-1 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                  title="Replay current sentence"
                >
                  <RotateCcw size={13} />
                  <span>{t("replaySentence")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextSentence}
                  disabled={currentIndex + 1 >= video.sentences.length}
                  className="p-2 rounded-[8px] border border-[var(--border)] hover:bg-[var(--surface-hover)] disabled:opacity-30 transition-colors cursor-pointer"
                  title="Next sentence"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Loop, Auto-pause & Speed Options */}
              <div className="flex items-center gap-2">
                {/* Loop Sentence Toggle */}
                <button
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  className={`px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-medium flex items-center gap-1 transition-all cursor-pointer ${
                    isLooping
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs"
                      : "border border-[var(--border)] text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
                  }`}
                  title="Repeat current sentence repeatedly"
                >
                  <Repeat size={13} />
                  <span className="hidden sm:inline">{t("loopSentence")}</span>
                </button>

                {/* Speed selector */}
                <div className="flex items-center rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-0.5 text-xs font-mono">
                  {([0.75, 1.0, 1.25] as const).map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleChangeSpeed(rate)}
                      className={`px-2 py-1 rounded-[6px] transition-all cursor-pointer ${
                        playbackRate === rate
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-bold"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Practice Runner Card for Active Sentence */}
            <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-5 shadow-xs">
              {/* Card Header: Mode selector */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSentenceMode("shadowing")}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all cursor-pointer ${
                      sentenceMode === "shadowing"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                        : "text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    🎙️ Voice Shadowing
                  </button>
                  <button
                    type="button"
                    onClick={() => setSentenceMode("dictation")}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all cursor-pointer ${
                      sentenceMode === "dictation"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                        : "text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    🎧 Dictation (Nghe chép)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSentenceMode("translate")}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all cursor-pointer ${
                      sentenceMode === "translate"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                        : "text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    ✍️ Translation & Vocabulary
                  </button>
                </div>

                <span className="text-[11px] font-mono text-[var(--muted)]">
                  Sentence #{currentIndex + 1}/{video.sentences.length}
                </span>
              </div>

              {/* Subtitle / Meaning Display */}
              <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <span className="text-xs font-mono uppercase text-[var(--muted)] font-semibold">
                  Vietnamese Meaning:
                </span>
                <p className="text-lg font-medium text-[var(--foreground)] leading-snug">
                  {activeSentence.textVi}
                </p>

                {/* English Text (revealed in Shadowing and Translate, hidden in Dictation) */}
                {sentenceMode !== "dictation" ? (
                  <div className="pt-2 border-t border-[var(--border)] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-[var(--muted)] font-semibold">
                        Target English Sentence:
                      </span>
                      <span className="text-[11px] font-mono text-[var(--muted)] hidden sm:inline">
                        ✨ Bôi đen từ để tra nghĩa & lưu
                      </span>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-tight leading-relaxed select-text cursor-text">
                      "{activeSentence.textEn}"
                    </p>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[var(--border)] text-xs text-[var(--muted)] italic">
                    Subtitle is hidden in Dictation mode. Listen to the video and type below.
                  </div>
                )}
              </div>

              {/* Key Phrases Chips (if available) */}
              {activeSentence.keyPhrases && activeSentence.keyPhrases.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[var(--muted-subtle)] uppercase font-mono">
                    Key Vocabulary & Idioms:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeSentence.keyPhrases.map((kp, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] text-xs"
                      >
                        <span className="font-semibold text-[var(--foreground)]">
                          {kp.phrase}
                        </span>
                        <span className="text-[var(--muted)]">→ {kp.meaningVi}</span>
                        <button
                          type="button"
                          onClick={() => handleSavePhrase(kp.phrase, kp.meaningVi)}
                          disabled={savedPhrases[kp.phrase]}
                          className="p-1 rounded text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                          title="Save to Phrase Bank"
                        >
                          {savedPhrases[kp.phrase] ? (
                            <Check size={13} className="text-[var(--status-success-fg)]" />
                          ) : (
                            <BookmarkPlus size={13} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODE 1: VOICE SHADOWING RUNNER */}
              {sentenceMode === "shadowing" && (
                <div className="p-5 rounded-[12px] border border-[var(--border)] bg-[var(--surface-raised)] space-y-4 text-center">
                  <p className="text-xs text-[var(--muted)]">
                    {t("shadowingVideoInstruction")}
                  </p>

                  <div className="flex justify-center gap-3">
                    <MicButton
                      onTranscript={handleShadowingSpeech}
                      label="Bấm Mic để nói nhại lại câu này"
                      className="px-6 py-2.5 text-sm"
                    />
                  </div>

                  {/* Word-by-word Diff & Accuracy Display */}
                  {shadowingTranscript && (
                    <div className="space-y-3 pt-3 text-left border-t border-[var(--border)] animate-in fade-in-50 duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[var(--muted)] uppercase font-semibold">
                          Pronunciation Analysis:
                        </span>
                        <span className="text-sm font-bold font-mono text-[var(--foreground)]">
                          Accuracy: {shadowingScore}%
                        </span>
                      </div>

                      {/* Highlighted Word Diff */}
                      <div className="p-3.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] flex flex-wrap gap-2 text-base font-medium">
                        {wordDiff.map((item, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-[6px] ${
                              item.status === "correct"
                                ? "bg-[var(--status-success-bg)] text-[var(--status-success-fg)] border border-[var(--status-success-border)]"
                                : "bg-[var(--status-error-bg)]/20 text-[var(--status-error-fg)] line-through"
                            }`}
                          >
                            {item.word}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-[var(--muted)] italic">
                        Spoken transcript: "{shadowingTranscript}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: DICTATION RUNNER */}
              {sentenceMode === "dictation" && (
                <form onSubmit={handleCheckDictation} className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                    {t("dictationVideoInstruction")}
                  </label>
                  <textarea
                    value={dictationInput}
                    onChange={(e) => setDictationInput(e.target.value)}
                    placeholder="Type the English sentence you heard..."
                    rows={3}
                    className="w-full p-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-base text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors resize-y"
                  />

                  {dictationResult === "correct" && (
                    <div className="p-3.5 rounded-[10px] bg-[var(--status-success-bg)]/25 border border-[var(--status-success-border)] flex items-center gap-2 text-xs text-[var(--status-success-fg)] font-semibold">
                      <CheckCircle2 size={16} />
                      <span>Chính xác tuyệt đối! Bạn nghe và gõ rất chuẩn.</span>
                    </div>
                  )}

                  {dictationResult === "incorrect" && (
                    <div className="p-3.5 rounded-[10px] bg-[var(--status-error-bg)]/20 border border-[var(--status-error-border)] space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-[var(--status-error-fg)] font-semibold">
                        <XCircle size={15} />
                        <span>Chưa hoàn toàn khớp. Hãy so sánh với câu chuẩn:</span>
                      </div>
                      <p className="font-medium text-[var(--foreground)] pl-5">
                        "{activeSentence.textEn}"
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={!dictationInput.trim()}
                      className="px-6 h-[40px] rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <span>Check Dictation</span>
                      <Sparkles size={14} />
                    </button>
                  </div>
                </form>
              )}

              {/* MODE 3: TRANSLATE & GRAMMAR RUNNER */}
              {sentenceMode === "translate" && (
                <div className="space-y-3">
                  {activeSentence.note && (
                    <div className="p-3.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] space-y-1 text-xs">
                      <span className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                        <HelpCircle size={13} className="text-[var(--muted)]" />
                        <span>Grammar & Usage Note:</span>
                      </span>
                      <p className="text-[var(--muted-subtle)] leading-relaxed">
                        {activeSentence.note}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <AudioButton text={activeSentence.textEn} label="Listen Native Audio (TTS)" size="sm" />
                    <button
                      type="button"
                      onClick={handleNextSentence}
                      disabled={currentIndex + 1 >= video.sentences.length}
                      className="px-4 py-2 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#262626] transition-colors cursor-pointer"
                    >
                      <span>Next Sentence</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Sentence Timeline Sidebar */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-5 space-y-4 shadow-xs sticky top-20 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5">
                <Tv size={14} />
                <span>Transcript Timeline</span>
              </span>
              <span className="text-xs font-mono text-[var(--muted)]">
                {video.sentences.length} {t("sentencesCount")}
              </span>
            </div>

            {/* Scrollable Sentence List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-text">
              {video.sentences.map((sent, idx) => {
                const isActive = idx === currentIndex;

                return (
                  <div
                    key={sent.id}
                    onClick={() => {
                      const sel = window.getSelection()?.toString().trim();
                      if (sel) return;
                      seekToSentence(idx, true);
                    }}
                    className={`w-full text-left p-3 rounded-[10px] border transition-all cursor-pointer flex flex-col gap-1 ${
                      isActive
                        ? "border-[var(--foreground)] bg-[var(--surface-hover)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span
                        className={`font-semibold ${
                          isActive
                            ? "text-[var(--foreground)]"
                            : "text-[var(--muted)]"
                        }`}
                      >
                        #{idx + 1} • {formatTime(sent.start)} - {formatTime(sent.end)}
                      </span>
                      {isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold">
                          NOW PLAYING
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs font-medium line-clamp-2 ${
                        isActive
                          ? "text-[var(--foreground)] font-semibold"
                          : "text-[var(--muted-subtle)]"
                      }`}
                    >
                      {sent.textEn}
                    </p>

                    <p className="text-[11px] text-[var(--muted)] line-clamp-1">
                      {sent.textVi}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
