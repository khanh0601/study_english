import { GoogleGenAI } from "@google/genai";

export interface RoleplayScenario {
  id: string;
  title: string;
  titleVi: string;
  category: "Engineering" | "Workplace" | "Career" | "Daily Life";
  difficulty: "A2-B1" | "B1-B2" | "B2+";
  partnerName: string;
  partnerRole: string;
  contextVi: string;
  contextEn: string;
  targetTurns: number;
  firstMessageEn: string;
  firstMessageVi: string;
  turnHints: string[];
}

export interface RoleplayTurnFeedback {
  score: number;
  naturalAlternative: string;
  feedbackVi: string;
  politeness: "Casual" | "Professional" | "Formal";
}

export interface RoleplayDebrief {
  overallScore: number;
  fluencyScore: number;
  vocabularyScore: number;
  toneScore: number;
  summaryVi: string;
  strongPoints: string[];
  improvementSuggestions: string[];
  keyCollocations: Array<{
    phrase: string;
    meaningVi: string;
    exampleEn: string;
  }>;
}

export interface RoleplayTurnResponse {
  reply: string;
  replyVi?: string;
  feedback: RoleplayTurnFeedback;
  isFinished: boolean;
  debrief?: RoleplayDebrief;
}

export const PRESET_SCENARIOS: RoleplayScenario[] = [
  {
    id: "daily_standup",
    title: "Daily Standup & Blocker Discussion",
    titleVi: "Họp Daily Standup & Báo cáo Blocker",
    category: "Engineering",
    difficulty: "B1-B2",
    partnerName: "Alex",
    partnerRole: "Scrum Master / Tech Lead (US)",
    contextVi:
      "Bạn là lập trình viên tham gia cuộc họp Standup 15 phút với Tech Lead người Mỹ. Hãy báo cáo công việc đã làm hôm qua, kế hoạch hôm nay và một blocker về lỗi timeout kết nối Database.",
    contextEn:
      "You are a developer in a 15-minute daily standup with your US Tech Lead. Report yesterday's accomplishments, today's goals, and a blocking issue with database connection timeouts.",
    targetTurns: 4,
    firstMessageEn:
      "Good morning team! Let's do a quick round for today's standup. What did you finish yesterday, and what are you planning to tackle today?",
    firstMessageVi:
      "Chào cả nhóm! Chúng ta bắt đầu buổi standup nhanh hôm nay nhé. Hôm qua bạn đã làm xong việc gì, và hôm nay dự định làm gì?",
    turnHints: [
      "Báo cáo: Hôm qua bạn đã hoàn thành việc review PR và tối ưu câu truy vấn, hôm nay bạn tiếp tục làm tính năng thanh toán.",
      "Nêu blocker: Bạn đang gặp lỗi database connection timeout khi test trên môi trường staging.",
      "Đề xuất hướng xử lý: Bạn cần nhờ DevOps kiểm tra lại connection pool và xin thêm 2 tiếng để debug.",
      "Tổng kết: Cảm ơn và hứa sẽ cập nhật lại kết quả trên kênh Slack sau buổi trưa.",
    ],
  },
  {
    id: "deadline_extension",
    title: "Requesting a Project Deadline Extension",
    titleVi: "Xin gia hạn Deadline với Product Manager",
    category: "Workplace",
    difficulty: "B1-B2",
    partnerName: "Sarah",
    partnerRole: "Product Manager (US)",
    contextVi:
      "Dự án của bạn gặp một số ca kiểm thử bảo mật phát sinh ngoài dự kiến. Bạn cần trao đổi lịch sự với PM để xin dời ngày bàn giao thêm 2 ngày mà không làm ảnh hưởng đến cả đội.",
    contextEn:
      "Your project hit unexpected third-party security testing delays. You need to politely negotiate a 2-day deadline extension with your PM while maintaining high trust and offering mitigation.",
    targetTurns: 4,
    firstMessageEn:
      "Hi there! Just checking in on the release milestone scheduled for this Friday. Is everything still on track to ship on time?",
    firstMessageVi:
      "Chào bạn! Tôi muốn kiểm tra lại mốc bàn giao dự kiến vào thứ Sáu tuần này. Mọi thứ vẫn đúng tiến độ để kịp release chứ?",
    turnHints: [
      "Báo cáo tình hình thực tế: Tính năng chính đã xong, nhưng khâu security audit phát sinh một số cảnh báo cần vá khẩn cấp.",
      "Đưa ra đề xuất cụ thể: Xin phép dời ngày release sang thứ Ba tuần sau thay vì thứ Sáu này.",
      "Đưa ra cam kết: Cam kết đội ngũ sẽ hoàn tất fix vào thứ Hai và chạy smoke test kỹ lưỡng.",
      "Chốt phương án: Cảm ơn sự thông cảm của Sarah và gửi lịch trình cập nhật chi tiết qua email.",
    ],
  },
  {
    id: "bug_incident",
    title: "Critical Bug Incident Post-Mortem",
    titleVi: "Giải thích sự cố Bug nghiêm trọng cho Lead",
    category: "Engineering",
    difficulty: "B1-B2",
    partnerName: "David",
    partnerRole: "Principal Systems Engineer",
    contextVi:
      "Hệ thống thanh toán vừa phát sinh lỗi 500 lúc 9 giờ sáng. Bạn là người phụ trách trực hệ thống, cần giải thích nguyên nhân gốc rễ (root cause) và thời gian hoàn tất bản vá (hotfix).",
    contextEn:
      "The payment gateway threw 500 errors at 9 AM. As on-call engineer, explain the root cause and hotfix rollout timeline to your Principal Engineer.",
    targetTurns: 4,
    firstMessageEn:
      "Hey! I'm seeing multiple alert notifications for 500 Internal Server Errors on the checkout endpoint. Do you know what triggered this, and are user payments currently blocked?",
    firstMessageVi:
      "Này bạn! Tôi đang nhận được hàng loạt cảnh báo lỗi 500 trên endpoint thanh toán. Bạn đã xác định được nguyên nhân chưa và giao dịch của người dùng hiện có bị nghẽn không?",
    turnHints: [
      "Trấn an và nêu tình trạng: Chúng ta đã rollback bản deploy lúc 9h15 nên hệ thống đã tạm thời ổn định.",
      "Giải thích nguyên nhân: Do bên thứ ba (payment provider) thay đổi định dạng webhook mà không báo trước.",
      "Biện pháp khắc phục: Bạn đang chuẩn bị hotfix với logic validate mềm dẻo hơn và viết thêm unit test.",
      "Kế hoạch dài hạn: Hứa sẽ viết tài liệu post-mortem và bổ sung alert giám sát vào chiều nay.",
    ],
  },
  {
    id: "salary_review",
    title: "Annual Compensation & Performance Review",
    titleVi: "Thảo luận Đánh giá Lương & Đóng góp 1 năm",
    category: "Career",
    difficulty: "B2+",
    partnerName: "Marcus",
    partnerRole: "Engineering Director",
    contextVi:
      "Buổi 1-on-1 tổng kết 1 năm cống hiến tại công ty. Bạn muốn trình bày các thành tích nổi bật (tối ưu tốc độ tải trang 40%, hướng dẫn 2 junior) và đề xuất mức tăng lương 15%.",
    contextEn:
      "Annual 1-on-1 review with your Engineering Director. Present your key impacts (40% load time optimization, mentoring juniors) and propose a 15% compensation adjustment.",
    targetTurns: 4,
    firstMessageEn:
      "Good to see you! We've reached your one-year milestone with the team. Looking back at this past year, how do you feel about your overall impact and growth?",
    firstMessageVi:
      "Rất vui được gặp bạn! Đã tròn một năm bạn đồng hành cùng đội ngũ. Nhìn lại năm vừa qua, bạn cảm nhận thế nào về những đóng góp và sự phát triển của bản thân?",
    turnHints: [
      "Điểm lại thành tựu: Nhắc đến việc bạn đã tối ưu core latency giảm 40% và dẫn dắt thành công 2 thành viên mới.",
      "Bày tỏ sự gắn bó: Bạn rất yêu thích văn hóa công ty và mong muốn tiếp tục gánh vác các dự án kiến trúc lớn hơn.",
      "Đề xuất con số: Dựa trên thị trường và đóng góp, bạn đề xuất mức điều chỉnh lương 15%.",
      "Thái độ cởi mở: Lắng nghe phản hồi từ Marcus và sẵn sàng tiếp nhận thêm thử thách mới.",
    ],
  },
  {
    id: "tech_disagreement",
    title: "Constructive Disagreement on Architecture",
    titleVi: "Phản biện Kiến trúc Hệ thống một cách lịch sự",
    category: "Engineering",
    difficulty: "B2+",
    partnerName: "Elena",
    partnerRole: "Lead Architect",
    contextVi:
      "Lead Architect đề xuất tách module đơn giản hiện tại thành Microservices riêng biệt. Bạn thấy dự án hiện tại chưa đủ quy mô và việc tách sẽ gây tốn kém chi phí bảo trì. Hãy phản biện mang tính xây dựng.",
    contextEn:
      "The Lead Architect suggests decoupling a simple monolith module into a separate microservice. You believe it introduces unnecessary overhead. Formulate a polite, data-driven counter-argument.",
    targetTurns: 4,
    firstMessageEn:
      "I was reviewing our roadmap and I think we should break down this user notification module into a dedicated microservice right now. Don't you think it's time to decouple it?",
    firstMessageVi:
      "Tôi vừa xem lại roadmap và tôi nghĩ chúng ta nên tách module thông báo này thành một microservice độc lập ngay bây giờ. Bạn có nghĩ đã đến lúc phân tách nó chưa?",
    turnHints: [
      "Đồng tình trước: Công nhận tầm nhìn về khả năng mở rộng trong tương lai.",
      "Nêu lo ngại thực tế: Hiện tại lượng truy cập còn thấp, tách sớm sẽ tăng độ phức tạp về network latency và CI/CD.",
      "Đề xuất giải pháp dung hòa: Giữ nguyên module dạng modular monolith trước, viết abstraction sạch và xem xét lại sau 6 tháng.",
      "Chốt vấn đề: Đề xuất làm một bảng so sánh nhanh ưu/nhược điểm để cả nhóm cùng biểu quyết.",
    ],
  },
];

