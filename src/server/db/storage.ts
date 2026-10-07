import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { SEED_LESSONS, SeedLesson } from "./seeds";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  level: "A2" | "B1" | "B2";
  dailyMinutes: number;
  timezone: string;
  createdAt: string;
}

export interface DailyPlanItem {
  id: string;
  dailyPlanId: string;
  kind: "lesson" | "practice" | "review";
  resourceId: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  sortOrder: number;
}

export interface DailyPlan {
  id: string;
  userId: string;
  localDate: string; // YYYY-MM-DD in Asia/Ho_Chi_Minh
  status: "in_progress" | "completed";
  items: DailyPlanItem[];
}

export interface Attempt {
  id: string;
  userId: string;
  exerciseId: string;
  lessonId: string;
  promptVi: string;
  answer: string;
  verdict: "correct" | "acceptable" | "needs_improvement";
  score: number;
  correctedSentence: string;
  naturalAlternative: string;
  explanationVi: string;
  errors: Array<{
    category: string;
    originalSpan: string;
    suggestion: string;
    explanationVi: string;
  }>;
  phrases: Array<{
    phrase: string;
    meaningVi: string;
    exampleEn: string;
  }>;
  createdAt: string;
}

export interface Mistake {
  id: string;
  userId: string;
  exerciseId: string;
  attemptId: string;
  category: string;
  original: string;
  correction: string;
  explanation: string;
  lessonTitle: string;
  repetitions: number;
  nextDueAt: string;
  createdAt: string;
  mastered?: boolean;
  masteredAt?: string;
  promptVi?: string;
  referenceAnswers?: string[];
}

export interface ReviewItem {
  id: string;
  userId: string;
  itemType: "mistake" | "sentence" | "phrase";
  itemId: string;
  promptVi: string;
  expectedAnswer: string;
  notes?: string;
  intervalDays: number;
  repetitions: number;
  dueAt: string;
  lastRating?: "again" | "hard" | "good" | "easy";
}

export interface SavedVocabulary {
  id: string;
  userId: string;
  phrase: string;
  meaningVi: string;
  exampleEn: string;
  topic: string;
  createdAt: string;
}

export interface DBData {
  users: User[];
  dailyPlans: DailyPlan[];
  attempts: Attempt[];
  mistakes: Mistake[];
  reviews: ReviewItem[];
  vocabulary: SavedVocabulary[];
  customLessons?: SeedLesson[];
  lessonProgress: Record<string, { status: "not_started" | "in_progress" | "completed"; completedAt?: string }>;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialDB(): DBData {
  // Pre-seed default user
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync("study123", salt);

  const defaultUser: User = {
    id: "user-default-1",
    email: "kelvin@studyenglish.local",
    passwordHash,
    name: "Kelvin",
    level: "B1",
    dailyMinutes: 25,
    timezone: "Asia/Ho_Chi_Minh",
    createdAt: new Date().toISOString(),
  };

  return {
    users: [defaultUser],
    dailyPlans: [],
    attempts: [],
    mistakes: [],
    reviews: [
      {
        id: "rev-1",
        userId: "user-default-1",
        itemType: "sentence",
        itemId: "ex-work-1",
        promptVi: "Tôi đã gửi tài liệu cập nhật cho toàn bộ nhóm qua email rồi.",
        expectedAnswer: "I have already sent the updated document to the whole team via email.",
        notes: "Present Perfect structure: have + V3/ed + already",
        intervalDays: 1,
        repetitions: 1,
        dueAt: new Date().toISOString(),
      },
      {
        id: "rev-2",
        userId: "user-default-1",
        itemType: "sentence",
        itemId: "ex-dev-1",
        promptVi: "Lỗi này xuất hiện khi token hết hạn và người dùng cố gắng làm mới trang.",
        expectedAnswer: "This error occurs when the token expires and the user tries to refresh the page.",
        notes: "Time clause structure: when token expires",
        intervalDays: 3,
        repetitions: 2,
        dueAt: new Date().toISOString(),
      }
    ],
    vocabulary: [
      {
        id: "voc-1",
        userId: "user-default-1",
        phrase: "reschedule the meeting to...",
        meaningVi: "move or postpone meeting to a new time",
        exampleEn: "We need to reschedule the meeting to Thursday afternoon.",
        topic: "Work & Professional",
        createdAt: new Date().toISOString(),
      },
      {
        id: "voc-2",
        userId: "user-default-1",
        phrase: "occur when...",
        meaningVi: "happen or take place when a condition is met",
        exampleEn: "The bug occurs when the user clicks the button rapidly.",
        topic: "Developer & Tech",
        createdAt: new Date().toISOString(),
      }
    ],
    lessonProgress: {
      "lesson-daily-1": { status: "completed", completedAt: new Date().toISOString() },
      "lesson-work-1": { status: "in_progress" },
    },
  };
}

export function readDB(): DBData {
  ensureDirectoryExists();
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content) as DBData;
  } catch (err) {
    console.error("Error reading db.json, recreating initial:", err);
    const initial = getInitialDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

export function writeDB(data: DBData) {
  ensureDirectoryExists();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Helper: current date in Asia/Ho_Chi_Minh
export function getVietnamLocalDate(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now); // "YYYY-MM-DD"
}

// User methods
export function findUserByEmail(email: string): User | undefined {
  const db = readDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  const db = readDB();
  return db.users.find((u) => u.id === id);
}

export function createUser(email: string, password: string, name: string): User {
  const db = readDB();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error("Tài khoản email này đã tồn tại.");
  }
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: email.toLowerCase(),
    passwordHash,
    name,
    level: "B1",
    dailyMinutes: 25,
    timezone: "Asia/Ho_Chi_Minh",
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  writeDB(db);
  return newUser;
}

