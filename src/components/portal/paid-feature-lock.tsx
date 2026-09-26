import { Lock } from "lucide-react";
import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";
import { getLocale } from "@/lib/i18n/server";
import { getMembershipAccess } from "@/lib/auth/membership";
import { getSession } from "@/lib/auth/session";

export async function paidMemberOrLock(feature: "hub" | "mcp") {
  const { user } = await getSession();
  const access = await getMembershipAccess(user?.email, Boolean(user?.isAdmin));
  if (access.paid) return null;
  return <PaidFeatureLock feature={feature} />;
}

export async function PaidFeatureLock({ feature }: { feature: "hub" | "mcp" }) {
  const locale = await getLocale();
  const en = locale === "en";
  const body =
    feature === "mcp"
      ? en
        ? "MCP is included with VIP lifetime membership. After you upgrade, Cursor can read your roadmap and write test results back to the project."
        : "MCP 連線是 VIP 終身會員專屬。升級之後，Cursor 才能讀取你的路線圖，並把測試結果寫回這個專案。"
      : en
        ? "The project hub is included with VIP lifetime membership. After you upgrade, you can create projects, follow the roadmap, and keep building in Cursor."
        : "專案中心是 VIP 終身會員專屬。升級之後，你可以建立專案、跟著路線圖做，並用 Cursor 接著完成。";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <Lock className="mx-auto mb-4 h-12 w-12 text-slate-400" />
        <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          {en ? "This is for VIP lifetime members" : "此功能為 VIP 終身會員專屬"}
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-500">{body}</p>
        <JoinLifetimeButton>{en ? "Upgrade to lifetime membership" : "立即升級終身會員"}</JoinLifetimeButton>
      </div>
    </div>
  );
}
