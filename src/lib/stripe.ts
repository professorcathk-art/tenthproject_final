import Stripe from "stripe";
import { SITE_URL } from "@/lib/seo";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key);
}

export function getCheckoutBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    SITE_URL
  ).replace(/\/$/, "");
}

export function getLifetimePriceId() {
  const priceId = process.env.STRIPE_LIFETIME_PRICE_ID;
  if (!priceId) {
    throw new Error("STRIPE_LIFETIME_PRICE_ID is not set");
  }
  return priceId;
}
