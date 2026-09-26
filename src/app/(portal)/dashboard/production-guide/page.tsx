import { playbookAccess, VipPlaybookGate } from "@/components/portal/vip-playbook-gate";
import { ProductionGuide } from "@/components/portal/production-guide";
import { getLocale } from "@/lib/i18n/server";

export default async function ProductionGuidePage() {
  const [paid, locale] = await Promise.all([playbookAccess(), getLocale()]);
  return (
    <VipPlaybookGate paid={paid}>
      <ProductionGuide locale={locale} />
    </VipPlaybookGate>
  );
}
