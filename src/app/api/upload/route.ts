import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";
import { requireAuth } from "@/lib/auth/session";
import { addArtifact, logActivity } from "@/lib/db/store";
import type { ProjectArtifact } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string;
    const type = (formData.get("type") as ProjectArtifact["type"]) || "screenshot";
    const title = (formData.get("title") as string) || file?.name || "Upload";

    if (!projectId || !file) {
      return NextResponse.json({ error: "Missing projectId or file" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", user.id, projectId);
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || ".png";
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, buffer);

    const publicUrl = `/uploads/${user.id}/${projectId}/${filename}`;

    const artifact: ProjectArtifact = {
      id: uuidv4(),
      project_id: projectId,
      type,
      title,
      file_url: publicUrl,
      content_url: null,
      extracted_text: null,
      summary: null,
      created_at: new Date().toISOString(),
    };

    await addArtifact(artifact);
    await logActivity(projectId, "file_uploaded", `Uploaded ${type}: ${title}`);

    return NextResponse.json({ artifact });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
