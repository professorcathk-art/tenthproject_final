import { ProductionGuideEn } from "@/components/portal/production-guide-en";
import { PromptBlock } from "@/components/portal/prompt-block";

const promptMvp = `我想要開發一個 [旅遊計劃行程 / 記帳 / AI 寫作] 的 WebApp。
目標受眾是 [喜歡自助旅行的年輕人]。我希望具備的最基礎核心功能有 3 個。
請以產品經理的角度，幫我梳理這個 MVP (最小可行性產品) 的核心功能清單、用戶使用流程 (User Flow)，並建議適合的技術棧 (Tech Stack)。`;

const promptMaster = `請根據我們剛剛確認的 MVP 功能清單與技術棧，幫我生成一份「Cursor Master Prompt」。
這份 Prompt 必須是純技術開發導向，包含：
1. 目標檔案結構 (Folder Structure)
2. 資料庫 Schema 設計
3. 分步開發任務 (Sprint Backlog)
注意：不要包含任何市場調查等非寫 Code 的任務，請完全專注於前端與後端實作指示。`;

const promptSupabase = `請幫我在此 Next.js 專案中整合 Supabase Auth。
1. 請建立一個登入/註冊頁面 (包含 Email 密碼登入 與 Google OAuth)。
2. 請提供我需要在 Supabase SQL Editor 中執行的 SQL 語法，用來建立 \`users\` 與 \`profiles\` 資料表，並包含 RLS (Row Level Security) 安全性設定，確保用戶只能讀取/修改自己的資料。`;

const promptStripe = `我需要串接 Stripe Checkout 進行 [一次性買斷 / 每月訂閱] 的收款。
1. 請幫我寫一個 API Route \`/api/stripe/create-checkout\` 負責產生付款連結。
2. 請幫我寫一個 Webhook API \`/api/webhooks/stripe\`，當接收到 \`checkout.session.completed\` 事件時，自動將該用戶在 Supabase 資料庫中的 \`is_premium\` 欄位更新為 true。`;

const promptUi = `你是一位世界頂級的 SaaS UI/UX 設計師。
我附上了目前網站的截圖以及它的 React / Tailwind 原始碼。
請指出目前設計中 3 個視覺缺陷（例如：留白不足、顏色層級不明確、排版混亂），並直接給出修改後的 Tailwind 完整代碼。請讓整體風格看起來像 Vercel 或 Linear 那樣具備現代科技感與玻璃擬物化 (Glassmorphism)。`;

