import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileJson, Key, Plug, RefreshCw } from "lucide-react";
import { McpSettings } from "@/components/project/mcp-settings";
import { getDict } from "@/lib/i18n/server";
import { getSession } from "@/lib/auth/session";
import { getProjects } from "@/lib/db/store";
import { redirect } from "next/navigation";

export default async function McpHubPage() {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login?redirect=/mcp");

  const dict = await getDict();
  const projects = await getProjects(user.id);
  const steps = [
    { icon: Key, body: dict.mcp.step1 },
    { icon: FileJson, body: dict.mcp.step2 },
    { icon: RefreshCw, body: dict.mcp.step3 },
  ];
  const tools = [
    { name: "get_active_roadmap", desc: dict.mcp.toolRoadmap },
    { name: "get_sprint_prompt", desc: dict.mcp.toolSprint },
    { name: "fetch_uat_status", desc: dict.mcp.toolUat },
    { name: "update_uat_item", desc: dict.mcp.toolUpdate },
    { name: "log_bug", desc: dict.mcp.toolBug },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-800">
          <Plug className="h-4 w-4" /> {dict.portal.mcp}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.mcpPage.title}</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{dict.mcpPage.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.body} className="rounded-2xl glass-panel p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-slate-400">0{index + 1}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.name} className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-sm">{tool.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{tool.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <McpSettings key={project.id} projectId={project.id} projectName={project.name} compact />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900 p-8 text-center text-white">
          <p className="font-medium">{dict.mcpPage.needProject}</p>
          <Link href="/projects/new" className="mt-4 inline-block">
            <Button variant="secondary">
              {dict.portal.newProject} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
