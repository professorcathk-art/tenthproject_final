import { AppShell } from "@/components/layout/app-shell";
import { NewProjectWizard } from "@/components/project/new-project-wizard";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const { isAuthenticated } = await getSession();
  if (!isAuthenticated) redirect("/login");

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">New project</h1>
        <p className="text-slate-600 mt-1">Let&apos;s set up your project step by step.</p>
      </div>
      <NewProjectWizard />
    </AppShell>
  );
}
