import Link from "next/link";
import { getLocale } from "@/lib/i18n/server";

export async function CaseConversionCta() {
  const en = (await getLocale()) === "en";

  return (
    <section className="mt-10 rounded-2xl bg-slate-50 px-5 py-6 dark:bg-slate-900/50 sm:px-8 sm:py-8">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
        {en ? "Ready to build your next breakout AI product?" : "準備好打造你的下一個爆款 AI 產品了嗎？"}
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-slate-600 dark:text-slate-300">
        {en
          ? "Whether you need an enterprise AI workflow, or you want to build a SaaS yourself, we can help you ship it."
          : "無論你是需要企業級 AI 工作流導入，還是想自己動手打造 SaaS 產品，我們都能幫你落地。"}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/enterprise"
          className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          {en ? "🏢 Book a free enterprise consult" : "🏢 企業預約免費諮詢"}
        </Link>
        <Link
          href="/courses"
          className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
        >
          {en ? "🚀 See the VIP lifetime community" : "🚀 了解 VIP 終身會員社群"}
        </Link>
      </div>
    </section>
  );
}
