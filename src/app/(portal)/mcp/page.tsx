import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { McpSettings } from "@/components/project/mcp-settings";
import { paidMemberOrLock } from "@/components/portal/paid-feature-lock";
import { getDict } from "@/lib/i18n/server";
import { getSession } from "@/lib/auth/session";
import { getProjects } from "@/lib/db/store";
import { SITE_URL } from "@/lib/seo";
import { redirect } from "next/navigation";

export default async function McpHubPage() {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login?redirect=/mcp");

  const lock = await paidMemberOrLock("mcp");
  if (lock) return lock;

  const dict = await getDict();
  const projects = await getProjects(user.id);

  if (!projects.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-semibold tracking-tight">{dict.mcp.needProjectTitle}</h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">{dict.mcp.needProjectBody}</p>
        <Link href="/projects/new" className="mt-5 inline-block">
          <Button>
            {dict.mcp.needProjectAction} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <McpSettings
      projects={projects.map((project) => ({ id: project.id, name: project.name, tool: project.selected_tool }))}
      mcpUrl={`${SITE_URL}/api/mcp`}
    />
  );
}
