import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth/session";
import { createClassroomUploadUrl } from "@/lib/classroom/storage";

const KINDS = {
  cover: "covers",
  video: "videos",
  material: "materials",
} as const;

function extFrom(name: string, contentType: string) {
  const fromName = name.includes(".") ? name.split(".").pop()?.toLowerCase() : "";
  if (fromName && /^[a-z0-9]{1,8}$/.test(fromName)) return fromName;
  if (contentType.includes("jpeg")) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("mp4")) return "mp4";
  if (contentType.includes("pdf")) return "pdf";
  return "bin";
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const kind = body.kind as keyof typeof KINDS;
    const filename = String(body.filename || "file");
    const contentType = String(body.contentType || "application/octet-stream");
    const courseId = String(body.courseId || "general");
    const lessonId = String(body.lessonId || "item");
    if (!KINDS[kind]) {
      return NextResponse.json({ error: "Unknown upload kind" }, { status: 400 });
    }
    const ext = extFrom(filename, contentType);
    const path = `${KINDS[kind]}/${courseId}/${lessonId}/${uuidv4()}.${ext}`;
    const signed = await createClassroomUploadUrl(path);
    return NextResponse.json({
      path: signed.path || path,
      token: signed.token,
      signedUrl: signed.signedUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}
