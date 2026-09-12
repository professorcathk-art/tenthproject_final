"use client";

import { useMemo, useState } from "react";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SERVICE_TYPES, BUDGET_RANGES, COMPANY_SIZES } from "@/types/platform";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";

const SLOTS = ["09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export function BookingCalendar() {
  const { dict, locale } = useI18n();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    company_size: "",
    budget_range: "",
    project_description: "",
  });

  const dates = useMemo(() => {
    const start = startOfDay(new Date());
    return Array.from({ length: 21 }, (_, i) => addDays(start, i)).filter((d) => d.getDay() !== 0);
  }, []);

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
    if (!selectedDate || !selectedSlot) {
      setError(dict.enterprise.noSlot);
      return;
    }
    setError("");
    setLoading(true);
    const preferred_slot = `${selectedDate} ${selectedSlot} HKT`;
    const res = await fetch("/api/enterprise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        service_type: services.join(","),
        preferred_slot,
        locale,
      }),
    });
    setLoading(false);
    if (res.ok) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl glass-panel p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{dict.enterprise.successTitle}</h2>
        <p className="text-slate-600 leading-relaxed">{dict.enterprise.successBody}</p>
        {selectedDate && selectedSlot ? (
          <p className="mt-3 text-sm font-medium text-slate-800">
            {selectedDate} · {selectedSlot} · {dict.enterprise.tz}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
      <form onSubmit={handleSubmit} className="rounded-2xl glass-panel p-8 space-y-4">
        <h2 className="text-xl font-semibold">{dict.enterprise.book}</h2>
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
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                    on ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300"
                  )}
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
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full h-11 rounded-full font-semibold" disabled={loading || services.length === 0}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {dict.enterprise.submitting}</> : dict.enterprise.submit}
        </Button>
      </form>

      <aside className="rounded-2xl glass-panel p-8">
        <h2 className="text-lg font-semibold">{dict.enterprise.calendar}</h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{dict.enterprise.calendarHint}</p>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{dict.enterprise.pickDate}</p>
        <div className="mt-3 grid grid-cols-4 sm:grid-cols-7 gap-2">
          {dates.map((d) => {
            const key = format(d, "yyyy-MM-dd");
            const disabled = isBefore(d, startOfDay(new Date()));
            const active = selectedDate === key;
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setSelectedDate(key);
                  setSelectedSlot("");
                }}
                className={cn(
                  "rounded-xl border px-1.5 py-2 text-center text-xs transition-all",
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white/70 hover:border-slate-300",
                  disabled && "opacity-40"
                )}
              >
                <span className="block text-[10px] opacity-70">{format(d, "EEE")}</span>
                <span className="block font-semibold">{format(d, "d")}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{dict.enterprise.pickTime}</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {SLOTS.map((slot) => {
            const active = selectedSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                disabled={!selectedDate}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-sm font-medium transition-all disabled:opacity-40",
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white/70 hover:border-slate-300"
                )}
              >
                {slot}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-slate-400">{dict.enterprise.tz}</p>
      </aside>
    </div>
  );
}
