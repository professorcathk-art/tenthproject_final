import { deleteCourse, getCaseStudies, replaceCaseStudies, seedPlatformData } from "@/lib/db/platform-store";
import {
  CANONICAL_CASE_SLUGS,
  getSeedCaseStudies,
  getSeedLessons,
  LEGACY_AGENT_COURSE_ID,
  SEED_COURSES,
} from "@/lib/seed/platform-seed";

let seeded = false;

export async function ensurePlatformSeeded() {
  try {
    const existing = seeded ? await getCaseStudies(undefined, false) : [];
    const hasCanonical = CANONICAL_CASE_SLUGS.every((slug) => existing.some((c) => c.slug === slug));
    if (seeded && hasCanonical) return;

    await seedPlatformData(SEED_COURSES, getSeedLessons());
    await deleteCourse(LEGACY_AGENT_COURSE_ID).catch(() => undefined);

    const latest = await getCaseStudies(undefined, false);
    const ready = CANONICAL_CASE_SLUGS.every((slug) => latest.some((c) => c.slug === slug));
    if (!ready) {
      await replaceCaseStudies(getSeedCaseStudies());
    }

    seeded = true;
  } catch (e) {
    console.error("Platform seed error:", e);
  }
}
