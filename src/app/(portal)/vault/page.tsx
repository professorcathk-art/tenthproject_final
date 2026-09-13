import { CaseStudyGrid } from "@/components/inspiration/case-study-grid";
import { getCaseMarksForUser, getCaseStudyCards } from "@/lib/db/platform-store";
import { ensureCasesSeeded } from "@/lib/seed/init";
import { Lightbulb } from "lucide-react";
import { getDict } from "@/lib/i18n/server";
import { getSession } from "@/lib/auth/session";
import type { CaseMarkStatus } from "@/types/platform";

export default async function VaultPage() {
  await ensureCasesSeeded();
  const { user } = await getSession();
  const [studies, dict, marks] = await Promise.all([
    getCaseStudyCards(),
    getDict(),
    user ? getCaseMarksForUser(user.id) : Promise.resolve({} as Record<string, CaseMarkStatus>),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-800">
          <Lightbulb className="h-4 w-4" /> {dict.portal.vault}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.portal.vault}</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{dict.inspiration.subtitle}</p>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{dict.inspiration.markHint}</p>
      </div>
      <CaseStudyGrid basePath="/vault" studies={studies} initialMarks={marks} personal />
    </div>
  );
}
