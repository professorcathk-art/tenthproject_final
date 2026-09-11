"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SERVICE_TYPES, BUDGET_RANGES, COMPANY_SIZES } from "@/types/platform";
import { useI18n } from "@/components/i18n/provider";

export function EnterpriseBookingForm() {
  const { dict } = useI18n();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    service_type: "",
    company_size: "",
    budget_range: "",
    project_description: "",
  });

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/enterprise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{dict.enterprise.successTitle}</h2>
          <p className="text-slate-600">{dict.enterprise.successBody}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{dict.enterprise.book}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{dict.enterprise.company} *</Label>
              <Input required value={form.company_name} onChange={(e) => update("company_name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{dict.enterprise.contact} *</Label>
              <Input required value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{dict.enterprise.email} *</Label>
              <Input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{dict.enterprise.phone}</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{dict.enterprise.service} *</Label>
              <Select value={form.service_type} onValueChange={(v) => v && update("service_type", v)}>
                <SelectTrigger><SelectValue placeholder={dict.enterprise.select} /></SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{dict.enterprise.size}</Label>
              <Select value={form.company_size} onValueChange={(v) => v && update("company_size", v)}>
                <SelectTrigger><SelectValue placeholder={dict.enterprise.select} /></SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{dict.enterprise.budget}</Label>
              <Select value={form.budget_range} onValueChange={(v) => v && update("budget_range", v)}>
                <SelectTrigger><SelectValue placeholder={dict.enterprise.select} /></SelectTrigger>
                <SelectContent>
                  {BUDGET_RANGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{dict.enterprise.describe} *</Label>
            <Textarea required rows={5} placeholder={dict.enterprise.placeholder} value={form.project_description} onChange={(e) => update("project_description", e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {dict.enterprise.submitting}</> : dict.enterprise.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
