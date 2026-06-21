import { MarketingShell } from "@/components/layout/app-shell";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <MarketingShell>
      <AuthForm mode="login" />
    </MarketingShell>
  );
}
