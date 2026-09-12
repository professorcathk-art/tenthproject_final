import { MarketingShell } from "@/components/layout/app-shell";
import { AcademyBrochure } from "@/components/marketing/academy-brochure";
import { ensurePlatformSeeded } from "@/lib/seed/init";

export default async function CoursesPage() {
  await ensurePlatformSeeded();
  return (
    <MarketingShell>
      <AcademyBrochure />
    </MarketingShell>
  );
}
