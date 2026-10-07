export interface ClozeQuestion {
  sentenceWithBlank: string;
  options: string[];
  correctAnswer: string;
  explanationVi: string;
  explanationEn: string;
}

export interface SentenceBuilderConfig {
  tokens: string[];
  distractors?: string[];
}

export const EXERCISE_CLOZE_MAP: Record<string, ClozeQuestion> = {
  "ex-daily-1": {
    sentenceWithBlank: "I usually wake up at 7 AM and ___ a glass of warm water.",
    options: ["drink", "drinks", "drinking", "drank"],
    correctAnswer: "drink",
    explanationVi: "Sau liên từ 'and', động từ 'drink' giữ nguyên mẫu song hành (parallel structure) với 'wake up' trong thì Hiện tại đơn của chủ ngữ 'I'.",
    explanationEn: "Parallel structure with 'wake up' in Present Simple with subject 'I' requires the base verb 'drink'.",
  },
  "ex-daily-2": {
    sentenceWithBlank: "He never ___ breakfast even when he is very busy.",
    options: ["skips", "skip", "skipping", "skipped"],
    correctAnswer: "skips",
    explanationVi: "Với chủ ngữ số ít ngôi thứ ba 'He' trong thì Hiện tại đơn, động từ thêm -s ('skips'). Trạng từ tần suất 'never' đứng trước động từ thường.",
    explanationEn: "Third-person singular subject 'He' takes -s ('skips') in the Present Simple tense.",
  },
  "ex-daily-3": {
    sentenceWithBlank: "___ you often work out in the evenings?",
    options: ["Do", "Are", "Does", "Have"],
    correctAnswer: "Do",
    explanationVi: "Câu hỏi thì Hiện tại đơn với động từ thường 'work out' và chủ ngữ 'you' sử dụng trợ động từ 'Do'.",
    explanationEn: "Present Simple questions with base action verbs and subject 'you' use auxiliary 'Do'.",
  },
  "ex-daily-4": {
    sentenceWithBlank: "My family usually ___ dinner together at 7:30 PM.",
    options: ["has", "have", "having", "had"],
    correctAnswer: "has",
    explanationVi: "Danh từ tập hợp 'My family' ở đây được coi là một chỉnh thể số ít trong văn cảnh tiêu chuẩn, đi với 'has'.",
    explanationEn: "Collective noun 'My family' acting as a single unit takes the singular verb 'has'.",
  },
  "ex-daily-5": {
    sentenceWithBlank: "I try to read for about 20 minutes before ___ to bed every night.",
    options: ["going", "go", "went", "goes"],
    correctAnswer: "going",
    explanationVi: "Sau giới từ chỉ thời gian 'before', động từ chia ở dạng V-ing (danh động từ - Gerund: 'going').",
    explanationEn: "Prepositions like 'before' must be followed by a gerund (V-ing form 'going').",
  },

  // Work & Professional
  "ex-work-1": {
    sentenceWithBlank: "I have already ___ the updated document to the whole team via email.",
    options: ["sent", "send", "sending", "sends"],
    correctAnswer: "sent",
    explanationVi: "Trong thì Hiện tại hoàn thành (have + V3/ed), dạng quá khứ phân từ của 'send' là 'sent'.",
    explanationEn: "Present Perfect requires the past participle (V3) form 'sent' after 'have already'.",
  },
  "ex-work-2": {
    sentenceWithBlank: "We need to ___ tomorrow's meeting to Thursday afternoon because the director is busy.",
    options: ["reschedule", "rescheduling", "rescheduled", "reschedules"],
    correctAnswer: "reschedule",
    explanationVi: "Cấu trúc 'need to + V-infinitive' yêu cầu động từ nguyên mẫu không 'to' ('reschedule').",
    explanationEn: "The pattern 'need to' requires the base infinitive verb 'reschedule'.",
  },
  "ex-work-3": {
    sentenceWithBlank: "Could you please ___ me the financial report before 5 PM today?",
    options: ["send", "to send", "sent", "sending"],
    correctAnswer: "send",
    explanationVi: "Sau động từ khiếm khuyết lịch sự 'Could you please', động từ giữ nguyên mẫu không 'to' ('send').",
    explanationEn: "Polite modal requests with 'Could you please' take a bare infinitive without 'to'.",
  },
  "ex-work-4": {
    sentenceWithBlank: "Our team is ___ the issue and expects to complete it within the next two hours.",
    options: ["resolving", "resolve", "resolved", "resolves"],
    correctAnswer: "resolving",
    explanationVi: "Thì Hiện tại tiếp diễn mô tả tác vụ đang xử lý trong công việc (is + V-ing: 'is resolving').",
    explanationEn: "Present Continuous tense for ongoing workplace actions uses 'is + V-ing' ('resolving').",
  },
  "ex-work-5": {
    sentenceWithBlank: "I have worked in this role ___ over two years and learned a lot.",
    options: ["for", "since", "during", "at"],
    correctAnswer: "for",
    explanationVi: "Dùng 'for' khi đi kèm khoảng thời gian kéo dài ('over two years'). Dùng 'since' khi đi với mốc thời gian cụ thể.",
    explanationEn: "Use 'for' with a duration of time ('over two years') vs 'since' with a specific starting point.",
  },

  // Developer & Tech
  "ex-dev-1": {
    sentenceWithBlank: "This error occurs when the token ___ and the user tries to refresh the page.",
    options: ["expires", "expire", "expired", "is expiring"],
    correctAnswer: "expires",
    explanationVi: "Mệnh đề trạng ngữ chỉ thời gian 'when...' mô tả quy luật kỹ thuật ở Hiện tại đơn, chủ ngữ số ít 'the token' đi với 'expires'.",
    explanationEn: "Time clauses stating technical logic use Present Simple with singular verb 'expires'.",
  },
  "ex-dev-2": {
    sentenceWithBlank: "We should ___ error handling for the case where the API returns a 500 status code.",
    options: ["add", "adding", "added", "adds"],
    correctAnswer: "add",
    explanationVi: "Sau động từ khuyết thiếu 'should' dùng để đề xuất phương án kỹ thuật, động từ giữ nguyên mẫu ('add').",
    explanationEn: "Modal verb 'should' requires the bare infinitive 'add'.",
  },
  "ex-dev-3": {
    sentenceWithBlank: "This function runs asynchronously, ___ we need to add the await keyword here.",
    options: ["so", "because", "although", "unless"],
    correctAnswer: "so",
    explanationVi: "Liên từ 'so' biểu thị hệ quả: 'Hàm này chạy bất đồng bộ, vì vậy (so) chúng ta cần thêm await'.",
    explanationEn: "Conjunction 'so' expresses consequence: 'It runs asynchronously, so we must add await'.",
  },
  "ex-dev-4": {
    sentenceWithBlank: "I have refactored the authentication module ___ improve performance and security.",
    options: ["to", "for", "so that", "in order"],
    correctAnswer: "to",
    explanationVi: "Cụm chỉ mục đích dùng 'to + V-infinitive' ('to improve'). Trong tiếng Anh không dùng 'for improve'.",
    explanationEn: "Infinitive of purpose uses 'to + base verb' ('to improve').",
  },
  "ex-dev-5": {
    sentenceWithBlank: "Could you check ___ the database is currently locked?",
    options: ["whether", "that", "weather", "where"],
    correctAnswer: "whether",
    explanationVi: "Trong câu hỏi gián tiếp Yes/No, dùng liên từ 'whether' (hoặc 'if') mang nghĩa 'liệu rằng ... có hay không'.",
    explanationEn: "Indirect yes/no questions use 'whether' or 'if' ('check whether the database is locked').",
  },

  // Travel & Social
  "ex-travel-1": {
    sentenceWithBlank: "Could you please tell me where the boarding gate for this flight ___?",
    options: ["is", "are", "does", "was"],
    correctAnswer: "is",
    explanationVi: "Trong câu hỏi gián tiếp ('Could you please tell me where...'), trật tự từ giữ nguyên dạng trần thuật: Chủ ngữ + Động từ ('the boarding gate... is').",
    explanationEn: "Indirect questions preserve standard statement word order: 'where [subject] is', not 'where is [subject]'.",
  },
  "ex-travel-2": {
    sentenceWithBlank: "I would like to ___, I made a reservation online.",
    options: ["check in", "check out", "checking in", "checked in"],
    correctAnswer: "check in",
    explanationVi: "Cụm động từ làm thủ tục nhận phòng là 'check in', đi sau cấu trúc lịch sự 'would like to + V'.",
    explanationEn: "Hotel check-in idiom is 'check in', following polite formula 'would like to + base verb'.",
  },
  "ex-travel-3": {
    sentenceWithBlank: "Is breakfast ___ in the room rate?",
    options: ["included", "including", "include", "includes"],
    correctAnswer: "included",
    explanationVi: "Thể bị động (Passive voice) thì Hiện tại đơn: 'Is + Subject + V3/ed' ('Is breakfast included in...?').",
    explanationEn: "Passive voice question structure: 'Is [subject] + V3/ed' ('included').",
  },
  "ex-travel-4": {
    sentenceWithBlank: "Could I leave my luggage here ___ this afternoon?",
    options: ["until", "by", "at", "during"],
    correctAnswer: "until",
    explanationVi: "Dùng 'until' để chỉ hành động gửi đồ duy trì liên tục cho đến một mốc thời gian ('until this afternoon').",
    explanationEn: "Use 'until' for continuous duration up to a future point ('leave luggage until afternoon').",
  },
  "ex-travel-5": {
    sentenceWithBlank: "Could you ___ a good local restaurant nearby?",
    options: ["recommend", "recommending", "recommended", "recommends"],
    correctAnswer: "recommend",
    explanationVi: "Sau cấu trúc thỉnh cầu lịch sự 'Could you', động từ luôn ở dạng nguyên mẫu không 'to' ('recommend').",
    explanationEn: "Modal request 'Could you' requires bare infinitive verb 'recommend'.",
  },
};

