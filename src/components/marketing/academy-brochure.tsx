"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebinarSignupButton } from "@/components/marketing/webinar-signup-dialog";
import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";

const TITLE = "Tenth Project 會員：Vibe Coding 與 AI Agent 從零到高手全攻略";
const BADGE = "🔥 限時Lifetime 終身會員優惠";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950">
      <h2 className="mb-6 border-b border-slate-200/80 pb-3 text-xl font-semibold tracking-[-0.02em] dark:border-slate-800">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SoftCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`border border-slate-200 bg-white shadow-none dark:border-slate-800 ${className}`}>
      {children}
    </Card>
  );
}

function InnerCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 last:mb-0 dark:border-slate-800 dark:bg-slate-900/40">
      {children}
    </div>
  );
}

const CORE_LESSONS = [
  {
    title: "第 1 課：需求挖掘 + 產品設計",
    blocks: [
      { label: "核心目標", items: ["明確目標受眾痛點和商業邏輯"] },
      {
        label: "核心內容",
        items: [
          "使用 AI 挖掘 + 市場驗證方法",
          "設計定價模型（訂閱制 / 積分制 / 一次性付費）",
          "定義 MVP：最小可行功能",
        ],
      },
    ],
  },
  {
    title: "第 2 課：MVP 構建 - Humanizer 及用戶體系",
    blocks: [
      {
        label: "教學重點",
        items: [
          "理解從 MVP 出發構建 LLM 應用的核心思路",
          "掌握 LLM Wrapper 基礎封裝與 Prompt Engineering 技巧",
          "掌握用戶註冊/登錄系統的構建與 Supabase 集成",
        ],
      },
      {
        label: "實戰階段",
        items: [
          "階段 1：MVP 核心功能開發（60 分鐘）— 實現 LLM Wrapper + Humanizer 功能、Prompt Engineering 實踐、使用 Cursor 快速搭建頁面。",
          "階段 2：用戶體系接入（60 分鐘）— Supabase 創建用戶表、Supabase Auth 實現註冊登入。",
        ],
      },
      { label: "產出", items: ["一個基於 Supabase 的用戶管理系統 + LLM Wrapper"] },
    ],
  },
  {
    title: "第 3 課：產品擴展 - 構建完整 Stealth Writer",
    blocks: [
      { label: "教學目標", items: ["掌握功能模塊化設計與 Prompt 驅動開發思維"] },
      {
        label: "核心模塊",
        items: [
          "定價系統（基於使用量設計計費方案）",
          "對話長度設定（控制上下文長度、重置上下文）",
          "AI 檢測器（判別 AI 生成或人工撰寫）",
          "Generator + Humanizer（生成初稿 → 改寫 → 輸出人類風格）",
        ],
      },
      { label: "產出", items: ["功能完整的 Stealth Writer MVP"] },
    ],
  },
  {
    title: "第 4 課：商業化閉環 - 支付與數據觀測",
    blocks: [
      { label: "教學目標", items: ["掌握產品商業化與數據分析的基本實現方式"] },
      {
        label: "核心模塊",
        items: [
          "Stripe 支付集成（接入 Stripe Checkout/Portal 及 Webhook）",
          "使用計費聯動（購買套餐 → 更新使用權限）",
          "GA 數據觀測（追蹤用戶行為、事件埋點）",
        ],
      },
      { label: "產出", items: ["完整可用且可線上收款的 LLM 產品原型"] },
    ],
  },
];

const WORKSHOPS = [
  { lesson: "Lesson 5", title: "如何用 Coze 知識庫建立你的 SaaS 產品", meta: "深度掌握 RAG 私有知識庫技術 (4 小時線上課)" },
  { lesson: "Lesson 6", title: "Mobile APP Vibe Coding 實戰 Workshop", meta: "(2 小時線上課 / 錄影)" },
  { lesson: "Lesson 7", title: "平台網站 Vibe Coding 實戰 Workshop", meta: "(2 小時線上課 / 錄影)" },
  { lesson: "Lesson 8", title: "投資分析網站 Vibe Coding 實戰 Workshop", meta: "(2 小時線上課 / 錄影)" },
  { lesson: "Lesson 9", title: "高效 Vibe Coding 開發 Flow 最佳實踐", meta: "(隨選即播)" },
  { lesson: "Lesson 10", title: "OpenClaw 龍蝦 Agent 實戰教學", meta: "(4 小時線上課)" },
  { lesson: "Lesson 11", title: "Tencent Workbuddy AI Agent 實戰 Workshop", meta: "(2 小時線上課)" },
  { lesson: "Lesson 13", title: "Grok AI Agent 實戰 Workshop", meta: "(每月 Zoom Live 直播互動)" },
];

