import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FolderOpen } from "lucide-react";
import { ProjectHubGrid } from "@/components/project/project-hub-grid";
import { ProjectHubTips } from "@/components/project/project-hub-tips";
import { SkoolClassroomBanner } from "@/components/membership/skool-classroom-banner";
import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";
import { getSession } from "@/lib/auth/session";
import { getMemberHubSnapshot } from "@/lib/db/store";
import { getProjectQuota } from "@/lib/membership/limits";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n/server";

export default async function DashboardPage() {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login?redirect=/dashboard");

  const dict = await getDict();
  const [{ projects, openUat, recentPrompts }, quota] = await Promise.all([
    getMemberHubSnapshot(user.id),
    getProjectQuota(user.email, user.id, user.isAdmin),
  ]);

  return (
    <div className="space-y-8">
      {quota.paid ? (
        <SkoolClassroomBanner />
      ) : (
        <section className="rounded-3xl glass-panel border border-emerald-500/20 bg-emerald-50/50 p-6 dark:border-emerald-500/30 dark:bg-slate-900/50 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">您目前使用的是免費方案</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              您已使用 {quota.count}/1 個免費專案額度。升級 VIP 終身會員即可解鎖 20 個專案、Skool 10小時大師課與 Cursor MCP 同步功能。
            </p>
          </div>
          <JoinLifetimeButton className="mt-5 sm:mt-0">🚀 立即升級終身會員</JoinLifetimeButton>
        </section>
      )}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{dict.dashboard.title}</h1>
            <ProjectHubTips />
          </div>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{dict.dashboard.subtitle}</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            {dict.dashboard.newProject}
          </Button>
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{dict.portal.hub}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{projects.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{dict.dashboard.openUat}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{openUat.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{dict.dashboard.promptsTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{recentPrompts.length}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="mb-4 h-12 w-12 text-slate-300" />
            <h2 className="mb-2 text-lg font-semibold">{dict.dashboard.emptyTitle}</h2>
            <p className="mb-6 max-w-sm text-slate-500">{dict.dashboard.emptyDesc}</p>
            <Link href="/projects/new">
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                {dict.dashboard.emptyCta}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ProjectHubGrid projects={projects} />
      )}
    </div>
  );
}
