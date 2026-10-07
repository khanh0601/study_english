import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { askAITutor, ChatMessage } from "@/server/ai/chat";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Session required." }, { status: 401 });
    }

    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array required." }, { status: 400 });
    }

    const reply = await askAITutor(messages as ChatMessage[], context);

    return NextResponse.json({
      success: true,
      message: {
        role: "assistant",
        content: reply,
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Failed to get AI Tutor response. Please try again." },
      { status: 500 }
    );
  }
}
