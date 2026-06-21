import { MarketingShell } from "@/components/layout/app-shell";
import { AuthForm } from "@/components/auth/auth-form";

export default function ResetPasswordPage() {
  return (
    <MarketingShell>
      <AuthForm mode="reset" />
    </MarketingShell>
  );
}
