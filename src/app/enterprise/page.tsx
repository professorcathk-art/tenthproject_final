import { MarketingShell } from "@/components/layout/app-shell";
import { BookingCalendar } from "@/components/enterprise/booking-calendar";
import { Building2, Bot, Workflow, GraduationCap, Briefcase } from "lucide-react";
import { PUBLIC_CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";
import { getDict } from "@/lib/i18n/server";

export default async function EnterprisePage() {
  const dict = await getDict();
  const services = [
    { icon: Bot, ...dict.enterprise.services.agent },
    { icon: Workflow, ...dict.enterprise.services.workflow },
    { icon: Briefcase, ...dict.enterprise.services.digital },
    { icon: GraduationCap, ...dict.enterprise.services.training },
  ];

  return (
    <MarketingShell>
      <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-slate-800/50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.1),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-sm font-medium text-slate-700 mb-5">
            <Building2 className="h-4 w-4" /> {dict.enterprise.badge}
          </div>
          <h1 className="max-w-3xl text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.2] text-gradient">
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
              <div key={s.title} className="rounded-2xl glass-panel glow-card p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white mb-4 dark:bg-slate-900">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <BookingCalendar />

        <p className="mt-8 text-sm text-slate-500">
          <a href={`mailto:${PUBLIC_CONTACT_EMAIL}`} className="hover:text-slate-900">{PUBLIC_CONTACT_EMAIL}</a>
          {" · "}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </p>
      </div>
    </MarketingShell>
  );
}
