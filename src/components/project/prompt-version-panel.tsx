"use client";

import type { ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS, zhTW } from "date-fns/locale";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/provider";
import type { PromptRun } from "@/types";

export function PromptVersionPanel({
  runs,
  previewRunId,
  toggling,
  onView,
  onToggleExecuted,
  children,
}: {
  runs: PromptRun[];
  previewRunId: string | null;
  toggling?: boolean;
  onView: (run: PromptRun) => void;
  onToggleExecuted: (run: PromptRun) => void;
  children?: ReactNode;
}) {
  const { dict, locale } = useI18n();
  const p = dict.project;
  const dateLocale = locale === "zh" ? zhTW : enUS;
  const current = runs.find((run) => run.id === previewRunId) ?? runs[0];
  const executed = Boolean(current?.is_executed);

  return (
    <div className="space-y-4">
      {current ? (
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              executed
                ? "bg-emerald-100 text-emerald-800 shadow-[0_0_12px_rgba(16,185,129,0.45)]"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {executed ? `🟢 ${p.executedBadge}` : `⚪ ${p.pendingBadge}`}
          </span>
          <Button size="sm" variant={executed ? "outline" : "default"} disabled={toggling} onClick={() => onToggleExecuted(current)}>
            <Zap className="h-3.5 w-3.5" />
            {executed ? p.markPending : `⚡ ${p.markExecuted}`}
          </Button>
          {current.executed_at ? (
            <span className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(current.executed_at), { addSuffix: true, locale: dateLocale })}
              {locale === "zh" ? "" : " "}
              {p.executedAgo}
            </span>
          ) : null}
        </div>
      ) : null}

      {children}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{p.versionHistory}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {runs.length === 0 ? (
            <p className="text-sm text-slate-500">{p.noPrompt}</p>
          ) : (
            runs.slice(0, 8).map((run) => (
              <div key={run.id} className="flex items-center justify-between gap-2 rounded-lg border p-2 text-sm">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    <span>
                      {run.prompt_type} · {run.tool}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        run.is_executed ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {run.is_executed ? `🟢 ${p.executedShort}` : `⚪ ${p.pendingShort}`}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(run.created_at), { addSuffix: true, locale: dateLocale })}
                    {run.executed_at
                      ? ` · ${formatDistanceToNow(new Date(run.executed_at), { addSuffix: true, locale: dateLocale })}${locale === "zh" ? "" : " "}${p.executedAgo}`
                      : ""}
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => onView(run)}>
                  {p.useLatestPrompt}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
