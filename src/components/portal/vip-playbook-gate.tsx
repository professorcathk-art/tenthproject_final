import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";
import { getMembershipAccess } from "@/lib/auth/membership";
import { getSession } from "@/lib/auth/session";

export async function playbookAccess() {
  const { user } = await getSession();
  const access = await getMembershipAccess(user?.email, Boolean(user?.isAdmin));
  return access.paid;
}

export function VipPlaybookGate({ paid, children }: { paid: boolean; children: ReactNode }) {
  if (paid) return children;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-950">
      <Lock className="h-14 w-14 text-slate-400" strokeWidth={1.5} />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">此內容為 VIP 終身會員專屬</h1>
      <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
        升級 VIP 終身會員即可解鎖完整的《SaaS 從 0 到 1 敏捷開發指南》與《零成本獲客與增長指南》，獲取從開發、UAT 到行銷變現的全套 SOP。
      </p>
      <JoinLifetimeButton className="mt-8">⚡ 立即升級終身會員解鎖</JoinLifetimeButton>
    </div>
  );
}
