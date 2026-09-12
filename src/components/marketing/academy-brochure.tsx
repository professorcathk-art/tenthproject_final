import Link from "next/link";
import { FLAGSHIP_SLUG } from "@/lib/seed/platform-seed";
import { getDict } from "@/lib/i18n/server";
import { JoinNowButton } from "@/components/marketing/join-now-button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl glass-panel p-6 sm:p-8 mb-6">
      <h2 className="text-xl font-semibold tracking-[-0.02em] pb-3 mb-6 border-b border-slate-200/80">{title}</h2>
      {children}
    </section>
  );
}

function Subhead({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-slate-900 mt-8 mb-4 dark:text-slate-100">{children}</h3>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 mb-4 dark:bg-slate-900/40">{children}</div>;
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-l-2 border-slate-900 bg-slate-50 px-4 py-3 text-sm text-slate-600 leading-relaxed mt-4">
      {children}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/80">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-950 text-white">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white/70 dark:bg-slate-950/40">
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-200/70">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2.5 text-slate-700 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function AcademyBrochure() {
  const dict = await getDict();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-medium tracking-[0.16em] uppercase text-slate-400">Tenth Project Club</p>
        <h1 className="mt-3 text-[2rem] sm:text-4xl font-semibold tracking-[-0.035em] leading-[1.15] text-slate-950 dark:text-white">
          Tenth Project 社群會員福利
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-500">
          一個專為現代職場人、創業者與有遠見的專業人士設計的學習社群。掌握 AI 與 Vibe Coding，既能創立自己的 SaaS，也能徹底改寫你在職場中的競爭力。
        </p>
      </header>

      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-[15px] font-semibold text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
        🔥 限時優惠：Lifetime Price 終身價格
        <br />
        只需付一次，永久享有所有未來更新及新增內容
      </div>

      <div className="mb-8 flex justify-center">
        <JoinNowButton />
      </div>

      <Section title="你將獲得什麼">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <h3 className="font-semibold mb-2">系統化學習與實踐</h3>
            <ul className="space-y-2 text-[15px] text-slate-600 leading-relaxed">
              <li>每月 1 場線上 Q&A 交流會（含回放）——與導師和同儕直接互動，解決真實挑戰。</li>
              <li>從零開始到實際應用，每堂課都有具體可行的步驟與案例。</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold mb-2">AI 工具與職場應用</h3>
            <ul className="space-y-2 text-[15px] text-slate-600 leading-relaxed">
              <li>不只 Vibe Coding，更涵蓋各類 AI 工具如何提升工作效率。</li>
              <li>用 AI 加速業務流程、優化決策、創造價值。</li>
              <li>實戰導向：對照企業級應用場景，而非僅限理論。</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold mb-2">專業社群的力量</h3>
            <ul className="space-y-2 text-[15px] text-slate-600 leading-relaxed">
              <li>加入由認真專業人士組成的封閉社群。</li>
              <li>開放式提問與互動，導師及同儕隨時可協助。</li>
              <li>分享成功案例與踩坑故事，建立有意義的職業網絡。</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section title="為什麼選擇 Tenth Project">
        <ul className="space-y-3 text-[15px] text-slate-600">
          <li>高品質內容 — 由業界專家親自設計與教授</li>
          <li>實用導向 — 每堂課都聚焦於立即可應用的知識</li>
          <li>廣東話社群有人陪伴 — 不只是自己學，遇到問題隨時有人幫手</li>
          <li>持續更新 — 緊跟 AI 與職場趨勢，內容定期優化</li>
        </ul>
      </Section>

      <Section title="會員方案">
        <p className="text-[15px] text-slate-600 leading-relaxed mb-5">
          Tenth Project Club 是一個實踐社群，為有野心的專業人士打造。我們幫助你用 AI 複製海外月入 6 位數工具站、建立個人品牌，並用同一套方法提升職場競爭力。
        </p>
        <ul className="space-y-2.5 text-[15px] text-slate-600">
          <li>線上教學課程 + 回放</li>
          <li>每月 1 場線上 Q&A 交流會 + 回放</li>
          <li>會員社群：提問與互動</li>
          <li>完整 Vibe Coding 資料庫與工具推薦</li>
          <li>每月直播活動</li>
          <li>一人公司到 AI 經營 IG 萬字攻略</li>
          <li>10 小時 Vibe Coding 完整課程 — 用 Cursor 一步步複製月入 6 位數 StealthWriter 工具站</li>
          <li>10 小時以上 AI Agent 從 0 到 1 課程</li>
          <li>45 分鐘私人諮詢（朱 Sir 與 Chris 同時諮詢）</li>
          <li>專案規劃工具，幫你把網站從想法做到上線</li>
        </ul>
        <Note>
          適合想學習變現、需要專家指導的創業者與求職者。現在加入，開始用 AI 做事。
        </Note>
        <div className="mt-6 flex justify-center">
          <JoinNowButton />
        </div>
      </Section>

      <Section title="課程概述">
        <Card>
          <h3 className="font-semibold mb-2">🎯 核心理念</h3>
          <p className="text-[15px] text-slate-600 leading-relaxed">
            結合項目導向學習（PBL）與AI技術，21天內從零開始打造可盈利的海外工具站副業。Tenth Project「
            <strong className="text-slate-900">幫助學生在21天實戰中複製一個海外月入6位數美金的工具站</strong>
            」只需用 Cursor, Vercel, GPT API 等工具，無需寫 code。
          </p>
        </Card>

        <Subhead>📅 課程時間表</Subhead>
        <Table
          headers={["課程類型", "日期", "時間", "導師"]}
          rows={[["📚 10小時線上Vibe Coding必修課程", "即時可用", "隨時", "朱Sir+Chris"]]}
        />

        <Subhead>🎁 額外專享會員教學（實戰Workshop）</Subhead>
        <Table
          headers={["時長", "形式", "主題", "導師"]}
          rows={[
            ["4小時", "線上課程", "如何用 Coze 知識庫建立你的 SaaS 產品", "朱Sir"],
            ["4小時", "線上課程", "OpenClaw 龍蝦Agent教學", "朱Sir"],
            ["2小時", "線上課程", "Mobile APP Vibe Coding實戰Workshop", "朱Sir"],
            ["2小時", "線上課程", "平台網站 Vibe Coding實戰Workshop", "朱Sir"],
            ["2小時", "線上課程", "投資網站 Vibe Coding實戰Workshop", "朱Sir"],
            ["2小時", "線上課程", "Tencent Workbuddy AI Agent實戰Workshop", "朱Sir"],
          ]}
        />

        <Subhead>💬 未來Vibe Coding Workshop預告</Subhead>
        <Table
          headers={["日期", "時間（香港時間）", "導師"]}
          rows={[
            ["隨時", "Skool & Whatsapp社群隨時發問支援", "朱Sir + Chris"],
            ["2026年9月12日", "10am-11am（Zoom 直播: Mobile App高效vibe coding製作workshop）", "朱Sir"],
            ["2026年9月19日", "10am-11am（Zoom 直播: Cursor Grok AI agent實戰workshop）", "朱Sir"],
          ]}
        />

        <Card>
          <h4 className="font-semibold mb-3">🌟 會員專屬福利（Lifetime Access）</h4>
          <ul className="space-y-2 text-[15px] text-slate-600">
            <li>✅ <strong className="text-slate-900">每月額外 1 場 Live Class</strong> — 完成第 6 課後，持續學習最新 AI 工具與實戰技巧</li>
            <li>✅ <strong className="text-slate-900">每課後 Q&A 支援</strong> — 每月開放Live問答時間，確保你完全掌握</li>
            <li>✅ <strong className="text-slate-900">終身更新權限</strong> — 一次付費，永久享有所有未來課程更新及新增內容</li>
            <li>✅ <strong className="text-slate-900">獨家社群資源</strong> — Skool 社群持續分享最新案例、工具推薦、市場趨勢</li>
          </ul>
        </Card>

        <Note>
          💡 <strong className="text-slate-900">即時支援：</strong>
          <br />
          可在 Skool 獨家社群或 WhatsApp 群發問，導師團隊會及時回覆
        </Note>
        <Note>
          ⏰ <strong className="text-slate-900">Lifetime優惠截止：2026年9月11日午夜</strong>
          <br />
          👥 <strong className="text-slate-900">名額限制：</strong>嚴格控制在 5 人內確保教學質量
        </Note>
        <div className="mt-6 flex justify-center">
          <JoinNowButton />
        </div>
      </Section>

      <Section title="學習成果保證">
        <ul className="space-y-3 text-[15px] text-slate-600">
          <li>✅ <strong className="text-slate-900">1個完整工具復刻：</strong>從需求挖掘開始，完整復刻月賺6位數美金的 Stealthwriter，包括支付系統，即做完即可開始收款！無需 IT 背景</li>
          <li>✅ <strong className="text-slate-900">真實海外盈利產品：</strong>跟著導師實作完成</li>
          <li>✅ <strong className="text-slate-900">完整的商業變現流程：</strong>免費到付費轉化系統</li>
          <li>✅ <strong className="text-slate-900">可重複的開發框架：</strong>為日後獨立開發工具站奠定基礎</li>
        </ul>
        <div className="mt-6 flex justify-center">
          <JoinNowButton />
        </div>
      </Section>

      <Section title="🎁 成品：您將獲得什麼？">
        <Card>
          <h4 className="font-semibold mb-3">1. 一個真實運營中的網站</h4>
          <ul className="space-y-2 text-[15px] text-slate-600">
            <li>✅ <strong className="text-slate-900">可以收款</strong>（Stripe 已接好）</li>
            <li>✅ <strong className="text-slate-900">可以展示</strong>（portfolio 展示作品）</li>
            <li>✅ <strong className="text-slate-900">可以迭代</strong>（您擁有 code）- 可自主構建第 2、第 3 個系統</li>
          </ul>
          <Note>
            💰 <strong className="text-slate-900">價值對比：</strong>
            <br />
            • 市場上租用系統年費：5 位數
            <br />
            • 購買或定製系統：6 位數以上
            <br />
            • <strong className="text-slate-900">21 天後擁有完整可收款的網站？</strong>
          </Note>
        </Card>
        <Card>
          <h4 className="font-semibold mb-3">2. 21天後擁有一套可複製的方法論</h4>
          <ul className="space-y-2 text-[15px] text-slate-600">
            <li>🔍 需求發現框架</li>
            <li>💻 AI 開發 SOP</li>
            <li>💰 收款部署方法</li>
            <li>🚀 用同一套方法做第 2、第 3 個產品：<strong className="text-slate-900">需求→開發→上線→變現</strong></li>
          </ul>
        </Card>
      </Section>

      <Section title="📚 課程內容與導師背景">
        <Card>
          <h4 className="font-semibold mb-2">🎯 課程如何設計</h4>
          <p className="text-[15px] text-slate-600 leading-relaxed">
            基於<strong className="text-slate-900">項目導向學習（PBL）</strong>優勢設計，我們將複雜的 AI 產品開發過程拆解成 4 個清晰的里程碑。每一週都有實戰項目，確保您不只是學習理論，而是真正能夠
            <strong className="text-slate-900">在 21 天內完成一個可收款的完整產品</strong>。
          </p>
        </Card>
        <Card>
          <h4 className="font-semibold mb-2">👨💼 導師背景：為什麼是朱Sir</h4>
          <p className="text-[15px] text-slate-600 leading-relaxed">
            <strong className="text-slate-900">前阿里技術專家、騰訊訓練營導師、多家知名企業培訓導師</strong>
            。朱Sir 不是純講師，而是
            <strong className="text-slate-900">真正在企業規模系統開發中實踐過的工程師</strong>
            。多年來幫助無數學生掌握 AI、實現職業轉型，並把大廠經驗轉成可上手的教學。
          </p>
        </Card>
        <Card>
          <h4 className="font-semibold mb-3">🚀 核心教學方法</h4>
          <ul className="space-y-2 text-[15px] text-slate-600">
            <li>• <strong className="text-slate-900">項目導向：</strong>每週一個完整項目，從零開始到能運營</li>
            <li>• <strong className="text-slate-900">實戰導向：</strong>不講廢話，只講你需要的技能</li>
            <li>• <strong className="text-slate-900">可複製：</strong>學完能立即應用到自己的項目</li>
            <li>• <strong className="text-slate-900">持續支援：</strong>導師不只在課堂，還在社群中持續解答問題</li>
          </ul>
        </Card>
      </Section>

      <Section title="這堂課適合你嗎？">
        <Card>
          <h4 className="font-semibold mb-3">✅ 這堂課適合以下人群</h4>
          <ul className="space-y-2 text-[15px] text-slate-600">
            <li>✓ <strong className="text-slate-900">想用 AI 創業但沒有技術背景</strong> - 我們從零教起，無需寫 code</li>
            <li>✓ <strong className="text-slate-900">想開發自己的 AI 工具產品</strong> - 完整的產品開發流程</li>
            <li>✓ <strong className="text-slate-900">想掌握年薪增加 30% 的技能</strong> - 懂 AI 在職場有明顯薪資優勢</li>
            <li>✓ <strong className="text-slate-900">想在 21 天內看到實際成果</strong> - 不是空談理論，是有可收款的產品</li>
            <li>✓ <strong className="text-slate-900">想加入 AI 開發者社群</strong> - 專業人脈與持續學習資源</li>
          </ul>
        </Card>
        <Card>
          <h4 className="font-semibold mb-3">❌ 這堂課可能不適合的情況</h4>
          <ul className="space-y-2 text-[15px] text-slate-600">
            <li>✗ <strong className="text-slate-900">只想學理論不想實作</strong> - 這是 100% 實戰課程</li>
            <li>✗ <strong className="text-slate-900">期待一夜暴富</strong> - 我們教可持續的方法論</li>
            <li>✗ <strong className="text-slate-900">沒有時間投入</strong> - 需要每週付出實際工作時間</li>
            <li>✗ <strong className="text-slate-900">對 AI 一點興趣都沒有</strong> - 最好有基本興趣與好奇心</li>
          </ul>
        </Card>
        <Note>
          💡 <strong className="text-slate-900">最關鍵的問題：</strong>
          <br />
          你是否準備好在 21 天內從零到一，完成一個真正可以運營、可以收錢的 AI 產品？如果答案是「是」，那這堂課就是為你設計的。
        </Note>
      </Section>

      <Section title="📚 必修課程詳細大綱">
        <Card>
          <h3 className="font-semibold mb-3">第1課：需求挖掘 + 產品設計</h3>
          <p className="text-[15px] text-slate-600 mb-3"><strong className="text-slate-900">核心目標：</strong>明確目標受眾痛點和商業邏輯</p>
          <ul className="space-y-2 text-[15px] text-slate-600">
            <li>• 使用 AI 挖掘 + 市場驗證方法</li>
            <li>• 設計定價模型（訂閱制/積分制/一次性付費）</li>
            <li>• 定義 MVP：最小可行功能</li>
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">第2課：MVP 構建 - Humanizer 及用戶體系</h3>
          <ul className="space-y-2 text-[15px] text-slate-600 mb-4">
            <li>• 理解從 MVP 出發構建 LLM 應用的核心思路</li>
            <li>• 掌握 LLM Wrapper 基礎封裝與 Prompt Engineering 技巧</li>
            <li>• 掌握用戶註冊/登錄系統的構建與 Supabase 集成</li>
          </ul>
          <p className="text-[15px] font-semibold mb-2">核心內容：</p>
          <div className="rounded-lg bg-white/80 border border-slate-200/80 p-4 mb-3 text-[14px] text-slate-600">
            <p className="font-semibold text-slate-800 mb-2">階段1：MVP 核心功能開發（60分鐘）</p>
            <ul className="space-y-1.5">
              <li>✓ 實現 LLM Wrapper + Humanizer 功能</li>
              <li>✓ Prompt Engineering 講解與實踐</li>
              <li>✓ 使用 Cursor 快速搭建 Humanizer 頁面</li>
              <li>✓ 基於 Humanizer 延展 demo 主題</li>
            </ul>
          </div>
          <div className="rounded-lg bg-white/80 border border-slate-200/80 p-4 text-[14px] text-slate-600">
            <p className="font-semibold text-slate-800 mb-2">階段2：用戶體系接入（60分鐘）</p>
            <ul className="space-y-1.5">
              <li>✓ 在 Supabase 中創建用戶表</li>
              <li>✓ 使用 Supabase Auth 實現註冊/登錄</li>
              <li>✓ 集成 Sign Up/Sign In 頁面</li>
            </ul>
          </div>
          <p className="mt-3 text-[15px] text-slate-600"><strong className="text-slate-900">產出：</strong>一個基於 Supabase 的用戶管理系統 + LLM Wrapper</p>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">第3課：產品擴展 - 構建完整 Stealth Writer</h3>
          <p className="text-[15px] text-slate-600 mb-3"><strong className="text-slate-900">教學目標：</strong>掌握功能模塊化設計與 prompt 驅動開發思維</p>
          <Table
            headers={["模塊", "功能描述"]}
            rows={[
              ["定價系統", "基於使用量設計計費方案"],
              ["對話長度設定", "控制上下文長度、重置上下文"],
              ["AI 檢測器", "判別 AI 生成或人工撰寫"],
              ["Generator + Humanizer", "生成初稿→改寫→輸出人類風格"],
            ]}
          />
          <p className="mt-3 text-[15px] text-slate-600"><strong className="text-slate-900">產出：</strong>功能完整的 Stealth Writer MVP</p>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">第4課：商業化閉環 - 支付與數據觀測</h3>
          <p className="text-[15px] text-slate-600 mb-3"><strong className="text-slate-900">教學目標：</strong>掌握產品商業化與數據分析的基本實現方式</p>
          <Table
            headers={["模塊", "教學重點"]}
            rows={[
              ["Stripe 支付集成", "接入 Stripe Checkout/Portal 及 Webhook"],
              ["使用計費聯動", "購買套餐→更新使用權限"],
              ["GA 數據觀測", "追踪用戶行為、事件埋點"],
            ]}
          />
          <p className="mt-3 text-[15px] text-slate-600"><strong className="text-slate-900">產出：</strong>完整可用的 LLM 產品原型</p>
        </Card>
      </Section>

      <Section title="👨💼 教學團隊">
        <div className="rounded-xl border border-slate-200/80 bg-slate-950 text-slate-200 p-6 mb-4">
          <h3 className="text-lg font-semibold text-white">導師：朱Sir</h3>
          <h4 className="mt-5 mb-2 font-semibold text-slate-300">🎓 核心背景</h4>
          <p className="text-[15px] text-slate-300 leading-relaxed">
            前阿里技術專家、騰訊訓練營導師、多家知名企業培訓導師。多年來幫助無數學生掌握 AI 技術、實現職業生涯轉型，並開拓可持續的副業。
          </p>
          <h4 className="mt-5 mb-2 font-semibold text-slate-300">💼 專業實力</h4>
          <ul className="space-y-2 text-[15px] text-slate-300">
            <li>✓ 阿里巴巴集團技術專家（2011.9-2015.6）- 大型互聯網平台架構設計</li>
            <li>✓ 10年職業程序員（2007.7-2017.7）- 完整技術成長路徑，從初級到資深專家</li>
            <li>✓ 7年編程教育專家（2018.5-至今）- 課程研發與教學實踐並重</li>
          </ul>
          <h4 className="mt-5 mb-2 font-semibold text-slate-300">📋 權威認證</h4>
          <ul className="space-y-2 text-[15px] text-slate-300">
            <li>✓ 初中信息技術教師資格證</li>
            <li>✓ CCF PTA 證書（C++）</li>
            <li>✓ 雙重教學資質保障</li>
          </ul>
          <h4 className="mt-5 mb-2 font-semibold text-slate-300">🎯 教學特色</h4>
          <p className="text-[15px] text-slate-300 mb-2"><strong className="text-white">核心理念：語言無關的編程思維</strong></p>
          <p className="text-[15px] text-slate-300 mb-4">摒棄傳統「教語法」模式，專注培養基本概念理解與邏輯結構掌握，讓學生具備可遷移的編程能力。</p>
          <p className="text-[15px] text-slate-300 mb-2"><strong className="text-white">🚀 項目導向學習（PBL）</strong></p>
          <ul className="space-y-2 text-[15px] text-slate-300">
            <li>✓ 真實項目驅動學習，學生在解決實際問題中掌握技能</li>
            <li>✓ 培養主動學習與獨立思考能力</li>
            <li>✓ 為合適學生提供信息學競賽（OI）進階培訓</li>
          </ul>
          <h4 className="mt-5 mb-2 font-semibold text-slate-300">🏆 近期成果</h4>
          <ul className="space-y-2 text-[15px] text-slate-300">
            <li>✓ 微信小程序教育平台 - 外聘培訓師 + 官方課程研發，結合最新技術趨勢</li>
            <li>✓ 騰訊 mini 鵝營地導師 - 青少年編程夏令營，遊戲化教學激發學習熱情</li>
          </ul>
          <div className="mt-5 rounded-lg bg-white/10 px-4 py-3 text-[14px] text-slate-200">
            <strong className="text-white">✅ 教學成效：</strong>將阿里巴巴企業實戰經驗融入課程設計，培養學生具備獨立分析問題與設計解決方案的核心能力，多名學生在競賽與實際項目中取得優異成果。
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-950 text-slate-200 p-6">
          <h3 className="text-lg font-semibold text-white">班長：Chris Lau</h3>
          <ul className="mt-4 space-y-2 text-[15px] text-slate-300">
            <li>✓ 前投資銀行副董事級專業人士</li>
            <li>✓ Imperial College London 量化金融碩士</li>
            <li>✓ 豐富的數位創業與項目管理經驗</li>
            <li>✓ 曾與頂級企業合作：</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Alibaba", "JP Morgan", "Goldman Sachs", "UBS", "Morgan Stanley"].map((name) => (
              <span key={name} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-slate-200">
                {name}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <div className="rounded-2xl bg-slate-950 px-6 py-10 text-center text-white">
        <p className="text-lg font-semibold">現在就加入 Tenth Project Club</p>
        <p className="mt-2 text-sm text-slate-300">課程、社群、Q&A 與專案工具都在同一套系統裡，登入後即可進入教室。</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <JoinNowButton variant="dark" />
          <Link
            href={`/courses/${FLAGSHIP_SLUG}`}
            className="inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-semibold text-white"
          >
            {dict.nav.outline}
          </Link>
        </div>
      </div>
    </div>
  );
}
