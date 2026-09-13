import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, getSession, writeSessionCookie } from "@/lib/auth/session";
import { loginWithPassword, signupWithPassword } from "@/lib/auth/identity";
import { getMembershipAccess } from "@/lib/auth/membership";

export async function GET() {
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ user: null });
  }
  let plan: "free" | "paid" = session.user.isAdmin ? "paid" : "free";
  let paid = session.user.isAdmin;
  try {
    const access = await getMembershipAccess(session.user.email, session.user.isAdmin);
    plan = access.paid ? "paid" : "free";
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
  let email = "";
  let name = "";
  let password = "";
  let mode: "login" | "signup" = "login";
  try {
    const body = await request.json();
    if (typeof body.email === "string") email = body.email;
    if (typeof body.name === "string") name = body.name;
    if (typeof body.password === "string") password = body.password;
    if (body.mode === "signup") mode = "signup";
  } catch {
    return NextResponse.json({ error: "invalid_body", message: "請輸入電郵和密碼。" }, { status: 400 });
  }

  const result = mode === "signup" ? await signupWithPassword(email, password, name) : await loginWithPassword(email, password);
  if (!result.ok) {
    const status = result.code === "invalid_input" ? 400 : result.code === "already_exists" ? 409 : 401;
    return NextResponse.json({ error: result.code, message: result.message }, { status });
  }

  let plan: "free" | "paid" = result.isAdmin ? "paid" : "free";
  let paid = result.isAdmin;
  try {
    const access = await getMembershipAccess(result.email, result.isAdmin);
    plan = access.paid ? "paid" : "free";
    paid = access.paid;
  } catch (error) {
    console.error("getMembershipAccess:", error);
  }

  const response = NextResponse.json({
    success: true,
    isAdmin: result.isAdmin,
    plan,
    paid,
  });
  writeSessionCookie(response, { email: result.email, name: result.name, id: result.userId });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(AUTH_COOKIE);
  return response;
}
