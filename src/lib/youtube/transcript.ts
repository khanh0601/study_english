import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenAI } from "@google/genai";
import { VideoLesson, VideoSentence } from "@/server/db/video-seeds";

/**
 * Extracts YouTube Video ID from standard URLs or direct 11-char ID
 */
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== "string") return null;

  const trimmed = urlOrId.trim();

  // Direct 11-character alphanumeric YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    // Check standard URL patterns
    const url = new URL(trimmed);
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/watch")) {
        return url.searchParams.get("v");
      }
      if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/v/")) {
        return url.pathname.split("/")[2] || null;
      }
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2] || null;
      }
    } else if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1).split("?")[0] || null;
    }
  } catch {
    // Regex fallback
    const match = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
    );
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Segments raw YouTube transcript tokens into clean, cohesive sentences
 */
export function segmentRawTranscript(
  rawItems: Array<{ text: string; offset: number; duration: number }>
): Array<{ start: number; end: number; textEn: string }> {
  const result: Array<{ start: number; end: number; textEn: string }> = [];

  let currentText = "";
  let currentStart = 0;
  let currentEnd = 0;

  for (let i = 0; i < rawItems.length; i++) {
    const item = rawItems[i];
    // Clean HTML entities like &#39; &amp; &quot;
    const cleanChunk = item.text
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\n/g, " ")
      .trim();

    if (!cleanChunk) continue;

    const chunkStart = item.offset / 1000;
    const chunkEnd = (item.offset + item.duration) / 1000;

    if (!currentText) {
      currentStart = chunkStart;
      currentText = cleanChunk;
      currentEnd = chunkEnd;
    } else {
      currentText += " " + cleanChunk;
      currentEnd = chunkEnd;
    }

    // Check sentence boundaries: ends with punctuation or pause to next chunk > 1.0s or words > 16
    const endsWithPunctuation = /[.!?]$/.test(cleanChunk);
    const nextItem = rawItems[i + 1];
    const isBigPause = nextItem
      ? nextItem.offset / 1000 - chunkEnd > 0.95
      : true;
    const wordCount = currentText.split(/\s+/).length;

    if (endsWithPunctuation || isBigPause || wordCount >= 16) {
      // Ensure first letter capitalized and trailing punctuation
      let finalized = currentText.trim();
      if (!/[.!?]$/.test(finalized)) {
        finalized += ".";
      }
      finalized = finalized.charAt(0).toUpperCase() + finalized.slice(1);

      result.push({
        start: Math.round(currentStart * 10) / 10,
        end: Math.round(currentEnd * 10) / 10,
        textEn: finalized,
      });

      currentText = "";
    }
  }

  if (currentText.trim()) {
    result.push({
      start: Math.round(currentStart * 10) / 10,
      end: Math.round(currentEnd * 10) / 10,
      textEn: currentText.trim(),
    });
  }

  return result;
}

/**
 * Translates segmented English sentences to natural Vietnamese using Gemini AI
 */
export async function translateSentencesWithGemini(
  sentences: Array<{ start: number; end: number; textEn: string }>
): Promise<VideoSentence[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return sentences.map((s, idx) => ({
      id: `sent-${idx + 1}`,
      start: s.start,
      end: s.end,
      textEn: s.textEn,
      textVi: `(Bản dịch mẫu) ${s.textEn}`,
    }));
  }

  const ai = new GoogleGenAI({ apiKey });
  const translationMap = new Map<string, { textVi: string; note?: string }>();

  // Process in batches of 20 to avoid token or timeout limits
  const BATCH_SIZE = 20;
  for (let i = 0; i < sentences.length; i += BATCH_SIZE) {
    const chunk = sentences.slice(i, i + BATCH_SIZE);
    const chunkPayload = chunk.map((s, idx) => ({
      id: `sent-${i + idx + 1}`,
      textEn: s.textEn,
    }));

    const prompt = `You are a professional subtitle translator for an English learning web app.
Given these English sentences extracted from a YouTube video, translate each into natural, conversational Vietnamese appropriate for context.

Input JSON:
${JSON.stringify(chunkPayload)}

Respond with STRICT JSON format:
[
  {
    "id": "sent-1",
    "textVi": "Bản dịch tiếng Việt tự nhiên",
    "note": "Ghi chú ngắn về cấu trúc hoặc từ vựng nếu có (tùy chọn)"
  }
]`;

    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          systemInstruction: "You are a master bilingual translator. Return valid JSON only.",
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      if (Array.isArray(parsed)) {
        parsed.forEach((item: any) => {
          if (item.id) translationMap.set(item.id, item);
        });
      }
    } catch (err) {
      console.warn("Gemini batch translation error:", err);
    }
  }

  return sentences.map((s, idx) => {
    const id = `sent-${idx + 1}`;
    const trans = translationMap.get(id);
    return {
      id,
      start: s.start,
      end: s.end,
      textEn: s.textEn,
      textVi: trans?.textVi || s.textEn,
      note: trans?.note,
    };
  });
}

/**
 * Fetch and process YouTube video into an interactive VideoLesson
 */
export async function importYouTubeVideo(
  urlOrId: string
): Promise<VideoLesson> {
  const youtubeId = extractYouTubeId(urlOrId);
  if (!youtubeId) {
    throw new Error("Invalid YouTube URL or Video ID.");
  }

  // 1. Fetch transcript from YouTube
  let rawTranscript: Array<{ text: string; offset: number; duration: number }>;
  try {
    rawTranscript = await YoutubeTranscript.fetchTranscript(youtubeId);
  } catch (err: any) {
    console.warn("Could not fetch YouTube transcript automatically:", err?.message || err);
    throw new Error(
      "This video does not have English subtitles/captions enabled on YouTube. Please try another video with subtitles."
    );
  }

  if (!rawTranscript || rawTranscript.length === 0) {
    throw new Error("No subtitles found for this video.");
  }

  // 2. Segment raw tokens into sentences
  const segmented = segmentRawTranscript(rawTranscript);

  // Take up to 80 sentences (covers 100% of typical 3-10 minute videos)
  const fullSentences = segmented.slice(0, 80);

  // 3. Translate to Vietnamese with Gemini
  const sentencesWithVi = await translateSentencesWithGemini(fullSentences);

  const durationSeconds =
    fullSentences.length > 0
      ? Math.ceil(fullSentences[fullSentences.length - 1].end)
      : 60;

  const timestamp = Date.now();
  const slug = `yt-${youtubeId.toLowerCase()}-${timestamp}`;

  const videoLesson: VideoLesson = {
    id: `video-${slug}`,
    slug,
    youtubeId,
    title: `YouTube Lesson: ${youtubeId}`,
    description: `Imported contextual practice from YouTube (${sentencesWithVi.length} sentences).`,
    topic: "Daily Conversations",
    level: "B1",
    durationSeconds,
    channelTitle: "YouTube Creator",
    sentences: sentencesWithVi,
    createdAt: new Date().toISOString(),
    isCustom: true,
  };

  return videoLesson;
}
