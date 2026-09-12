import type { CaseStudy, CaseStudyCategory, Course, Lesson } from "@/types/platform";

export const FLAGSHIP_COURSE_ID = "11111111-1111-1111-1111-111111111101";
export const LEGACY_AGENT_COURSE_ID = "11111111-1111-1111-1111-111111111102";
export const FLAGSHIP_SLUG = "ai-vibecoding";

export const SEED_COURSES: Course[] = [
  {
    id: FLAGSHIP_COURSE_ID,
    title: "Tenth Project Vibe Coding 課程+社群限時Lifetime Plan",
    slug: FLAGSHIP_SLUG,
    description: "項目導向學習 × AI技術，從零打造可盈利海外工具站",
    cover_image: null,
    level: "beginner",
    duration_hours: 24,
    published: true,
    created_at: new Date().toISOString(),
  },
];

const modules: Omit<Lesson, "id" | "course_id" | "created_at">[] = [
  {
    title: "第1課：需求挖掘 + 產品設計",
    order_index: 0,
    video_url: null,
    content_md: `# 第1課：需求挖掘 + 產品設計

**核心目標：**明確目標受眾痛點和商業邏輯

- 使用 AI 挖掘 + 市場驗證方法
- 設計定價模型（訂閱制/積分制/一次性付費）
- 定義 MVP：最小可行功能
`,
    quiz_data: [
      {
        id: "m1q1",
        question: "Vibe Coding 最穩妥的起步方式是？",
        options: ["一次請 AI 生成整個產品", "先寫清楚目標與 MVP，再以小步衝刺開發", "只使用 no-code、完全不驗收", "先買伺服器再想需求"],
        correctIndex: 1,
      },
    ],
  },
  {
    title: "第2課：MVP 構建 - Humanizer 及用戶體系",
    order_index: 1,
    video_url: null,
    content_md: `# 第2課：MVP 構建 - Humanizer 及用戶體系

- 理解從 MVP 出發構建 LLM 應用的核心思路
- 掌握 LLM Wrapper 基礎封裝與 Prompt Engineering 技巧
- 掌握用戶註冊/登錄系統的構建與 Supabase 集成

## 核心內容

### 階段1：MVP 核心功能開發（60分鐘）
- 實現 LLM Wrapper + Humanizer 功能
- Prompt Engineering 講解與實踐
- 使用 Cursor 快速搭建 Humanizer 頁面
- 基於 Humanizer 延展 demo 主題

### 階段2：用戶體系接入（60分鐘）
- 在 Supabase 中創建用戶表
- 使用 Supabase Auth 實現註冊/登錄
- 集成 Sign Up/Sign In 頁面

**產出：**一個基於 Supabase 的用戶管理系統 + LLM Wrapper
`,
    quiz_data: [
      {
        id: "m2q1",
        question: "一份可用的 Master Prompt 最少應包含？",
        options: ["只有產品名稱", "願景、技術棧、衝刺範圍與驗收標準", "一段鼓勵的話", "完整商業計劃書 PDF"],
        correctIndex: 1,
      },
    ],
  },
  {
    title: "第3課：產品擴展 - 構建完整 Stealth Writer",
    order_index: 2,
    video_url: null,
    content_md: `# 第3課：產品擴展 - 構建完整 Stealth Writer

**教學目標：**掌握功能模塊化設計與 prompt 驅動開發思維

| 模塊 | 功能描述 |
| --- | --- |
| 定價系統 | 基於使用量設計計費方案 |
| 對話長度設定 | 控制上下文長度、重置上下文 |
| AI 檢測器 | 判別 AI 生成或人工撰寫 |
| Generator + Humanizer | 生成初稿→改寫→輸出人類風格 |

**產出：**功能完整的 Stealth Writer MVP
`,
    quiz_data: [
      {
        id: "m3q1",
        question: "為什麼要在早期接入使用者體系？",
        options: ["純粹為了美觀", "才能做權限、用量與日後收款閉環", "Supabase 規定一定要做", "可以不用測試"],
        correctIndex: 1,
      },
    ],
  },
  {
    title: "第4課：商業化閉環 - 支付與數據觀測",
    order_index: 3,
    video_url: null,
    content_md: `# 第4課：商業化閉環 - 支付與數據觀測

**教學目標：**掌握產品商業化與數據分析的基本實現方式

| 模塊 | 教學重點 |
| --- | --- |
| Stripe 支付集成 | 接入 Stripe Checkout/Portal 及 Webhook |
| 使用計費聯動 | 購買套餐→更新使用權限 |
| GA 數據觀測 | 追踪用戶行為、事件埋點 |

**產出：**完整可用的 LLM 產品原型
`,
    quiz_data: [
      {
        id: "m4q1",
        question: "第4課的商業化閉環包含哪一項？",
        options: ["只做 Landing Page", "Stripe 支付集成、使用計費聯動與 GA 數據觀測", "每天發一篇社交媒體", "先融資再做產品"],
        correctIndex: 1,
      },
    ],
  },
];

export function getSeedLessons(): Lesson[] {
  const now = new Date().toISOString();
  return modules.map((l, i) => ({
    ...l,
    id: `22222222-2222-2222-2222-${String(i + 1).padStart(12, "0")}`,
    course_id: FLAGSHIP_COURSE_ID,
    created_at: now,
  }));
}

