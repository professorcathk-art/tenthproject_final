import { after, NextRequest, NextResponse } from "next/server";
import { createEnterpriseEnquiry } from "@/lib/db/platform-store";
import { notifyLeadByEmail } from "@/lib/email/notify-lead";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const companyName = typeof body.company_name === "string" ? body.company_name.trim() : "";
    const contactName = typeof body.contact_name === "string" ? body.contact_name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const serviceType = typeof body.service_type === "string" ? body.service_type.trim() : "";
    if (!companyName || !contactName || !email.includes("@") || !serviceType) {
      return NextResponse.json({ error: "Company, contact, email, and service type are required." }, { status: 400 });
    }
    const preferredSlot = typeof body.preferred_slot === "string" ? body.preferred_slot.trim() : "";
    const locale = body.locale === "en" ? "en" : "zh";
    const projectDescription = preferredSlot
      ? `【預約時段 / Preferred slot】${preferredSlot}\n\n${body.project_description ?? ""}`
      : body.project_description;
    const enquiry = await createEnterpriseEnquiry({
      company_name: companyName,
      contact_name: contactName,
      email,
      phone: body.phone ?? null,
      service_type: serviceType,
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
