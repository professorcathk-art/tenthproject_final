import { playbookAccess, VipPlaybookGate } from "@/components/portal/vip-playbook-gate";
import { ProductionGuide } from "@/components/portal/production-guide";

export default async function ProductionGuidePage() {
  const paid = await playbookAccess();
  return (
    <VipPlaybookGate paid={paid}>
      <ProductionGuide />
    </VipPlaybookGate>
  );
}
