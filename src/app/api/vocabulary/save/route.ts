import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { addVocabulary } from "@/server/db/storage";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yêu cầu đăng nhập." }, { status: 401 });
  }

  const { phrase, meaningVi, exampleEn, topic } = await request.json();
  if (!phrase || !meaningVi) {
    return NextResponse.json({ error: "Vui lòng nhập cụm từ và nghĩa tiếng Việt." }, { status: 400 });
  }

  const newVocab = addVocabulary(
    session.id,
    phrase.trim(),
    meaningVi.trim(),
    (exampleEn || "").trim(),
    (topic || "Chung").trim()
  );

  return NextResponse.json({ success: true, vocabulary: newVocab });
}
