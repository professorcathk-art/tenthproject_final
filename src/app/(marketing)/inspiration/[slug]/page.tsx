import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getCaseStudyBySlug, getCaseStudyCards } from "@/lib/db/platform-store";
import { ensureCasesSeeded } from "@/lib/seed/init";
import { getDict, getLocale } from "@/lib/i18n/server";
import { caseCategories } from "@/types/platform";
import { localizedCaseText } from "@/lib/inspiration/locale-text";
import { CaseArticle } from "@/components/inspiration/case-article";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return {};
  return pageMetadata({
    title: study.title,
    description: study.summary,
    path: `/inspiration/${study.slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  await ensureCasesSeeded();
  const { slug } = await params;
  const [study, studies, dict, locale] = await Promise.all([
    getCaseStudyBySlug(slug),
    getCaseStudyCards(),
    getDict(),
    getLocale(),
  ]);
  if (!study) notFound();

  const related = studies.filter((item) => item.slug !== study.slug).slice(0, 3);
  const website = study.website_url;
  const highlights = study.highlights ?? [];

  return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/inspiration" className="mb-6 inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="mr-1 h-4 w-4" /> {dict.inspiration.back}
        </Link>
        <div className="mb-3 flex flex-wrap gap-2">
          {caseCategories(study).map((cat) => (
            <Badge key={cat}>{dict.inspiration.cats[cat as keyof typeof dict.inspiration.cats] ?? cat}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">{study.title}</h1>
        <p className="mt-3 mb-5 leading-relaxed text-slate-600">{localizedCaseText(study.summary, locale)}</p>
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
          >
            {dict.inspiration.visitSite}
            <ArrowUpRight className="h-4 w-4" />
            <span className="font-normal text-slate-500">{website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
          </a>
        ) : null}

        {highlights.length > 0 ? (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {highlights.map((item) => (
              <div key={`${item.zh}-${item.value}`} className="rounded-2xl glass-panel px-3 py-3">
                <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                  {locale === "en" ? item.en : item.zh}
                </p>
                <p className="mt-1 text-sm font-semibold tracking-tight text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>
        ) : null}

        <article className="rounded-3xl glass-panel px-5 py-6 sm:px-8 sm:py-8">
          <CaseArticle markdown={localizedCaseText(study.breakdown_md, locale)} />
        </article>

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-xl font-semibold tracking-tight">{dict.inspiration.related}</h2>
            <p className="mt-1 mb-5 text-sm text-slate-500">{dict.inspiration.relatedHint}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} href={`/inspiration/${item.slug}`} prefetch className="rounded-2xl glass-panel glow-card p-4">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {caseCategories(item).slice(0, 2).map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-[11px]">
                        {dict.inspiration.cats[cat as keyof typeof dict.inspiration.cats] ?? cat}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {localizedCaseText(item.summary, locale)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
  );
}
