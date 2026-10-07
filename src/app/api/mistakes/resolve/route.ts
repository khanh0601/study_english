import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { resolveMistake, toggleMistakeMastered } from "@/server/db/storage";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Session required." }, { status: 401 });
    }

    const { mistakeId, action } = await request.json();
    if (!mistakeId) {
      return NextResponse.json({ error: "mistakeId required." }, { status: 400 });
    }

    const updated = action === "toggle"
      ? toggleMistakeMastered(session.id, mistakeId)
      : resolveMistake(session.id, mistakeId);

    if (!updated) {
      return NextResponse.json({ error: "Mistake not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, mistake: updated });
  } catch (err) {
    console.error("Resolve mistake API error:", err);
    return NextResponse.json({ error: "Server error resolving mistake." }, { status: 500 });
  }
}
