"use client";

import { useMemo, useState } from "react";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { BUDGET_RANGES, SERVICE_TYPES } from "@/types/platform";
import { ENTERPRISE_EMAIL, WHATSAPP_URL } from "@/lib/contact";
import { enterpriseCopy } from "@/lib/enterprise/copy";
import { cn } from "@/lib/utils";

const SLOTS = ["10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "04:00 PM"];
const copy = enterpriseCopy.zh.booking;

export function EnterpriseBookingSection() {
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
    budget_range: "",
    project_description: "",
  });

  const dates = useMemo(() => {
    const start = startOfDay(new Date());
    return Array.from({ length: 28 }, (_, i) => addDays(start, i)).filter((d) => {
      const day = d.getDay();
      return day !== 0 && day !== 6 && !isBefore(d, start);
    });
  }, []);

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
    const preferred_slot = selectedDate && selectedSlot ? `${selectedDate} ${selectedSlot} HKT` : "";
    const res = await fetch("/api/enterprise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        service_type: services.join(","),
        preferred_slot,
        locale: "zh",
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
        {selectedDate && selectedSlot ? (
          <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200">
            {selectedDate} · {selectedSlot} · {copy.tz}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <section id="booking" className="scroll-mt-24">
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl glass-panel p-6 sm:p-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{copy.formTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{copy.formSubtitle}</p>
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
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{copy.email} *</Label>
              <Input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{copy.phone}</Label>
              <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
          </div>
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
                    {item.zh}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <Label>{copy.budget}</Label>
            <Select value={form.budget_range} onValueChange={(value) => value && update("budget_range", value)}>
              <SelectTrigger>
                <SelectValue placeholder="請選擇預算區間" />
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
          <div className="space-y-2">
            <Label>{copy.brief} *</Label>
            <Textarea
              required
              rows={5}
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

        <aside className="space-y-5 rounded-3xl glass-panel p-6 sm:p-8">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <Calendar className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">{copy.calendarTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{copy.calendarSubtitle}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">{copy.pickDate}</p>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {dates.map((date) => {
                const key = format(date, "yyyy-MM-dd");
                const active = selectedDate === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedDate(key);
                      setSelectedSlot("");
                    }}
                    className={cn(
                      "rounded-xl border px-1.5 py-2 text-center text-xs transition-all",
                      active
                        ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950"
                        : "border-slate-200 bg-white/70 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/50",
                    )}
                  >
                    <span className="block text-[10px] opacity-70">{format(date, "EEE")}</span>
                    <span className="block font-semibold">{format(date, "d")}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">{copy.pickTime}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                        ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950"
                        : "border-slate-200 bg-white/70 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/50",
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-400">{copy.tz}</p>
          </div>
          <div className="grid gap-3">
            <a
              href={`mailto:${ENTERPRISE_EMAIL}`}
              className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40"
            >
              <Mail className="mt-0.5 h-4 w-4" />
              <div>
                <p className="text-xs text-slate-500">{copy.emailLabel}</p>
                <p className="text-sm font-semibold">{ENTERPRISE_EMAIL}</p>
              </div>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40"
            >
              <Phone className="mt-0.5 h-4 w-4" />
              <div>
                <p className="text-xs text-slate-500">{copy.phoneLabel}</p>
                <p className="text-sm font-semibold">{copy.phoneDisplay}</p>
              </div>
            </a>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
              <MapPin className="mt-0.5 h-4 w-4" />
              <div>
                <p className="text-xs text-slate-500">{copy.officeLabel}</p>
                <p className="text-sm font-semibold">{copy.office}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
