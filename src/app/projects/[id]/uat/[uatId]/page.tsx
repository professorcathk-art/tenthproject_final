import { AppShell } from "@/components/layout/app-shell";
import { UATDetailView } from "@/components/uat/uat-detail";
import { getSession } from "@/lib/auth/session";
import { getProject, getUATItem } from "@/lib/db/store";
import { redirect, notFound } from "next/navigation";

export default async function UATPage({
  params,
}: {
  params: Promise<{ id: string; uatId: string }>;
}) {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login");

  const { id, uatId } = await params;
  const project = await getProject(id, user.id);
  if (!project) notFound();

  const { item, remarks } = await getUATItem(uatId, id);
  if (!item) notFound();

  return (
    <AppShell>
      <UATDetailView
        projectId={id}
        projectName={project.name}
        item={item}
        remarks={remarks}
      />
    </AppShell>
  );
}
