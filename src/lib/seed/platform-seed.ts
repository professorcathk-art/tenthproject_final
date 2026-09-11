import type { CaseStudy, CaseStudyCategory, Course, Lesson } from "@/types/platform";

export const FLAGSHIP_COURSE_ID = "11111111-1111-1111-1111-111111111101";
export const LEGACY_AGENT_COURSE_ID = "11111111-1111-1111-1111-111111111102";
export const FLAGSHIP_SLUG = "ai-vibecoding";

export const SEED_COURSES: Course[] = [
  {
    id: FLAGSHIP_COURSE_ID,
    title: "Vibe Coding 與 AI Agent 從零到高手全攻略",
    slug: FLAGSHIP_SLUG,
    description:
      "Felix Zhu 與 Chris Liu 雙導師親授。從 Cursor／Lovable 基礎、Master Prompt、Supabase 全端，到 AI Agent、MCP 與商業化上線——項目導向，完成測驗即可取得可公開驗證證書。",
    cover_image: null,
    level: "beginner",
    duration_hours: 21,
    published: true,
    created_at: new Date().toISOString(),
  },
];

const modules: Omit<Lesson, "id" | "course_id" | "created_at">[] = [
  {
    title: "Module 1：Vibe Coding 思維重構與 Cursor / Lovable 基礎",
    order_index: 0,
    video_url: null,
    content_md: `# Module 1：Vibe Coding 思維重構

Vibe Coding 不是「叫 AI 寫幾行 code」，而是用清楚的產品意圖、可測試的範圍，以及可複製的開發節奏，把產品做出來。

## 這一課你會學會
- 用一句話定義產品目標與完成樣貌
- 安裝並設定 Cursor、Lovable
- 用小步衝刺取代一次生成整份專案
- 分辨什麼該交給 AI、什麼必須由你驗收

## 實作節奏
1. 寫下目標使用者與核心痛點
2. 定義 MVP：只做能驗證需求的最小功能
3. 在 Cursor 裡用 Chat 規劃、用 Inline Edit 改檔
4. 每一輪改動後手動走一次主要路徑

## 導師觀點
Felix Zhu（前阿里技術專家）強調：先有架構直覺，再讓工具加速。不要把對話當版本控制——路線圖與 UAT 才是進度來源。
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
    title: "Module 2：實戰 Prompt 工程與 Master Prompt 撰寫技巧",
    order_index: 1,
    video_url: null,
    content_md: `# Module 2：Prompt 工程與 Master Prompt

好的提示詞像一份可執行的專案簡報，而不是一句願望。

## Master Prompt 應包含
- 產品願景與目標使用者
- 技術棧與檔案結構
- 本衝刺範圍（做什麼／不做什麼）
- 驗收標準（Acceptance Criteria）
- 已知限制與風險

## 實戰練習
對齊 StealthWriter 類 LLM Wrapper：先生成，再 Humanize，再以檢測器驗證。把這個流程寫進 Master Prompt，而不是每次重講一次。

Tenth Project 專案中心可自動產出可貼到 Cursor 的主提示詞——課堂會拆解為什麼這樣寫。
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
    title: "Module 3：應用 Supabase、API 與 AI 模組構建 Full-Stack 產品",
    order_index: 2,
    video_url: null,
    content_md: `# Module 3：Full-Stack 產品骨架

沒有帳號、資料與 API，產品只是靜態頁。

## 本課模組
- Supabase Auth：註冊／登入
- 使用者資料表與權限思路
- LLM Wrapper：把 Prompt 封成穩定 API
- 用量、套餐與功能開關的資料模型

## 對齊實戰產品
課程以可收款的海外工具站為藍本（如 Humanizer／StealthWriter 結構）：生成 → 改寫 → 輸出，再接上使用者體系。

產出：一個可登入的 LLM 應用骨架，而不是示範用的單頁。
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
    title: "Module 4：AI Agent 架構解析、Tool Calling 與 MCP 本地端整合",
    order_index: 3,
    video_url: null,
    content_md: `# Module 4：AI Agent 與 MCP

Agent 與聊天機器人的分別：它會**自主使用工具**完成目標。

## 架構元件
- LLM 決策層
- Tool / Function schema
- 短期記憶與專案脈絡
- 行動迴圈（觀察 → 決策 → 呼叫 → 再觀察）

## MCP（Model Context Protocol）
把 Cursor 接到 Tenth Project 之後，對話不再憑空開始：
- \`get_active_roadmap\`：下一步做什麼
- \`fetch_uat_status\`：哪些驗收還沒過
- \`update_uat_item\`：把測試結果寫回
- \`log_bug\`：建置失敗時登記錯誤

課堂會帶你產生金鑰、寫 \`.cursor/mcp.json\`，並用真實專案走一次。
`,
    quiz_data: [
      {
        id: "m4q1",
        question: "MCP 對 Vibe Coding 最直接的價值是？",
        options: ["讓網站變漂亮", "讓 Cursor 讀取路線圖與 UAT，而不是把進度留在對話裡", "取代所有測試", "自動向投資人簡報"],
        correctIndex: 1,
      },
    ],
  },
  {
    title: "Module 5：UAT 自動化測試、產品上線與商業化營運",
    order_index: 4,
    video_url: null,
    content_md: `# Module 5：驗收、上線、收款

能跑的 demo 與能營運的產品，差在驗收與商業閉環。

## 上線清單
- UAT 逐項：預期結果 vs 實際結果
- 部署到 Vercel，環境變數齊全
- Stripe Checkout／Portal 與 Webhook
- 套餐購買後更新使用權限
- 基礎 GA／事件追蹤

## 可複製方法論
需求發現 → AI 開發 SOP → 收款部署 → 用同一套流程做第二個產品。

完成本課測驗且通過全部單元，即可獲發 Tenth Project 可公開驗證畢業證書。
`,
    quiz_data: [
      {
        id: "m5q1",
        question: "商業化閉環最少要打通哪一層？",
        options: ["只做 Landing Page", "支付、權限與可觀測的使用數據", "每天發一篇社交媒體", "先融資再做產品"],
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
  stack: string[];
  summary: string;
  body: string;
}> = [
  {
    id: "44444444-4444-4444-4444-444444444401",
    title: "CalAI",
    slug: "calai",
    category: "saas",
    stack: ["Cursor", "Next.js", "Computer Vision API"],
    summary: "非技術創作者如何利用 Vibe Coding 打造月營收爆發的 AI 熱量計算 App，從概念到 App Store 上線全拆解。",
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
    category: "tooling",
    stack: ["Claude 3.5", "Python", "Tailwind"],
    summary: "解決 AI 內文重寫與 Humanizer 需求，精準調教 Prompt 與 API 串接的商業化案例。",
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
    stack: ["Next.js", "Supabase", "Midjourney API"],
    summary: "提示詞社群平台設計，如何透過社群 UGC 與 AI 圖像生成介面實現高流量留存。",
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
];

export function getSeedCaseStudies(): CaseStudy[] {
  const now = new Date().toISOString();
  return CASES.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    category: c.category,
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
