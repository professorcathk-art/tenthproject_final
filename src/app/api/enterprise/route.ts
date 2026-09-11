import { NextRequest, NextResponse } from "next/server";
import { createEnterpriseEnquiry } from "@/lib/db/platform-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const enquiry = await createEnterpriseEnquiry({
      company_name: body.company_name,
      contact_name: body.contact_name,
      email: body.email,
      phone: body.phone ?? null,
      service_type: body.service_type,
      company_size: body.company_size ?? null,
      budget_range: body.budget_range ?? null,
      project_description: body.project_description,
    });
    return NextResponse.json({ enquiry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
