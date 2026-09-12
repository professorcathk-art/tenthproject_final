import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, buildUser } from "@/lib/auth/session";

export async function GET() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      email: session.user.email,
      name: session.user.name,
      isAdmin: session.user.isAdmin,
    },
  });
}

export async function POST(request: NextRequest) {
  let email = "demo@tenthproject.app";
  let name: string | undefined;
  try {
    const body = await request.json();
    if (typeof body.email === "string" && body.email.includes("@")) email = body.email;
    if (typeof body.name === "string" && body.name.trim()) name = body.name.trim();
  } catch {
    /* demo defaults */
  }

  const user = buildUser(email, name);
  const response = NextResponse.json({ success: true, isAdmin: user.isAdmin });
  response.cookies.set(
    AUTH_COOKIE,
    JSON.stringify({ email: user.email, name: user.name }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    }
  );
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(AUTH_COOKIE);
  return response;
}
