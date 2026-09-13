import type { Metadata } from "next";
import { getDict, getLocale } from "@/lib/i18n/server";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "私隱政策",
  description: "Tenth Project 如何收集、使用與保存個人資料。",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const dict = await getDict();
  const locale = await getLocale();
  const zh = locale === "zh";

  return (
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-6 text-slate-700 leading-relaxed [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-slate-900 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        <p className="text-sm text-slate-500">{dict.legal.lastUpdated}：2026-09-11</p>
        <h1 className="text-3xl font-bold tracking-tight mt-2">{zh ? "私隱政策" : "Privacy Policy"}</h1>
        {zh ? (
          <>
            <p>Tenth Project（「我們」）重視你的私隱。本政策說明我們如何收集、使用與保存資料。本網站目前為 MVP，部分功能使用示範登入。</p>
            <h2>我們收集的資料</h2>
            <ul>
              <li>你主動提供的資料：姓名、電郵、公司資料、專案描述、課程進度、上傳的截圖與網址。</li>
              <li>企業查詢表單中的聯絡與專案資訊。</li>
              <li>技術資料：Cookie（登入狀態、語言偏好）、基本使用紀錄。</li>
            </ul>
            <h2>我們如何使用資料</h2>
            <ul>
              <li>提供課程、專案規劃、UAT、證書與 MCP 同步等服務。</li>
              <li>回覆企業諮詢與改善產品。</li>
              <li>在呼叫 AI 服務時，僅傳送完成分析所需的專案摘要，並盡量避免不必要的敏感內容。</li>
            </ul>
            <h2>儲存與第三方</h2>
            <p>資料可能儲存於 Supabase 與部署平台（例如 Vercel）。AI 分析可能經由 AIML／OpenAI 相容 API 處理。我們不會出售你的個人資料。</p>
            <h2>Cookie</h2>
            <p>我們使用必要 Cookie 維持登入與語言設定（繁體中文為預設，可切換 English）。</p>
            <h2>你的權利</h2>
            <p>你可要求查閱、更正或刪除個人資料。請以電郵聯絡管理員：{PUBLIC_CONTACT_EMAIL}。</p>
            <h2>政策更新</h2>
            <p>我們可能更新本政策，並在本頁顯示最新日期。</p>
          </>
        ) : (
          <>
            <p>Tenth Project (“we”) respects your privacy. This policy explains what we collect and why. This product is an MVP and currently uses demo authentication.</p>
            <h2>What we collect</h2>
            <ul>
              <li>Information you provide: name, email, company details, project descriptions, course progress, screenshots and URLs.</li>
              <li>Enterprise enquiry details.</li>
              <li>Technical data: cookies (session and language) and basic usage logs.</li>
            </ul>
            <h2>How we use it</h2>
            <ul>
              <li>To deliver courses, planning, UAT, certificates, and MCP sync.</li>
              <li>To respond to enterprise enquiries and improve the product.</li>
              <li>To send the minimum project context required for AI analysis.</li>
            </ul>
            <h2>Storage and processors</h2>
            <p>Data may be stored with Supabase and our hosting provider (e.g. Vercel). AI analysis may be processed via an AIML / OpenAI-compatible API. We do not sell personal data.</p>
            <h2>Cookies</h2>
            <p>We use essential cookies for sign-in and language (Traditional Chinese by default; English optional).</p>
            <h2>Your rights</h2>
            <p>You may request access, correction, or deletion by emailing {PUBLIC_CONTACT_EMAIL}.</p>
            <h2>Updates</h2>
            <p>We may update this policy and will post the latest date on this page.</p>
          </>
        )}
      </article>
  );
}
