export const MASTER_PROMPT_CODING_CONSTRAINTS = `CRITICAL CONSTRAINTS FOR MASTER PROMPT GENERATION:
1. PURE DEVELOPMENT FOCUS: The output must ONLY contain instructions for an AI Coding Assistant (like Cursor) to write code.
2. NO NON-CODING TASKS: Absolutely DO NOT include tasks like "Market Research (市場調查)", "User Interviews (用戶訪談)", "Writing Reports", or "UI/UX Mockups".
3. THIS SPRINT SCOPE: The sprint scope must be strict technical implementations (e.g., "Implement Next.js App Router for Home Page", "Create Supabase Auth Schema", "Build REST API for Itinerary").
4. FEATURE REQUIREMENTS: Translate user needs into technical features (e.g., "PostgreSQL Database", "Stripe Integration", "Tailwind CSS Layouts").

Example of the FIX for the generated output:

❌ Wrong Scope: "1. 完成市場調查，並生成報告。 2. 收集至少10個用戶故事。"

✅ Correct Scope: "1. 建立 Next.js 專案基礎架構與路由。 2. 實作 MongoDB 連線與 Schema 設計。 3. 開發前端行程表單組件 (ItineraryForm.tsx)。"`;

const NON_CODING_RE =
  /市場調查|用戶訪談|用戶調研|競品分析|撰寫報告|寫報告|收集.{0,8}用戶故事|market research|user interviews?|writing reports?|ui\/ux mockups?|competitor analysis|stakeholder workshop/i;

export function looksLikeNonCodingWork(text: string | null | undefined): boolean {
  return Boolean(text && NON_CODING_RE.test(text));
}

export function keepCodingItems<T>(items: T[] | undefined, textOf: (item: T) => string): T[] {
  return (items ?? []).filter((item) => !looksLikeNonCodingWork(textOf(item)));
}