function getLocalRoleplayFallback(
  scenario: RoleplayScenario,
  userReply: string,
  turnIndex: number
): RoleplayTurnResponse {
  const isFinished = turnIndex >= scenario.targetTurns;

  const fallbackReplies = [
    `Thanks for the clear update. I really appreciate your proactive communication on this. What specific next step will you take before the end of the day?`,
    `That makes a lot of sense. Let's make sure we document this clearly so the rest of the team stays in the loop. How can I best support you with this right now?`,
    `Sounds like a solid plan. Keep me posted if any new roadblocks come up. Great job handling this calmly and professionally!`,
  ];

  const reply =
    fallbackReplies[(turnIndex - 1) % fallbackReplies.length] ||
    `Understood! Thank you for the update. Let's keep moving forward.`;

  return {
    reply,
    feedback: {
      score: 88,
      naturalAlternative: `I'd like to share that ${userReply.trim()}`,
      feedbackVi:
        "Câu trả lời của bạn truyền tải đúng ý và dễ hiểu. Bạn có thể sử dụng các từ nối chuyên nghiệp như 'Currently', 'In addition' để câu mạch lạc hơn.",
      politeness: "Professional",
    },
    isFinished,
    debrief: isFinished
      ? {
          overallScore: 89,
          fluencyScore: 90,
          vocabularyScore: 86,
          toneScore: 92,
          summaryVi: `Bạn đã hoàn thành xuất sắc tình huống "${scenario.titleVi}". Bạn phản xạ tự tin, ngữ điệu lịch sự và đúng trọng tâm công việc.`,
          strongPoints: [
            "Cách dùng từ văn minh, đúng chuẩn giao tiếp công sở quốc tế.",
            "Trình bày mạch lạc, giải quyết đúng mục tiêu của tình huống.",
          ],
          improvementSuggestions: [
            "Có thể mở rộng thêm một số từ vựng chuyên ngành để tạo ấn tượng mạnh mẽ hơn.",
          ],
          keyCollocations: [
            {
              phrase: "keep someone in the loop",
              meaningVi: "thường xuyên cập nhật tình hình cho ai đó",
              exampleEn: "Please keep me in the loop regarding the deployment status.",
            },
            {
              phrase: "tackle the issue",
              meaningVi: "giải quyết vấn đề / sự cố",
              exampleEn: "Our team will tackle the database timeout first thing tomorrow.",
            },
            {
              phrase: "meet halfway",
              meaningVi: "nhượng bộ một phần, tìm giải pháp dung hòa",
              exampleEn: "We can meet halfway by extending the deadline by just two days.",
            },
          ],
        }
      : undefined,
  };
}

