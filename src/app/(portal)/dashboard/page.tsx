import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FolderOpen } from "lucide-react";
import { ProjectHubGrid } from "@/components/project/project-hub-grid";
import { getSession } from "@/lib/auth/session";
import { getMemberHubSnapshot } from "@/lib/db/store";
import { redirect } from "next/navigation";
import { getDict } from "@/lib/i18n/server";

export default async function DashboardPage() {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login?redirect=/dashboard");

  const dict = await getDict();
  const { projects, openUat, recentPrompts } = await getMemberHubSnapshot(user.id);

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
    </div>
  );
}
