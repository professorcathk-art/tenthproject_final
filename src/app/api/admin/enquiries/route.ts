import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { updateEnquiryStatus } from "@/lib/db/platform-store";

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, status } = await request.json();
    await updateEnquiryStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}
