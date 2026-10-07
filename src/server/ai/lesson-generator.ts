import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { SeedLesson } from "@/server/db/seeds";
import { saveCustomLesson } from "@/server/db/storage";

export const GeneratedLessonSchema = z.object({
  title: z.string(),
  description: z.string(),
  topic: z.string(),
  level: z.enum(["A2", "B1", "B2"]),
  objectives: z.array(z.string()).default([]),
  theory: z.string(),
  examples: z.array(
    z.object({
      vi: z.string(),
      en: z.string(),
      note: z.string().optional(),
    })
  ),
  exercises: z.array(
    z.object({
      id: z.string(),
      promptVi: z.string(),
      referenceAnswers: z.array(z.string()),
      hint: z.string().optional(),
      topic: z.string(),
      grammarCategory: z.string(),
    })
  ),
});

/**
 * Intelligent local fallback when Gemini is offline or rate limited.
 * Provides authentic, high-frequency sentences tailored to keywords.
 */
function createFallbackLesson(
  scenarioPrompt: string,
  level: "A2" | "B1" | "B2" = "B1"
): SeedLesson {
  const lower = scenarioPrompt.toLowerCase();
  const timestamp = Date.now();
  const slug = `custom-${timestamp}`;

  // Tech / Software / Interview
  if (
    lower.includes("phỏng vấn") ||
    lower.includes("interview") ||
    lower.includes("backend") ||
    lower.includes("frontend") ||
    lower.includes("developer") ||
    lower.includes("tech") ||
    lower.includes("kỹ sư")
  ) {
    return {
      id: `lesson-${slug}`,
      slug,
      topic: "Tech & Professional Interview",
      level,
      title: `Interview Scenario: ${scenarioPrompt.slice(0, 45)}...`,
      description: "Essential sentences and polite expressions for software engineering and technical interviews.",
      objectives: [
        "Articulate past engineering experience using Present Perfect and Past Simple",
        "Explain architecture trade-offs, system scalability, and bug troubleshooting clearly",
      ],
      estimatedMinutes: 15,
      theory: `In engineering interviews, use the **STAR method** (Situation, Task, Action, Result) with active verbs:
- Highlight impact: \`I spearheaded the migration to...\` / \`This reduced API response time by 40%.\`
- Describe technical choices: \`We chose Redis over Memcached because...\`
- Handle unknown answers politely: \`While I haven't worked directly with X, I have extensive experience in similar patterns like Y.\``,
      examples: [
        {
          vi: "Tôi có hơn 4 năm kinh nghiệm làm việc với kiến trúc microservices và Node.js.",
          en: "I have over four years of experience working with microservices architecture and Node.js.",
        },
        {
          vi: "Chúng tôi đã tối ưu hóa các câu truy vấn cơ sở dữ liệu để giảm độ trễ cho người dùng.",
          en: "We optimized database queries to significantly reduce latency for end users.",
        },
      ],
      exercises: [
        {
          id: `ex-${slug}-1`,
          promptVi: "Tôi đã lãnh đạo việc di chuyển hệ thống sang điện toán đám mây vào năm ngoái.",
          referenceAnswers: [
            "I led the system migration to the cloud last year.",
            "I spearheaded our cloud migration initiative last year.",
          ],
          hint: "led the migration / spearheaded",
          topic: "Tech & Professional Interview",
          grammarCategory: "Past Simple with Action Verbs",
        },
        {
          id: `ex-${slug}-2`,
          promptVi: "Điểm mạnh nhất của tôi là khả năng phân tích và xử lý các sự cố phức tạp trong production.",
          referenceAnswers: [
            "My greatest strength is troubleshooting complex incidents in production environments.",
            "My key strength is analyzing and resolving complex production issues efficiently.",
          ],
          hint: "troubleshooting complex incidents, production environments",
          topic: "Tech & Professional Interview",
          grammarCategory: "Gerund as Subject Complement",
        },
        {
          id: `ex-${slug}-3`,
          promptVi: "Bạn có thể cho tôi biết thêm về cấu trúc nhóm và quy trình deploy hiện tại không?",
          referenceAnswers: [
            "Could you tell me more about the team structure and current deployment workflow?",
            "Could you share more details about your team structure and deployment pipeline?",
          ],
          hint: "team structure, deployment workflow / pipeline",
          topic: "Tech & Professional Interview",
          grammarCategory: "Polite Inquiry (Could you tell me)",
        },
        {
          id: `ex-${slug}-4`,
          promptVi: "Chúng tôi đã giải quyết tình trạng tắc nghẽn bộ nhớ bằng cách triển khai cơ chế caching.",
          referenceAnswers: [
            "We resolved the memory bottleneck by implementing a caching layer.",
            "We solved the memory leak by introducing Redis caching.",
          ],
          hint: "resolved the memory bottleneck, by implementing",
          topic: "Tech & Professional Interview",
          grammarCategory: "Preposition 'by' + Gerund",
        },
        {
          id: `ex-${slug}-5`,
          promptVi: "Tôi luôn hào hứng học hỏi các công nghệ mới và chia sẻ kiến thức với đồng nghiệp.",
          referenceAnswers: [
            "I am always excited to learn new technologies and share knowledge with my teammates.",
            "I'm eager to adopt new technologies and mentor fellow team members.",
          ],
          hint: "excited to learn, share knowledge with teammates",
          topic: "Tech & Professional Interview",
          grammarCategory: "Adjective + Infinitive",
        },
      ],
    };
  }

  // Work & Deadline / Negotiation
  if (
    lower.includes("deadline") ||
    lower.includes("hạn chót") ||
    lower.includes("lương") ||
    lower.includes("salary") ||
    lower.includes("email") ||
    lower.includes("sếp") ||
    lower.includes("khách hàng")
  ) {
    return {
      id: `lesson-${slug}`,
      slug,
      topic: "Workplace Negotiation & Requests",
      level,
      title: `Workplace Scenario: ${scenarioPrompt.slice(0, 45)}...`,
      description: "Polite workplace formulas for negotiations, deadline extensions, and client communication.",
      objectives: [
        "Master polite modal requests (Would it be possible, Could we...)",
        "Explain business justifications clearly without sounding confrontational",
      ],
      estimatedMinutes: 15,
      theory: `When negotiating or requesting changes at work:
- Soften requests with conditionals: *Would it be feasible to...?* rather than *We want to...*
- Frame delays with solutions: *To maintain deliverable quality, we propose pushing the date to...*
- Acknowledge the other party's constraints first.`,
      examples: [
        {
          vi: "Liệu chúng ta có thể thảo luận lại mốc thời gian bàn giao vào sáng mai không?",
          en: "Would it be possible to revisit the delivery timeline tomorrow morning?",
        },
        {
          vi: "Tôi rất mong muốn nhận được phản hồi của bạn về đề xuất này.",
          en: "I look forward to hearing your thoughts on this proposal.",
        },
      ],
      exercises: [
        {
          id: `ex-${slug}-1`,
          promptVi: "Để đảm bảo chất lượng kiểm thử tốt nhất, chúng tôi đề xuất gia hạn deadline thêm hai ngày.",
          referenceAnswers: [
            "To ensure thorough testing quality, we propose extending the deadline by two days.",
            "In order to guarantee top quality, we would like to extend the deadline by two days.",
          ],
          hint: "To ensure testing quality, extend the deadline by two days",
          topic: "Workplace Negotiation & Requests",
          grammarCategory: "Infinitive of Purpose",
        },
        {
          id: `ex-${slug}-2`,
          promptVi: "Liệu công ty có thể xem xét mức đãi ngộ phản ánh đúng trách nhiệm mở rộng của tôi không?",
          referenceAnswers: [
            "Would the company consider a compensation package that reflects my expanded responsibilities?",
            "Could we discuss adjusting the compensation to reflect my broader role?",
          ],
          hint: "compensation package, reflects expanded responsibilities",
          topic: "Workplace Negotiation & Requests",
          grammarCategory: "Polite Conditional (Would... consider)",
        },
        {
          id: `ex-${slug}-3`,
          promptVi: "Tôi đã gửi bản tóm tắt các điểm thảo luận chính vào email của bạn rồi.",
          referenceAnswers: [
            "I have already sent a summary of the key discussion points to your email.",
            "I've emailed you a summary of the key takeaways.",
          ],
          hint: "have already sent, key discussion points",
          topic: "Workplace Negotiation & Requests",
          grammarCategory: "Present Perfect",
        },
        {
          id: `ex-${slug}-4`,
          promptVi: "Chúng tôi rất trân trọng sự linh hoạt và hỗ trợ liên tục của bạn trong dự án này.",
          referenceAnswers: [
            "We truly appreciate your flexibility and ongoing support on this project.",
            "We are very grateful for your continuous cooperation and support.",
          ],
          hint: "appreciate your flexibility, ongoing support",
          topic: "Workplace Negotiation & Requests",
          grammarCategory: "Collocations with Appreciate",
        },
        {
          id: `ex-${slug}-5`,
          promptVi: "Xin vui lòng cho tôi biết nếu bạn cần thêm bất kỳ tài liệu bổ sung nào.",
          referenceAnswers: [
            "Please let me know if you need any additional documentation.",
            "Feel free to let me know if any further documents are required.",
          ],
          hint: "Please let me know if, additional documentation",
          topic: "Workplace Negotiation & Requests",
          grammarCategory: "Conditional Clause (Type 1)",
        },
      ],
    };
  }

  // General Life / Travel / Social
  return {
    id: `lesson-${slug}`,
    slug,
    topic: "Practical Contextual Communication",
    level,
    title: `Custom Practice: ${scenarioPrompt.slice(0, 45)}...`,
    description: "Tailored real-world sentences to build confidence and natural English reflex.",
    objectives: [
      "Express complete thoughts fluently in everyday English",
      "Connect sentences smoothly with natural linking phrases",
    ],
    estimatedMinutes: 15,
    theory: `For effective communication in this scenario:
- Focus on subject-verb agreement and natural word combinations.
- Use conversational softeners like *Actually*, *By the way*, *Could I ask...* to sound friendly.`,
    examples: [
      {
        vi: "Tôi đang tìm kiếm giải pháp phù hợp nhất cho tình huống này.",
        en: "I am looking for the most suitable solution for this situation.",
      },
      {
        vi: "Cảm ơn bạn đã dành thời gian giải thích chi tiết cho tôi.",
        en: "Thank you for taking the time to explain this in detail.",
      },
    ],
    exercises: [
      {
        id: `ex-${slug}-1`,
        promptVi: `Tôi muốn tìm hiểu thêm thông tin về tình huống này trước khi đưa ra quyết định.`,
        referenceAnswers: [
          "I would like to gather more information about this situation before making a decision.",
          "I'd like to understand the details better before I make my decision.",
        ],
        hint: "would like to gather more information, before making a decision",
        topic: "Practical Contextual Communication",
        grammarCategory: "Gerund after preposition",
      },
      {
        id: `ex-${slug}-2`,
        promptVi: "Bạn có thể hướng dẫn tôi các bước tiếp theo cần phải thực hiện không?",
        referenceAnswers: [
          "Could you guide me through the next steps that need to be taken?",
          "Can you walk me through the next steps we should follow?",
        ],
        hint: "guide me through the next steps",
        topic: "Practical Contextual Communication",
        grammarCategory: "Polite Request",
      },
      {
        id: `ex-${slug}-3`,
        promptVi: "Tôi hoàn toàn đồng ý với đề xuất của bạn và sẵn sàng bắt đầu ngay hôm nay.",
        referenceAnswers: [
          "I completely agree with your proposal and am ready to get started today.",
          "I fully support your suggestion and can start right away.",
        ],
        hint: "completely agree with your proposal, ready to get started",
        topic: "Practical Contextual Communication",
        grammarCategory: "Parallel Structure with 'and'",
      },
      {
        id: `ex-${slug}-4`,
        promptVi: "Nếu có bất kỳ thay đổi nào phát sinh, tôi sẽ thông báo cho bạn ngay lập tức.",
        referenceAnswers: [
          "If any changes arise, I will notify you immediately.",
          "Should any changes occur, I will inform you right away.",
        ],
        hint: "If any changes arise, notify you immediately",
        topic: "Practical Contextual Communication",
        grammarCategory: "First Conditional",
      },
      {
        id: `ex-${slug}-5`,
        promptVi: "Rất vui được trao đổi và hợp tác với bạn trong công việc này.",
        referenceAnswers: [
          "It is a pleasure discussing and collaborating with you on this work.",
          "I'm very glad to cooperate and work together with you.",
        ],
        hint: "pleasure discussing and collaborating with you",
        topic: "Practical Contextual Communication",
        grammarCategory: "Gerund after Preposition",
      },
    ],
  };
}

