"use client";

import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";
import { useI18n } from "@/components/i18n/provider";

export function JoinNowButton({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { dict } = useI18n();

  return (
    <JoinLifetimeButton variant={variant === "dark" ? "dark" : "primary"}>
      {dict.nav.joinNow}
    </JoinLifetimeButton>
  );
}
