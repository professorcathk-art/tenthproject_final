"use client";

import { useMemo, useState } from "react";
import { Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useI18n } from "@/components/i18n/provider";
import { CATEGORY_BADGE_CLASS, CATEGORY_LABEL, SEVERITY_CLASS } from "@/lib/project/audit";
import type { AiSuggestion, Enhancement } from "@/types";

export function NextSprintSheet({
  open,
  loading = false,
  suggestions,
  enhancements,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  loading?: boolean;
  suggestions: AiSuggestion[];
  enhancements: Enhancement[];
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: { suggestionIds: string[]; enhancementIds: string[] }) => Promise<void>;
}) {
  const { dict, locale } = useI18n();
  const p = dict.project;

  const pendingSuggestions = useMemo(
    () => suggestions.filter((item) => item.status === "pending"),
    [suggestions],
  );
  const openEnhancements = useMemo(
    () => enhancements.filter((item) => item.status === "suggested" || item.status === "planned"),
    [enhancements],
  );

  const snapshotKey = `${open}:${pendingSuggestions.map((item) => item.id).join(",")}:${openEnhancements.map((item) => item.id).join(",")}`;
  const [seenKey, setSeenKey] = useState(snapshotKey);
  const [suggestionIds, setSuggestionIds] = useState<string[]>(() => pendingSuggestions.map((item) => item.id));
  const [enhancementIds, setEnhancementIds] = useState<string[]>(() =>
    openEnhancements.filter((item) => item.status === "suggested").map((item) => item.id),
  );
  const [saving, setSaving] = useState(false);

  if (snapshotKey !== seenKey) {
    setSeenKey(snapshotKey);
    if (open) {
      setSuggestionIds(pendingSuggestions.map((item) => item.id));
      setEnhancementIds(openEnhancements.filter((item) => item.status === "suggested").map((item) => item.id));
    }
  }

  function toggle(list: string[], id: string, on: boolean) {
    return on ? [...new Set([...list, id])] : list.filter((item) => item !== id);
  }

  const selectedCount = suggestionIds.length + enhancementIds.length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            {p.sprintPickerTitle}
          </SheetTitle>
          <SheetDescription>{p.sprintPickerDesc}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4">
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            {p.sprintPickerUatNote}
          </p>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{p.sprintAiGroup}</h3>
              <span className="text-xs text-slate-500">{suggestionIds.length}/{pendingSuggestions.length}</span>
            </div>
            {pendingSuggestions.length === 0 ? (
              <p className="text-sm text-slate-500">{p.noSuggestions}</p>
            ) : (
              pendingSuggestions.map((item) => {
                const checked = suggestionIds.includes(item.id);
                const label = CATEGORY_LABEL[item.category]?.[locale === "zh" ? "zh" : "en"] ?? item.category;
                return (
                  <label key={item.id} className="flex cursor-pointer gap-3 rounded-xl border bg-card p-3">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        setSuggestionIds((current) => toggle(current, item.id, value === true))
                      }
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap gap-1">
                        <Badge className={CATEGORY_BADGE_CLASS[item.category] ?? ""}>{label}</Badge>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${SEVERITY_CLASS[item.severity] ?? ""}`}>
                          {item.severity}
                        </span>
                        {checked ? <span className="text-[11px] text-emerald-700">{p.willCreateUat}</span> : null}
                      </div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="line-clamp-2 text-xs text-slate-500">{item.description}</p>
                    </div>
                  </label>
                );
              })
            )}
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{p.sprintEnhGroup}</h3>
              <span className="text-xs text-slate-500">{enhancementIds.length}/{openEnhancements.length}</span>
            </div>
            {openEnhancements.length === 0 ? (
              <p className="text-sm text-slate-500">{p.noEnhancements}</p>
            ) : (
              openEnhancements.map((item) => {
                const checked = enhancementIds.includes(item.id);
                return (
                  <label key={item.id} className="flex cursor-pointer gap-3 rounded-xl border bg-card p-3">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        setEnhancementIds((current) => toggle(current, item.id, value === true))
                      }
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <Badge variant="outline">{item.priority}</Badge>
                        <span className="text-[11px] text-slate-400">{item.status}</span>
                        {checked ? <span className="text-[11px] text-emerald-700">{p.willCreateUat}</span> : null}
                      </div>
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.description ? <p className="line-clamp-2 text-xs text-slate-500">{item.description}</p> : null}
                    </div>
                  </label>
                );
              })
            )}
          </section>

          {pendingSuggestions.length === 0 && openEnhancements.length === 0 ? (
            <p className="text-sm text-slate-500">{p.sprintEmpty}</p>
          ) : null}
        </div>

        <SheetFooter>
          <Button
            disabled={loading || saving}
            onClick={async () => {
              setSaving(true);
              try {
                await onConfirm({ suggestionIds, enhancementIds });
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving || loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            {p.sprintConfirm}
            {selectedCount ? ` (${selectedCount})` : ""}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
