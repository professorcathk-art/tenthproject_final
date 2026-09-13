"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { BUDGET_RANGES, SERVICE_TYPES } from "@/types/platform";
import { enterpriseCopy } from "@/lib/enterprise/copy";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";

export function EnterpriseBookingSection() {
  const { locale } = useI18n();
  const copy = (locale === "en" ? enterpriseCopy.en : enterpriseCopy.zh).booking;
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    budget_range: "",
    project_description: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleService(value: string) {
    setServices((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!services.length) {
      setError(copy.noService);
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/enterprise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        service_type: services.join(","),
        locale: locale === "en" ? "en" : "zh",
      }),
    });
    setLoading(false);
    if (res.ok) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div id="booking" className="rounded-3xl glass-panel px-6 py-14 text-center sm:px-10">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
        <h2 className="text-2xl font-semibold tracking-tight">{copy.successTitle}</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400">{copy.successBody}</p>
      </div>
    );
  }

  return (
    <section id="booking" className="scroll-mt-24">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl glass-panel p-6 sm:p-8 lg:p-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{copy.formTitle}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {copy.formSubtitle}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{copy.company} *</Label>
            <Input required value={form.company_name} onChange={(e) => update("company_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{copy.contact} *</Label>
            <Input required value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{copy.email} *</Label>
            <Input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{copy.phone}</Label>
            <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>{copy.service} *</Label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_TYPES.map((item) => {
                const on = services.includes(item.value);
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => toggleService(item.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                      on
                        ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950"
                        : "border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300",
                    )}
                  >
                    {locale === "en" ? item.en : item.zh}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <Label>{copy.budget}</Label>
            <Select value={form.budget_range} onValueChange={(value) => value && update("budget_range", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={locale === "en" ? "Select a budget range" : "請選擇預算區間"} />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.zh}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>{copy.brief} *</Label>
          <Textarea
            required
            rows={6}
            value={form.project_description}
            onChange={(e) => update("project_description", e.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button
          type="submit"
          className="h-12 w-full rounded-full font-semibold hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {copy.submitting}
            </>
          ) : (
            copy.submit
          )}
        </Button>
      </form>
    </section>
  );
}
