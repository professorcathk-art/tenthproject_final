import type { Metadata } from "next";
import { CaseStudyGrid } from "@/components/inspiration/case-study-grid";
import { getCaseStudyCards } from "@/lib/db/platform-store";
import { Lightbulb } from "lucide-react";
import { getDict } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return pageMetadata({
    title: dict.inspiration.title,
    description: dict.inspiration.subtitle,
    path: "/inspiration",
    keywords: ["創業靈感庫", "AI SaaS", "案例研究"],
  });
}

export default async function InspirationPage() {
  const [studies, dict] = await Promise.all([getCaseStudyCards(), getDict()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-sm font-medium text-slate-700 mb-4">
          <Lightbulb className="h-4 w-4" /> {dict.inspiration.badge}
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-white">
          {dict.inspiration.title}
        </h1>
        <p className="text-slate-500 mt-3 max-w-2xl leading-relaxed">{dict.inspiration.subtitle}</p>
      </div>
      <CaseStudyGrid studies={studies} />
    </div>
  );
}
