import { MarketingShell } from "@/components/layout/app-shell";
import { EnterpriseBookingForm } from "@/components/enterprise/booking-form";
import { Building2, Bot, Workflow, GraduationCap, Briefcase } from "lucide-react";
import { getDict, getLocale } from "@/lib/i18n/server";

export default async function EnterprisePage() {
  const dict = await getDict();
  const locale = await getLocale();
  const weekdays = locale === "zh" ? ["一", "二", "三", "四", "五", "六", "日"] : ["M", "T", "W", "T", "F", "S", "S"];
  const services = [
    { icon: Bot, ...dict.enterprise.services.agent },
    { icon: Workflow, ...dict.enterprise.services.workflow },
    { icon: Briefcase, ...dict.enterprise.services.digital },
    { icon: GraduationCap, ...dict.enterprise.services.training },
  ];

  return (
    <MarketingShell>
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.06),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-700 mb-5 shadow-sm backdrop-blur">
            <Building2 className="h-4 w-4" /> {dict.enterprise.badge}
          </div>
          <h1 className="max-w-3xl text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-[1.2]">
            {dict.enterprise.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 leading-relaxed">{dict.enterprise.subtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 mb-16">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 mb-4">
                  <Icon className="h-5 w-5 text-slate-800" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{s.title}</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <EnterpriseBookingForm />
          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{dict.enterprise.calendar}</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{dict.enterprise.calendarHint}</p>
            <div className="mt-6 grid grid-cols-7 gap-1.5 text-center text-xs text-slate-400">
              {weekdays.map((d, i) => (
                <span key={`${d}-${i}`} className="py-1">{d}</span>
              ))}
              {Array.from({ length: 21 }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-lg border border-slate-200 bg-white py-2 ${i === 9 || i === 14 ? "border-slate-900 text-slate-900 font-semibold" : ""}`}
                >
                  {i + 8}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-600">
              chris.lau@tenthproject.com
              <br />
              +852 9690 3338
            </p>
          </aside>
        </div>
      </div>
    </MarketingShell>
  );
}
