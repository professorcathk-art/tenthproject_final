"use client";

import { useState } from "react";

import { useI18n } from "@/components/i18n/provider";

export function PromptBlock({ children }: { children: string }) {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const copyLabel = locale === "en" ? "Copy" : "複製";
  const copiedLabel = locale === "en" ? "Copied" : "已複製";

  async function copy() {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative mt-3">
      <button
        type="button"
        onClick={copy}
        className="absolute top-3 right-3 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-100 hover:bg-slate-700"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
      <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 pr-20 text-sm leading-relaxed text-slate-100">
        <code>{children}</code>
      </pre>
    </div>
  );
}
