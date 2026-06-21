import { cookies } from "next/headers";

export const DEMO_USER = {
  id: process.env.DEMO_USER_ID ?? "154442dc-5e98-462d-9ad8-71926ba637fd",
  email: "demo@tenthproject.app",
  name: "Demo User",
  avatar_url: null,
  default_ai_model: "openai",
  default_tool: "cursor" as const,
  created_at: new Date().toISOString(),
};

export const AUTH_COOKIE = "tenth_project_session";

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE);
  if (session?.value === "authenticated") {
    return { user: DEMO_USER, isAuthenticated: true };
  }
  return { user: null, isAuthenticated: false };
}

export async function requireAuth() {
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    throw new Error("Unauthorized");
  }
  return { user: session.user, isAuthenticated: true as const };
}