export const EXERCISE_BUILDER_MAP: Record<string, SentenceBuilderConfig> = {
  "ex-daily-1": {
    tokens: ["I", "usually", "wake up", "at 7 AM", "and", "drink", "a glass of", "warm water."],
    distractors: ["drinks", "drinking"],
  },
  "ex-daily-2": {
    tokens: ["He", "never", "skips", "breakfast", "even when", "he is", "very busy."],
    distractors: ["skip", "does"],
  },
  "ex-daily-3": {
    tokens: ["Do", "you", "often", "work out", "in the", "evenings?"],
    distractors: ["Are", "Does"],
  },
  "ex-daily-4": {
    tokens: ["My family", "usually", "has", "dinner", "together", "at 7:30 PM."],
    distractors: ["have", "is having"],
  },
  "ex-daily-5": {
    tokens: ["I try to", "read for", "about 20 minutes", "before", "going to bed", "every night."],
    distractors: ["go", "went"],
  },

  "ex-work-1": {
    tokens: ["I have", "already", "sent", "the updated document", "to the whole team", "via email."],
    distractors: ["send", "was sending"],
  },
  "ex-work-2": {
    tokens: ["We need to", "reschedule", "tomorrow's meeting", "to Thursday afternoon", "because", "the director is busy."],
    distractors: ["postponing", "delayed"],
  },
  "ex-work-3": {
    tokens: ["Could you please", "send me", "the financial report", "before 5 PM", "today?"],
    distractors: ["to send", "sending"],
  },
  "ex-work-4": {
    tokens: ["Our team", "is resolving", "the issue", "and expects to", "complete it", "within the next", "two hours."],
    distractors: ["resolved", "resolve"],
  },
  "ex-work-5": {
    tokens: ["I have worked", "in this role", "for over", "two years", "and learned", "a lot."],
    distractors: ["since", "during"],
  },

  "ex-dev-1": {
    tokens: ["This error", "occurs when", "the token", "expires", "and the user", "tries to refresh", "the page."],
    distractors: ["expire", "expired"],
  },
  "ex-dev-2": {
    tokens: ["We should", "add error handling", "for the case", "where the API", "returns a 500", "status code."],
    distractors: ["adding", "to add"],
  },
  "ex-dev-3": {
    tokens: ["This function", "runs asynchronously,", "so we need to", "add the await", "keyword here."],
    distractors: ["because", "although"],
  },
  "ex-dev-4": {
    tokens: ["I have refactored", "the authentication module", "to improve", "performance", "and security."],
    distractors: ["for", "with"],
  },
  "ex-dev-5": {
    tokens: ["Could you check", "whether the database", "is currently", "locked?"],
    distractors: ["weather", "that"],
  },

  "ex-travel-1": {
    tokens: ["Could you please", "tell me", "where the boarding gate", "for this flight", "is?"],
    distractors: ["is it", "does"],
  },
  "ex-travel-2": {
    tokens: ["I would like to", "check in,", "I made a reservation", "online."],
    distractors: ["check out", "checking in"],
  },
  "ex-travel-3": {
    tokens: ["Is breakfast", "included", "in the", "room rate?"],
    distractors: ["including", "include"],
  },
  "ex-travel-4": {
    tokens: ["Could I leave", "my luggage here", "until", "this afternoon?"],
    distractors: ["by", "since"],
  },
  "ex-travel-5": {
    tokens: ["Could you", "recommend", "a good local", "restaurant", "nearby?"],
    distractors: ["recommending", "suggested"],
  },
};

