import { MarketingHeader } from "@/components/layout/marketing-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { JsonLd } from "@/components/seo/json-ld";
import { getSession } from "@/lib/auth/session";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <JsonLd />
      <MarketingHeader loggedIn={isAuthenticated} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
