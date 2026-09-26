import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { getProject } from "@/lib/db/store";
import { briefSourceFromProject } from "@/lib/ai/product-brief";
import { polishProductBrief } from "@/lib/ai/polish-brief";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const projectId = String(body.projectId ?? "");
    const notes = typeof body.notes === "string" ? body.notes.slice(0, 8000) : "";
    const fileNames = Array.isArray(body.fileNames)
      ? body.fileNames.map((name: unknown) => String(name).slice(0, 180)).slice(0, 12)
      : [];

    if (!projectId) return NextResponse.json({ error: "Project not found" }, { status: 400 });
    const project = await getProject(projectId, user.id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const brief = await polishProductBrief(briefSourceFromProject(project, notes, fileNames));
    return NextResponse.json({ brief });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Brief failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
