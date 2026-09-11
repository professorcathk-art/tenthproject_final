import { MarketingShell } from "@/components/layout/app-shell";
import { getDict, getLocale } from "@/lib/i18n/server";

export default async function AboutPage() {
  const dict = await getDict();
  const locale = await getLocale();
  const zh = locale === "zh";

  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-6 text-slate-700 leading-relaxed [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-slate-900 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        <p className="text-sm text-slate-500">{dict.nav.about}</p>
        <h1 className="text-3xl font-bold tracking-tight mt-2">
          {zh ? "關於 Tenth Project" : "About Tenth Project"}
        </h1>
        {zh ? (
          <>
            <p>
              Tenth Project 是給「想用 Cursor、Lovable、Claude、ChatGPT 做出自己產品，但不想在混亂中開發」的人而建的平台。
              我們相信：沒有工程背景，也可以把產品做完——前提是每一步都清楚、可測試、可複製。
            </p>
            <h2>我們做什麼</h2>
            <ul>
              <li>學院：系統化學習 Vibe Coding 與 AI Agent，完成課程可取得可驗證證書。</li>
              <li>專案中心：把一句想法變成路線圖、UAT 清單與可貼到 Cursor 的主提示詞。</li>
              <li>靈感庫：真實案例拆解，讓你看見別人如何從 0 到上線。</li>
              <li>企業方案：協助團隊導入 AI 工作流與客製 Agent。</li>
            </ul>
            <p>總部概念立足香港，服務華語與國際創作者。如需合作，請前往企業方案頁面。</p>
          </>
        ) : (
          <>
            <p>
              Tenth Project is for people who want to ship with Cursor, Lovable, Claude, and ChatGPT — without losing the plot.
              You do not need an engineering background. You do need a clear next step, a testable checklist, and a prompt you can actually paste.
            </p>
            <h2>What we offer</h2>
            <ul>
              <li>Academy: structured vibe coding and AI agent courses, with verifiable certificates.</li>
              <li>Project Hub: turn one sentence into a roadmap, UAT list, and a Cursor-ready master prompt.</li>
              <li>Inspiration Vault: real builds, unpacked.</li>
              <li>Enterprise: help teams adopt AI workflows and custom agents.</li>
            </ul>
            <p>Based in Hong Kong, serving Chinese- and English-speaking builders. For partnerships, visit Enterprise.</p>
          </>
        )}
      </article>
    </MarketingShell>
  );
}
