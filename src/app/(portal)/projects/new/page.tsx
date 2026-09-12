import { NewProjectWizard } from "@/components/project/new-project-wizard";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const { isAuthenticated } = await getSession();
  if (!isAuthenticated) redirect("/login");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New project</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Let&apos;s set up your project step by step.</p>
      </div>
      <NewProjectWizard />
    </div>
  );
}
