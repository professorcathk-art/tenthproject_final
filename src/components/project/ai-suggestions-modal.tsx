"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useI18n } from "@/components/i18n/provider";
import { CATEGORY_LABEL, SEVERITY_CLASS } from "@/lib/project/audit";
import type { AiSuggestion } from "@/types";

interface AiSuggestionsModalProps {
  open: boolean;
  suggestions: AiSuggestion[];
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (suggestions: AiSuggestion[]) => Promise<void>;
}

export function AiSuggestionsModal({
  open,
  suggestions,
  loading = false,
  onOpenChange,
  onConfirm,
}: AiSuggestionsModalProps) {
  const { dict, locale } = useI18n();
  const p = dict.project;
  const [drafts, setDrafts] = useState<AiSuggestion[]>(suggestions);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setDrafts(suggestions);
  }, [open, suggestions]);

  const visible = useMemo(
    () => drafts.filter((item) => item.status !== "applied"),
    [drafts],
  );

  function update(id: string, patch: Partial<AiSuggestion>) {
    setDrafts((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  const selectedCount = visible.filter((item) => item.approved && item.status !== "dismissed").length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {p.modalTitle}
          </SheetTitle>
          <SheetDescription>{p.modalDesc}</SheetDescription>
        </SheetHeader>

        <div className="space-y-3 px-4">
          {visible.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">{p.noSuggestions}</p>
          ) : (
            visible.map((item) => {
              const label = CATEGORY_LABEL[item.category]?.[locale === "zh" ? "zh" : "en"] ?? item.category;
              return (
                <div key={item.id} className="rounded-xl border bg-card p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary">{label}</Badge>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${SEVERITY_CLASS[item.severity] ?? SEVERITY_CLASS.medium}`}>
                        {item.severity}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.approved}
                      onClick={() => update(item.id, { approved: !item.approved, status: "pending" })}
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition ${
                        item.approved
                          ? "bg-emerald-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.approved ? "✓ " : ""}
                      {p.includeSprint}
                    </button>
                  </div>
                  <Input value={item.title} onChange={(event) => update(item.id, { title: event.target.value })} />
                  <Textarea
                    rows={3}
                    value={item.description}
                    onChange={(event) => update(item.id, { description: event.target.value })}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={() => update(item.id, { approved: false, status: "dismissed" })}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    {p.dismissSuggestion}
                  </Button>
                </div>
              );
            })
          )}
        </div>

        <SheetFooter>
          <Button
            disabled={loading || saving || selectedCount === 0}
            onClick={async () => {
              setSaving(true);
              try {
                await onConfirm(drafts);
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {p.confirmSprint}
            {selectedCount ? ` (${selectedCount})` : ""}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
