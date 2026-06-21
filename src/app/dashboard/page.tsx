import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, FolderOpen } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getProjects, getRecentActivity } from "@/lib/db/store";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login");

  const projects = await getProjects(user.id);
  const activity = await getRecentActivity(user.id);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Track your projects and see what to do next.</p>
          </div>
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New project
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen className="h-12 w-12 text-slate-300 mb-4" />
              <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
              <p className="text-slate-500 mb-6 max-w-sm">
                Start your first project and get a personalized roadmap, UAT checklist, and AI prompts.
              </p>
              <Link href="/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Create your first project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Badge variant="secondary" className="text-xs">{project.product_type.replace("_", " ")}</Badge>
                      <Badge variant="outline" className="text-xs">{project.stage.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">
                      Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {activity.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.map((log) => (
                <div key={log.id} className="flex items-start justify-between text-sm border-b pb-3 last:border-0">
                  <span>{log.message}</span>
                  <span className="text-xs text-slate-400 shrink-0 ml-4">
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
