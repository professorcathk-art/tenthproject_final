"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { createClient } from "@supabase/supabase-js";
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
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [recoveryFromHash] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.hash.replace(/^#/, "")).get("type") === "recovery";
  });
  const recovery = mode === "reset" && (recoveryFromHash || searchParams.get("type") === "recovery" || Boolean(searchParams.get("code")));
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
    setError("");
    if (mode === "reset") {
      setLoading(true);
      const form = new FormData(e.currentTarget);
      const submittedEmail = String(form.get("email") ?? email).trim();
      const submittedPassword = String(form.get("password") ?? "").trim();
      try {
        if (recovery) {
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          if (!url || !key) {
            setError("重設密碼服務尚未設定，請稍後再試。");
            return;
          }
          const supabase = createClient(url, key, { auth: { persistSession: true, detectSessionInUrl: true } });
          const { error: updateError } = await supabase.auth.updateUser({ password: submittedPassword });
          if (updateError) {
            setError(updateError.message);
            window.alert(updateError.message);
            return;
          }
          const login = await fetch("/api/auth/demo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: submittedEmail, password: submittedPassword, mode: "login" }),
          });
          if (!login.ok) {
            router.push("/login");
            return;
          }
          router.push("/dashboard");
          router.refresh();
          return;
        }
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: submittedEmail }),
        });
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        if (!res.ok) {
          const message = data.message || "無法寄出重設連結，請再試一次。";
          setError(message);
          window.alert(message);
          return;
        }
        setNotice(data.message || dict.auth.resetSent);
      } catch {
        const message = "連線失敗，請再試一次。";
        setError(message);
        window.alert(message);
      } finally {
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const submittedEmail = String(form.get("email") ?? email).trim();
    const submittedName = String(form.get("name") ?? name).trim();
    const submittedPassword = String(form.get("password") ?? "").trim();
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: submittedEmail,
          name: submittedName,
          password: submittedPassword,
          mode: mode === "signup" ? "signup" : "login",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { isAdmin?: boolean; message?: string; error?: string };
      if (!res.ok) {
        const message = data.message || (mode === "signup" ? "註冊失敗，請再試一次。" : "登入失敗，請再試一次。");
        setError(message);
        window.alert(message);
        return;
      }
      const redirect = searchParams.get("redirect");
      const next = redirect || (data.isAdmin ? "/admin" : "/dashboard");
      router.push(next);
      router.refresh();
    } catch {
      const message = "連線失敗，請再試一次。";
      setError(message);
      window.alert(message);
    } finally {
      setLoading(false);
    }
  }

  const formCard = (
    <Card className={`w-full max-w-md shadow-none ${split ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" : "glass-panel"}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 overflow-hidden rounded-full">
          <Image src="/logo.jpg" alt="Tenth Project" width={48} height={48} className="h-12 w-12 object-cover" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              {notice}
            </p>
          ) : null}
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
          {mode !== "reset" || recovery ? (
            <div className="space-y-2">
              <Label htmlFor="password">{recovery ? dict.auth.newPassword : split ? "密碼 (Password)" : dict.auth.password}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
          ) : null}
          <Button type="submit" className="h-11 w-full font-semibold" disabled={loading}>
            {loading
              ? mode === "reset"
                ? recovery
                  ? dict.auth.savePassword
                  : dict.auth.sendingReset
                : dict.auth.signingIn
              : split
                ? mode === "login"
                  ? "登入專案中心 ➔"
                  : "免費建立帳號 ➔"
                : mode === "login"
                  ? dict.auth.signIn
                  : mode === "signup"
                    ? dict.auth.createAccount
                    : recovery
                      ? dict.auth.savePassword
                      : dict.auth.sendReset}
          </Button>
        </form>
        {split ? (
          <>
            <p className="mt-4 text-center text-xs text-slate-500">🔒 無需信用卡 · 1 分鐘快速開通基礎功能</p>
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
            {mode === "login" ? (
              <div className="mt-3 text-center text-sm">
                <Link href="/reset-password" className="text-slate-500 underline-offset-4 hover:underline dark:text-slate-400">
                  {dict.auth.forgot}
                </Link>
              </div>
            ) : null}
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
            {mode === "login" ? (
              <div className="mt-3 text-center text-sm">
                <Link href="/reset-password" className="text-slate-500 hover:underline">
                  {dict.auth.forgot}
                </Link>
              </div>
            ) : null}
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
