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
  variant?: "page" | "split";
}

function AuthFormInner({ mode, variant = "page" }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict } = useI18n();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const split = variant === "split" && mode !== "reset";

  const titles = {
    login: { title: split ? "歡迎回來" : dict.auth.loginTitle, desc: split ? "登入或開通帳號，立即開啟你的 AI 專案工作台。" : dict.auth.loginDesc },
    signup: { title: split ? "免費建立 Tenth Project 帳號" : dict.auth.signupTitle, desc: split ? "登入或開通帳號，立即開啟你的 AI 專案工作台。" : dict.auth.signupDesc },
    reset: { title: dict.auth.resetTitle, desc: dict.auth.resetDesc },
  };
  const { title, desc } = titles[mode];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const submittedEmail = String(form.get("email") ?? email).trim();
    const submittedName = String(form.get("name") ?? name).trim();
    const submittedPassword = String(form.get("password") ?? "").trim();
    const res = await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: submittedEmail, name: submittedName, password: submittedPassword }),
    });
    const data = (await res.json().catch(() => ({}))) as { isAdmin?: boolean };
    const next = searchParams.get("redirect") || (data.isAdmin ? "/admin" : "/dashboard");
    router.push(next);
    router.refresh();
  }

  const formCard = (
    <Card className={`w-full max-w-md shadow-none ${split ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" : "glass-panel"}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Sparkles className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" || (!split && mode !== "reset") ? (
            <div className="space-y-2">
              <Label htmlFor="name">{split ? "姓名 (Full Name)" : dict.auth.name}</Label>
              <Input
                id="name"
                name="name"
                required={mode === "signup"}
                autoComplete="name"
                placeholder={split ? "姓名 (Full Name)" : dict.auth.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">{split ? "電子郵件 (Email)" : dict.auth.email}</Label>
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
          {mode !== "reset" ? (
            <div className="space-y-2">
              <Label htmlFor="password">{split ? "密碼 (Password)" : dict.auth.password}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
          ) : null}
          <Button type="submit" className="h-11 w-full font-semibold" disabled={loading}>
            {loading
              ? dict.auth.signingIn
              : split
                ? mode === "login"
                  ? "登入專案中心 ➔"
                  : "免費建立帳號 ➔"
                : mode === "login"
                  ? dict.auth.signIn
                  : mode === "signup"
                    ? dict.auth.createAccount
                    : dict.auth.sendReset}
          </Button>
        </form>
        {split ? (
          <>
            <p className="mt-4 text-center text-xs text-slate-500">🔒 免信用卡 · 1 分鐘快速開通基礎功能</p>
            <div className="mt-4 text-center text-sm text-slate-600">
              {mode === "login" ? (
                <>
                  還沒有帳號？{" "}
                  <Link href="/signup?redirect=/dashboard" className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-white">
                    免費註冊
                  </Link>
                </>
              ) : (
                <>
                  已有帳號？{" "}
                  <Link href="/login?redirect=/dashboard" className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-white">
                    立即登入
                  </Link>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">{dict.auth.demoNote}</p>
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
          </>
        )}
      </CardContent>
    </Card>
  );

  if (split) return formCard;
  return <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">{formCard}</div>;
}

export function AuthForm(props: AuthFormProps) {
  return (
    <Suspense>
      <AuthFormInner {...props} />
    </Suspense>
  );
}
