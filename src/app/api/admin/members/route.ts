import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth/session";
import { getMembers, upsertMember, deleteMember } from "@/lib/db/platform-store";
import type { Member } from "@/types/platform";

export async function GET() {
  try {
    await requireAdmin();
    const members = await getMembers();
    return NextResponse.json({ members });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const member: Member = {
      id: body.id || uuidv4(),
      email: String(body.email).trim().toLowerCase(),
      name: body.name || "Member",
      plan: body.plan || "free",
      status: body.status || "active",
      notes: body.notes || null,
      created_at: new Date().toISOString(),
    };
    await upsertMember(member);
    return NextResponse.json({ member });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await request.json();
    await deleteMember(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}
