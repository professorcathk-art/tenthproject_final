"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useI18n } from "@/components/i18n/provider";

interface AuthFormProps {
  mode: "login" | "signup" | "reset";
}

function AuthFormInner({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict } = useI18n();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const titles = {
    login: { title: dict.auth.loginTitle, desc: dict.auth.loginDesc },
    signup: { title: dict.auth.signupTitle, desc: dict.auth.signupDesc },
    reset: { title: dict.auth.resetTitle, desc: dict.auth.resetDesc },
  };
  const { title, desc } = titles[mode];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const submittedEmail = String(form.get("email") ?? email).trim();
    const submittedName = String(form.get("name") ?? name).trim();
    const res = await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: submittedEmail, name: submittedName }),
    });
    const data = (await res.json().catch(() => ({}))) as { isAdmin?: boolean };
    const next = searchParams.get("redirect") || (data.isAdmin ? "/admin" : "/dashboard");
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md glass-panel shadow-none">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode !== "reset" && (
              <div className="space-y-2">
                <Label htmlFor="name">{dict.auth.name}</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder={dict.auth.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{dict.auth.email}</Label>
                <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            {mode !== "reset" && (
              <div className="space-y-2">
                <Label htmlFor="password">{dict.auth.password}</Label>
                <Input id="password" type="password" defaultValue="demo1234" />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? dict.auth.signingIn
                : mode === "login"
                  ? dict.auth.signIn
                  : mode === "signup"
                    ? dict.auth.createAccount
                    : dict.auth.sendReset}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500 leading-relaxed">{dict.auth.demoNote}</p>
          <div className="mt-4 text-center text-sm text-slate-600">
            {mode === "login" && (
              <>
                {dict.auth.noAccount}{" "}
                <Link href="/signup?redirect=/dashboard" className="font-medium text-slate-900 hover:underline">
                  {dict.auth.createAccount}
                </Link>
                {" · "}
                <Link href="/reset-password" className="font-medium text-slate-900 hover:underline">
                  {dict.auth.forgot}
                </Link>
              </>
            )}
            {mode === "signup" && (
              <>
                {dict.auth.hasAccount}{" "}
                <Link href="/login?redirect=/dashboard" className="font-medium text-slate-900 hover:underline">
                  {dict.auth.signIn}
                </Link>
              </>
            )}
            {mode === "reset" && (
              <Link href="/login?redirect=/dashboard" className="font-medium text-slate-900 hover:underline">
                {dict.auth.backToLogin}
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AuthForm(props: AuthFormProps) {
  return (
    <Suspense>
      <AuthFormInner {...props} />
    </Suspense>
  );
}
