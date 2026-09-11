import { MarketingShell } from "@/components/layout/app-shell";
import { EnterpriseBookingForm } from "@/components/enterprise/booking-form";
import { Building2, Bot, Workflow, GraduationCap } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export default async function EnterprisePage() {
  const dict = await getDict();
  const services = [
    { icon: Bot, ...dict.enterprise.services.agent },
    { icon: Workflow, ...dict.enterprise.services.workflow },
    { icon: Building2, ...dict.enterprise.services.digital },
    { icon: GraduationCap, ...dict.enterprise.services.training },
  ];

  return (
    <MarketingShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 mb-4">
              <Building2 className="h-4 w-4" /> {dict.enterprise.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{dict.enterprise.title}</h1>
            <p className="text-slate-600 mt-4 leading-relaxed">{dict.enterprise.subtitle}</p>
            <div className="mt-8 space-y-4">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-sm text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <EnterpriseBookingForm />
        </div>
      </div>
    </MarketingShell>
  );
}
