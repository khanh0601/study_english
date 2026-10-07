import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { evaluateTranslation } from "@/server/ai/gemini";
import { saveAttempt } from "@/server/db/storage";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Yêu cầu đăng nhập." }, { status: 401 });
    }

    const body = await request.json();
    const { exerciseId, lessonId, promptVi, answer, referenceAnswers } = body;

    if (!promptVi || !answer || !answer.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập câu trả lời tiếng Anh." },
        { status: 400 }
      );
    }

    // Call Gemini evaluation (with local fallback if key/quota is missing)
    const evaluation = await evaluateTranslation(
      promptVi,
      answer.trim(),
      referenceAnswers || []
    );

    // Save attempt to database history
    const savedAttempt = saveAttempt({
      userId: session.id,
      exerciseId: exerciseId || "custom",
      lessonId: lessonId || "custom",
      promptVi,
      answer: answer.trim(),
      verdict: evaluation.verdict,
      score: evaluation.score,
      correctedSentence: evaluation.correctedSentence,
      naturalAlternative: evaluation.naturalAlternative,
      explanationVi: evaluation.explanationVi,
      errors: evaluation.errors,
      phrases: evaluation.phrases,
    });

    return NextResponse.json({
      success: true,
      evaluation,
      attemptId: savedAttempt.id,
    });
  } catch (err) {
    console.error("Evaluation error:", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi chấm bài. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
