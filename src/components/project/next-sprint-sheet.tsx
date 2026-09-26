"use client";

import { useMemo, useState, type ReactNode } from "react";
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
import { founderCard, UNMARKED_UAT } from "@/lib/project/founder-copy";
import type { AiSuggestion, Enhancement, Task, UATItem } from "@/types";

function PickRow({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: (next: boolean) => void;
  children: ReactNode;
}) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onToggle(!checked)}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          onToggle(!checked);
        }
      }}
      className="flex cursor-pointer gap-3 rounded-xl border bg-card p-3"
    >
      <Checkbox checked={checked} tabIndex={-1} className="pointer-events-none mt-0.5" />
      <div className="min-w-0 flex-1 space-y-1">{children}</div>
    </div>
  );
}

export function NextSprintSheet({
  open,
  loading = false,
  suggestions,
  enhancements,
  tasks,
  uatItems,
  onOpenChange,
  onReviewUat,
  onConfirm,
}: {
  open: boolean;
  loading?: boolean;
  suggestions: AiSuggestion[];
  enhancements: Enhancement[];
  tasks: Task[];
  uatItems: UATItem[];
  onOpenChange: (open: boolean) => void;
  onReviewUat: () => void;
  onConfirm: (payload: { suggestionIds: string[]; enhancementIds: string[]; taskIds: string[] }) => Promise<void>;
}) {
  const { dict, locale } = useI18n();
  const p = dict.project;
  const lang = locale === "zh" ? "zh" : "en";

  const pendingSuggestions = useMemo(
    () => suggestions.filter((item) => item.status === "pending"),
    [suggestions],
  );
  const openEnhancements = useMemo(
    () => enhancements.filter((item) => item.status === "suggested" || item.status === "planned"),
    [enhancements],
  );
  const openTasks = useMemo(
    () => tasks.filter((task) => task.status === "todo" || task.status === "in_progress" || task.status === "blocked"),
    [tasks],
  );
  const unmarked = useMemo(
    () => uatItems.filter((item) => UNMARKED_UAT.has(item.status)),
    [uatItems],
  );

  const snapshotKey = `${open}:${pendingSuggestions.map((item) => item.id).join(",")}:${openEnhancements.map((item) => item.id).join(",")}:${openTasks.map((item) => item.id).join(",")}`;
  const [seenKey, setSeenKey] = useState(snapshotKey);
  const [suggestionIds, setSuggestionIds] = useState<string[]>(() => pendingSuggestions.map((item) => item.id));
  const [enhancementIds, setEnhancementIds] = useState<string[]>([]);
  const [taskIds, setTaskIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  if (snapshotKey !== seenKey) {
    setSeenKey(snapshotKey);
    if (open) {
      setSuggestionIds(pendingSuggestions.map((item) => item.id));
      setEnhancementIds([]);
      setTaskIds([]);
    }
  }

  function toggle(list: string[], id: string, on: boolean) {
    return on ? [...new Set([...list, id])] : list.filter((item) => item !== id);
  }

  const selectedCount = suggestionIds.length + enhancementIds.length + taskIds.length;
  const blocked = unmarked.length > 0;
  const priorityLabel = (value: string) =>
    value === "high" ? p.priorityHigh : value === "low" ? p.priorityLow : p.priorityMedium;
  const taskStatusLabel = (status: Task["status"]) =>
    status === "in_progress" ? p.inProgress : status === "blocked" ? p.blocked : status === "done" ? p.done : p.todo;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 pr-8">
            <Rocket className="h-4 w-4" />
            {p.sprintPickerTitle}
          </SheetTitle>
          <SheetDescription>{p.sprintPickerDesc}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-4">
          {blocked ? (
            <section className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-50">
              <h3 className="text-sm font-semibold">{p.sprintBlockedTitle}</h3>
              <p className="text-sm leading-relaxed">{p.sprintBlockedBody}</p>
              <ul className="space-y-1 text-sm">
                {unmarked.map((item) => (
                  <li key={item.id}>
                    {item.title}
                    <span className="text-amber-800 dark:text-amber-200"> · {p.uatStatuses[item.status]}</span>
                  </li>
                ))}
              </ul>
              <Button type="button" variant="outline" onClick={onReviewUat}>
                {p.sprintGoUat}
              </Button>
            </section>
          ) : (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              {p.sprintPickerUatNote}
            </p>
          )}

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{p.sprintTaskGroup}</h3>
              <span className="text-xs text-slate-500">{taskIds.length}/{openTasks.length}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">{p.sprintTaskHint}</p>
            {openTasks.length === 0 ? (
              <p className="text-sm text-slate-500">{p.noTasks}</p>
            ) : (
              openTasks.map((task) => (
                <PickRow
                  key={task.id}
                  checked={taskIds.includes(task.id)}
                  onToggle={(next) => setTaskIds((current) => toggle(current, task.id, next))}
                >
                  <div className="flex flex-wrap items-center gap-1">
                    <Badge variant="outline">{priorityLabel(task.priority)}</Badge>
                    <span className="text-[11px] text-slate-400">{taskStatusLabel(task.status)}</span>
                  </div>
                  <p className="text-sm font-medium">{task.title}</p>
                  {task.description ? <p className="line-clamp-2 text-xs text-slate-500">{task.description}</p> : null}
                </PickRow>
              ))
            )}
          </section>

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
                const label = CATEGORY_LABEL[item.category]?.[lang] ?? item.category;
                const facing = founderCard(item, lang);
                return (
                  <PickRow
                    key={item.id}
                    checked={checked}
                    onToggle={(next) => setSuggestionIds((current) => toggle(current, item.id, next))}
                  >
                    <div className="flex flex-wrap gap-1">
                      <Badge className={CATEGORY_BADGE_CLASS[item.category] ?? ""}>{label}</Badge>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${SEVERITY_CLASS[item.severity] ?? ""}`}>
                        {item.severity === "critical" ? (lang === "zh" ? "緊急" : "Critical") : priorityLabel(item.severity)}
                      </span>
                      {checked ? <span className="text-[11px] text-emerald-700">{p.willCreateUat}</span> : null}
                    </div>
                    <p className="text-sm font-medium">{facing.title}</p>
                    {facing.summary ? <p className="line-clamp-3 text-xs leading-relaxed text-slate-500">{facing.summary}</p> : null}
                  </PickRow>
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
                const facing = founderCard(item, lang);
                const checked = enhancementIds.includes(item.id);
                return (
                  <PickRow
                    key={item.id}
                    checked={checked}
                    onToggle={(next) => setEnhancementIds((current) => toggle(current, item.id, next))}
                  >
                    <div className="flex flex-wrap items-center gap-1">
                      <Badge variant="outline">{priorityLabel(item.priority)}</Badge>
                      {checked ? <span className="text-[11px] text-emerald-700">{p.willCreateUat}</span> : null}
                    </div>
                    <p className="text-sm font-medium">{facing.title}</p>
                    {facing.summary ? <p className="line-clamp-3 text-xs leading-relaxed text-slate-500">{facing.summary}</p> : null}
                  </PickRow>
                );
              })
            )}
          </section>

          {!blocked && pendingSuggestions.length === 0 && openEnhancements.length === 0 && openTasks.length === 0 ? (
            <p className="text-sm text-slate-500">{p.sprintEmpty}</p>
          ) : null}
        </div>

        <SheetFooter>
          <Button
            disabled={blocked || loading || saving}
            onClick={async () => {
              setSaving(true);
              try {
                await onConfirm({ suggestionIds, enhancementIds, taskIds });
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving || loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            {p.sprintConfirm}
            {!blocked && selectedCount ? ` (${selectedCount})` : ""}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