/**
 * Generate a complete contextual lesson using Gemini AI.
 */
export async function generateCustomLesson(
  scenarioPrompt: string,
  level: "A2" | "B1" | "B2" = "B1"
): Promise<SeedLesson> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const fallback = createFallbackLesson(scenarioPrompt, level);
    return saveCustomLesson(fallback);
  }

  const ai = new GoogleGenAI({ apiKey });
  const timestamp = Date.now();
  const slug = `ai-${timestamp}`;

  const prompt = `You are an expert curriculum designer for an English learning web app focusing on sentence-level translation and context mastery.
The student requests a personalized lesson based on their specific situation:
Scenario: ${JSON.stringify(scenarioPrompt)}
Target CEFR Level: ${level}

Design a complete 5-sentence lesson strictly formatted in JSON.
The lesson must contain:
1. "title": Concise, motivating title (e.g. "Mastering Tech Interview: System Design & Bug Diagnosis").
2. "description": 1-2 sentence overview of why these phrases matter.
3. "topic": 2-4 word topic category.
4. "level": "${level}".
5. "theory": Practical grammar / communication rule breakdown in markdown (explain natural phrasing, tone, and common pitfalls for this scenario).
6. "examples": Exactly 2 bilingual real-world sentence examples { "vi": string, "en": string, "note": string }.
7. "exercises": Exactly 5 practical sentences that a person in this scenario would truly say.
   Each exercise must have:
   - "id": "ex-${slug}-1", "ex-${slug}-2", etc.
   - "promptVi": Natural Vietnamese sentence that an educated native Vietnamese speaker would say in this context.
   - "referenceAnswers": Array of 2 to 3 natural, authentic native English translations.
   - "hint": Useful collocations or key phrases.
   - "topic": Topic string.
   - "grammarCategory": Specific grammatical focus (e.g., "Present Perfect", "Modal Verbs", "Infinitive of Purpose", "Conditional").

Respond ONLY with valid JSON matching this schema:
{
  "title": string,
  "description": string,
  "topic": string,
  "level": "${level}",
  "theory": string,
  "examples": [
    { "vi": string, "en": string, "note": string }
  ],
  "exercises": [
    {
      "id": string,
      "promptVi": string,
      "referenceAnswers": [string, string],
      "hint": string,
      "topic": string,
      "grammarCategory": string
    }
  ]
}`;

  const modelsToTry = [
    process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
  ];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction:
            "You are a master English curriculum designer. Always output strict valid JSON only, without markdown code fences or backticks.",
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        const validated = GeneratedLessonSchema.parse(parsed);

        const customLesson: SeedLesson = {
          id: `lesson-${slug}`,
          slug,
          title: validated.title,
          description: validated.description,
          topic: validated.topic,
          level: validated.level,
          objectives:
            validated.objectives && validated.objectives.length > 0
              ? validated.objectives
              : [
                  "Master natural native expressions in this specific context",
                  "Translate and shadow practical sentences fluently",
                ],
          estimatedMinutes: 15,
          theory: validated.theory,
          examples: validated.examples,
          exercises: validated.exercises.map((ex, i) => ({
            id: `ex-${slug}-${i + 1}`,
            promptVi: ex.promptVi,
            referenceAnswers: ex.referenceAnswers,
            hint: ex.hint,
            topic: validated.topic,
            grammarCategory: ex.grammarCategory,
          })),
        };

        return saveCustomLesson(customLesson);
      }
    } catch (err: any) {
      console.warn(
        `Gemini lesson generation failed with model ${model}:`,
        err?.message || err
      );
    }
  }

  // Graceful fallback to guarantee user gets a working lesson immediately
  const fallback = createFallbackLesson(scenarioPrompt, level);
  return saveCustomLesson(fallback);
}
