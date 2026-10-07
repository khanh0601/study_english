import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db/prisma";
import { findUserByEmail } from "@/server/db/storage";
import { setSession } from "@/server/auth/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    // 1. Try querying Neon PostgreSQL via Prisma first
    let user: {
      id: string;
      email: string;
      passwordHash: string;
      name: string;
      level: string;
      dailyMinutes: number;
    } | null = null;

    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
    } catch (dbErr) {
      console.warn("Prisma query fallback to local storage:", dbErr);
    }

    // 2. Fallback to local storage if not found in Postgres
    if (!user) {
      const localUser = findUserByEmail(email.trim());
      if (localUser) {
        user = localUser;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Set secure HTTP-only cookie with JWT session
    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
      level: (user.level as "A2" | "B1" | "B2") || "B1",
      dailyMinutes: user.dailyMinutes || 25,
    });

    return NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email, level: user.level },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Server error occurred during login." },
      { status: 500 }
    );
  }
}
