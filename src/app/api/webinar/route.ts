import { NextRequest, NextResponse } from "next/server";
import { createWebinarSignup } from "@/lib/db/platform-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const whatsapp = typeof body.whatsapp === "string" ? body.whatsapp.trim() : "";
    if (!name || !email.includes("@") || !whatsapp) {
      return NextResponse.json({ error: "Name, WhatsApp, and email are required." }, { status: 400 });
    }
    const signup = await createWebinarSignup({ name, email, whatsapp });
    return NextResponse.json({ signup });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
