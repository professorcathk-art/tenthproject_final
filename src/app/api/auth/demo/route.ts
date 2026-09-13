import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, buildUser, writeSessionCookie } from "@/lib/auth/session";
import { resolveSignedInAccount } from "@/lib/auth/identity";
import { getMembershipAccess } from "@/lib/auth/membership";

export async function GET() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ user: null });
  }
  let plan: "free" | "academy" | "enterprise" = session.user.isAdmin ? "enterprise" : "free";
  let paid = session.user.isAdmin;
  try {
    const access = await getMembershipAccess(session.user.email, session.user.isAdmin);
    plan = access.plan;
    paid = access.paid;
  } catch (error) {
    console.error("getMembershipAccess:", error);
  }
  return NextResponse.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      isAdmin: session.user.isAdmin,
      plan,
      paid,
    },
  });
}

export async function POST(request: NextRequest) {
  let email = "demo@tenthproject.app";
  let name: string | undefined;
  let password: string | undefined;
  try {
    const body = await request.json();
    if (typeof body.email === "string" && body.email.includes("@")) email = body.email;
    if (typeof body.name === "string" && body.name.trim()) name = body.name.trim();
    if (typeof body.password === "string" && body.password.length >= 6) password = body.password;
  } catch {
    /* demo defaults */
  }

  const user = buildUser(email, name);
  let plan: "free" | "academy" | "enterprise" = user.isAdmin ? "enterprise" : "free";
  let paid = user.isAdmin;
  let memberId = user.id;
  try {
    const { member, userId } = await resolveSignedInAccount(user.email, user.name, user.isAdmin, password);
    const access = await getMembershipAccess(user.email, user.isAdmin);
    memberId = userId;
    plan = member.plan;
    paid = access.paid;
  } catch (error) {
    console.error("resolveSignedInAccount:", error);
  }
  const response = NextResponse.json({
    success: true,
    isAdmin: user.isAdmin,
    plan,
    paid,
  });
  writeSessionCookie(response, { email: user.email, name: user.name, id: memberId });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(AUTH_COOKIE);
  return response;
}
