import type { MetadataRoute } from "next";
import { getCaseStudyCards, getCourses } from "@/lib/db/platform-store";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/courses",
    "/enterprise",
    "/inspiration",
    "/about",
    "/privacy",
    "/terms",
    "/login",
    "/signup",
  ].map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/courses" || path === "/enterprise" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/courses" || path === "/enterprise" ? 0.9 : 0.6,
  }));

  let extra: MetadataRoute.Sitemap = [];
  try {
    const [courses, cases] = await Promise.all([getCourses(true), getCaseStudyCards(true)]);
    extra = [
      ...courses.map((course) => ({
        url: `${SITE_URL}/courses/${course.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...cases.map((study) => ({
        url: `${SITE_URL}/inspiration/${study.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    extra = [];
  }

  return [...staticRoutes, ...extra];
}
