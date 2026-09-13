import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { deleteWebinarSignup, getWebinarSignups, updateWebinarSignupStatus } from "@/lib/db/platform-store";

export async function GET() {
  try {
    await requireAdmin();
    const signups = await getWebinarSignups();
    return NextResponse.json({ signups });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });
    await updateWebinarSignupStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await deleteWebinarSignup(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}
