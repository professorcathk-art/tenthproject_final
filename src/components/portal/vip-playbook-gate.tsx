import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";
import { getLocale } from "@/lib/i18n/server";
import { getMembershipAccess } from "@/lib/auth/membership";
import { getSession } from "@/lib/auth/session";

export async function playbookAccess() {
  const { user } = await getSession();
  const access = await getMembershipAccess(user?.email, Boolean(user?.isAdmin));
  return access.paid;
}

export async function VipPlaybookGate({ paid, children }: { paid: boolean; children: ReactNode }) {
  if (paid) return children;
  const locale = await getLocale();
  const en = locale === "en";

  return (
    <div className="relative w-full min-h-[80vh]">
      <div className="pointer-events-none h-[80vh] select-none overflow-hidden opacity-40 blur-[4px]" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-white/80 px-4 dark:to-slate-950/80">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <Lock className="mx-auto mb-4 h-12 w-12 text-slate-400" />
          <h3 className="mb-2 text-xl font-bold">{en ? "This is for VIP lifetime members" : "此內容為 VIP 終身會員專屬"}</h3>
          <p className="mb-6 text-sm leading-relaxed text-slate-500">
            {en
              ? "Upgrade to VIP lifetime membership to unlock the full Agile SaaS Guide from 0 to 1 and the Zero-Cost Acquisition and Growth Guide, including every hands-on prompt template and the pitfalls from real builds."
              : "升級 VIP 終身會員即可解鎖完整的《SaaS 從 0 到 1 敏捷開發指南》與《零成本獲客與增長指南》，獲取所有實戰 Prompt 模板與踩坑教學。"}
          </p>
          <JoinLifetimeButton>{en ? "⚡ Upgrade to lifetime membership" : "⚡ 立即升級終身會員解鎖"}</JoinLifetimeButton>
        </div>
      </div>
    </div>
  );
}
