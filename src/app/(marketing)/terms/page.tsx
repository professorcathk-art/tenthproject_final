import type { Metadata } from "next";
import { getDict, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "使用條款",
  description: "Tenth Project 網站、課程與顧問服務的使用條款。",
  path: "/terms",
});

export default async function TermsPage() {
  const dict = await getDict();
  const locale = await getLocale();
  const zh = locale === "zh";

  return (
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 space-y-6 text-slate-700 leading-relaxed [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-slate-900 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        <p className="text-sm text-slate-500">{dict.legal.lastUpdated}：2026-09-11</p>
        <h1 className="text-3xl font-bold tracking-tight mt-2">{zh ? "使用條款" : "Terms of Use"}</h1>
        {zh ? (
          <>
            <p>使用 Tenth Project（「本服務」）即表示你同意本條款。若不同意，請勿使用本服務。</p>
            <h2>1. 服務性質</h2>
            <p>本服務提供學習內容、專案規劃、UAT 追蹤、AI 提示詞生成與企業查詢功能。目前為 MVP，功能可能變更。示範登入不構成完整帳戶系統保證。</p>
            <h2>2. 帳號與管理員</h2>
            <p>後台管理權限僅授予指定電郵（professor.cat.hk@gmail.com）。你必須確保所提供資料正確，並對你帳號下的操作負責。</p>
            <h2>3. 內容與知識產權</h2>
            <p>課程、案例與平台介面之權利屬 Tenth Project 或其授權方。你上傳或輸入的專案內容仍歸你所有，但你授權我們為提供服務而儲存與處理該內容。你不得上傳侵權、違法或惡意內容。</p>
            <h2>4. AI 輸出免責</h2>
            <p>AI 生成的路線圖、提示詞與建議僅供參考，不保證正確、完整或適於特定用途。你應自行審查後再用於開發或商業決策。</p>
            <h2>5. 證書</h2>
            <p>證書證明你已完成本平台記錄之課程單元與測驗，並非政府認可學歷。</p>
            <h2>6. 企業查詢</h2>
            <p>提交企業表單不構成合約。正式合作需另行書面確認。</p>
            <h2>7. 責任限制</h2>
            <p>在法律允許範圍內，我們不對間接損失、資料遺失或業務中斷負責。本服務按「現況」提供。</p>
            <h2>8. 準據法</h2>
            <p>本條款受香港特別行政區法律管轄。</p>
            <h2>9. 聯絡</h2>
            <p>professor.cat.hk@gmail.com</p>
          </>
        ) : (
          <>
            <p>By using Tenth Project (the “Service”), you agree to these terms. If you do not agree, do not use the Service.</p>
            <h2>1. The Service</h2>
            <p>We provide learning content, project planning, UAT tracking, AI prompt generation, and enterprise enquiries. This is an MVP and may change. Demo sign-in is not a guarantee of a full account system.</p>
            <h2>2. Accounts and admin</h2>
            <p>Admin access is limited to professor.cat.hk@gmail.com. You are responsible for activity under your session and for providing accurate information.</p>
            <h2>3. Content and IP</h2>
            <p>Platform content belongs to Tenth Project or its licensors. You retain rights to project materials you upload, and grant us a licence to store and process them to provide the Service. Do not upload unlawful or infringing content.</p>
            <h2>4. AI output</h2>
            <p>Generated plans and prompts are guidance only. You must review them before use.</p>
            <h2>5. Certificates</h2>
            <p>Certificates confirm completion of recorded lessons and quizzes. They are not accredited academic qualifications.</p>
            <h2>6. Enterprise enquiries</h2>
            <p>Submitting a form does not create a contract. Engagements require a separate written agreement.</p>
            <h2>7. Liability</h2>
            <p>To the extent permitted by law, we are not liable for indirect loss. The Service is provided “as is”.</p>
            <h2>8. Governing law</h2>
            <p>These terms are governed by the laws of the Hong Kong SAR.</p>
            <h2>9. Contact</h2>
            <p>professor.cat.hk@gmail.com</p>
          </>
        )}
      </article>
  );
}
