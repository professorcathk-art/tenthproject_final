import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSession } from "@/lib/auth/session";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = await getSession();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader variant="app" initialUser={user ? { email: user.email, isAdmin: user.isAdmin } : null} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}

export async function MarketingShell({ children }: { children: React.ReactNode }) {
  const { user } = await getSession();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader variant="marketing" initialUser={user ? { email: user.email, isAdmin: user.isAdmin } : null} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
