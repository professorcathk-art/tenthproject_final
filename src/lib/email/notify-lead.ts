import { Resend } from "resend";
import { LEAD_NOTIFY_EMAIL, PUBLIC_CONTACT_EMAIL, WHATSAPP_DISPLAY } from "@/lib/contact";
import type { EnterpriseEnquiry } from "@/types/platform";

export async function notifyLeadByEmail(
  enquiry: EnterpriseEnquiry,
  extras?: { locale?: "zh" | "en"; preferredSlot?: string }
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set — lead saved, email not sent.");
    return { sent: false as const, reason: "missing_key" };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? "Tenth Project <onboarding@resend.dev>";
  const to = process.env.LEAD_NOTIFY_EMAIL ?? LEAD_NOTIFY_EMAIL;
  const slot = extras?.preferredSlot || "";

  const internal = await resend.emails.send({
    from,
    to,
    replyTo: enquiry.email,
    subject: `新企業諮詢｜${enquiry.company_name} — ${enquiry.contact_name}`,
    text: [
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
      "",
      `公開聯絡：${PUBLIC_CONTACT_EMAIL}`,
    ].join("\n"),
    html: `
      <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#0f172a">
        <p>Tenth Project 收到一則新的企業諮詢。</p>
        <table style="border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">公司</td><td>${escapeHtml(enquiry.company_name)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">聯絡人</td><td>${escapeHtml(enquiry.contact_name)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">電郵</td><td>${escapeHtml(enquiry.email)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">電話</td><td>${escapeHtml(enquiry.phone || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">服務</td><td>${escapeHtml(enquiry.service_type)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">規模</td><td>${escapeHtml(enquiry.company_size || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">預算</td><td>${escapeHtml(enquiry.budget_range || "—")}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">預約時段</td><td>${escapeHtml(slot || "—")}</td></tr>
        </table>
        <p style="margin-top:16px;white-space:pre-wrap">${escapeHtml(enquiry.project_description)}</p>
      </div>
    `,
  });

  if (internal.error) {
    console.error("Resend lead email failed:", internal.error.message);
  }

  const zh = extras?.locale !== "en";
  const confirm = await resend.emails.send({
    from,
    to: enquiry.email,
    replyTo: PUBLIC_CONTACT_EMAIL,
    subject: zh
      ? `已收到你的諮詢｜Tenth Project`
      : `We received your enquiry | Tenth Project`,
    text: zh
      ? [
          `${enquiry.contact_name} 你好，`,
          "",
          "我們已收到你的企業諮詢，會在 1–2 個工作天內與你聯絡。",
          slot ? `你選擇的時段：${slot}` : "",
          "",
          `如需即時聯絡：${PUBLIC_CONTACT_EMAIL} 或 WhatsApp ${WHATSAPP_DISPLAY}`,
          "",
          "Tenth Project",
        ].filter(Boolean).join("\n")
      : [
          `Hello ${enquiry.contact_name},`,
          "",
          "We received your enterprise enquiry and will contact you within 1–2 business days.",
          slot ? `Preferred slot: ${slot}` : "",
          "",
          `Reach us anytime: ${PUBLIC_CONTACT_EMAIL} or WhatsApp ${WHATSAPP_DISPLAY}`,
          "",
          "Tenth Project",
        ].filter(Boolean).join("\n"),
  });

  if (confirm.error) {
    console.error("Resend confirmation email failed:", confirm.error.message);
  }

  if (internal.error && confirm.error) {
    return { sent: false as const, reason: internal.error.message };
  }
  return { sent: true as const };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