const VIP_PERKS = [
  {
    emoji: "👥",
    title: "30+ 人專業導師與學員社群",
    desc: "獨家 Skool 與 WhatsApp 專屬私密群組，導師團隊及時解答疑難。",
  },
  {
    emoji: "👨‍🏫",
    title: "45 分鐘 1-on-1 私人諮詢",
    desc: "由朱Sir 與 Chris 兩位雙導師親自為你診斷專案與商業架構。",
  },
  {
    emoji: "💬",
    title: "每月 Live Q&A 答疑直播",
    desc: "每月開放線上 Q&A 交流會，確保你持續掌握最新 AI 工具趨勢。",
  },
  {
    emoji: "📘",
    title: "一人公司及 AI 宣傳天書",
    desc: "獨家整理從產品構想、AI 開發到 IG/FB 萬字行銷變現 SOP。",
  },
  {
    emoji: "⚡",
    title: "Tenth Project 專案規劃與 Cursor MCP 系統",
    desc: "專屬 AI Build Coach，支援 UAT 測試與 Cursor 本地雙向同步。",
  },
];

const FORMAT = [
  "學生在付款後的24小時內，將會被加入 Skool 社群，並可即時瀏覽所有 On-Demand 影片及教學內容。(廣東話教學)",
  "建議同學在 Q&A 與 Live Session 前先完成所有影片教學，以便更有效參與討論。",
  "Q&A 及 Live Session 均以 Zoom 進行，報名後將透過電郵發送 Zoom 連結。",
  "若未能即時參加 Zoom Live，可在稍後於 Skool 平台上重溫錄影內容。",
  "所有教學材料均可終身存取，讓你隨時重溫學習內容。",
];

