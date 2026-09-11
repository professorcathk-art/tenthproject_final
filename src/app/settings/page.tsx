"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AI_TOOLS } from "@/types";
import { useI18n } from "@/components/i18n/provider";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { dict } = useI18n();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/auth/demo")
      .then((r) => r.json())
      .then((d) => {
        setEmail(d.user?.email ?? "");
        setName(d.user?.name ?? "");
      });
  }, []);

  return (
    <AppShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{dict.settings.title}</h1>
          <p className="text-slate-600 mt-1">{dict.settings.subtitle}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{dict.settings.profile}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{dict.auth.name}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{dict.auth.email}</Label>
              <Input id="email" type="email" value={email} readOnly />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{dict.settings.prefs}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{dict.settings.defaultTool}</Label>
              <Select defaultValue="cursor">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AI_TOOLS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{dict.settings.defaultModel}</Label>
              <Select defaultValue="openai">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI (GPT-4o-mini)</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{dict.settings.integrations}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["GitHub", "Vercel", "Supabase"].map((n) => (
              <div key={n} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">{n}</span>
                <span className="text-xs text-slate-400">{dict.settings.comingSoon}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{dict.settings.billing}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">{dict.settings.billingNote}</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
