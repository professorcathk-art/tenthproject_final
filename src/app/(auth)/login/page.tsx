import { AuthForm } from "@/components/auth/auth-form";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";

export default function LoginPage() {
  return (
    <AuthSplitShell>
      <AuthForm mode="login" variant="split" />
    </AuthSplitShell>
  );
}
