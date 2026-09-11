import { MarketingShell } from "@/components/layout/app-shell";
import { getDict, getLocale } from "@/lib/i18n/server";

export default async function AboutPage() {
  const dict = await getDict();
  const locale = await getLocale();
  const zh = locale === "zh";

  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-6 text-slate-700 leading-relaxed [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-slate-900 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        <p className="text-sm text-slate-500">{dict.nav.about}</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-2">
          {zh ? "關於 Tenth Project" : "About Tenth Project"}
        </h1>
        {zh ? (
          <>
            <p>
              Tenth Project 是企業 AI 顧問與 Vibe Coding 學院。我們把大廠工程能力與投行轉型方法，做成可上線的 Agent、可驗證的課程，以及可複製的產品開發節奏。
            </p>
            <h2>創辦團隊</h2>
            <p>
              <strong>Felix Zhu（技術負責人）</strong> — {dict.founders.felix}
            </p>
            <p>
              <strong>Chris Liu（商業需求與轉型負責人）</strong> — {dict.founders.chris}
            </p>
            <h2>我們做什麼</h2>
            <ul>
              <li>學院：Vibe Coding 與 AI Agent 從零到高手，含測驗與可公開驗證證書。</li>
              <li>企業方案：客製 Agent、RPA、轉型顧問與團隊工作坊。</li>
              <li>靈感庫：真實上線產品的架構與提示詞拆解。</li>
              <li>專案中心：路線圖、UAT 與 Cursor MCP 雙向同步。</li>
            </ul>
            <p>立足香港。合作請前往企業方案，或來信 chris.lau@tenthproject.com。</p>
          </>
        ) : (
          <>
            <p>
              Tenth Project is an enterprise AI consultancy and vibe-coding academy. We turn big-tech engineering and investment-banking transformation practice into agents that ship, courses that certify, and a build rhythm you can repeat.
            </p>
            <h2>Founders</h2>
            <p>
              <strong>Felix Zhu, Head of Technology</strong> — {dict.founders.felix}
            </p>
            <p>
              <strong>Chris Liu, Head of Business Requirements & Transformation</strong> — {dict.founders.chris}
            </p>
            <h2>What we offer</h2>
            <ul>
              <li>Academy: vibe coding and AI agents, with quizzes and a verifiable certificate.</li>
              <li>Enterprise: custom agents, RPA, advisory, and workshops.</li>
              <li>Inspiration Vault: architecture and prompts from shipped products.</li>
              <li>Project Hub: roadmaps, UAT, and Cursor MCP.</li>
            </ul>
            <p>Based in Hong Kong. For partnerships, visit Enterprise or write to chris.lau@tenthproject.com.</p>
          </>
        )}
      </article>
    </MarketingShell>
  );
}