/**
 * Fisher-Yates shuffle array helper
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get Sentence Builder pool tokens for any exercise.
 * If not explicitly mapped, tokenizes reference answer into words.
 */
export function getExerciseBuilderPool(
  exerciseId: string,
  referenceSentence: string
): { initialPool: string[]; targetSentence: string } {
  const config = EXERCISE_BUILDER_MAP[exerciseId];
  if (config) {
    const all = [...config.tokens, ...(config.distractors || [])];
    return {
      initialPool: shuffleArray(all),
      targetSentence: referenceSentence,
    };
  }

  // Fallback: tokenize words
  const cleanTokens = referenceSentence.trim().split(/\s+/).filter(Boolean);
  return {
    initialPool: shuffleArray(cleanTokens),
    targetSentence: referenceSentence,
  };
}

/**
 * Normalizes punctuation and casing for sentence builder comparison.
 */
export function normalizeSentence(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,!?;:'"״“”—\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validates assembled builder sentence against accepted references.
 */
export function validateBuilderSentence(
  assembled: string,
  referenceAnswers: string[]
): boolean {
  const normAssembled = normalizeSentence(assembled);
  return referenceAnswers.some(
    (ref) => normalizeSentence(ref) === normAssembled
  );
}

/**
 * Get Cloze question for any exercise.
 * Fallback to a placeholder if not found.
 */
export function getExerciseClozeQuestion(
  exerciseId: string,
  referenceSentence: string
): ClozeQuestion {
  const item = EXERCISE_CLOZE_MAP[exerciseId];
  if (item) return item;

  // Fallback: blank out first substantive word
  const words = referenceSentence.split(" ");
  const targetIndex = Math.min(2, Math.max(0, words.length - 2));
  const targetWord = words[targetIndex].replace(/[.,!?]/g, "");
  const sentenceWithBlank = words
    .map((w, i) => (i === targetIndex ? "___" : w))
    .join(" ");

  return {
    sentenceWithBlank,
    options: [targetWord, "is", "for", "with"],
    correctAnswer: targetWord,
    explanationVi: `Từ chính xác để hoàn thiện câu là "${targetWord}".`,
    explanationEn: `The appropriate word to complete this sentence is "${targetWord}".`,
  };
}
