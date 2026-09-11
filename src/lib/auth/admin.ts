import { getSession, DEMO_USER } from "@/lib/auth/session";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "demo@tenthproject.app").split(",").map((e) => e.trim());

export async function isAdmin(): Promise<boolean> {
  const { user, isAuthenticated } = await getSession();
  if (!isAuthenticated || !user) return false;
  return ADMIN_EMAILS.includes(user.email);
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) throw new Error("Forbidden");
  return { user: DEMO_USER };
}
