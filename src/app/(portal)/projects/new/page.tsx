import { NewProjectWizard } from "@/components/project/new-project-wizard";
import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";
import { getSession } from "@/lib/auth/session";
import { getProjectQuota } from "@/lib/membership/limits";
import { FREE_TIER_LIMIT_MESSAGE } from "@/lib/membership/constants";
import { getDict } from "@/lib/i18n/server";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login?redirect=/projects/new");
  const dict = await getDict();
  const quota = await getProjectQuota(user.email, user.id, user.isAdmin);

  if (quota.atLimit) {
    return (
      <div className="rounded-3xl glass-panel border border-emerald-500/20 bg-emerald-50/50 p-8 text-center dark:border-emerald-500/30 dark:bg-slate-900/50">
        <p className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">{FREE_TIER_LIMIT_MESSAGE}</p>
        <JoinLifetimeButton className="mt-6">🚀 立即升級終身會員</JoinLifetimeButton>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{dict.dashboard.newProject}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{dict.dashboard.subtitle}</p>
      </div>
      <NewProjectWizard />
    </div>
  );
}
