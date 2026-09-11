"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";

export function AcademyCurriculum() {
  const { dict } = useI18n();
  const schedule = Object.values(dict.courses.schedule);
  const milestones = Object.values(dict.courses.milestones);
  const [open, setOpen] = useState<string | null>("m1");

  return (
    <div className="grid gap-8 lg:grid-cols-2 mb-14">
      <FadeIn>
        <section className="rounded-2xl glass-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold">{dict.courses.scheduleTitle}</h2>
          <div className="mt-5 space-y-2">
            {schedule.map((item, i) => (
              <AccordionRow
                key={item.title}
                id={`s${i}`}
                title={item.title}
                body={item.desc}
                open={open === `s${i}`}
                onToggle={() => setOpen(open === `s${i}` ? null : `s${i}`)}
              />
            ))}
          </div>
        </section>
      </FadeIn>
      <FadeIn delay={0.08}>
        <section className="rounded-2xl glass-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold">{dict.courses.milestonesTitle}</h2>
          <div className="mt-5 space-y-2">
            {milestones.map((item, i) => (
              <AccordionRow
                key={item.title}
                id={`m${i}`}
                title={item.title}
                body={item.desc}
                open={open === `m${i}`}
                onToggle={() => setOpen(open === `m${i}` ? null : `m${i}`)}
                glow
              />
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  );
}

function AccordionRow({
  id,
  title,
  body,
  open,
  onToggle,
  glow,
}: {
  id: string;
  title: string;
  body: string;
  open: boolean;
  onToggle: () => void;
  glow?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border border-slate-200/80 bg-white/60 dark:border-slate-800/50 dark:bg-slate-950/30", glow && open && "shadow-[0_0_24px_rgba(59,130,246,0.18)] border-blue-400/40")}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <p id={`${id}-panel`} className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
          {body}
        </p>
      ) : null}
    </div>
  );
}
