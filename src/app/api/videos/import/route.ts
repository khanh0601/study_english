import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { importYouTubeVideo } from "@/lib/youtube/transcript";
import { saveCustomVideoLesson, getVideoLessonById } from "@/server/db/storage";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Yêu cầu đăng nhập." },
        { status: 401 }
      );
    }

    if (session.role !== "admin") {
      return NextResponse.json(
        { error: "Bạn không có quyền thực hiện hành động này. Chỉ Quản trị viên (Admin) mới có quyền thêm video vào hệ thống." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url, title, topic, level } = body;

    if (!url || !url.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập đường link video YouTube hợp lệ." },
        { status: 400 }
      );
    }

    // Check if already imported
    const existing = getVideoLessonById(url.trim());
    if (existing) {
      return NextResponse.json({
        success: true,
        video: existing,
        redirectUrl: `/watch/${existing.slug}`,
      });
    }

    const videoLesson = await importYouTubeVideo(url.trim());
    if (title && title.trim()) {
      videoLesson.title = title.trim();
    }
    if (topic) {
      videoLesson.topic = topic;
    }
    if (level) {
      videoLesson.level = level;
    }
    const saved = saveCustomVideoLesson(videoLesson);

    return NextResponse.json({
      success: true,
      video: saved,
      redirectUrl: `/watch/${saved.slug}`,
    });
  } catch (err: any) {
    console.error("YouTube import error:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "Không thể nhập phụ đề từ video này. Vui lòng kiểm tra video có phụ đề tiếng Anh và thử lại.",
      },
      { status: 400 }
    );
  }
}
