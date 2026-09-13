import { redirect } from "next/navigation";
import { PortalShell } from "@/components/layout/portal-shell";
import { getSession } from "@/lib/auth/session";
import { getProjectQuota } from "@/lib/membership/limits";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) {
    redirect("/login?redirect=/dashboard");
  }

  const quota = await getProjectQuota(user.email, user.id, user.isAdmin);

  return (
    <PortalShell
      user={{ email: user.email, name: user.name, isAdmin: user.isAdmin }}
      paid={quota.paid}
      projectCount={quota.count}
    >
      {children}
    </PortalShell>
  );
}
