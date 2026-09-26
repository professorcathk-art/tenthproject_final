import { MarketingGuideEn } from "@/components/portal/marketing-guide-en";

export function MarketingGuide({ locale = "zh" }: { locale?: "zh" | "en" }) {
  if (locale === "en") return <MarketingGuideEn />;
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        SaaS 產品零成本獲客與增長指南 (Growth Playbook)
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        產品上線只是開始。丟掉「花錢投廣告」的舊思維，掌握 Y Combinator 與頂尖 Indie Hackers 的實戰行銷矩陣，精準且免費地獲取你的前 100 位付費用戶。
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">1. 公開造車 (Build in Public) - 獨立開發者的流量密碼</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          不要等產品完美才發佈，過程本身就是最好的行銷素材。人們喜歡看真實的創業故事，包括你的失敗與掙扎。
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 實戰 Step-by-Step：</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1：選擇陣地</strong>：註冊 X (Twitter) 或 LinkedIn。設定真實的頭像與 Bio（例：「正在用 Cursor + AI 打造下一個百萬營收 SaaS」）。
          </li>
          <li>
            <strong>Step 2：分享「未經修飾」的過程</strong>：不要發公關稿。分享你今天遇到什麼 Bug、Cursor 幫你寫了什麼神級代碼、或是第一筆 Stripe 入帳的截圖 (MRR 里程碑)。
          </li>
          <li>
            <strong>Step 3：與同行互動</strong>：在 X 上搜尋 <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">#BuildInPublic</code>，每天花 15 分鐘回覆其他開發者的推文，真誠的互動會為你帶來第一批高質量的早期測試者 (Early Adopters)。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">2. 工程即行銷 (Engineering as Marketing) - 開發者的降維打擊</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          這是 Starter Story 中最常見的成功招式：用 1-2 天開發一個極簡的「免費小工具」，利用它去截取 SEO 流量，再導流到你的付費主產品。
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 實戰 Step-by-Step：</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1：找出痛點關鍵字</strong>：如果你的主產品是「AI 旅遊規劃 SaaS」，去找出高搜尋量但低意圖的詞，例如「日本簽證計算機」或「行李打包清單生成器」。
          </li>
          <li>
            <strong>Step 2：極速開發微型工具 (Micro-tool)</strong>：用 Cursor Vibe Coding 在 2 小時內寫出一個單頁面的免費小工具，部署在你的主網域子目錄（如 <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">yourdomain.com/packing-list</code>）。
          </li>
          <li>
            <strong>Step 3：全畫面引流</strong>：在免費小工具的結果頁，放上醒目的 Banner：「想要更完整的 AI 自動排行程服務？試試我們的 Pro 版本 ➔」。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">3. 無限次發佈策略 (Launch Over & Over Again)</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          YC 創辦人 Paul Graham 說過：「不要只發佈一次。」產品的每一個重大更新，都是你重新登上舞台的機會。
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 實戰 Step-by-Step：</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1：Product Hunt 打榜</strong>：準備一段 30 秒的操作影片、一張會動的 GIF Logo，以及一篇真誠的 Maker Comment（講述你為何做這個產品）。在太平洋時間凌晨 12:01 發佈，並在社群號召投票。
          </li>
          <li>
            <strong>Step 2：Hacker News (Show HN)</strong>：開發者聖地。標題必須加上 <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">Show HN: </code>，內文不要有任何行銷話術，直接貼網址並用極度 Nerd（技術派）的語氣解釋你的 Tech Stack 與解決了什麼技術痛點。
          </li>
          <li>
            <strong>Step 3：利基社群 (Reddit & Facebook 臉書社團)</strong>：尋找垂直領域的版塊（如 <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">r/Entrepreneur</code> 或特定的興趣社團）。<strong>不要直接丟連結</strong>，先發布一篇「我花了 14 天解決 XXX 痛點的經驗分享」超長乾貨文，最後才順帶一提你的工具。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">4. 做無法規模化的事 (Do Things That Don&apos;t Scale)</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          不要一開始就想著自動化獲客，你的前 50 個付費用戶必須靠「純手工」拿下。
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 實戰 Step-by-Step：</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1：關鍵字監聽</strong>：在 X, Reddit 搜尋「How to [你的產品解決的問題]」或「I hate [競品名稱]」。
          </li>
          <li>
            <strong>Step 2：客製化 Loom 影片 (DM 私訊)</strong>：看到潛在用戶抱怨痛點時，錄製一段 1 分鐘的 Loom 螢幕錄影：「嗨，我看到你在找 XXX 的解法，我剛好寫了一個工具，為你專屬示範一下...」。這種高客製化的私訊，轉換率高達 30% 以上。
          </li>
          <li>
            <strong>Step 3：白手套入駐 (White-glove Onboarding)</strong>：對早期的 B2B 客戶，主動提議：「我們通個 15 分鐘電話，我直接幫你把系統設定好。」
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">5. AI Lead Magnet (誘餌) 與自動化私訊矩陣</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">將你在 Tenth Project 學到的自動化思維應用到行銷上。</p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 實戰 Step-by-Step：</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1：設計高價值誘餌</strong>：用 AI 整理一份目標受眾極度渴望的資源（例：針對行銷人的「100 個爆款小紅書標題 Prompt」）。
          </li>
          <li>
            <strong>Step 2：發布誘餌短影音/圖文</strong>：在 IG Reels, TikTok, 或小紅書發布短片，結尾 Call to Action：「在留言區輸入『AI』，我把這份清單免費私訊給你。」
          </li>
          <li>
            <strong>Step 3：ManyChat 自動化</strong>：設定 ManyChat 關鍵字觸發，只要有人留言，系統自動回覆留言並發送 DM 私訊。私訊內含獲取資源的表單連結（收集 Email），並在感謝頁面直接 Upsell 你的 SaaS 產品。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">6. B2B 專屬：AI Agent 自動化陌生開發 (Cold Outreach)</h2>
        <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
          如果你的客單價較高（如企業級 AI 部署），Cold Email 是回報率最高的管道。
        </p>
        <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">💡 實戰 Step-by-Step：</h3>
        <ul className="mt-3 list-disc space-y-3 pl-5 leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1：精準名單抓取</strong>：使用 Apollo.io, Phantombuster 或自己寫的 OpenClaw AI Agent，從 LinkedIn 批量抓取目標企業決策者（CEO, CTO, Marketing Director）的 Email。
          </li>
          <li>
            <strong>Step 2：AI 撰寫客製化郵件</strong>：不要群發垃圾信！利用 AI Agent 分析對方的 LinkedIn 簡介或公司官網，生成高度個人化的第一段開場白（Icebreaker）。
          </li>
          <li>
            <strong>Step 3：提供「無可拒絕的提議 (Mafia Offer)」</strong>：「我用 AI 掃描了貴公司的業務流程，發現有一個地方可以每週節省 20 小時。我做了一個初步的 Prototype，下週二花 10 分鐘展示給您看可以嗎？」
          </li>
        </ul>
      </section>
    </article>
  );
}
