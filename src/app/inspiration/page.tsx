import { MarketingShell } from "@/components/layout/app-shell";
import { CaseStudyGrid } from "@/components/inspiration/case-study-grid";
import { getCaseStudies } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { Lightbulb } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export default async function InspirationPage() {
  await ensurePlatformSeeded();
  const studies = await getCaseStudies();
  const dict = await getDict();

  return (
    <MarketingShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800 mb-4">
            <Lightbulb className="h-4 w-4" /> {dict.inspiration.badge}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {studies.length}+ {dict.inspiration.title}
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl leading-relaxed">{dict.inspiration.subtitle}</p>
        </div>
        <CaseStudyGrid studies={studies} />
      </div>
    </MarketingShell>
  );
}
