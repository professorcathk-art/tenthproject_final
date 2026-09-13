import { NextResponse } from "next/server";
import { captureFreeCheckoutLead, isPaidEmail } from "@/lib/auth/membership";
import { getSession } from "@/lib/auth/session";
import { getCheckoutBaseUrl, getLifetimePriceId, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getSession();
    const signedIn = session.isAuthenticated && session.user;

    const name = signedIn
      ? session.user.name || (typeof body.name === "string" ? body.name.trim() : "")
      : typeof body.name === "string"
        ? body.name.trim()
        : "";
    const email = signedIn
      ? session.user.email
      : typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const whatsapp = typeof body.whatsapp === "string" ? body.whatsapp.trim() : "";

    if (!name || !email.includes("@") || !whatsapp) {
      return NextResponse.json({ error: "Name, email, and WhatsApp are required." }, { status: 400 });
    }

    if (await isPaidEmail(email)) {
      return NextResponse.json(
        { error: "此電郵已是付費會員，請直接登入，無需重複購買。", code: "already_paid" },
        { status: 409 },
      );
    }

    try {
      await captureFreeCheckoutLead(email, name, whatsapp);
    } catch (error) {
      console.error("captureFreeCheckoutLead:", error);
    }

    const stripe = getStripe();
    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: getLifetimePriceId(), quantity: 1 }],
      mode: "payment",
      allow_promotion_codes: true,
      customer_email: email,
      metadata: {
        name,
        email,
        whatsapp,
        ...(signedIn ? { user_id: session.user.id } : {}),
      },
      success_url: `${getCheckoutBaseUrl()}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getCheckoutBaseUrl()}/courses`,
    });

    if (!checkout.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
    }

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start checkout";
    console.error("create-checkout:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
