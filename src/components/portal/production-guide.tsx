const prompt = `你現在是 Senior Next.js / React Native 開發者。請閱讀以下 \`Master Prompt\` 的產品需求，先幫我搭建基礎的專案路由 (Routes) 與頁面骨架 (UI Skeleton)。請確保使用 Tailwind CSS 與 shadcn/ui，並保持代碼模組化。在開始寫代碼前，請先列出你要創建的檔案清單。`;

export function ProductionGuide() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">SaaS 產品從 0 到 1 敏捷開發指南 (Web & Mobile)</h1>
      <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        跟隨此 14 天標準化開發流程 (SOP)，利用 AI 將你的點子轉化為可穩定收款的正式產品。
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 1-2: 需求規劃與架構設計 (Planning)</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>與 AI 討論需求</strong>：使用 ChatGPT / Claude 梳理你的商業邏輯。確定你的目標受眾、核心功能 (Must-have) 與最小可行性產品 (MVP) 範圍。
          </li>
          <li>
            <strong>生成 Cursor 專屬指令</strong>：將討論結果丟入 Tenth Project 專案規劃工具，生成包含檔案結構的 <code>Master Prompt</code>，準備交給 Cursor 進行開發。
          </li>
          <li>
            <strong>Sample Prompt (餵給 Cursor)</strong>:
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm leading-relaxed text-slate-100">
              <code>{prompt}</code>
            </pre>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 3-5: 核心功能開發 (Core Functions)</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          逐一擊破：依照 Master Prompt 的 Sprint 計劃，讓 Cursor 專注完成核心業務邏輯（例如：AI 內容生成、數據分析或行程規劃）。每次只要求 Cursor 實作一個小模塊，確保運行無誤後再進行下一步。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 6-7: 用戶系統與支付串接 (Auth & Monetization)</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>登入系統 (Supabase)</strong>：實作 Email/密碼註冊，以及 Google 快速登入。確保未登入用戶無法訪問核心功能路由。
          </li>
          <li>
            <strong>金流串接 (Stripe)</strong>：設定 Stripe Checkout。切記做好 Webhook 接收機制，當用戶付款成功後，自動更新資料庫中的會員權限 (Tier/Credits)。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 8-9: UI/UX 打磨與優化 (UI Polish)</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>AI 視覺診斷</strong>：將你目前開發好的網頁/App 截圖，上傳給 Gemini 或 ChatGPT (GPT-4o) 進行視覺分析。
          </li>
          <li>
            要求 AI 給出修改建議：請 AI 針對排版、留白、顏色與組件層級給出具體的 Tailwind 修改建議，然後將這些 Prompt 直接貼回給 Cursor 執行。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 10-11: 基礎設施與合規完善 (Infrastructure)</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>必備靜態頁面</strong>：建立 隱私權政策 (Privacy Policy)、服務條款 (Terms of Service)、聯絡我們 (Contact) 與 常見問題 (Support/FAQ)。
          </li>
          <li>
            <strong>多語系與 SEO</strong>：配置 i18n 多語言選項。設置 sitemap.xml、robots.txt 與針對 AI 搜尋引擎的 llms.txt。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Day 12-14: UAT 驗收與正式上線 (UAT & Launch)</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>極端測試 (UAT)</strong>：自己在不同設備 (Mobile/Desktop) 上操作完整流程。測試邊界情況（如：沒輸入資料按送出、斷網重連、刷卡失敗的提示）。
          </li>
          <li>
            <strong>部署與發布</strong>：將前端部署至 Vercel，確認自訂網域 (Domain) 綁定與 SSL 憑證生效，正式迎接第一批真實用戶。
          </li>
        </ul>
      </section>
    </article>
  );
}
