import { NextResponse } from "next/server";
import { getCheckoutBaseUrl, getLifetimePriceId, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const whatsapp = typeof body.whatsapp === "string" ? body.whatsapp.trim() : "";

    if (!name || !email.includes("@") || !whatsapp) {
      return NextResponse.json({ error: "Name, email, and WhatsApp are required." }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: getLifetimePriceId(), quantity: 1 }],
      mode: "payment",
      customer_email: email,
      metadata: { name, email, whatsapp },
      success_url: `${getCheckoutBaseUrl()}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getCheckoutBaseUrl()}/courses`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start checkout";
    console.error("create-checkout:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
