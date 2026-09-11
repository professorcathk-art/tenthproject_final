import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth/session";
import { upsertCaseStudy, deleteCaseStudy } from "@/lib/db/platform-store";
import type { CaseStudy } from "@/types/platform";
import { CASE_CATEGORIES } from "@/types/platform";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const slugSource = String(body.slug || body.title || "case")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const cs: CaseStudy = {
      id: body.id || uuidv4(),
      title: body.title,
      slug: slugSource || `case-${Date.now().toString(36)}`,
      category: CASE_CATEGORIES.some((c) => c.value === body.category) ? body.category : "saas",
      summary: body.summary,
      breakdown_md: body.breakdown_md,
      tech_stack: body.tech_stack ?? [],
      cover_image: body.cover_image || null,
      author_id: null,
      is_published: body.is_published !== false,
      created_at: body.created_at || new Date().toISOString(),
    };
    await upsertCaseStudy(cs);
    return NextResponse.json({ caseStudy: cs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await request.json();
    await deleteCaseStudy(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Forbidden" ? 403 : 500 });
  }
}
