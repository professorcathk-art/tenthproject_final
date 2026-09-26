import { MarketingGuide } from "@/components/portal/marketing-guide";
import { playbookAccess, VipPlaybookGate } from "@/components/portal/vip-playbook-gate";

export default async function MarketingGuidePage() {
  const paid = await playbookAccess();
  return (
    <VipPlaybookGate paid={paid}>
      <MarketingGuide />
    </VipPlaybookGate>
  );
}
