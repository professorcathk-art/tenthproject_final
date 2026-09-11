import { NextResponse } from "next/server";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getCaseStudies, getCourses } from "@/lib/db/platform-store";

export async function POST() {
  try {
    await ensurePlatformSeeded();
    const [courses, cases] = await Promise.all([getCourses(false), getCaseStudies(undefined, false)]);
    return NextResponse.json({
      message: "Seeded successfully",
      courses: courses.length,
      caseStudies: cases.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
