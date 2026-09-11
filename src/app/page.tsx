import { MarketingShell } from "@/components/layout/app-shell";
import { LandingView } from "@/components/marketing/landing-view";
import { ensurePlatformSeeded } from "@/lib/seed/init";

export default async function LandingPage() {
  await ensurePlatformSeeded();
  return (
    <MarketingShell>
      <LandingView />
    </MarketingShell>
  );
}
