import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import {
  deleteVideoLesson,
  updateVideoLesson,
  getVideoLessonById,
} from "@/server/db/storage";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { error: "Chỉ Quản trị viên (Admin) mới có quyền xóa video." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existing = getVideoLessonById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Không tìm thấy video để xóa." },
        { status: 404 }
      );
    }

    deleteVideoLesson(id);

    return NextResponse.json({
      success: true,
      message: `Đã xóa video "${existing.title}" thành công.`,
    });
  } catch (err: any) {
    console.error("Delete video error:", err);
    return NextResponse.json(
      { error: err?.message || "Lỗi máy chủ khi xóa video." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { error: "Chỉ Quản trị viên (Admin) mới có quyền chỉnh sửa video." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updated = updateVideoLesson(id, body);
    if (!updated) {
      return NextResponse.json(
        { error: "Không tìm thấy video để cập nhật." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      video: updated,
      message: "Cập nhật video thành công.",
    });
  } catch (err: any) {
    console.error("Update video error:", err);
    return NextResponse.json(
      { error: err?.message || "Lỗi máy chủ khi cập nhật video." },
      { status: 500 }
    );
  }
}
