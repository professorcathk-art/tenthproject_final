import { PlatformHeader } from "@/components/layout/platform-nav";
import { CaseStudyGrid } from "@/components/inspiration/case-study-grid";
import { getCaseStudies } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { Lightbulb } from "lucide-react";

export default async function InspirationPage() {
  await ensurePlatformSeeded();
  const studies = await getCaseStudies();

  return (
    <div className="min-h-screen bg-slate-50">
      <PlatformHeader />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800 mb-4">
            <Lightbulb className="h-4 w-4" /> Inspiration Vault
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{studies.length}+ Case Studies</h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Real-world vibe coding startups and AI agent solutions — with architecture breakdowns, tech stacks, and lessons learned.
          </p>
        </div>
        <CaseStudyGrid studies={studies} />
      </div>
    </div>
  );
}
