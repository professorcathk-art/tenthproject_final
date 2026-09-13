import { AuthForm } from "@/components/auth/auth-form";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";

export default function SignupPage() {
  return (
    <AuthSplitShell>
      <AuthForm mode="signup" variant="split" />
    </AuthSplitShell>
  );
}
