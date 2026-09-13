import Link from "next/link";

export function AuthSplitShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">
      <aside className="flex flex-col justify-between bg-slate-900 p-8 text-white lg:col-span-6 lg:p-12">
        <div>
          <Link href="/" className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">
            ✨ Tenth Project 免費會員專屬
          </Link>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight lg:text-4xl">開啟你的 AI 產品與 Vibe Coding 之旅</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 lg:text-base">
            無須寫程式背景。加入社群，體驗 AI Build Coach 如何幫你把想法快速落地方案。
          </p>
          <ul className="mt-10 space-y-6 text-sm leading-relaxed text-slate-200">
            <li>
              <p className="font-semibold text-white">⚡ 免費體驗 1 個 AI 專案規劃</p>
              <p className="mt-1 text-slate-300">輸入產品構想，自動生成 3 步階段路線圖、UAT 驗收清單與 Cursor 專屬 Master Prompt。</p>
            </li>
            <li>
              <p className="font-semibold text-white">💡 免費解鎖 50+ 靈感案例庫</p>
              <p className="mt-1 text-slate-300">瀏覽 CalAI、StealthWriter 等海外爆款產品的需求拆解與技術選型分析。</p>
            </li>
            <li>
              <p className="font-semibold text-white">🔑 體驗 Cursor MCP 自動化流程</p>
              <p className="mt-1 text-slate-300">生成專屬 API 密鑰，體驗 Cursor 本地端與 Tenth Project 專案中心雙向同步。</p>
            </li>
          </ul>
        </div>
        <blockquote className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm leading-relaxed text-slate-100">
            「結合大廠技術架構與投行轉型經驗，我們致力於幫助每一位創作者與企業把 AI 用到實處。」
          </p>
          <footer className="mt-3 text-xs text-slate-400">— Felix Zhu & Chris Lau (Tenth Project 創辦團隊)</footer>
        </blockquote>
      </aside>
      <section className="flex items-center justify-center bg-slate-50 p-6 dark:bg-slate-950 lg:col-span-6 lg:p-12">
        {children}
      </section>
    </div>
  );
}
