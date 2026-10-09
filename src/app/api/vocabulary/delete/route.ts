import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { deleteVocabulary } from "@/server/db/storage";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Yêu cầu đăng nhập." }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID từ vựng là bắt buộc." }, { status: 400 });
    }

    const success = deleteVocabulary(id, session.id);
    if (!success) {
      return NextResponse.json({ error: "Không tìm thấy từ vựng hoặc đã bị xoá." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Lỗi khi xoá từ vựng." }, { status: 500 });
  }
}
