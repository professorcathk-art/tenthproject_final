import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentSuccessView } from "@/components/membership/payment-success-view";

export const metadata: Metadata = {
  title: "付款成功｜Tenth Project",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-500">Loading…</div>}>
      <PaymentSuccessView />
    </Suspense>
  );
}
