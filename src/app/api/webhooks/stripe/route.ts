import { after, NextResponse } from "next/server";
import type Stripe from "stripe";
import { notifyAdmin } from "@/lib/email/notify-admin";
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

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = sessionEmail(session);
    const name = session.metadata?.name || "VIP Member";
    const whatsapp = session.metadata?.whatsapp || "";

    if (event.type === "checkout.session.expired") {
      after(() =>
        notifyAdmin(
          `未完成付款｜${name} — ${email || "未知電郵"}`,
          ["Lifetime Checkout 逾時未付款。", "", `姓名：${name}`, `電郵：${email || "—"}`, `WhatsApp：${whatsapp || "—"}`, `Stripe session：${session.id}`].join("\n"),
        ).catch((error) => console.error("abandoned checkout email:", error)),
      );
      return NextResponse.json({ received: true });
    }

    if (email) {
      try {
        await grantLifetimeMembership({
          email,
          name,
          whatsapp,
          stripeCustomerId: sessionCustomerId(session),
          stripeSessionId: session.id,
          existingUserId: session.metadata?.user_id || null,
        });
        after(() =>
          notifyAdmin(
            `新付款｜${name} — ${email}`,
            ["Lifetime 付款成功。", "", `姓名：${name}`, `電郵：${email}`, `WhatsApp：${whatsapp || "—"}`, `Stripe session：${session.id}`].join("\n"),
          ).catch((error) => console.error("sale email:", error)),
        );
      } catch (error) {
        console.error("grantLifetimeMembership:", error);
        return NextResponse.json({ error: "Failed to grant membership" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
