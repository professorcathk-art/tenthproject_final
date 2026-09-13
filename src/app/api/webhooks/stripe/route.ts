import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { grantLifetimeMembership } from "@/lib/membership/grant-lifetime";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function sessionEmail(session: Stripe.Checkout.Session) {
  return session.metadata?.email || session.customer_details?.email || session.customer_email || "";
}

function sessionCustomerId(session: Stripe.Checkout.Session) {
  if (typeof session.customer === "string") return session.customer;
  if (session.customer && typeof session.customer === "object" && "id" in session.customer) {
    return session.customer.id;
  }
  return null;
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not set" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = sessionEmail(session);
    if (email) {
      try {
        await grantLifetimeMembership({
          email,
          name: session.metadata?.name || "VIP Member",
          whatsapp: session.metadata?.whatsapp || "",
          stripeCustomerId: sessionCustomerId(session),
          stripeSessionId: session.id,
          existingUserId: session.metadata?.user_id || null,
        });
      } catch (error) {
        console.error("grantLifetimeMembership:", error);
        return NextResponse.json({ error: "Failed to grant membership" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
