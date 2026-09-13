"use client";

import { WebinarSignupButton } from "@/components/marketing/webinar-signup-dialog";
import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";
import { MembershipSyllabus } from "@/components/membership/membership-syllabus";

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

function InnerCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 last:mb-0 dark:border-slate-800 dark:bg-slate-900/40">
      {children}
    </div>
  );
}

const FORMAT = [
  "學生在付款後的24小時內，將會被加入 Skool 社群，並可即時瀏覽所有 On-Demand 影片及教學內容。(廣東話教學)",
  "建議同學在 Q&A 與 Live Session 前先完成所有影片教學，以便更有效參與討論。",
  "Q&A 及 Live Session 均以 Zoom 進行，報名後將透過電郵發送 Zoom 連結。",
  "若未能即時參加 Zoom Live，可在稍後於 Skool 平台上重溫錄影內容。",
  "所有教學材料均可終身存取，讓你隨時重溫學習內容。",
];

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
