import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Invalid or expired session. Please log in again." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      name: session.name,
      email: session.email,
      level: session.level,
    },
  });
}
