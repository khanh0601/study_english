import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/server/db/prisma";

const SECRET_KEY = process.env.AUTH_SECRET || "study-english-super-secret-key-32chars-minimum-prod";
const key = new TextEncoder().encode(SECRET_KEY);

const ACCESS_COOKIE_NAME = "study_access_token";
const REFRESH_COOKIE_NAME = "study_refresh_token";

// Durations
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const ACCESS_COOKIE_MAX_AGE = 15 * 60; // 15 mins in seconds
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  level: "A2" | "B1" | "B2";
  dailyMinutes: number;
}

// 1. Generate Access Token (JWT, 15m)
export async function generateAccessToken(user: SessionUser): Promise<string> {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(key);
}

// 2. Generate and store Refresh Token (30d) in Neon PostgreSQL
export async function createRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE * 1000);

  try {
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  } catch (err) {
    console.warn("Could not save refresh token to database, operating in memory/fallback mode:", err);
  }

  return token;
}

// 3. Set both Access & Refresh cookies
export async function setSession(user: SessionUser) {
  const accessToken = await generateAccessToken(user);
  const refreshToken = await createRefreshToken(user.id);
  const cookieStore = await cookies();

  // Access Token Cookie (15 mins)
  cookieStore.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });

  // Refresh Token Cookie (30 days)
  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

// 4. Verify Access Token
export async function verifyAccessToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

// 5. Automatic Refresh Flow: getSession checks access token, if expired refreshes via refresh token
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  // Step A: If access token is valid, return user immediately
  if (accessToken) {
    const user = await verifyAccessToken(accessToken);
    if (user) return user;
  }

  // Step B: Access token is missing or expired, attempt Refresh Token validation
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    return null;
  }

  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked || new Date(storedToken.expiresAt) < new Date()) {
      // Invalid or revoked or expired refresh token
      await deleteSession();
      return null;
    }

    const dbUser = storedToken.user;
    const sessionUser: SessionUser = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      level: (dbUser.level as "A2" | "B1" | "B2") || "B1",
      dailyMinutes: dbUser.dailyMinutes || 25,
    };

    // Issue new access token seamlessly
    const newAccessToken = await generateAccessToken(sessionUser);
    cookieStore.set(ACCESS_COOKIE_NAME, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });

    return sessionUser;
  } catch (err) {
    console.error("Error refreshing session token:", err);
    return null;
  }
}

// 6. Delete session on Logout (revokes token in DB and clears cookies)
export async function deleteSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (refreshToken) {
    try {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    } catch (err) {
      console.warn("Could not revoke refresh token in DB:", err);
    }
  }

  cookieStore.delete(ACCESS_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
  cookieStore.delete("study_english_session"); // Clean up old legacy cookie if present
}
