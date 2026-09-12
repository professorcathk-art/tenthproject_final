import { CaseStudyGrid } from "@/components/inspiration/case-study-grid";
import { getCaseStudyCards } from "@/lib/db/platform-store";
import { Lightbulb } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export default async function VaultPage() {
  const [studies, dict] = await Promise.all([getCaseStudyCards(), getDict()]);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-800">
          <Lightbulb className="h-4 w-4" /> {dict.portal.vault}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.portal.vault}</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{dict.inspiration.subtitle}</p>
      </div>
      <CaseStudyGrid basePath="/vault" studies={studies} />
    </div>
  );
}
