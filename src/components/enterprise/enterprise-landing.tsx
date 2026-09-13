"use client";

import Image from "next/image";
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
const caseImages = [
  { src: "/images/case-hr.jpg", alt: "HR 與招聘流程顧問工作現場" },
  { src: "/images/case-logistics.jpg", alt: "跨境電商物流與倉儲作業" },
  { src: "/images/case-finance.jpg", alt: "金融盡職審查與文件研讀" },
];

export function EnterpriseLanding() {
  return (
    <div className="bg-[#f4f4f1] dark:bg-slate-950">
      <section className="relative w-full overflow-hidden border-b border-slate-200/70 py-12 dark:border-slate-800/50 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="pr-0 lg:col-span-7 lg:pr-6">
              <FadeIn className="space-y-6">
                <p className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-200">
                  {copy.hero.badge}
                </p>
                <h1 className="text-3xl font-semibold tracking-[-0.04em] leading-[1.12] text-slate-950 sm:text-5xl dark:text-white">
                  {copy.hero.headline}
                </h1>
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  {copy.hero.subheadline}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#booking"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
                  >
                    {copy.hero.ctaPrimary}
                  </a>
                  <a
                    href="#cases"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 text-sm font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200"
                  >
                    {copy.hero.ctaSecondary}
                  </a>
                </div>
              </FadeIn>
            </div>
            <div className="relative lg:col-span-5">
              <div className="relative min-h-[320px] overflow-hidden rounded-3xl lg:min-h-[520px]">
                <Image
                  src="/images/enterprise-consulting.jpg"
                  alt="Tenth Project 顧問與企業客戶在香港進行一對一諮詢"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-[center_28%] brightness-[0.7] contrast-[1.03] saturate-[0.75]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(15,23,42,0.42)_100%)]" />
              </div>
            </div>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {copy.hero.metrics.map((metric, index) => (
              <FadeIn key={metric.value} delay={0.08 * index}>
                <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-5 py-5 dark:border-slate-800/50 dark:bg-slate-950/40">
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
          <div className="mt-10 grid gap-8">
            {copy.cases.items.map((item, index) => (
              <FadeIn key={item.title} delay={0.05 * index}>
                <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] dark:border-slate-800/70 dark:bg-slate-950/50">
                  <div className="grid lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]">
                    <div className="relative aspect-[16/10] bg-slate-200 lg:aspect-auto lg:min-h-full dark:bg-slate-900">
                      <Image
                        src={caseImages[index].src}
                        alt={caseImages[index].alt}
                        fill
                        sizes="(min-width: 1024px) 32vw, 92vw"
                        className="object-cover brightness-[0.62] contrast-[1.04] saturate-[0.7]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/15 to-slate-950/20 lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/25" />
                    </div>
                    <div className="p-7 sm:p-8">
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
                          <div className="mt-5 rounded-2xl bg-slate-950 px-5 py-4 text-white">
                            <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">{item.resultLabel}</p>
                            <p className="mt-2 text-sm leading-7 text-slate-100">{item.result}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
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
