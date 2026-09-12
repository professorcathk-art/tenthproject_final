import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen, ClipboardCheck, FileOutput } from "lucide-react";
import { ProjectHubGrid } from "@/components/project/project-hub-grid";
import { getSession } from "@/lib/auth/session";
import { getMemberHubSnapshot, getRecentActivity } from "@/lib/db/store";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { zhTW, enUS } from "date-fns/locale";
import { getDict, getLocale } from "@/lib/i18n/server";

export default async function DashboardPage() {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login?redirect=/dashboard");

  const dict = await getDict();
  const locale = await getLocale();
  const dateLocale = locale === "zh" ? zhTW : enUS;
  const [{ projects, openUat, recentPrompts }, activity] = await Promise.all([
    getMemberHubSnapshot(user.id),
    getRecentActivity(user.id),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dict.dashboard.title}</h1>
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

      {projects.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardCheck className="h-4 w-4" />
                {dict.dashboard.uatTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {openUat.length === 0 ? (
                <p className="text-sm text-slate-500">{dict.dashboard.noUat}</p>
              ) : (
                openUat.map((item) => (
                  <Link
                    key={item.id}
                    href={`/projects/${item.project_id}/uat/${item.id}`}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                  >
                    <span>
                      <span className="font-medium">{item.title}</span>
                      <span className="mt-0.5 block text-xs text-slate-400">{item.project_name}</span>
                    </span>
                    <Badge variant="outline" className="shrink-0 text-xs">{item.status.replace("_", " ")}</Badge>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileOutput className="h-4 w-4" />
                {dict.dashboard.promptsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPrompts.length === 0 ? (
                <p className="text-sm text-slate-500">{dict.dashboard.noPrompts}</p>
              ) : (
                recentPrompts.map((run) => (
                  <Link
                    key={run.id}
                    href={`/projects/${run.project_id}/prompts`}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                  >
                    <span className="line-clamp-2">{run.prompt_text.slice(0, 120)}</span>
                    <span className="shrink-0 text-xs text-slate-400">{run.project_name}</span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {activity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{dict.dashboard.activity}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.map((log) => (
              <div key={log.id} className="flex items-start justify-between border-b pb-3 text-sm last:border-0">
                <span>{log.message}</span>
                <span className="ml-4 shrink-0 text-xs text-slate-400">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: dateLocale })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
