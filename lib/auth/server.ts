import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createSessionToken,
  type DemoSession,
  readSessionFromToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
} from "@/lib/auth/session";

function getSessionExpiryDate(expiresAt: number) {
  return new Date(expiresAt);
}

export async function getOptionalSession() {
  const cookieStore = await cookies();
  return readSessionFromToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function createSession(email: string): Promise<DemoSession> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const session = { email, expiresAt };
  const token = createSessionToken(session);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: getSessionExpiryDate(expiresAt),
  });

  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function verifySession() {
  const session = await getOptionalSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
