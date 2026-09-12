import type { Course, Lesson } from "@/types/platform";
export { CANONICAL_CASE_SLUGS, LEGACY_CASE_SLUG, getSeedCaseStudies } from "@/lib/seed/case-studies";

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
