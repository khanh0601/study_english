import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { toggleDailyPlanItem } from "@/server/db/storage";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yêu cầu đăng nhập." }, { status: 401 });
  }

  const { planItemId } = await request.json();
  if (!planItemId) {
    return NextResponse.json({ error: "Thiếu ID mục cần cập nhật." }, { status: 400 });
  }

  const updatedPlan = toggleDailyPlanItem(session.id, planItemId);
  return NextResponse.json({ success: true, plan: updatedPlan });
}
