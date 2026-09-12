"use client";

import {
  Bot,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Workflow,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { EnterpriseBookingSection } from "@/components/enterprise/enterprise-booking-section";
import { enterpriseCopy } from "@/lib/enterprise/copy";

const copy = enterpriseCopy.zh;
const valueIcons = [UserCheck, Bot, ShieldCheck, CheckCircle2];
const serviceIcons = [Bot, Workflow, Building2, Sparkles];

export function EnterpriseLanding() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-slate-800/50">
        <div className="pointer-events-none absolute inset-0 hero-canvas" />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 lg:px-8 lg:pt-24 lg:pb-20">
          <FadeIn>
            <p className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/60 px-4 py-1.5 text-sm font-medium text-slate-600 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-200">
              {copy.hero.badge}
            </p>
            <h1 className="mt-6 max-w-4xl text-3xl font-semibold tracking-[-0.04em] leading-[1.12] text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
              {copy.hero.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              {copy.hero.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#booking"
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] dark:bg-white dark:text-slate-950"
              >
                {copy.hero.ctaPrimary}
              </a>
              <a
                href="#cases"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white/70 px-6 text-sm font-semibold text-slate-800 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200"
              >
                {copy.hero.ctaSecondary}
              </a>
            </div>
          </FadeIn>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {copy.hero.metrics.map((metric, index) => (
              <FadeIn key={metric.value} delay={0.08 * index}>
                <div className="rounded-2xl glass-panel px-5 py-5">
                  <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{metric.value}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{metric.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <FadeIn>
          <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            {copy.value.title}
          </h2>
        </FadeIn>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {copy.value.items.map((item, index) => {
            const Icon = valueIcons[index];
            return (
              <FadeIn key={item.title} delay={0.06 * index}>
                <article className="h-full rounded-3xl glass-panel glow-card p-7">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.body}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <FadeIn>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              {copy.servicesTitle}
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {copy.services.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <FadeIn key={service.title} delay={0.05 * index}>
                  <article className="h-full rounded-3xl glass-panel p-7">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold leading-snug">{service.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{service.intro}</p>
                    <p className="mt-5 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      {service.scenesLabel}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{service.scenes}</p>
                    <p className="mt-5 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      {service.techLabel}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{service.tech}</p>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <FadeIn>
          <h2 className="max-w-4xl text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            {copy.process.title}
          </h2>
        </FadeIn>
        <div className="mt-10 grid gap-4">
          {copy.process.steps.map((step, index) => (
            <FadeIn key={step.num} delay={0.04 * index}>
              <article className="grid gap-4 rounded-3xl glass-panel p-6 sm:grid-cols-[auto_1fr] sm:items-start sm:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-snug">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{step.body}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="cases" className="scroll-mt-24 border-y border-slate-200/70 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <FadeIn>
            <h2 className="max-w-4xl text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              {copy.cases.title}
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-6">
            {copy.cases.items.map((item, index) => (
              <FadeIn key={item.title} delay={0.05 * index}>
                <article className="rounded-3xl glass-panel glow-card p-7 sm:p-8">
                  <p className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">案例 {["A", "B", "C"][index]}</p>
                  <h3 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">{item.title}</h3>
                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">{item.backgroundLabel}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.background}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">{item.painLabel}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.pain}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">{item.solutionLabel}</p>
                      <ul className="mt-2 space-y-2">
                        {item.solutions.map((line) => (
                          <li key={line} className="flex gap-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-slate-900 dark:text-slate-200" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-950 px-5 py-4 text-white dark:border-slate-700">
                        <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">{item.resultLabel}</p>
                        <p className="mt-2 text-sm leading-7">{item.result}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            {copy.testimonials.title}
          </h2>
        </FadeIn>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {copy.testimonials.items.map((item, index) => (
            <FadeIn key={item.role} delay={0.06 * index}>
              <blockquote className="flex h-full flex-col rounded-3xl glass-panel p-7">
                <p className="flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">「{item.quote}」</p>
                <footer className="mt-6 text-sm font-semibold text-slate-950 dark:text-white">{item.role}</footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200/70 bg-white/50 py-16 dark:border-slate-800/50 dark:bg-slate-900/30 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <EnterpriseBookingSection />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
