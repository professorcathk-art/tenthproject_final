import { redirect } from "next/navigation";
import { PortalShell } from "@/components/layout/portal-shell";
import { getSession } from "@/lib/auth/session";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = await getSession();
  if (!isAuthenticated || !user) {
    redirect("/login?redirect=/dashboard"); // middleware usually handles the original path
  }

  return (
    <PortalShell user={{ email: user.email, name: user.name, isAdmin: user.isAdmin }}>
      {children}
    </PortalShell>
  );
}
