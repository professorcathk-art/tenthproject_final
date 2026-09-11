"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SERVICE_TYPES, BUDGET_RANGES, COMPANY_SIZES } from "@/types/platform";
import { useI18n } from "@/components/i18n/provider";

export function EnterpriseBookingForm() {
  const { dict, locale } = useI18n();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    company_size: "",
    budget_range: "",
    project_description: "",
  });

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleService(value: string) {
    setServices((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!services.length) return;
    setLoading(true);
    const res = await fetch("/api/enterprise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        service_type: services.join(","),
      }),
    });
    setLoading(false);
    if (res.ok) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{dict.enterprise.successTitle}</h2>
        <p className="text-slate-600 leading-relaxed">{dict.enterprise.successBody}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold">{dict.enterprise.book}</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
        <div className="space-y-2">
          <Label>{dict.enterprise.service} *</Label>
          <div className="flex flex-wrap gap-2">
            {SERVICE_TYPES.map((s) => {
              const on = services.includes(s.value);
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleService(s.value)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                    on ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {locale === "zh" ? s.zh : s.en}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{dict.enterprise.size}</Label>
            <Select value={form.company_size} onValueChange={(v) => v && update("company_size", v)}>
              <SelectTrigger><SelectValue placeholder={dict.enterprise.select} /></SelectTrigger>
              <SelectContent>
                {COMPANY_SIZES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{locale === "zh" ? s.zh : s.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{dict.enterprise.budget}</Label>
            <Select value={form.budget_range} onValueChange={(v) => v && update("budget_range", v)}>
              <SelectTrigger><SelectValue placeholder={dict.enterprise.select} /></SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{locale === "zh" ? s.zh : s.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>{dict.enterprise.describe} *</Label>
          <Textarea required rows={5} placeholder={dict.enterprise.placeholder} value={form.project_description} onChange={(e) => update("project_description", e.target.value)} />
        </div>
        <Button type="submit" className="w-full h-11 font-semibold" disabled={loading || services.length === 0}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {dict.enterprise.submitting}</> : dict.enterprise.submit}
        </Button>
      </form>
    </div>
  );
}
