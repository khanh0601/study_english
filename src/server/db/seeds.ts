export interface SeedLesson {
  id: string;
  slug: string;
  topic: string;
  level: "A2" | "B1" | "B2";
  title: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;
  theory: string;
  examples: { vi: string; en: string; note?: string }[];
  exercises: {
    id: string;
    promptVi: string;
    referenceAnswers: string[];
    hint?: string;
    topic: string;
    grammarCategory: string;
  }[];
}

export const SEED_LESSONS: SeedLesson[] = [
  // 1. Topic: Daily Conversations (A2 - B1)
  {
    id: "lesson-daily-1",
    slug: "daily-routine-habits",
    topic: "Daily Conversations",
    level: "A2",
    title: "Expressing Daily Habits & Routines (Present Simple)",
    description: "Naturally describe routines, schedules, and frequency of everyday activities.",
    objectives: [
      "Use Present Simple accurately with frequency adverbs (usually, always, rarely)",
      "Form natural sentences describing daily schedules without basic tense errors"
    ],
    estimatedMinutes: 15,
    theory: `**Present Simple** is used to describe habits, repeated schedules, and factual statements.
Sentence structure:
- Affirmative: \`Subject + Verb(s/es) + Object\`
- Negative: \`Subject + do/does not + Verb(base)\`
- Adverbs of frequency: place BEFORE ordinary verbs, and AFTER the auxiliary verb "to be".
Example: *I usually wake up at 7 AM.*`,
    examples: [
      { vi: "Tôi thường thức dậy lúc 6 giờ 30 sáng mỗi ngày.", en: "I usually wake up at 6:30 AM every day." },
      { vi: "Cô ấy hiếm khi uống cà phê sau buổi trưa.", en: "She rarely drinks coffee after noon." },
      { vi: "Chúng tôi thường xuyên đi dạo quanh công viên vào cuối tuần.", en: "We regularly take a walk around the park on weekends." },
      { vi: "Xe buýt khởi hành lúc 8 giờ sáng mỗi ngày làm việc.", en: "The bus departs at 8:00 AM every weekday." }
    ],
    exercises: [
      {
        id: "ex-daily-1",
        promptVi: "Tôi thường thức dậy lúc 7 giờ sáng và uống một cốc nước ấm.",
        referenceAnswers: [
          "I usually wake up at 7 AM and drink a glass of warm water.",
          "I usually get up at 7:00 AM and have a glass of warm water."
        ],
        hint: "wake up / get up, glass of warm water",
        topic: "Daily Conversations",
        grammarCategory: "Tense"
      },
      {
        id: "ex-daily-2",
        promptVi: "Anh ấy không bao giờ bỏ bữa sáng ngay cả khi rất bận rộn.",
        referenceAnswers: [
          "He never skips breakfast even when he is very busy.",
          "He never skips breakfast even if he's extremely busy."
        ],
        hint: "skip breakfast, even when",
        topic: "Daily Conversations",
        grammarCategory: "Adverb of frequency"
      },
      {
        id: "ex-daily-3",
        promptVi: "Bạn có thường xuyên đi tập thể dục vào các buổi tối không?",
        referenceAnswers: [
          "Do you often work out in the evenings?",
          "Do you regularly go to the gym in the evening?"
        ],
        hint: "work out / go to the gym, in the evening",
        topic: "Daily Conversations",
        grammarCategory: "Question form"
      },
      {
        id: "ex-daily-4",
        promptVi: "Gia đình tôi thường ăn tối cùng nhau vào lúc 7 giờ 30 tối.",
        referenceAnswers: [
          "My family usually has dinner together at 7:30 PM.",
          "My family usually eats dinner together at 7:30 in the evening."
        ],
        hint: "have dinner together",
        topic: "Daily Conversations",
        grammarCategory: "Subject-verb agreement"
      },
      {
        id: "ex-daily-5",
        promptVi: "Tôi cố gắng đọc sách khoảng 20 phút trước khi đi ngủ mỗi tối.",
        referenceAnswers: [
          "I try to read for about 20 minutes before going to bed every night.",
          "I try to read books for about 20 minutes before I sleep each night."
        ],
        hint: "try to read, before going to bed",
        topic: "Daily Conversations",
        grammarCategory: "Gerund after preposition"
      }
    ]
  },

  // 2. Topic: Work & Professional English (B1)
  {
    id: "lesson-work-1",
    slug: "work-status-updates",
    topic: "Work & Professional",
    level: "B1",
    title: "Project Progress Updates & Status Reports (Present Perfect)",
    description: "Communicate completed deliverables, ongoing initiatives, and milestones in professional environments.",
    objectives: [
      "Distinguish Present Perfect and Past Simple when reporting workplace status",
      "Confidently use business phrases: update progress, meet deadline, on schedule"
    ],
    estimatedMinutes: 20,
    theory: `**Present Perfect** is used to announce completed work whose outcome directly impacts the present moment.
Structure: \`Subject + have/has + V3/ed\`
- Use *already* for completed actions: *I have already sent the report.*
- Use *yet* in questions and negatives: *I haven't received the feedback yet.*
- Use *for / since* for continuous duration: *I have worked here for 2 years.*`,
    examples: [
      { vi: "Tôi đã gửi bản kế hoạch cho khách hàng sáng nay.", en: "I sent the project plan to the client this morning." },
      { vi: "Chúng tôi đã làm việc với đối tác này được 3 năm rồi.", en: "We have worked with this partner for three years." },
      { vi: "Dự án hiện đang đúng tiến độ và sẽ bàn giao vào thứ Sáu.", en: "The project is currently on schedule and will be delivered on Friday." },
      { vi: "Tôi vẫn chưa nhận được xác nhận từ người quản lý.", en: "I have not received confirmation from the manager yet." }
    ],
    exercises: [
      {
        id: "ex-work-1",
        promptVi: "Tôi đã gửi tài liệu cập nhật cho toàn bộ nhóm qua email rồi.",
        referenceAnswers: [
          "I have already sent the updated document to the whole team via email.",
          "I've already emailed the updated document to the entire team."
        ],
        hint: "have already sent, updated document, entire team",
        topic: "Work & Professional",
        grammarCategory: "Present Perfect"
      },
      {
        id: "ex-work-2",
        promptVi: "Chúng ta cần dời cuộc họp ngày mai sang chiều thứ Năm vì giám đốc bận.",
        referenceAnswers: [
          "We need to reschedule tomorrow's meeting to Thursday afternoon because the director is busy.",
          "We need to postpone tomorrow's meeting to Thursday afternoon since the director is unavailable."
        ],
        hint: "reschedule / postpone, to Thursday afternoon",
        topic: "Work & Professional",
        grammarCategory: "Business Phrasing"
      },
      {
        id: "ex-work-3",
        promptVi: "Bạn có thể gửi cho tôi bản báo cáo tài chính trước 5 giờ chiều nay được không?",
        referenceAnswers: [
          "Could you please send me the financial report before 5 PM today?",
          "Can you send me the financial report by 5 PM today?"
        ],
        hint: "Could you send me, by 5 PM",
        topic: "Work & Professional",
        grammarCategory: "Polite Request"
      },
      {
        id: "ex-work-4",
        promptVi: "Nhóm của chúng tôi đang giải quyết sự cố và dự kiến hoàn tất trong hai giờ tới.",
        referenceAnswers: [
          "Our team is resolving the issue and expects to complete it within the next two hours.",
          "Our team is working on the incident and expects to finish within the next two hours."
        ],
        hint: "resolving the issue, within the next two hours",
        topic: "Work & Professional",
        grammarCategory: "Present Continuous"
      },
      {
        id: "ex-work-5",
        promptVi: "Tôi đã làm việc ở vị trí này được hơn hai năm và học được rất nhiều điều.",
        referenceAnswers: [
          "I have worked in this role for over two years and learned a lot.",
          "I have been working in this position for more than two years and have learned a great deal."
        ],
        hint: "have worked in this role, for over two years",
        topic: "Work & Professional",
        grammarCategory: "Present Perfect with duration"
      }
    ]
  },

  // 3. Topic: Developer & Tech English (B1 - B2)
  {
    id: "lesson-dev-1",
    slug: "dev-code-review-bugs",
    topic: "Developer & Tech",
    level: "B1",
    title: "Code Reviews, Bug Reports & Engineering Discussions",
    description: "Precise technical vocabulary and structures to report bugs, review PRs, and propose architectural solutions.",
    objectives: [
      "Articulate the root cause and runtime impact of software defects",
      "Draft constructive, polite, and actionable code review comments"
    ],
    estimatedMinutes: 25,
    theory: `In engineering communication, phrasing should be clear, concise, and solution-oriented:
- When describing a bug: \`The issue occurs when...\` / \`This causes unexpected behavior because...\`
- When suggesting an improvement: \`Would it make sense to extract this into a helper?\` / \`We might want to handle edge cases where...\`
- Use passive or objective structures to avoid personal blame: *The payload is missing the user ID* instead of *You forgot the user ID*.`,
    examples: [
      { vi: "Lỗi này xảy ra khi người dùng bấm nút submit hai lần liên tiếp.", en: "This bug occurs when the user clicks the submit button twice in a row." },
      { vi: "Chúng ta nên trích xuất hàm này ra một hook riêng để dễ test.", en: "We should extract this logic into a custom hook to make it easier to test." },
      { vi: "PR này đã giải quyết vấn đề rò rỉ bộ nhớ trong component giỏ hàng.", en: "This PR addresses the memory leak in the shopping cart component." },
      { vi: "Vui lòng đảm bảo tất cả các bài unit test đều pass trước khi merge.", en: "Please make sure all unit tests pass before merging." }
    ],
    exercises: [
      {
        id: "ex-dev-1",
        promptVi: "Lỗi này xuất hiện khi token hết hạn và người dùng cố gắng làm mới trang.",
        referenceAnswers: [
          "This error occurs when the token expires and the user tries to refresh the page.",
          "This bug happens when the token has expired and the user attempts to reload the page."
        ],
        hint: "occurs when, token expires, refresh the page",
        topic: "Developer & Tech",
        grammarCategory: "Condition & Time Clauses"
      },
      {
        id: "ex-dev-2",
        promptVi: "Chúng ta nên thêm xử lý lỗi cho trường hợp API trả về mã lỗi 500.",
        referenceAnswers: [
          "We should add error handling for the case where the API returns a 500 status code.",
          "We should implement error handling in case the API responds with a 500 error."
        ],
        hint: "add error handling, API returns a 500 status code",
        topic: "Developer & Tech",
        grammarCategory: "Modal verb should"
      },
      {
        id: "ex-dev-3",
        promptVi: "Hàm này đang chạy bất đồng bộ nên chúng ta cần thêm từ khóa await ở đây.",
        referenceAnswers: [
          "This function runs asynchronously, so we need to add the await keyword here.",
          "Because this function is asynchronous, we need to use the await keyword here."
        ],
        hint: "runs asynchronously, add the await keyword",
        topic: "Developer & Tech",
        grammarCategory: "Conjunctions"
      },
      {
        id: "ex-dev-4",
        promptVi: "Tôi đã refactor lại module xác thực để cải thiện hiệu năng và tính bảo mật.",
        referenceAnswers: [
          "I have refactored the authentication module to improve performance and security.",
          "I refactored the auth module to enhance both performance and security."
        ],
        hint: "refactored the authentication module, to improve performance",
        topic: "Developer & Tech",
        grammarCategory: "Infinitive of purpose"
      },
      {
        id: "ex-dev-5",
        promptVi: "Bạn có thể kiểm tra xem cơ sở dữ liệu có đang bị khóa hay không?",
        referenceAnswers: [
          "Could you check whether the database is currently locked?",
          "Can you check if the database is locked right now?"
        ],
        hint: "check whether / check if, database is locked",
        topic: "Developer & Tech",
        grammarCategory: "Indirect Question"
      }
    ]
  },

  // 4. Topic: Travel & Social English (A2 - B1)
  {
    id: "lesson-travel-1",
    slug: "travel-airport-hotel-booking",
    topic: "Travel & Social",
    level: "A2",
    title: "Airport Customs, Hotel Bookings & Navigating Directions",
    description: "Essential real-world sentences for international travel, reservations, and polite inquiries.",
    objectives: [
      "Use polite inquiry formulas with 'Would like to' and 'Could you please...'",
      "Confidently navigate customs questions and hotel check-in procedures"
    ],
    estimatedMinutes: 15,
    theory: `In travel situations, politeness formulas ensure smooth communication:
- Instead of saying *I want...*, prefer *I would like to...* or *Could I have...?*
- When asking for directions: *Excuse me, could you tell me how to get to...?*
- At hotel check-ins: *I have a reservation under the name of...*`,
    examples: [
      { vi: "Xin lỗi, cho tôi hỏi nhà vệ sinh gần nhất ở đâu ạ?", en: "Excuse me, where is the nearest restroom?" },
      { vi: "Tôi có đặt phòng trước dưới tên Kelvin.", en: "I have a reservation under the name of Kelvin." },
      { vi: "Chuyến bay đến Tokyo sẽ cất cánh từ cổng số 12.", en: "The flight to Tokyo will depart from Gate 12." },
      { vi: "Tôi muốn đổi một chỗ ngồi cạnh cửa sổ nếu còn trống.", en: "I would like to change to a window seat if available." }
    ],
    exercises: [
      {
        id: "ex-travel-1",
        promptVi: "Làm ơn cho tôi biết cổng lên máy bay cho chuyến bay này ở đâu?",
        referenceAnswers: [
          "Could you please tell me where the boarding gate for this flight is?",
          "Can you tell me where the boarding gate is for this flight?"
        ],
        hint: "boarding gate for this flight",
        topic: "Travel & Social",
        grammarCategory: "Indirect Question"
      },
      {
        id: "ex-travel-2",
        promptVi: "Tôi muốn làm thủ tục nhận phòng, tôi đã đặt trước trên mạng.",
        referenceAnswers: [
          "I would like to check in, I made a reservation online.",
          "I'd like to check in, please. I have an online booking."
        ],
        hint: "would like to check in, made a reservation online",
        topic: "Travel & Social",
        grammarCategory: "Polite Request"
      },
      {
        id: "ex-travel-3",
        promptVi: "Bữa sáng có được bao gồm trong giá phòng không ạ?",
        referenceAnswers: [
          "Is breakfast included in the room rate?",
          "Is breakfast included in the room price?"
        ],
        hint: "is breakfast included in",
        topic: "Travel & Social",
        grammarCategory: "Passive Voice"
      },
      {
        id: "ex-travel-4",
        promptVi: "Tôi có thể gửi hành lý ở đây cho đến chiều được không?",
        referenceAnswers: [
          "Could I leave my luggage here until this afternoon?",
          "Can I store my luggage here until the afternoon?"
        ],
        hint: "leave my luggage here, until this afternoon",
        topic: "Travel & Social",
        grammarCategory: "Modal verb could / can"
      },
      {
        id: "ex-travel-5",
        promptVi: "Bạn có thể giới thiệu cho tôi một quán ăn địa phương ngon gần đây không?",
        referenceAnswers: [
          "Could you recommend a good local restaurant nearby?",
          "Can you suggest a good local place to eat near here?"
        ],
        hint: "recommend a good local restaurant nearby",
        topic: "Travel & Social",
        grammarCategory: "Polite Request"
      }
    ]
  }
];
