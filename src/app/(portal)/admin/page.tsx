import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getCaseStudies, getEnterpriseEnquiries, getCoursesWithLessons, getMembers } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";
import { getDict } from "@/lib/i18n/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminPage() {
  const { user, isAuthenticated } = await getSession();
  const dict = await getDict();

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-xl font-semibold tracking-tight">{dict.admin.deniedTitle}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {dict.admin.deniedBody}{" "}
          <span className="font-medium text-slate-900 dark:text-slate-100">{user?.email ?? "—"}</span>.
        </p>
        <Link href="/login?redirect=/admin" className={cn(buttonVariants(), "mt-6")}>
          {dict.admin.deniedCta}
        </Link>
      </div>
    );
  }

  await ensurePlatformSeeded();
  const [caseStudies, enquiries, courses, members] = await Promise.all([
    getCaseStudies(undefined, false),
    getEnterpriseEnquiries(),
    getCoursesWithLessons(),
    getMembers(),
  ]);

  return (
      <AdminDashboard
        initialCaseStudies={caseStudies}
        initialEnquiries={enquiries}
        initialCourses={courses}
        initialMembers={members}
      />
  );
}
