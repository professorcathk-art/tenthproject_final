import { cache } from "react";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/auth/admin";

export const AUTH_COOKIE = "tenth_project_session";
export const DEMO_USER_ID = process.env.DEMO_USER_ID ?? "154442dc-5e98-462d-9ad8-71926ba637fd";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  default_ai_model: string;
  default_tool: "cursor";
  created_at: string;
  isAdmin: boolean;
}

interface SessionPayload {
  email: string;
  name: string;
  id?: string;
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
};

export function buildUser(email: string, name?: string, id?: string): SessionUser {
  const admin = isAdminEmail(email);
  return {
    id: id || DEMO_USER_ID,
    email: email.trim().toLowerCase(),
    name: name?.trim() || (admin ? "Professor Cat" : "Member"),
    avatar_url: null,
    default_ai_model: "openai",
    default_tool: "cursor",
    created_at: new Date().toISOString(),
    isAdmin: admin,
  };
}

export function writeSessionCookie(
  response: NextResponse,
  payload: { email: string; name: string; id?: string },
) {
  response.cookies.set(AUTH_COOKIE, JSON.stringify(payload), SESSION_COOKIE_OPTIONS);
  return response;
}

export const DEMO_USER = buildUser("demo@tenthproject.app", "Demo User");

function parsePayload(raw: string | undefined): SessionPayload | null {
  if (!raw) return null;
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    value = raw;
  }
  if (value === "authenticated") {
    return { email: DEMO_USER.email, name: DEMO_USER.name };
  }
  try {
    const parsed = JSON.parse(value) as SessionPayload;
    if (parsed?.email) return parsed;
  } catch {
    return null;
  }
  return null;
}

export const getSession = cache(async function getSession() {
  const cookieStore = await cookies();
  const payload = parsePayload(cookieStore.get(AUTH_COOKIE)?.value);
  if (!payload) return { user: null, isAuthenticated: false as const };
  const user = buildUser(payload.email, payload.name, payload.id);
  return { user, isAuthenticated: true as const };
});

export async function requireAuth() {
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    throw new Error("Unauthorized");
  }
  return { user: session.user, isAuthenticated: true as const };
}

export async function isAdmin() {
  const { user, isAuthenticated } = await getSession();
  return Boolean(isAuthenticated && user?.isAdmin);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.user?.isAdmin) {
    throw new Error("Forbidden");
  }
  return { user: session.user };
}
