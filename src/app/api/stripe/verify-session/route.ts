import { NextRequest, NextResponse } from "next/server";
import { writeSessionCookie } from "@/lib/auth/session";
import { grantLifetimeMembership } from "@/lib/membership/grant-lifetime";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment is not complete." }, { status: 402 });
    }

    const email =
      session.metadata?.email || session.customer_details?.email || session.customer_email || "";
    if (!email) {
      return NextResponse.json({ error: "Checkout session has no email." }, { status: 400 });
    }

    const granted = await grantLifetimeMembership({
      email,
      name: session.metadata?.name || session.customer_details?.name || "VIP Member",
      whatsapp: session.metadata?.whatsapp || "",
      stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
      stripeSessionId: session.id,
    });

    const response = NextResponse.json({
      ok: true,
      email: granted.email,
      name: granted.name,
    });
    writeSessionCookie(response, {
      email: granted.email,
      name: granted.name,
      id: granted.userId,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify session";
    console.error("verify-session:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
