import { NewProjectWizard } from "@/components/project/new-project-wizard";
import { getSession } from "@/lib/auth/session";
import { getDict } from "@/lib/i18n/server";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const { isAuthenticated } = await getSession();
  if (!isAuthenticated) redirect("/login?redirect=/projects/new");
  const dict = await getDict();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{dict.dashboard.newProject}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{dict.dashboard.subtitle}</p>
      </div>
      <NewProjectWizard />
    </div>
  );
}
