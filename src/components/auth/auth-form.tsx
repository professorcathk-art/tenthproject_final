"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AuthFormProps {
  mode: "login" | "signup" | "reset";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("demo@tenthproject.app");

  const titles = {
    login: { title: "Welcome back", desc: "Sign in to continue building your project" },
    signup: { title: "Create your account", desc: "Start organizing your vibe coding journey" },
    reset: { title: "Reset password", desc: "We'll send you a link to reset your password" },
  };

  const { title, desc } = titles[mode];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/demo", { method: "POST" });
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-slate-200 shadow-sm">
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
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" defaultValue="Demo User" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            {mode !== "reset" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="demo1234" />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            Demo mode — click sign in to enter the app instantly.
          </p>
          <div className="mt-4 text-center text-sm text-slate-600">
            {mode === "login" && (
              <>
                No account?{" "}
                <Link href="/signup" className="font-medium text-slate-900 hover:underline">
                  Sign up
                </Link>
                {" · "}
                <Link href="/reset-password" className="font-medium text-slate-900 hover:underline">
                  Forgot password?
                </Link>
              </>
            )}
            {mode === "signup" && (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-slate-900 hover:underline">
                  Sign in
                </Link>
              </>
            )}
            {mode === "reset" && (
              <Link href="/login" className="font-medium text-slate-900 hover:underline">
                Back to sign in
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