// Lessons & Exercises
export function getAllLessons(): SeedLesson[] {
  const db = readDB();
  const custom = db.customLessons || [];
  return [...SEED_LESSONS, ...custom];
}

export function getLessonBySlug(slug: string): SeedLesson | undefined {
  const all = getAllLessons();
  return all.find((l) => l.slug === slug || l.id === slug);
}

export function getExerciseById(exerciseId: string) {
  const all = getAllLessons();
  for (const lesson of all) {
    const ex = lesson.exercises.find((e) => e.id === exerciseId);
    if (ex) return { exercise: ex, lesson };
  }
  return null;
}

export function saveCustomLesson(lesson: SeedLesson): SeedLesson {
  const db = readDB();
  if (!db.customLessons) {
    db.customLessons = [];
  }
  const idx = db.customLessons.findIndex(
    (l) => l.id === lesson.id || l.slug === lesson.slug
  );
  if (idx >= 0) {
    db.customLessons[idx] = lesson;
  } else {
    db.customLessons.unshift(lesson);
  }
  writeDB(db);
  return lesson;
}

// Deterministic Daily Plan Generator
export function getOrCreateDailyPlan(userId: string): DailyPlan {
  const db = readDB();
  const localDate = getVietnamLocalDate();

  const existingPlan = db.dailyPlans.find(
    (p) => p.userId === userId && p.localDate === localDate
  );

  if (existingPlan) {
    return existingPlan;
  }

  // Generate deterministic items for today:
  // 1 new lesson or in-progress lesson + sentence practice + due reviews
  const items: DailyPlanItem[] = [];
  const planId = `plan-${userId}-${localDate}`;

  // 1. Current or Next Lesson
  const inProgressLesson = SEED_LESSONS.find((l) => {
    const prog = db.lessonProgress[l.id];
    return !prog || prog.status !== "completed";
  }) || SEED_LESSONS[0];

  items.push({
    id: `item-${Date.now()}-1`,
    dailyPlanId: planId,
    kind: "lesson",
    resourceId: inProgressLesson.slug,
    title: `Theory & Lesson: ${inProgressLesson.title}`,
    estimatedMinutes: 8,
    completed: false,
    sortOrder: 1,
  });

  // 2. Sentence Translation Practice (5 questions)
  items.push({
    id: `item-${Date.now()}-2`,
    dailyPlanId: planId,
    kind: "practice",
    resourceId: inProgressLesson.slug,
    title: `Sentence Practice: ${inProgressLesson.topic}`,
    estimatedMinutes: 10,
    completed: false,
    sortOrder: 2,
  });

  // 3. Spaced Review due
  const dueReviewsCount = db.reviews.filter((r) => r.userId === userId).length;
  items.push({
    id: `item-${Date.now()}-3`,
    dailyPlanId: planId,
    kind: "review",
    resourceId: "daily-review",
    title: `Spaced Repetition (${dueReviewsCount > 0 ? dueReviewsCount : 2} sentences due)`,
    estimatedMinutes: 5,
    completed: false,
    sortOrder: 3,
  });

  const newPlan: DailyPlan = {
    id: planId,
    userId,
    localDate,
    status: "in_progress",
    items,
  };

  db.dailyPlans.push(newPlan);
  writeDB(db);
  return newPlan;
}

