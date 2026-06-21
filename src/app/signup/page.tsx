import { MarketingShell } from "@/components/layout/app-shell";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <MarketingShell>
      <AuthForm mode="signup" />
    </MarketingShell>
  );
}
