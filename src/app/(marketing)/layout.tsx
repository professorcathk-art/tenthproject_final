import { MarketingHeader } from "@/components/layout/marketing-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { getSession } from "@/lib/auth/session";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader loggedIn={isAuthenticated} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
