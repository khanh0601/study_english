import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SEED_LESSONS } from "../src/server/db/seeds";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Neon PostgreSQL database...");

  // 1. Create or update default user
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync("study123", salt);

  const user = await prisma.user.upsert({
    where: { email: "kelvin@studyenglish.local" },
    update: {},
    create: {
      id: "user-default-1",
      email: "kelvin@studyenglish.local",
      passwordHash,
      name: "Kelvin",
      level: "B1",
      dailyMinutes: 25,
      timezone: "Asia/Ho_Chi_Minh",
    },
  });

  console.log(`✓ User created/verified: ${user.email}`);

  // 2. Seed Lessons & Exercises
  for (const l of SEED_LESSONS) {
    const lesson = await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: {
        title: l.title,
        description: l.description,
        theory: l.theory,
        objectives: l.objectives,
        estimatedMinutes: l.estimatedMinutes,
        examplesJson: l.examples,
      },
      create: {
        id: l.id,
        slug: l.slug,
        topic: l.topic,
        level: l.level,
        title: l.title,
        description: l.description,
        objectives: l.objectives,
        estimatedMinutes: l.estimatedMinutes,
        theory: l.theory,
        examplesJson: l.examples,
      },
    });

    for (const ex of l.exercises) {
      await prisma.exercise.upsert({
        where: { id: ex.id },
        update: {
          promptVi: ex.promptVi,
          referenceAnswers: ex.referenceAnswers,
          hint: ex.hint,
          topic: ex.topic,
          grammarCategory: ex.grammarCategory,
        },
        create: {
          id: ex.id,
          lessonId: lesson.id,
          promptVi: ex.promptVi,
          referenceAnswers: ex.referenceAnswers,
          hint: ex.hint,
          topic: ex.topic,
          grammarCategory: ex.grammarCategory,
        },
      });
    }
  }

  console.log(`✓ Seeded ${SEED_LESSONS.length} curriculum lessons & exercises.`);

  // 3. Seed initial Spaced Review items
  await prisma.reviewSchedule.upsert({
    where: {
      userId_itemType_itemId: {
        userId: user.id,
        itemType: "sentence",
        itemId: "ex-work-1",
      },
    },
    update: {},
    create: {
      userId: user.id,
      itemType: "sentence",
      itemId: "ex-work-1",
      promptVi: "Tôi đã gửi tài liệu cập nhật cho toàn bộ nhóm qua email rồi.",
      expectedAnswer: "I have already sent the updated document to the whole team via email.",
      notes: "Present Perfect structure: have + V3/ed + already",
      intervalDays: 1,
      repetitions: 1,
      dueAt: new Date(),
    },
  });

  await prisma.reviewSchedule.upsert({
    where: {
      userId_itemType_itemId: {
        userId: user.id,
        itemType: "sentence",
        itemId: "ex-dev-1",
      },
    },
    update: {},
    create: {
      userId: user.id,
      itemType: "sentence",
      itemId: "ex-dev-1",
      promptVi: "Lỗi này xuất hiện khi token hết hạn và người dùng cố gắng làm mới trang.",
      expectedAnswer: "This error occurs when the token expires and the user tries to refresh the page.",
      notes: "Time clause condition: when token expires",
      intervalDays: 3,
      repetitions: 2,
      dueAt: new Date(),
    },
  });

  console.log("✓ Initial Spaced Reviews seeded.");

  // 4. Seed initial Vocabulary
  const existingVocab = await prisma.vocabulary.findFirst({ where: { userId: user.id } });
  if (!existingVocab) {
    await prisma.vocabulary.createMany({
      data: [
        {
          userId: user.id,
          phrase: "reschedule the meeting to...",
          meaningVi: "move or postpone meeting to a new time",
          exampleEn: "We need to reschedule the meeting to Thursday afternoon.",
          topic: "Work & Professional",
        },
        {
          userId: user.id,
          phrase: "occur when...",
          meaningVi: "happen or take place when a condition is met",
          exampleEn: "The bug occurs when the user clicks the button rapidly.",
          topic: "Developer & Tech",
        },
      ],
    });
    console.log("✓ Initial phrase bank items seeded.");
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
