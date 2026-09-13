"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebinarSignupButton } from "@/components/marketing/webinar-signup-dialog";

const JOIN_HREF = "/signup?redirect=/dashboard";

function JoinCta({ className = "" }: { className?: string }) {
  return (
    <Link
      href={JOIN_HREF}
      className={`inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-800 ${className}`}
    >
      立即加入 Lifetime 會員
      <ArrowUpRight className="ml-1.5 h-4 w-4" />
    </Link>
  );
}

function OutlineCta() {
  return (
    <Link
      href="#outline"
      className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:bg-transparent dark:text-white"
    >
      查看課程詳細大綱
      <ArrowRight className="ml-1.5 h-4 w-4" />
    </Link>
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

const CORE_LESSONS = [
  {
    value: "l1",
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
    value: "l2",
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
    value: "l3",
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
    value: "l4",
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

export function MembershipSyllabus() {
  return (
    <div id="outline" className="scroll-mt-24 space-y-8">
      <Tabs defaultValue="core" className="gap-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900/40">
          <TabsTrigger value="core" className="rounded-xl px-3 py-2">
            第一部分｜Vibe Coding 0 到 1 核心主修課 (21 天實戰打造可收款工具站)
          </TabsTrigger>
          <TabsTrigger value="workshops" className="rounded-xl px-3 py-2">
            第二部分｜AI Agent 高階進階課與專題 Workshop
          </TabsTrigger>
          <TabsTrigger value="vip" className="rounded-xl px-3 py-2">
            第三部分｜會員專屬 5 大 VIP 尊享超值配套
          </TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">第一部分：Vibe Coding 0 到 1 核心主修課</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">
              項目導向學習（PBL）× 21 天實戰，帶你復刻月賺 6 位數美金的 StealthWriter，含 Stripe 收款系統。
            </p>
          </div>
          <Accordion multiple defaultValue={["l1"]} className="rounded-2xl border border-slate-200 bg-white px-4 dark:border-slate-800">
            {CORE_LESSONS.map((lesson) => (
              <AccordionItem key={lesson.value} value={lesson.value} className="border-slate-200 dark:border-slate-800">
                <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                  {lesson.title}
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="space-y-4">
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
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">第二部分：AI Agent 高階進階課與實戰 Workshop</h2>
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
        </TabsContent>

        <TabsContent value="vip" className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">加入會員即免費獲贈 5 大 VIP 實戰配套</h2>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AcademyBrochure() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-12 max-w-4xl">
        <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          🔥 限時優惠｜Lifetime Plan 終身會員
        </p>
        <h1 className="mt-5 text-[2rem] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-5xl dark:text-white">
          Tenth Project VIP 會員：Vibe Coding 與 AI Agent 從零到高手全攻略
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          一次加入，永久享用所有核心主修課、高階實戰 Workshop、AI 專案規劃工具與導師社群支援。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          <JoinCta />
          <OutlineCta />
          <WebinarSignupButton />
        </div>
      </header>

      <MembershipSyllabus />

      <section className="mt-14 rounded-3xl border border-slate-200 bg-slate-950 px-6 py-10 text-center text-white dark:border-slate-800">
        <p className="text-xl font-semibold">立即加入 Lifetime 會員</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          一次加入，永久享用所有核心主修課、高階實戰 Workshop、AI 專案規劃工具與導師社群支援。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={JOIN_HREF}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 hover:bg-white/90"
          >
            立即加入 Lifetime 會員
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Link>
          <Link
            href="#outline"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white"
          >
            查看課程詳細大綱
          </Link>
          <WebinarSignupButton variant="dark" />
        </div>
      </section>
    </div>
  );
}
