import {
  countPublishedCaseStudies,
  deleteCourse,
  getCaseStudyBySlug,
  getCourseBySlug,
  replaceCaseStudies,
  seedPlatformData,
  upsertCaseStudy,
} from "@/lib/db/platform-store";
import { CASE_SEED_MARKER, getSeedCaseStudies } from "@/lib/seed/case-studies";
import { FLAGSHIP_SLUG, getSeedLessons, LEGACY_AGENT_COURSE_ID, SEED_COURSES } from "@/lib/seed/platform-seed";

let coursesReady = false;
let casesReady = false;

export async function ensureCoursesSeeded() {
  if (coursesReady) return;
  try {
    const existing = await getCourseBySlug(FLAGSHIP_SLUG);
    if (!existing) {
      await seedPlatformData(SEED_COURSES, getSeedLessons());
    }
    await deleteCourse(LEGACY_AGENT_COURSE_ID).catch(() => undefined);
    coursesReady = true;
  } catch (e) {
    console.error("Course seed error:", e);
  }
}

async function upsertMissingSeedCases() {
  for (const seed of getSeedCaseStudies()) {
    const existing = await getCaseStudyBySlug(seed.slug);
    if (!existing) await upsertCaseStudy(seed);
  }
}

export async function ensureCasesSeeded() {
  if (casesReady) return;
  try {
    const count = await countPublishedCaseStudies();
    if (count < 4) {
      await replaceCaseStudies(getSeedCaseStudies());
    } else {
      await upsertMissingSeedCases();
    }
    casesReady = true;
  } catch (e) {
    console.error("Case seed error:", e);
  }
}

export async function ensurePlatformSeeded(options?: { force?: boolean }) {
  try {
    if (options?.force) {
      coursesReady = false;
      casesReady = false;
    }

    await ensureCoursesSeeded();

    if (!casesReady) {
      if (options?.force) {
        const sample = await getCaseStudyBySlug("calai");
        if (!sample?.breakdown_md.includes(CASE_SEED_MARKER)) {
          await replaceCaseStudies(getSeedCaseStudies());
        }
        casesReady = true;
      } else {
        await ensureCasesSeeded();
      }
    }
  } catch (e) {
    console.error("Platform seed error:", e);
  }
}
