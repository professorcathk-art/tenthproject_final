import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/auth/identity";

export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    if (typeof body.email === "string") email = body.email;
  } catch {
    return NextResponse.json({ error: "invalid_body", message: "請輸入電郵。" }, { status: 400 });
  }

  const result = await requestPasswordReset(email);
  if (!result.ok) {
    return NextResponse.json({ error: "reset_failed", message: result.message }, { status: 400 });
  }
  return NextResponse.json({ success: true, message: result.message });
}
