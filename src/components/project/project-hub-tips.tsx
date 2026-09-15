"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/provider";

export function ProjectHubTips() {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const steps = [
    { title: dict.dashboard.tipsS1Title, body: dict.dashboard.tipsS1Body },
    { title: dict.dashboard.tipsS2Title, body: dict.dashboard.tipsS2Body },
    { title: dict.dashboard.tipsS3Title, body: dict.dashboard.tipsS3Body },
    { title: dict.dashboard.tipsS4Title, body: dict.dashboard.tipsS4Body },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="project-hub-tips"
        aria-label={dict.dashboard.tipsLabel}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-300"
      >
        <CircleHelp className="h-4 w-4" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent id="project-hub-tips" className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dict.dashboard.tipsTitle}</DialogTitle>
            <DialogDescription>{dict.dashboard.tipsLead}</DialogDescription>
          </DialogHeader>
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-slate-200 px-3 py-3 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
              </li>
            ))}
          </ol>
          <DialogFooter>
            <Button type="button" onClick={() => setOpen(false)}>
              {dict.dashboard.tipsClose}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
