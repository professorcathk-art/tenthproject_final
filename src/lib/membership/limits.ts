import { getMembershipAccess } from "@/lib/auth/membership";
import { getProjects } from "@/lib/db/store";
import { FREE_PROJECT_LIMIT, PAID_PROJECT_LIMIT } from "@/lib/membership/constants";

export { FREE_PROJECT_LIMIT, FREE_TIER_LIMIT_MESSAGE, PAID_PROJECT_LIMIT } from "@/lib/membership/constants";

export async function getProjectQuota(email: string | null | undefined, userId: string, isAdmin = false) {
  const access = await getMembershipAccess(email, isAdmin);
  const projects = await getProjects(userId);
  const limit = access.paid ? PAID_PROJECT_LIMIT : FREE_PROJECT_LIMIT;
  return {
    paid: access.paid,
    plan: access.plan,
    count: projects.length,
    limit,
    remaining: Math.max(0, limit - projects.length),
    atLimit: !access.paid && projects.length >= FREE_PROJECT_LIMIT,
  };
}
