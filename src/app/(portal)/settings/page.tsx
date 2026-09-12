"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.settings.title}</h1>
        <p className="mt-1 text-slate-600">{dict.settings.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{dict.settings.lifetime}</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="mb-3">{dict.settings.lifetime}</Badge>
          <p className="text-sm text-slate-600">{dict.settings.lifetimeNote}</p>
        </CardContent>
      </Card>

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
                {AI_TOOLS.map((tool) => (
                  <SelectItem key={tool.value} value={tool.value}>{tool.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{dict.settings.defaultModel}</Label>
            <Select defaultValue="openai">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