export async function processRoleplayTurn(
  scenario: RoleplayScenario,
  history: Array<{ role: "ai" | "user"; content: string }>,
  userReply: string,
  turnIndex: number
): Promise<RoleplayTurnResponse> {
  const isFinished = turnIndex >= scenario.targetTurns;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return getLocalRoleplayFallback(scenario, userReply, turnIndex);
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a real-time conversational AI roleplay coach for Vietnamese English learners.
Your goal is to simulate an authentic, professional English workplace conversation.

CURRENT SCENARIO:
- Title: ${scenario.title}
- Context: ${scenario.contextEn}
- Partner Persona: You are "${scenario.partnerName}", a ${scenario.partnerRole}.
- Turn: ${turnIndex} of ${scenario.targetTurns}.
- Is Final Turn: ${isFinished ? "YES, this is the final exchange." : "NO, continue the conversation."}

BEHAVIOR RULES:
1. "reply": Your in-character conversational response in natural English (1-3 sentences). Speak naturally like a native colleague/manager. If isFinished is true, give a pleasant concluding remark.
2. "feedback":
   - "score": integer 0-100 evaluating the user's latest message based on clarity, naturalness, and tone.
   - "naturalAlternative": Rewrite the user's sentence into natural, native-sounding professional English.
   - "feedbackVi": Concise Vietnamese explanation (2-3 sentences) pointing out what they did well, nuance adjustments, or prepositions/grammar fixes.
   - "politeness": "Casual" | "Professional" | "Formal"
3. "debrief" (MANDATORY IF isFinished === true, otherwise null):
   - "overallScore": 0-100
   - "fluencyScore": 0-100
   - "vocabularyScore": 0-100
   - "toneScore": 0-100
   - "summaryVi": 2-3 sentences evaluating the whole conversation in Vietnamese.
   - "strongPoints": Array of 2-3 specific things the learner did well.
   - "improvementSuggestions": Array of 1-2 actionable tips.
   - "keyCollocations": 3 high-value workplace idioms/phrases with { phrase, meaningVi, exampleEn }.

STRICT OUTPUT FORMAT: Return ONLY valid JSON adhering to the specified schema without Markdown fences.`;

  const conversationTranscript = history
    .map((m) => `${m.role === "ai" ? scenario.partnerName : "Learner"}: "${m.content}"`)
    .join("\n");

  const prompt = `CONVERSATION SO FAR:
${conversationTranscript}
Learner (Turn ${turnIndex}): "${userReply}"

Respond with the JSON object containing { reply, feedback, isFinished: ${isFinished}, debrief: ${isFinished ? "{ ... }" : "null"} }`;

  const modelsToTry = [
    process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
  ];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const parsedText = response.text || "{}";
      const parsed = JSON.parse(parsedText);

      return {
        reply: parsed.reply || "Thank you for the update!",
        feedback: {
          score: parsed.feedback?.score || 85,
          naturalAlternative: parsed.feedback?.naturalAlternative || userReply,
          feedbackVi:
            parsed.feedback?.feedbackVi ||
            "Câu trả lời rõ ràng và truyền tải đúng thông điệp.",
          politeness: parsed.feedback?.politeness || "Professional",
        },
        isFinished,
        debrief: isFinished ? parsed.debrief : undefined,
      };
    } catch (err: any) {
      console.warn(`Roleplay Gemini model ${model} failed:`, err?.message || err);
    }
  }

  return getLocalRoleplayFallback(scenario, userReply, turnIndex);
}
