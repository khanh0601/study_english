/**
 * High-quality client-side Text-to-Speech (TTS) using Web Speech Synthesis API.
 * 100% Free, zero latency, runs offline, native US/UK English pronunciation.
 */

export interface TTSOptions {
  rate?: number; // 1.0 (normal) or 0.8 (slow)
  pitch?: number;
  lang?: string;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }

  if (cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    };

    // Fallback if event doesn't fire immediately
    setTimeout(() => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    }, 200);
  });
}

function selectBestEnglishVoice(voices: SpeechSynthesisVoice[], preferredLang: string = "en-US"): SpeechSynthesisVoice | null {
  // 1. Try Google US / UK English or Natural voices
  const googleVoice = voices.find(
    (v) => (v.name.includes("Google") || v.name.includes("Natural")) && v.lang.startsWith("en")
  );
  if (googleVoice) return googleVoice;

  // 2. Try Samantha / Alex (macOS / iOS native premium)
  const appleVoice = voices.find(
    (v) => (v.name.includes("Samantha") || v.name.includes("Alex") || v.name.includes("Daniel")) && v.lang.startsWith("en")
  );
  if (appleVoice) return appleVoice;

  // 3. Fallback to any en-US or en-GB
  const exactLang = voices.find((v) => v.lang === preferredLang);
  if (exactLang) return exactLang;

  const anyEnglish = voices.find((v) => v.lang.startsWith("en"));
  return anyEnglish || voices[0] || null;
}

export async function speakEnglishSentence(
  text: string,
  options: TTSOptions = {},
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech Synthesis API not supported in this browser.");
    onError?.(new Error("Speech Synthesis not supported"));
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const voices = await getVoices();
  const utterance = new SpeechSynthesisUtterance(text);

  const voice = selectBestEnglishVoice(voices, options.lang || "en-US");
  if (voice) {
    utterance.voice = voice;
  }

  utterance.rate = options.rate ?? 1.0;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.lang = options.lang || "en-US";

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = (e) => {
    // If interrupted/cancelled by another utterance, don't trigger error
    if (e.error !== "interrupted" && e.error !== "canceled") {
      onError?.(e);
    }
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
