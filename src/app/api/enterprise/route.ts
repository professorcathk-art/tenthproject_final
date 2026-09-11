import { after, NextRequest, NextResponse } from "next/server";
import { createEnterpriseEnquiry } from "@/lib/db/platform-store";
import { notifyLeadByEmail } from "@/lib/email/notify-lead";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const preferredSlot = typeof body.preferred_slot === "string" ? body.preferred_slot.trim() : "";
    const locale = body.locale === "en" ? "en" : "zh";
    const projectDescription = preferredSlot
      ? `【預約時段 / Preferred slot】${preferredSlot}\n\n${body.project_description ?? ""}`
      : body.project_description;
    const enquiry = await createEnterpriseEnquiry({
      company_name: body.company_name,
      contact_name: body.contact_name,
      email: body.email,
      phone: body.phone ?? null,
      service_type: body.service_type,
      company_size: body.company_size ?? null,
      budget_range: body.budget_range ?? null,
      project_description: projectDescription,
    });
    after(() =>
      notifyLeadByEmail(enquiry, { locale, preferredSlot }).catch((error) => {
        console.error("Lead email notify failed:", error);
      })
    );
    return NextResponse.json({ enquiry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
