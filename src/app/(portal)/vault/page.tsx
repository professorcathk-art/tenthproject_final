import { CaseStudyGrid } from "@/components/inspiration/case-study-grid";
import { getCaseMarkStateForUser, getCaseStudyCards } from "@/lib/db/platform-store";
import { ensureCasesSeeded } from "@/lib/seed/init";
import { Lightbulb } from "lucide-react";
import { getDict } from "@/lib/i18n/server";
import { getSession } from "@/lib/auth/session";
import type { CaseMarkStatus } from "@/types/platform";

export default async function VaultPage() {
  await ensureCasesSeeded();
  const { user } = await getSession();
  const emptyState = { marks: {} as Record<string, CaseMarkStatus>, reads: [] as string[] };
  const [studies, dict, markState] = await Promise.all([
    getCaseStudyCards(),
    getDict(),
    user ? getCaseMarkStateForUser(user.id) : Promise.resolve(emptyState),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-800">
          <Lightbulb className="h-4 w-4" /> {dict.portal.vault}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.portal.vault}</h1>
      </div>
      <CaseStudyGrid
        basePath="/vault"
        studies={studies}
        initialMarks={markState.marks}
        initialReads={markState.reads}
        personal
      />
    </div>
  );
}