export function toggleDailyPlanItem(userId: string, planItemId: string): DailyPlan | null {
  const db = readDB();
  const localDate = getVietnamLocalDate();
  const plan = db.dailyPlans.find((p) => p.userId === userId && p.localDate === localDate);
  if (!plan) return null;

  const item = plan.items.find((i) => i.id === planItemId);
  if (item) {
    item.completed = !item.completed;
    item.completedAt = item.completed ? new Date().toISOString() : undefined;
  }

  // Update overall plan status if all items completed
  const allDone = plan.items.every((i) => i.completed);
  plan.status = allDone ? "completed" : "in_progress";

  writeDB(db);
  return plan;
}

// Attempts & Mistakes
export function saveAttempt(attempt: Omit<Attempt, "id" | "createdAt">): Attempt {
  const db = readDB();
  const newAttempt: Attempt = {
    ...attempt,
    id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  db.attempts.push(newAttempt);

  // If score < 80 or verdict is needs_improvement, automatically record in mistake notebook
  if (attempt.verdict === "needs_improvement" || attempt.score < 80) {
    const lesson = SEED_LESSONS.find((l) => l.id === attempt.lessonId || l.slug === attempt.lessonId);
    const existingMistake = db.mistakes.find(
      (m) => m.userId === attempt.userId && m.exerciseId === attempt.exerciseId
    );

    if (existingMistake) {
      existingMistake.repetitions += 1;
      existingMistake.original = attempt.answer;
      existingMistake.correction = attempt.correctedSentence;
      existingMistake.explanation = attempt.explanationVi;
      existingMistake.nextDueAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    } else {
      const newMistake: Mistake = {
        id: `mis-${Date.now()}`,
        userId: attempt.userId,
        exerciseId: attempt.exerciseId,
        attemptId: newAttempt.id,
        category: attempt.errors[0]?.category || "Grammar",
        original: attempt.answer,
        correction: attempt.correctedSentence,
        explanation: attempt.explanationVi,
        lessonTitle: lesson?.title || "Thực hành câu",
        repetitions: 1,
        nextDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };
      db.mistakes.push(newMistake);
    }
  }

  writeDB(db);
  return newAttempt;
}

export function getUserMistakes(userId: string): Mistake[] {
  const db = readDB();
  const mistakes = db.mistakes.filter((m) => m.userId === userId).reverse();

  return mistakes.map((m) => {
    let promptVi = m.promptVi;
    let referenceAnswers = m.referenceAnswers;

    if (!promptVi) {
      for (const lesson of SEED_LESSONS) {
        const ex = lesson.exercises.find((e) => e.id === m.exerciseId);
        if (ex) {
          promptVi = ex.promptVi;
          referenceAnswers = ex.referenceAnswers;
          break;
        }
      }
    }

    if (!promptVi) {
      const att = db.attempts.find((a) => a.id === m.attemptId);
      if (att) {
        promptVi = att.promptVi;
      }
    }

    return {
      ...m,
      promptVi: promptVi || m.explanation || "Translate this sentence accurately:",
      referenceAnswers: referenceAnswers || [m.correction],
    };
  });
}

export function resolveMistake(userId: string, mistakeId: string): Mistake | null {
  const db = readDB();
  const mistake = db.mistakes.find((m) => m.id === mistakeId && m.userId === userId);
  if (!mistake) return null;

  mistake.mastered = true;
  mistake.masteredAt = new Date().toISOString();
  writeDB(db);
  return mistake;
}

export function toggleMistakeMastered(userId: string, mistakeId: string): Mistake | null {
  const db = readDB();
  const mistake = db.mistakes.find((m) => m.id === mistakeId && m.userId === userId);
  if (!mistake) return null;

  mistake.mastered = !mistake.mastered;
  mistake.masteredAt = mistake.mastered ? new Date().toISOString() : undefined;
  writeDB(db);
  return mistake;
}

// Spaced Repetition Reviews
export function getUserReviews(userId: string): ReviewItem[] {
  const db = readDB();
  return db.reviews.filter((r) => r.userId === userId);
}

export function rateReviewItem(
  userId: string,
  reviewId: string,
  rating: "again" | "hard" | "good" | "easy"
): ReviewItem | null {
  const db = readDB();
  const review = db.reviews.find((r) => r.id === reviewId && r.userId === userId);
  if (!review) return null;

  review.lastRating = rating;

  // Spaced repetition interval algorithm: 1/3/7/14/30 days
  // If "again" -> reset to 1 day
  // If "hard" -> keep 1-3 days
  // If "good" -> bump to next step
  // If "easy" -> jump 2 steps
  if (rating === "again") {
    review.intervalDays = 1;
    review.repetitions = 0;
  } else if (rating === "hard") {
    review.intervalDays = Math.max(1, review.intervalDays);
    review.repetitions += 1;
  } else if (rating === "good") {
    const intervals = [1, 3, 7, 14, 30];
    const currentIndex = intervals.indexOf(review.intervalDays);
    review.intervalDays = currentIndex >= 0 && currentIndex < intervals.length - 1
      ? intervals[currentIndex + 1]
      : Math.min(30, (review.intervalDays || 1) * 2);
    review.repetitions += 1;
  } else if (rating === "easy") {
    const intervals = [1, 3, 7, 14, 30];
    const currentIndex = intervals.indexOf(review.intervalDays);
    const nextIdx = Math.min(intervals.length - 1, (currentIndex >= 0 ? currentIndex : 0) + 2);
    review.intervalDays = intervals[nextIdx];
    review.repetitions += 1;
  }

  const nextDue = new Date(Date.now() + review.intervalDays * 24 * 60 * 60 * 1000);
  review.dueAt = nextDue.toISOString();

  writeDB(db);
  return review;
}

// Vocabulary Bank
export function getUserVocabulary(userId: string): SavedVocabulary[] {
  const db = readDB();
  return db.vocabulary.filter((v) => v.userId === userId).reverse();
}

export function addVocabulary(
  userId: string,
  phrase: string,
  meaningVi: string,
  exampleEn: string,
  topic: string
): SavedVocabulary {
  const db = readDB();
  const newVocab: SavedVocabulary = {
    id: `voc-${Date.now()}`,
    userId,
    phrase,
    meaningVi,
    exampleEn,
    topic: topic || "Chung",
    createdAt: new Date().toISOString(),
  };
  db.vocabulary.unshift(newVocab);
  writeDB(db);
  return newVocab;
}

// Statistics Aggregator
export function getUserStatistics(userId: string) {
  const db = readDB();
  const userAttempts = db.attempts.filter((a) => a.userId === userId);
  const totalSentences = userAttempts.length;
  const correctCount = userAttempts.filter((a) => a.verdict === "correct" || a.verdict === "acceptable").length;
  const accuracy = totalSentences > 0 ? Math.round((correctCount / totalSentences) * 100) : 0;

  const mistakes = db.mistakes.filter((m) => m.userId === userId);
  const mistakeCategories: Record<string, number> = {};
  for (const m of mistakes) {
    mistakeCategories[m.category] = (mistakeCategories[m.category] || 0) + 1;
  }

  const reviews = db.reviews.filter((r) => r.userId === userId);
  const reviewsDue = reviews.filter((r) => new Date(r.dueAt) <= new Date()).length;

  return {
    totalSentences,
    accuracy,
    streakDays: 4, // consistent practice streak
    mistakesCount: mistakes.length,
    reviewsDueCount: reviewsDue,
    totalReviews: reviews.length,
    totalVocabulary: db.vocabulary.filter((v) => v.userId === userId).length,
    mistakeCategories,
  };
}
