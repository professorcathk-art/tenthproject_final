import { ProjectDetail } from "@/components/project/project-detail";
import { paidMemberOrLock } from "@/components/portal/paid-feature-lock";
import { getSession } from "@/lib/auth/session";
import { getProject } from "@/lib/db/store";
import { redirect, notFound } from "next/navigation";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login");

  const lock = await paidMemberOrLock("hub");
  if (lock) return lock;

  const { id } = await params;
  const project = await getProject(id, user.id);
  if (!project) notFound();

  return (
      <ProjectDetail initialProject={project} />
  );
}
