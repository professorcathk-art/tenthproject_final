import { getCaseStudies, seedPlatformData } from "@/lib/db/platform-store";
import { SEED_COURSES, getSeedLessons, getSeedCaseStudies } from "@/lib/seed/platform-seed";

let seeded = false;

export async function ensurePlatformSeeded() {
  if (seeded) return;
  try {
    const existing = await getCaseStudies(undefined, false);
    if (existing.length < 50) {
      await seedPlatformData(SEED_COURSES, getSeedLessons(), getSeedCaseStudies());
    }
    seeded = true;
  } catch (e) {
    console.error("Platform seed error:", e);
  }
}
