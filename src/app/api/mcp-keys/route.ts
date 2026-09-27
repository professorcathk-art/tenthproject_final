import { NextRequest, NextResponse } from "next/server";
import { isPaidEmail } from "@/lib/auth/membership";
import { requireAuth } from "@/lib/auth/session";
import { createMcpApiKey, getMcpKeysForProject, revokeMcpApiKey } from "@/lib/db/platform-store";
import { getProject } from "@/lib/db/store";

function normalizeMcpKeyLabel(raw: unknown) {
  const text = String(raw ?? "")
    .replace(/[\u0000-\u001F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
  return text || "MCP";
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    if (!(await isPaidEmail(user.email))) return NextResponse.json({ error: "PAID_REQUIRED" }, { status: 403 });
    const projectId = request.nextUrl.searchParams.get("projectId");
    if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

    const project = await getProject(projectId, user.id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const keys = await getMcpKeysForProject(user.id, projectId);
    return NextResponse.json({ keys });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    if (!(await isPaidEmail(user.email))) return NextResponse.json({ error: "PAID_REQUIRED" }, { status: 403 });
    const { projectId, label } = await request.json();

    const project = await getProject(projectId, user.id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { key, record } = await createMcpApiKey(user.id, projectId, normalizeMcpKeyLabel(label));
    return NextResponse.json({ key, record: { id: record.id, key_prefix: record.key_prefix, label: record.label, created_at: record.created_at } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    if (!(await isPaidEmail(user.email))) return NextResponse.json({ error: "PAID_REQUIRED" }, { status: 403 });
    const { keyId } = await request.json();
    await revokeMcpApiKey(keyId, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
