import { Resend } from "resend";
import { LEAD_NOTIFY_EMAIL } from "@/lib/contact";

export async function notifyAdmin(subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set — email skipped.");
    return { sent: false as const };
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.RESEND_FROM || "Tenth Project <onboarding@resend.dev>",
    to: process.env.LEAD_NOTIFY_EMAIL || LEAD_NOTIFY_EMAIL,
    subject,
    text,
  });

  if (error) {
    console.error("Resend:", error.message);
    return { sent: false as const };
  }
  return { sent: true as const };
}
