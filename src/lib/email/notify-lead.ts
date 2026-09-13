import { notifyAdmin } from "@/lib/email/notify-admin";
import type { EnterpriseEnquiry } from "@/types/platform";

export async function notifyLeadByEmail(
  enquiry: EnterpriseEnquiry,
  extras?: { locale?: "zh" | "en"; preferredSlot?: string },
) {
  const slot = extras?.preferredSlot || "";
  return notifyAdmin(
    `新企業諮詢｜${enquiry.company_name} — ${enquiry.contact_name}`,
    [
      "Tenth Project 收到一則新的企業諮詢。",
      "",
      `公司：${enquiry.company_name}`,
      `聯絡人：${enquiry.contact_name}`,
      `電郵：${enquiry.email}`,
      `電話：${enquiry.phone || "—"}`,
      `服務：${enquiry.service_type}`,
      `規模：${enquiry.company_size || "—"}`,
      `預算：${enquiry.budget_range || "—"}`,
      `預約時段：${slot || "—"}`,
      "",
      "需求說明：",
      enquiry.project_description,
    ].join("\n"),
  );
}