export function MembershipSyllabus() {
  return (
    <div id="outline" className="scroll-mt-24 space-y-8">
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            第一部分｜Vibe Coding 0 到 1 核心主修課 (21 天實戰打造可收款工具站)
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">
            項目導向學習（PBL）× 21 天實戰，帶你復刻月賺 6 位數美金的 StealthWriter，含 Stripe 收款系統。
          </p>
        </div>
        <div className="space-y-4">
          {CORE_LESSONS.map((lesson) => (
            <SoftCard key={lesson.title}>
              <CardHeader>
                <CardTitle className="text-lg">{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lesson.blocks.map((block) => (
                  <div key={block.label}>
                    <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{block.label}</p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {block.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </SoftCard>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            第二部分｜AI Agent 高階進階課與專題 Workshop
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">
            從 RAG 私有知識庫、Mobile App 到企業級 AI Agent 的進階全收錄。
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {WORKSHOPS.map((item) => (
            <SoftCard key={item.lesson} className={item.lesson === "Lesson 5" || item.lesson === "Lesson 13" ? "sm:col-span-2" : ""}>
              <CardHeader>
                <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{item.lesson}</p>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.meta}</p>
              </CardContent>
            </SoftCard>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            第三部分｜會員專屬 5 大 VIP 尊享超值配套
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {VIP_PERKS.map((item, index) => (
            <SoftCard key={item.title} className={index < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {item.emoji} {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.desc}</p>
              </CardContent>
            </SoftCard>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AcademyBrochure() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-12 max-w-4xl">
        <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          {BADGE}
        </p>
        <h1 className="mt-5 text-[2rem] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-5xl dark:text-white">
          {TITLE}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          一次加入，永久享用所有核心主修課、高階實戰 Workshop、AI 專案規劃工具與導師社群支援。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <JoinLifetimeButton />
          <WebinarSignupButton />
        </div>
      </header>

      <Section title="🎯 核心理念">
        <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
          採納「項目導向學習（PBL）」機制，結合現代 AI 開發工具鏈（Cursor、Vercel、OpenAI/Claude API）。我們不講空洞理論，專注於帶領會員在實戰中從 0 到 1 獨立開發並上線具備完整商業變現能力的海外級 AI 工具產品。
        </p>
      </Section>

      <Section title="學習成果保證">
        <ul className="space-y-3 text-[15px] text-slate-600 dark:text-slate-300">
          <li>
            <strong className="text-slate-900 dark:text-white">獨立交付完整 AI 工具：</strong>
            從需求洞察到產品發佈，全程實戰復刻如 StealthWriter 等高頻需求的 AI SaaS 產品，含完整用戶體系與線上支付。
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">具備商業營運能力的線上產品：</strong>
            在雙導師帶領下完成真實產品上線，具備收取訂閱費與點數付費機制。
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">完整端到端變現閉環：</strong>
            掌握從免費體驗（Freemium）到付費轉化（Stripe Integration）的產品設計架構。
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">可重複套用的敏捷開發 SOP：</strong>
            建立語言無關的編程思維與 Prompt 驅動開發流程，為日後獨立開發第二、第三個 AI 產品奠定堅實基礎。
          </li>
        </ul>
      </Section>

      <Section title="🎁 成品：您將獲得什麼？">
        <InnerCard>
          <h3 className="mb-3 font-semibold">1. 一個具備完整商業能力的線上 AI 產品</h3>
          <ul className="space-y-2 text-[15px] text-slate-600 dark:text-slate-300">
            <li>✅ <strong className="text-slate-900 dark:text-white">線上收款能力：</strong>已完成 Stripe 支付與 Webhook 訂閱計費串接。</li>
            <li>✅ <strong className="text-slate-900 dark:text-white">作品集展示與營運：</strong>具備完整的用戶註冊、登入與資料庫認證架構。</li>
            <li>✅ <strong className="text-slate-900 dark:text-white">100% 程式碼自主權：</strong>擁有完整源碼與部署權限，可隨時自主迭代與擴充功能。</li>
          </ul>
        </InnerCard>
        <InnerCard>
          <h3 className="mb-3 font-semibold">2. 一套可持續複刻的 AI 開發方法論</h3>
          <ul className="space-y-2 text-[15px] text-slate-600 dark:text-slate-300">
            <li>🔍 <strong className="text-slate-900 dark:text-white">商業需求驗證框架：</strong>精準找到市場切入點與 MVP 功能範疇。</li>
            <li>💻 <strong className="text-slate-900 dark:text-white">Prompt 驅動開發 SOP：</strong>靈活運用 Cursor 與 Master Prompt 進行敏捷開發。</li>
            <li>💳 <strong className="text-slate-900 dark:text-white">自動化變現部署流程：</strong>掌握資料庫、API 與支付網關的實戰整合。</li>
          </ul>
        </InnerCard>
      </Section>

      <Section title="📚 課程內容與導師背景">
        <InnerCard>
          <h3 className="mb-2 font-semibold">🎯 課程如何設計</h3>
          <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
            基於<strong className="text-slate-900 dark:text-white">項目導向學習（PBL）</strong>
            優勢設計，確保您不只是學習理論，而是真正能夠
            <strong className="text-slate-900 dark:text-white">在 21 天內完成一個可收款的完整產品</strong>。
          </p>
        </InnerCard>
        <InnerCard>
          <h3 className="mb-2 font-semibold">👨💼 導師背景：為什麼是朱Sir</h3>
          <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
            知名學府計算機科學學士 + 阿里巴巴集團技術專家 + 10年程序員經驗。朱Sir 不是純講師，而是真正在企業規模系統開發中實踐過的工程師。他將自己在大型互聯網平台的架構設計經驗，轉化為適合初學者的教學方法。
          </p>
        </InnerCard>
      </Section>

      <MembershipSyllabus />

      <Section title="課程形式">
        <ol className="space-y-5">
          {FORMAT.map((item, index) => (
            <li key={item} className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">{index + 1}. </strong>
              {item}
            </li>
          ))}
        </ol>
      </Section>

      <Section title="教學團隊">
        <div className="mb-4 rounded-xl border border-slate-200/80 bg-slate-950 p-6 text-slate-200">
          <h3 className="text-lg font-semibold text-white">導師：朱Sir</h3>
          <h4 className="mt-5 mb-2 font-semibold text-slate-300">🎓 核心背景</h4>
          <p className="text-[15px] leading-relaxed text-slate-300">
            華南理工大學計算機科學學士 + 阿里巴巴集團技術專家 + 10年一線程序員經驗，2018年全面轉入編程教育領域，將企業級開發經驗轉化為突破性教學方法。
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
          <p className="mb-2 text-[15px] text-slate-300">
            <strong className="text-white">核心理念：語言無關的編程思維</strong>
          </p>
          <p className="mb-4 text-[15px] text-slate-300">
            摒棄傳統「教語法」模式，專注培養基本概念理解與邏輯結構掌握，讓學生具備可遷移的編程能力。
          </p>
          <p className="mb-2 text-[15px] text-slate-300">
            <strong className="text-white">🚀 項目導向學習（PBL）</strong>
          </p>
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
            <strong className="text-white">✅ 教學成效：</strong>
            將阿里巴巴企業實戰經驗融入課程設計，培養學生具備獨立分析問題與設計解決方案的核心能力，多名學生在競賽與實際項目中取得優異成果。
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-slate-950 p-6 text-slate-200">
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

      <section className="mt-14 rounded-3xl border border-slate-200 bg-slate-950 px-6 py-10 text-center text-white dark:border-slate-800">
        <p className="text-xl font-semibold">立即加入 Lifetime 會員</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          一次加入，永久享用所有核心主修課、高階實戰 Workshop、AI 專案規劃工具與導師社群支援。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <JoinLifetimeButton variant="dark">立即加入 Lifetime 會員</JoinLifetimeButton>
          <WebinarSignupButton variant="dark" />
        </div>
      </section>
    </div>
  );
}
