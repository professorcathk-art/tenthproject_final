import { cookies } from "next/headers";
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
}

export function buildUser(email: string, name?: string): SessionUser {
  const admin = isAdminEmail(email);
  return {
    id: DEMO_USER_ID,
    email: email.trim().toLowerCase(),
    name: name?.trim() || (admin ? "Professor Cat" : "Member"),
    avatar_url: null,
    default_ai_model: "openai",
    default_tool: "cursor",
    created_at: new Date().toISOString(),
    isAdmin: admin,
  };
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

export async function getSession() {
  const cookieStore = await cookies();
  const payload = parsePayload(cookieStore.get(AUTH_COOKIE)?.value);
  if (!payload) return { user: null, isAuthenticated: false as const };
  const user = buildUser(payload.email, payload.name);
  return { user, isAuthenticated: true as const };
}

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