const CASES: Array<{
  id: string;
  title: string;
  slug: string;
  category: CaseStudyCategory;
  categories: CaseStudyCategory[];
  stack: string[];
  summary: string;
  body: string;
}> = [
  {
    id: "44444444-4444-4444-4444-444444444401",
    title: "CalAI",
    slug: "calai",
    category: "saas",
    categories: ["saas", "tooling"],
    stack: ["Cursor", "Next.js", "Computer Vision API", "Stripe"],
    summary: "非技術創作者如何利用 Vibe Coding 打造月營收爆發的 AI 食物熱量計算 App，拆解從視像辨識到訂閱制收費流程。",
    body: `# CalAI

## 問題
計算熱量依賴手動輸入，門檻高、流失快。拍照即分析是明顯的產品切口，但傳統開發週期與成本對個人創作者不友好。

## 方案
以 Vibe Coding 節奏切出 MVP：相機輸入 → 視覺模型辨識食物 → 回傳熱量與巨量營養素 → 訂閱制鎖定留存。

## 架構
\`\`\`
App / Web → Next.js API → Computer Vision → 營養資料庫 → 訂閱與帳號
\`\`\`

## 關鍵學習
1. 先打通「拍一張就能得到答案」的核心迴路
2. Master Prompt 寫清平台限制（App Store、隱私、錯誤狀態）
3. 每一版都用真實餐點做 UAT，而不是示範圖
4. 商業化與產品同時設計，避免上線後才想收費

## 結果
從概念到商店上線的路徑可複製：意圖清楚、技術棧克制、驗收具體。
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444402",
    title: "StealthWriter",
    slug: "stealthwriter",
    category: "saas",
    categories: ["saas", "workflow_agent"],
    stack: ["Claude 3.5 Sonnet", "Python", "Tailwind CSS", "Supabase"],
    summary: "月入 6 位數美金的 AI 內容重寫與 Humanizer 產品，解析 Prompt 鏈調校與 Token 計費設計。",
    body: `# StealthWriter

## 問題
生成式模型輸出容易被偵測、語氣生硬。內容工作者需要「生成 → 改寫 → 檢測」的穩定流水線，而不是一次性聊天。

## 方案
做成 LLM Wrapper：可設定上下文長度、定價與用量，Humanizer 與 Detector 分開模組，便於迭代 Prompt。

## 架構
\`\`\`
使用者 → Tailwind UI → API → Claude 3.5（生成／改寫）→ 檢測器 → 用量與付款
\`\`\`

## 關鍵學習
1. Prompt 要版本化，不能散落在對話
2. 把「像人」拆成可測的驗收（語氣、重複句、偵測分數）
3. 支付與額度必須跟功能開關綁在同一資料模型
4. 這正是 Tenth Project 學院第 2–5 課的實戰藍本

## 結果
可收款的工具站結構：不是 demo，而是能重複賣的 SOP。
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444403",
    title: "Image Prompt Org",
    slug: "image-prompt-org",
    category: "platform",
    categories: ["platform", "content"],
    stack: ["Next.js", "Supabase", "Midjourney API"],
    summary: "提示詞分享與 AI 圖像生成社群平台，分析高流量留存與 UGC 社群裂變機制。",
    body: `# Image Prompt Org

## 問題
優質圖像提示詞分散在聊天室與截圖。創作者找不到可搜尋、可再混搭的資產，平台也難以形成網絡效應。

## 方案
做成 UGC 平台：上傳／收藏提示詞、一鍵送到生成介面、用帳號體系累積聲譽與回訪。

## 架構
\`\`\`
Next.js → Supabase（用戶、收藏、內容）→ Midjourney / 圖像 API → 動態牆與搜尋
\`\`\`

## 關鍵學習
1. 社群產品的 MVP 是「發佈—瀏覽—再生成」，不是大而全的社交網絡
2. 權限與儲存一開始就要進資料庫，否則無法做推薦
3. 生成失敗、審核、重複內容都要進 UAT
4. 流量來自可被搜尋的資產，而不是單次爆款圖

## 結果
高留存來自「還想再跑一次提示詞」——產品與社群是同一條工作流。
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444404",
    title: "HumanAIAgent",
    slug: "humanaiagent",
    category: "workflow_agent",
    categories: ["workflow_agent", "tooling"],
    stack: ["LangChain", "OpenAI API", "Node.js", "MCP Server"],
    summary: "客製化擬人 AI 代理工作流，剖析如何讓 Agent 自動調用 Tool Calling 完成多步驟任務。",
    body: `# HumanAIAgent

## 問題
一般聊天機器人只能回答，不能做事。企業與創作者需要一個會規劃、會呼叫工具、會把多步驟任務做完的擬人 Agent。

## 方案
以 LangChain + OpenAI Tool Calling 建立行動迴圈：觀察 → 決策 → 呼叫工具 → 再觀察。MCP Server 把本地專案脈絡（路線圖、UAT、檔案）接進同一個 Agent。

## 架構
\`\`\`
使用者意圖 → Agent 規劃 → OpenAI Tool Calling → LangChain Tools / MCP → 結果回寫
\`\`\`

## 關鍵學習
1. Tool schema 要比 Prompt 更早定清楚
2. 每一步都要可觀測，否則 Agent 會在迴圈裡空轉
3. MCP 讓 Agent 讀到真實專案狀態，而不是憑空猜測
4. 「擬人」來自穩定的角色、記憶與驗收，而不是更長的人設段落

## 結果
可複製的 Agent 工作流：不是一次示範，而是能反覆完成任務的工具鏈。
`,
  },
];

export function getSeedCaseStudies(): CaseStudy[] {
  const now = new Date().toISOString();
  return CASES.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    category: c.category,
    categories: c.categories,
    summary: c.summary,
    breakdown_md: c.body,
    tech_stack: c.stack,
    cover_image: null,
    author_id: null,
    is_published: true,
    created_at: now,
  }));
}

export const CANONICAL_CASE_SLUGS = CASES.map((c) => c.slug);
export const LEGACY_CASE_SLUG = "solo-founder-built-a-saas-in-48-hours";
