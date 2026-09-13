import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { getCaseMarksForUser, getCaseStudyBySlug, setCaseMarkForUser } from "@/lib/db/platform-store";
import type { CaseMarkStatus } from "@/types/platform";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

function isMarkStatus(value: unknown): value is CaseMarkStatus {
  return value === "saved" || value === "passed";
}

export async function GET() {
  try {
    const { user } = await requireAuth();
    const marks = await getCaseMarksForUser(user.id);
    return NextResponse.json({ marks });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = (await request.json()) as { slug?: unknown; status?: unknown };
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    if (!SLUG_RE.test(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const study = await getCaseStudyBySlug(slug);
    if (!study) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const status = body.status === null ? null : isMarkStatus(body.status) ? body.status : undefined;
    if (status === undefined) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const marks = await setCaseMarkForUser(user.id, slug, status);
    return NextResponse.json({ marks });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
