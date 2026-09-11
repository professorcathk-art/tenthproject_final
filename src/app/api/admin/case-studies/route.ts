import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/lib/auth/admin";
import { upsertCaseStudy, deleteCaseStudy } from "@/lib/db/platform-store";
import type { CaseStudy } from "@/types/platform";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const cs: CaseStudy = {
      id: uuidv4(),
      title: body.title,
      slug: body.slug,
      category: body.category,
      summary: body.summary,
      breakdown_md: body.breakdown_md,
      tech_stack: body.tech_stack ?? [],
      cover_image: null,
      author_id: null,
      is_published: true,
      created_at: new Date().toISOString(),
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
