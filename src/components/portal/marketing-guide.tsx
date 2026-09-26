export function MarketingGuide() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">SaaS 產品零成本獲客與增長指南</h1>
      <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        產品上線只是開始，掌握以下實戰行銷矩陣，精準獲取你的第一批付費用戶。
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">1. 社群媒體與內容佈局 (Social Media & Content Strategy)</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>建立品牌手冊 (Brand Book)</strong>：讓 Gemini 根據你的產品特色，定義出品牌價值主張 (Value Proposition)、市場定位與核心人設。
          </li>
          <li>
            <strong>制定內容矩陣</strong>：規劃「泛流量貼文（引發共鳴、搞笑、痛點）」與「精準流量貼文（乾貨、教學、工具對比）」。
          </li>
          <li>
            <strong>自動化圖文生成</strong>：請 Gemini 批量生成 30 天的貼文主題與腳本，接著使用 Nano Banana 或 Canva 快速產出高質感的 IG / 小紅書輪播圖 (Carousel) 或單頁貼文。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">2. 短影音真實演示 (Film Real Demos)</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>痛點直擊</strong>：不要只發精美的宣傳圖。錄製真實操作產品的螢幕畫面 (Screen Recording) 或手機錄影，展示你的工具如何「在 10 秒內解決一個具體問題」。
          </li>
          <li>
            <strong>分發平台</strong>：發布至 X (Twitter), Reddit 相關子板塊, TikTok, IG Reels。真誠地分享你的開發過程 (Build in Public)，往往能獲得最高互動。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">3. Lead Magnet (誘餌) 與自動化私訊</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>設計誘餌</strong>：整理一份高價值的免費資源（如：2024 AI 工具白皮書、50 個萬能 Prompt 模板）。
          </li>
          <li>
            <strong>社群互動獲客</strong>：在 IG 或小紅書發佈貼文：「留言『我要』即可免費獲取」。
          </li>
          <li>
            <strong>自動化發送</strong>：使用 ManyChat 等自動化回覆工具，只要用戶留言，系統就自動發送包含你 SaaS 註冊連結與誘餌檔案的 DM，輕鬆收集高潛在名單。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">4. B2B 專屬：AI Agent 自動化開發客戶</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>如果你的 SaaS 偏向 B2B，可利用 AI Agent (如 OpenClaw 或 Phantombuster) 自動在 LinkedIn 或指定網站抓取目標企業決策者的聯絡方式。</li>
          <li>使用 AI 撰寫高度客製化的 Cold Email 進行陌生開發，提供免費試用期以促成通話。</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">5. 笨功夫：一對一私訊與論壇種草 (DMs & Forum Seeding)</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>獲取前 50 名用戶</strong>：親自在社群平台搜尋相關痛點的關鍵字，主動 DM 潛在用戶。與他們對話、了解需求，並邀請他們免費試用。
          </li>
          <li>
            <strong>論壇種草</strong>：在 V2EX, PTT, Dcard, 連登 (LIHKG) 等論壇，以「分享解決方案」而非「硬推銷」的角度撰寫經驗文，自然帶入你的 SaaS 產品。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">6. 廣告放大器 (Ads Amplification)</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>何時開始投廣告？</strong> 當你透過上述免費渠道獲得了 10-20 個真實活躍用戶，且確認產品能真正留住人時，再開啟付費廣告。
          </li>
          <li>
            <strong>測試策略</strong>：初期每天投入 $20 - $50 美元，測試不同的廣告素材與受眾，找到 ROI 為正的渠道後再加碼放大。
          </li>
        </ul>
      </section>
    </article>
  );
}
