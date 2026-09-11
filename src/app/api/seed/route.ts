import { NextResponse } from "next/server";
import { seedPlatformData, getCaseStudies } from "@/lib/db/platform-store";
import { SEED_COURSES, getSeedLessons, getSeedCaseStudies } from "@/lib/seed/platform-seed";

export async function POST() {
  try {
    const existing = await getCaseStudies(undefined, false);
    if (existing.length >= 50) {
      return NextResponse.json({ message: "Already seeded", count: existing.length });
    }
    await seedPlatformData(SEED_COURSES, getSeedLessons(), getSeedCaseStudies());
    return NextResponse.json({ message: "Seeded successfully", courses: 2, caseStudies: 50 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
