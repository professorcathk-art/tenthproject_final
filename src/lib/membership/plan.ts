import { fromBillingTier, isPaidPlan, type MemberPlan } from "@/types/platform";

export function normalizeStoredPlan(plan: string | null | undefined, existing?: string | null): MemberPlan {
  if (!plan || plan === "free" || !isPaidPlan(plan)) return "free";
  if (plan === "paid") return fromBillingTier("paid", existing);
  if (plan === "enterprise" || existing === "enterprise") return "enterprise";
  return "academy";
}
