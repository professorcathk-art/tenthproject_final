import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const GROUP_URL = "https://chat.whatsapp.com/Eoc2fSS90f6GvzQG7eZPun";

export const metadata: Metadata = pageMetadata({
  title: "21天造出AI工具站分享會 | Vibe Coding x Tenth Project",
  description:
    "免費線上說明會｜由前投行聯席董事 Chris Lau 主講，系統化拆解無需程式背景的Vibe Coding實作方法，從0建立海外AI工具站",
  path: "/webinar",
});

const why = [
  {
    icon: "🌍",
    title: "海外市場空間可觀",
    body: "海外用戶付費習慣成熟，市場規模遠超本地，一個好工具可服務全球用戶。",
  },
  {
    icon: "🛠️",
    title: "工具站模式清晰",
    body: "工具站商業模式直觀，投入產出比高，可以從一個功能開始，快速驗證市場。",
  },
  {
    icon: "📉",
    title: "技術門檻大幅降低",
    body: "AI可自動化70–80%的Coding開發工作，即使沒有程式背景，也能做出真實產品。",
  },
];

const cases = [
  {
    revenue: "月收6位數美元",
    name: "💬 StealthWriter",
    body: "AI文案改寫工具，幫助用戶繞過AI內容檢測，成為一門可持續的SaaS生意。",
  },
  {
    revenue: "日活過萬",
    name: "🖼️ ImagePrompt.org",
    body: "AI圖像提示生成器，低技術門檻，高需求，透過廣告與訂閱實現商業化。",
  },
  {
    revenue: "月入$10K+ USD",
    name: "👨‍💻 個人開發者",
    body: "多位個人開發者以簡單工具站達成穩定被動收入，形成清晰可複製的商業模式。",
  },
];

const lessons = [
  {
    title: "👉 無需程式背景的實作方法（Vibe Coding）",
    body: "零基礎也能動手做，學會用AI工具自動生成代碼，打造自己的第一個功能性產品。",
  },
  {
    title: "👉 從0建立海外AI工具站的步驟",
    body: "完整路線圖：選題→開發→上線→推廣→變現。21天內造出第一個可對外的AI工具站。",
  },
  {
    title: "👉 打造清晰商業模式與可持續被動收入 💰",
    body: "Vibe Coding如何從興趣轉化為真實收入？廣告、訂閱、SaaS——哪種模式適合你？",
  },
];

function JoinLink({ children, className }: { children: string; className?: string }) {
  return (
    <a href={GROUP_URL} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function WebinarPage() {
  return (
    <article className="pb-20">
      <section className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
        <p className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800">
          📣 免費線上說明會 · 名額有限
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl">
          <span className="text-emerald-700">21天</span>造出
          <br />
          AI工具站分享會
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          想利用AI創立互聯網事業？不如試下用AI自動寫code做出你的<strong className="font-semibold whitespace-nowrap text-slate-900">第一個產品</strong>！
          <br />
          Vibe Coding究竟能做到什麼程度？AI Coding 又能如何盈利賺錢？
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <JoinLink className={cn(buttonVariants({ size: "lg" }), "min-w-44")}>加入通知群組</JoinLink>
          <Link href="#what-you-learn" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "min-w-44")}>
            了解更多
          </Link>
        </div>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <li>線上直播</li>
          <li>名額有限</li>
          <li>出席送入門手冊</li>
          <li>完全免費</li>
        </ul>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">為何現在啟動？</p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          AI黃金窗口，
          <br />
          現在就是最佳時機
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
          海外市場付費習慣成熟，工具站模式清晰，投入產出比高。現在入場，就是佔據先機。
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {why.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-2xl" aria-hidden="true">
                {item.icon}
              </p>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6">
        <div className="rounded-3xl bg-slate-50 px-6 py-10 sm:px-10">
          <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">🔥 真實案例分享</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            個人開發者的
            <br />
            真實成果
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
            這些不是大公司，而是一個人或幾個人打造的簡單工具站，卻創造了驚人的被動收入。
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cases.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-2xl font-semibold tracking-tight text-emerald-700">{item.revenue}</p>
                <h3 className="mt-2 font-semibold text-slate-950">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="what-you-learn" className="mx-auto mt-20 max-w-3xl scroll-mt-24 px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">你將會學到什麼？</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          系統化拆解
          <br />
          Vibe Coding全流程
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600">由前投行聯席董事 Chris Lau 主講，一步一步帶你從零開始。</p>
        <ul className="mt-8 space-y-3">
          {lessons.map((item) => (
            <li key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h3 className="text-lg font-semibold text-emerald-800">🎁 出席特別獎勵</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            凡出席說明會的參加者，將獲贈《Vibe Coding入門手冊》電子版，名額有限，先到先得！
          </p>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">主講嘉賓</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">認識我們的講者</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-emerald-700">主講嘉賓 · Tenth Project 創辦人</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">Chris Lau</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              前投行聯席董事，現為AI工具站創業者及教育者。以親身經歷系統化拆解AI創業路徑，帶領學員從零開始建立可盈利的AI工具站。
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
              <li className="rounded-full border border-slate-200 px-2.5 py-1">前投行聯席董事</li>
              <li className="rounded-full border border-slate-200 px-2.5 py-1">AI創業</li>
              <li className="rounded-full border border-slate-200 px-2.5 py-1">Vibe Coding</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-emerald-700">特別嘉賓 · 資深程序教育專家</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">朱Sir</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              華南理工計算機科學學士，前阿里巴巴集團技術專家（2011–2015）。擁有10年一線程序員及7年編程教育經驗，2018年全面轉入教育領域，現為騰訊mini鵝營地導師。
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
              <li className="rounded-full border border-slate-200 px-2.5 py-1">前阿里技術專家</li>
              <li className="rounded-full border border-slate-200 px-2.5 py-1">10年開發經驗</li>
              <li className="rounded-full border border-slate-200 px-2.5 py-1">7年編程教育</li>
              <li className="rounded-full border border-slate-200 px-2.5 py-1">騰訊mini鵝營地</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">立即登記</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">免費參加｜名額有限</h2>
        <p className="mt-4 leading-relaxed text-slate-600">
          立即加入我們的WhatsApp通知群組，鎖定席位，第一時間獲得說明會詳情與報名連結。🚀
        </p>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-left">
          <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">🎟️ 完全免費</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950">加入通知群組</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">透過WhatsApp群組取得說明會最新資訊、報名連結及出席專屬手冊。</p>
          <JoinLink className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}>立即加入通知群組</JoinLink>
          <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">按下按鈕後，將跳轉至WhatsApp加入群組。完全免費，無需信用卡。</p>
        </div>
        <p className="mt-10 text-xs text-slate-400">© 2026 Tenth Project · 《21天造出AI工具站分享會》· 免費線上活動</p>
      </section>
    </article>
  );
}
