import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { generateCustomLesson } from "@/server/ai/lesson-generator";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Yêu cầu đăng nhập." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { scenarioPrompt, level } = body;

    if (!scenarioPrompt || !scenarioPrompt.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập mô tả tình huống bạn muốn luyện tập." },
        { status: 400 }
      );
    }

    const targetLevel = level === "A2" || level === "B2" ? level : "B1";

    const lesson = await generateCustomLesson(
      scenarioPrompt.trim(),
      targetLevel
    );

    return NextResponse.json({
      success: true,
      lesson,
      redirectUrl: `/learn/${lesson.slug}`,
    });
  } catch (err: any) {
    console.error("Custom lesson generation error:", err);
    return NextResponse.json(
      { error: "Không thể tạo bài học lúc này. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
