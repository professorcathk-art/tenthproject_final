import { deleteCourse, getCaseStudyBySlug, replaceCaseStudies, seedPlatformData } from "@/lib/db/platform-store";
import { CASE_SEED_MARKER, getSeedCaseStudies } from "@/lib/seed/case-studies";
import { getSeedLessons, LEGACY_AGENT_COURSE_ID, SEED_COURSES } from "@/lib/seed/platform-seed";

let coursesReady = false;
let casesReady = false;

export async function ensurePlatformSeeded() {
  try {
    if (!coursesReady) {
      await seedPlatformData(SEED_COURSES, getSeedLessons());
      await deleteCourse(LEGACY_AGENT_COURSE_ID).catch(() => undefined);
      coursesReady = true;
    }

    if (!casesReady) {
      const sample = await getCaseStudyBySlug("calai");
      if (!sample?.breakdown_md.includes(CASE_SEED_MARKER)) {
        await replaceCaseStudies(getSeedCaseStudies());
      }
      casesReady = true;
    }
  } catch (e) {
    console.error("Platform seed error:", e);
  }
}
