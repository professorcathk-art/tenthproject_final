import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getUserCertificates } from "@/lib/db/platform-store";
import { getSession } from "@/lib/auth/session";
import { getMembershipAccess } from "@/lib/auth/membership";
import { getDict } from "@/lib/i18n/server";
import { redirect } from "next/navigation";
import { MembershipSyllabus } from "@/components/membership/membership-syllabus";
import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";
import { VipSkoolWelcome } from "@/components/membership/vip-skool-welcome";

export default async function LearningHomePage() {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) redirect("/login?redirect=/learning");

  const [dict, access] = await Promise.all([
    getDict(),
    getMembershipAccess(user.email, user.isAdmin),
  ]);

  if (access.paid) {
    return (
      <div className="mx-auto max-w-3xl">
        <VipSkoolWelcome />
      </div>
    );
  }

  const certificates = await getUserCertificates(user.id);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-800">
          <BookOpen className="h-4 w-4" /> {dict.portal.learning}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.courses.title}</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{dict.courses.subtitle}</p>
        <JoinLifetimeButton className="mt-4">{dict.courses.enroll}</JoinLifetimeButton>
      </div>
      <MembershipSyllabus />

      <div className="rounded-2xl glass-panel p-6">
        <h2 className="text-lg font-semibold">{dict.courses.yourCerts}</h2>
        {certificates.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{dict.courses.noCerts}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificate/${cert.certificate_code}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                <span className="font-mono">{cert.certificate_code}</span>
                <span className="text-slate-500">{dict.courses.viewCert}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
