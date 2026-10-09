import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// In-memory cache for ultra-fast lookup (0ms for repeat words)
const lookupCache = new Map<string, {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningVi: string;
  explanationEn: string;
  exampleEn: string;
}>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawText = body.text;
    const context = body.context || "";

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json(
        { error: "Text is required for lookup." },
        { status: 400 }
      );
    }

    // Clean up selected text (remove trailing punctuation, normalize spaces)
    const cleaned = rawText
      .replace(/^[“"'`(\[\{]+|[.,!?;:״”"')\]\}]+$/g, "")
      .trim();

    if (!cleaned || cleaned.length < 2 || cleaned.split(/\s+/).length > 8) {
      return NextResponse.json(
        { error: "Please select between 1 and 6 words to look up." },
        { status: 400 }
      );
    }

    const cacheKey = cleaned.toLowerCase();
    if (lookupCache.has(cacheKey)) {
      return NextResponse.json({
        success: true,
        data: lookupCache.get(cacheKey),
        cached: true,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Basic fallback without AI
      const fallbackData = {
        word: cleaned,
        phonetic: "",
        partOfSpeech: "phrase",
        meaningVi: `Nghĩa của: ${cleaned}`,
        explanationEn: `Selected text: ${cleaned}`,
        exampleEn: context || `Let's practice using \"${cleaned}\".`,
      };
      return NextResponse.json({ success: true, data: fallbackData });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a concise, accurate English-Vietnamese dictionary for an English learning app.
Look up this English word or phrase: "${cleaned}"${context ? ` (Context sentence: "${context}")` : ""}.

Return STRICT JSON format:
{
  "word": "${cleaned}",
  "phonetic": "/IPA pronunciation/",
  "partOfSpeech": "noun | verb | adjective | adverb | idiom | phrasal verb",
  "meaningVi": "Short, clear, accurate Vietnamese meaning (under 15 words)",
  "explanationEn": "Brief, simple English definition (under 15 words)",
  "exampleEn": "A short natural example sentence using this word/phrase"
}`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: "You are an English-Vietnamese dictionary. Return only valid JSON.",
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const resultData = {
      word: parsed.word || cleaned,
      phonetic: parsed.phonetic || "",
      partOfSpeech: parsed.partOfSpeech || "word",
      meaningVi: parsed.meaningVi || `Nghĩa của: ${cleaned}`,
      explanationEn: parsed.explanationEn || "",
      exampleEn: parsed.exampleEn || context || `Example with ${cleaned}.`,
    };

    // Store in cache (limit cache size to 1000 items)
    if (lookupCache.size > 1000) {
      const firstKey = lookupCache.keys().next().value;
      if (firstKey) lookupCache.delete(firstKey);
    }
    lookupCache.set(cacheKey, resultData);

    return NextResponse.json({
      success: true,
      data: resultData,
      cached: false,
    });
  } catch (err: any) {
    console.error("Dictionary lookup error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to look up word definition." },
      { status: 500 }
    );
  }
}