export function ProductionGuide({ locale = "zh" }: { locale?: "zh" | "en" }) {
  if (locale === "en") return <ProductionGuideEn />;
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        SaaS 產品從 0 到 1 敏捷開發指南 (Web & Mobile)
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        拒絕無效開發！跟隨此 14 天標準化開發流程 (SOP)，利用 ChatGPT/Gemini 進行邏輯推演，並用 Cursor 完成高質量編程。
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 1-2: 商業需求規劃與架構設計 (Planning)</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          不要一開始就打開 Cursor 寫 Code！先使用通用的 AI 大模型 (ChatGPT-4o / Gemini 1.5 Pro) 進行頭腦風暴與需求梳理。
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 實踐步驟：</h3>
        <ol className="mt-3 list-decimal space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>將你的初步想法告訴 AI，請它幫你梳理商業邏輯與核心功能 (MVP)。</li>
          <li>確認功能清單後，請 AI 轉換成專門給 Cursor 閱讀的 Master Prompt。</li>
        </ol>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">📝 Sample Prompt 1 (餵給 ChatGPT / Gemini - 梳理需求)：</h3>
        <PromptBlock>{promptMvp}</PromptBlock>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">📝 Sample Prompt 2 (餵給 ChatGPT / Gemini - 生成 Master Prompt)：</h3>
        <PromptBlock>{promptMaster}</PromptBlock>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 3-5: 核心功能開發 (Core Functions)</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          帶著生成的 Master Prompt 進入 Cursor，開啟 Composer (Cmd+I) 進行開發。
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 實戰避坑指南：</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>不要一次要求太多：一次只請 Cursor 實作一個組件（例如：「先幫我刻出首頁的 Hero Section」），確認無誤後再進行下一個。</li>
          <li>隨時 Commit：每完成一個會動的功能，一定要在終端機 git commit，如果 AI 把代碼改壞了才能隨時還原。</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 6-7: 用戶系統與金流支付串接 (Auth & Monetization)</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          這是 SaaS 變現最核心的一環，我們強烈建議使用 Supabase (Auth + DB) 與 Stripe (金流)。
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">🔐 階段一：Supabase 身份驗證與資料庫</h3>
        <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">⚠️ 實戰避坑指南：</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>若要實作 Google 登入，必須先去 Google Cloud Console 申請 OAuth 憑證，並將 Client ID 填入 Supabase 後台。</li>
          <li>建立 Table 後，一定要設定 RLS (Row Level Security) 政策，否則你的資料庫會被任何人讀寫！(可以請 Cursor 幫你寫 RLS SQL)。</li>
        </ul>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">📝 Sample Prompt (餵給 Cursor - 串接 Supabase)：</h3>
        <PromptBlock>{promptSupabase}</PromptBlock>
        <h3 className="mt-8 font-semibold text-slate-950 dark:text-white">💳 階段二：Stripe 支付與 Webhook</h3>
        <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">⚠️ 實戰避坑指南：</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>開發時，務必在 Stripe 後台開啟 Test Mode (測試模式)。</li>
          <li>新增產品並複製 price_... 開頭的 Price ID 到你的 .env 中。</li>
          <li>Webhook 驗證：開發環境需使用 Stripe CLI 轉發請求到 localhost:3000 來測試，上線後記得將 Webhook Endpoint 換成正式網址。</li>
        </ul>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">📝 Sample Prompt (餵給 Cursor - 串接 Stripe)：</h3>
        <PromptBlock>{promptStripe}</PromptBlock>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 8-9: UI/UX 打磨與視覺優化 (UI Polish)</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          當功能都能動之後，你會發現介面可能有點「工程師美學」。這時可以利用 AI 的視覺辨識 (Vision) 能力來幫你美化。
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 實踐步驟：</h3>
        <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
          將你覺得難看的網頁畫面截圖 (Screenshot)，連同該頁面的原始碼，一起丟給 Gemini 1.5 Pro 或 ChatGPT (GPT-4o)。
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">📝 Sample Prompt (餵給具備視覺能力的 AI)：</h3>
        <PromptBlock>{promptUi}</PromptBlock>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 10-14: 基礎設施、SEO 與正式上線 (Launch)</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">行百里者半九十，上線前的最後一哩路至關重要。</p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 實踐步驟與建議：</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>合規頁面：請 ChatGPT 直接幫你草擬《隱私權政策 Privacy Policy》與《服務條款 Terms of Service》並放入專案中。</li>
          <li>SEO 與 GEO 設置：請 Cursor 幫你動態生成 sitemap.xml，並配置給 AI 爬蟲看的 llms.txt。</li>
          <li>
            極端 UAT 測試：
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>故意輸入錯誤的密碼看看有沒有紅字提示。</li>
              <li>在手機上點擊所有按鈕，確保沒有跑版或溢出。</li>
              <li>用測試信用卡 (4242...) 跑一次完整的付款到解鎖流程。</li>
            </ul>
          </li>
          <li>Vercel 部署：將代碼推送到 GitHub，連接 Vercel 自動部署。</li>
        </ul>
        <p className="mt-6 leading-relaxed text-slate-700 dark:text-slate-300">
          ⚠️ 終極檢查：部署後，務必到 Vercel 的 Environment Variables 替換成正式版的 Stripe Live Keys、Live Price ID，並更新 NEXT_PUBLIC_SITE_URL 為你的正式自訂網域！
        </p>
      </section>
    </article>
  );
}
