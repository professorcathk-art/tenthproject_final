import { AppShell } from "@/components/layout/app-shell";
import { PromptExportView } from "@/components/prompts/prompt-export";
import { getSession } from "@/lib/auth/session";
import { getProject } from "@/lib/db/store";
import { redirect, notFound } from "next/navigation";
import type { AITool } from "@/types";

export default async function PromptsPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login");

  const { id } = await params;
  const project = await getProject(id, user.id);
  if (!project) notFound();

  return (
    <AppShell>
      <PromptExportView
        projectId={id}
        projectName={project.name}
        selectedTool={project.selected_tool as AITool}
        promptRuns={project.prompt_runs ?? []}
      />
    </AppShell>
  );
}
