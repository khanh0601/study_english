import { GoogleGenAI } from "@google/genai";

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

const SYSTEM_INSTRUCTION = `You are SentenceLab AI Tutor, an encouraging, practical, and highly knowledgeable English language coach.

Your core behavior:
1. Always address the user's specific prompt or question directly first. Do not reply with generic template advice when a specific question is asked.
2. Language:
   - If the user writes in Vietnamese (e.g. asking for advice, asking "bạn hỗ trợ tiếng anh cho tôi được không", or asking about a grammar point), reply warmly and naturally in Vietnamese, providing clear explanations, English sentence examples, and phonetic/usage tips.
   - If the user writes in English, reply in natural English.
3. For grammar/sentence questions:
   - State the core rule or correction immediately.
   - Provide 2-3 practical, high-frequency example sentences (especially for workplace, daily life, or tech).
   - Point out subtle nuances in tone or formality.
4. Keep answers clean, well-formatted with markdown, and engaging.`;

function getLocalChatFallback(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("hỗ trợ") || lower.includes("học được") || lower.includes("bạn là ai")) {
    return `Chào bạn! **Chắc chắn rồi ạ.** Mình là trợ lý AI chuyên đồng hành hỗ trợ bạn học tiếng Anh qua câu hoàn chỉnh tại SentenceLab.

Mình có thể hỗ trợ bạn:
1. **Giải thích ngữ pháp & sắc thái từ:** Bản chất thì, giới từ, liên từ khi đặt câu.
2. **Sửa câu và gợi ý cách nói tự nhiên:** Gửi cho mình câu bạn tự viết, mình sẽ gợi ý cách viết chuẩn bản xứ (chuẩn giao tiếp hoặc chuẩn email công sở/IT).
3. **Mở rộng vốn từ theo ngữ cảnh:** Đưa ra các cụm từ (collocations) thường dùng trong công việc và cuộc sống.

Bạn có câu hỏi hoặc câu tiếng Anh nào đang muốn kiểm tra hay luyện tập không? Cứ gửi cho mình nhé!`;
  }

  if (lower.includes("present perfect") || lower.includes("past simple")) {
    return `### Present Perfect vs. Past Simple

**1. Điểm khác biệt cốt lõi:**
- **Past Simple (Quá khứ đơn):** Diễn tả hành động đã hoàn tất tại một thời điểm xác định trong quá khứ.
  *Ví dụ:* "I **sent** the email yesterday." (Thời gian đã kết thúc)
- **Present Perfect (Hiện tại hoàn thành):** Kết nối hành động quá khứ với hiện tại, nhấn mạnh kết quả hoặc sự việc còn kéo dài đến nay.
  *Ví dụ:* "I **have already sent** the email." (Kết quả ảnh hưởng ngay lúc này)

**2. Ví dụ thực tế trong công việc:**
- "We **launched** version 2.0 last week." *(Past Simple)*
- "I **have worked** here for 2 years." *(Present Perfect - bắt đầu trong quá khứ, hiện vẫn đang làm)*`;
  }

  return `Chào bạn! Mình đã nhận được tin nhắn của bạn. Bạn có thể gửi bất kỳ câu tiếng Anh nào bạn muốn dịch, kiểm tra ngữ pháp hoặc hỏi cách diễn đạt tự nhiên hơn trong công việc, mình sẽ phân tích và giải thích chi tiết cho bạn ngay!`;
}

export async function askAITutor(
  messages: ChatMessage[],
  currentContext?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    return getLocalChatFallback(lastUserMsg);
  }

  const modelsToTry = [
    process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
  ];

  const ai = new GoogleGenAI({ apiKey });

  const formattedContents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : m.role,
    parts: [{ text: m.content }],
  }));

  if (currentContext && formattedContents.length > 0) {
    const lastPart = formattedContents[formattedContents.length - 1];
    lastPart.parts[0].text = `[Current Context: ${currentContext}]\n\nUser Question: ${lastPart.parts[0].text}`;
  }

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: formattedContents.length > 0 ? (formattedContents as any) : [{ role: "user", parts: [{ text: "Hello" }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const reply = response.text;
      if (reply) {
        return reply;
      }
    } catch (err: any) {
      console.warn(`Gemini Tutor attempt failed with model ${model}:`, err?.message || err);
    }
  }

  const lastUserMsg = messages[messages.length - 1]?.content || "";
  return getLocalChatFallback(lastUserMsg);
}
