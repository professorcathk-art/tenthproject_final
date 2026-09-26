import { MarketingGuide } from "@/components/portal/marketing-guide";
import { playbookAccess, VipPlaybookGate } from "@/components/portal/vip-playbook-gate";
import { getLocale } from "@/lib/i18n/server";

export default async function MarketingGuidePage() {
  const [paid, locale] = await Promise.all([playbookAccess(), getLocale()]);
  return (
    <VipPlaybookGate paid={paid}>
      <MarketingGuide locale={locale} />
    </VipPlaybookGate>
  );
}
