import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth/session";
import { deleteMember, getMemberByEmail, getMembers, upsertMember } from "@/lib/db/platform-store";
import { normalizeStoredPlan } from "@/lib/membership/plan";
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
      plan: normalizeStoredPlan(body.plan),
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

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (!body.id && !body.email) {
      return NextResponse.json({ error: "Member id required" }, { status: 400 });
    }
    const email = String(body.email).trim().toLowerCase();
    const existing = await getMemberByEmail(email);
    const member: Member = {
      id: body.id || existing?.id || uuidv4(),
      email,
      name: body.name || existing?.name || "Member",
      plan: normalizeStoredPlan(body.plan, existing?.plan),
      status: body.status || existing?.status || "active",
      notes: body.notes ?? existing?.notes ?? null,
      created_at: body.created_at || existing?.created_at || new Date().toISOString(),
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
