import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { processRoleplayTurn, RoleplayScenario } from "@/server/ai/roleplay";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Yêu cầu đăng nhập." }, { status: 401 });
    }

    const body = await request.json();
    const { scenario, history, userReply, turnIndex } = body;

    if (!scenario || !userReply || typeof userReply !== "string") {
      return NextResponse.json(
        { error: "Scenario và câu trả lời của người dùng là bắt buộc." },
        { status: 400 }
      );
    }

    const result = await processRoleplayTurn(
      scenario as RoleplayScenario,
      history || [],
      userReply.trim(),
      turnIndex || 1
    );

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("Roleplay API error:", err);
    return NextResponse.json(
      { error: err?.message || "Lỗi xử lý hội thoại nhập vai." },
      { status: 500 }
    );
  }
}
