import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getCaseMarkStateForUser, getCaseStudyBySlug, getCaseStudyCards } from "@/lib/db/platform-store";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getSession } from "@/lib/auth/session";
import { caseCategories, type CaseMarkStatus } from "@/types/platform";
import { localizedCaseText } from "@/lib/inspiration/locale-text";
import { CaseArticle } from "@/components/inspiration/case-article";
import { CaseClonePrompt, CaseStudyMeta } from "@/components/inspiration/case-study-extras";
import { CaseMarkBar } from "@/components/inspiration/case-mark-bar";

export default async function VaultCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { user } = await getSession();
  const emptyState = { marks: {} as Record<string, CaseMarkStatus>, reads: [] as string[] };
  const [study, studies, dict, locale, markState] = await Promise.all([
    getCaseStudyBySlug(slug),
    getCaseStudyCards(),
    getDict(),
    getLocale(),
    user ? getCaseMarkStateForUser(user.id) : Promise.resolve(emptyState),
  ]);
  if (!study) notFound();
  const article = localizedCaseText(study.breakdown_md, locale);
  const related = studies.filter((item) => item.slug !== study.slug).slice(0, 3);
  const marks = markState.marks;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/vault" className="mb-6 inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="mr-1 h-4 w-4" /> {dict.portal.vault}
      </Link>
      <div className="mb-3 flex flex-wrap gap-2">
        {caseCategories(study).map((cat) => (
          <Badge key={cat}>{dict.inspiration.cats[cat as keyof typeof dict.inspiration.cats] ?? cat}</Badge>
        ))}
        {marks[study.slug] === "saved" ? <Badge variant="secondary">{dict.inspiration.saved}</Badge> : null}
        {marks[study.slug] === "passed" ? <Badge variant="secondary">{dict.inspiration.markedPassed}</Badge> : null}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">{study.title}</h1>
      <p className="mt-3 mb-5 leading-relaxed text-slate-600">{localizedCaseText(study.summary, locale)}</p>
      {study.website_url ? (
        <a
          href={study.website_url}
          target="_blank"
          rel="noreferrer"
          className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
        >
          {dict.inspiration.visitSite}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      ) : null}
      <CaseStudyMeta study={study} />
      {(study.highlights ?? []).length > 0 ? (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(study.highlights ?? []).map((item) => (
            <div key={`${item.zh}-${item.value}`} className="rounded-2xl glass-panel px-3 py-3">
              <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                {locale === "en" ? item.en : item.zh}
              </p>
              <p className="mt-1 text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}
      <article className="rounded-3xl glass-panel px-5 py-6 sm:px-8">
        <CaseArticle markdown={article} />
      </article>
      <CaseMarkBar
        slug={study.slug}
        initialStatus={marks[study.slug] ?? null}
        initialRead={markState.reads.includes(study.slug)}
      />
      <CaseClonePrompt study={study} />
      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">{dict.inspiration.related}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} href={`/vault/${item.slug}`} className="rounded-2xl glass-panel p-4">
                {marks[item.slug] === "saved" ? (
                  <p className="mb-2 text-xs font-semibold text-rose-600">{dict.inspiration.saved}</p>
                ) : marks[item.slug] === "passed" ? (
                  <p className="mb-2 text-xs font-semibold text-slate-500">{dict.inspiration.markedPassed}</p>
                ) : null}
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{localizedCaseText(item.summary, locale)}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
