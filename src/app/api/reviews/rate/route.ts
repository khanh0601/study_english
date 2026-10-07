import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { rateReviewItem } from "@/server/db/storage";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yêu cầu đăng nhập." }, { status: 401 });
  }

  const { reviewId, rating } = await request.json();
  if (!reviewId || !rating) {
    return NextResponse.json({ error: "Thiếu dữ liệu đánh giá." }, { status: 400 });
  }

  const updatedReview = rateReviewItem(session.id, reviewId, rating);
  return NextResponse.json({ success: true, review: updatedReview });
}
