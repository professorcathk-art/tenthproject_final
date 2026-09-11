import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getCaseStudies, getEnterpriseEnquiries, getCoursesWithLessons, getMembers } from "@/lib/db/platform-store";
import { ensurePlatformSeeded } from "@/lib/seed/init";

export default async function AdminPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/dashboard");

  await ensurePlatformSeeded();
  const [caseStudies, enquiries, courses, members] = await Promise.all([
    getCaseStudies(undefined, false),
    getEnterpriseEnquiries(),
    getCoursesWithLessons(),
    getMembers(),
  ]);

  return (
    <AppShell>
      <AdminDashboard
        initialCaseStudies={caseStudies}
        initialEnquiries={enquiries}
        initialCourses={courses}
        initialMembers={members}
      />
    </AppShell>
  );
}
