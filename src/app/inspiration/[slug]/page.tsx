import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getCaseStudyBySlug } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getDict } from "@/lib/i18n/server";
import { caseCategories } from "@/types/platform";

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  await ensurePlatformSeeded();
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) notFound();
  const dict = await getDict();

  return (
    <MarketingShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/inspiration" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> {dict.inspiration.back}
        </Link>
        <div className="flex flex-wrap gap-2 mb-3">
          {caseCategories(study).map((cat) => (
            <Badge key={cat}>{dict.inspiration.cats[cat as keyof typeof dict.inspiration.cats] ?? cat}</Badge>
          ))}
        </div>
        <h1 className="text-2xl font-bold mb-2 tracking-tight">{study.title}</h1>
        <p className="text-slate-600 mb-4 leading-relaxed">{study.summary}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {study.tech_stack.map((t) => (
            <Badge key={t} variant="outline">{t}</Badge>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6 prose prose-slate prose-sm max-w-none">
            {study.breakdown_md.split("\n").map((line, i) => {
              if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
              if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold mt-4 mb-2">{line.slice(3)}</h2>;
              if (line.startsWith("```")) return null;
              if (line.startsWith("- ") || line.startsWith("1.")) return <li key={i} className="ml-4">{line.replace(/^[-\d.]+\s*/, "")}</li>;
              if (line.trim()) return <p key={i} className="mb-2 text-slate-600">{line}</p>;
              return null;
            })}
          </CardContent>
        </Card>
      </div>
    </MarketingShell>
  );
}
