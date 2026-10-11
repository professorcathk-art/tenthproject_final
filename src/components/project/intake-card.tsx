"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { detectDeliveryShape } from "@/lib/ai/delivery-shape";
import { readProjectIntake, type ProjectIntake } from "@/lib/project/intake";
import type { AITool, ProjectWithRelations } from "@/types";

interface IntakeCardProps {
  project: ProjectWithRelations;
  labels: {
    title: string;
    edit: string;
    cancel: string;
    save: string;
    needName: string;
    saveFailed: string;
    empty: string;
    drift: string;
    name: string;
    what: string;
    goal: string;
    audience: string;
    type: string;
    stage: string;
    tool: string;
    notes: string;
    files: string;
    website: string;
    github: string;
    productTypes: Record<string, string>;
    stages: Record<string, string>;
    tools: Record<string, string>;
  };
  promptText: string;
  onSaved: (tool: AITool) => Promise<void>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="text-sm whitespace-pre-wrap text-slate-800">{value}</dd>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 sm:grid-cols-[9rem_1fr] sm:items-start sm:gap-3">
      <span className="pt-2 text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export function IntakeCard({ project, labels, promptText, onSaved }: IntakeCardProps) {
  const { intake } = readProjectIntake(project);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<ProjectIntake>(intake);
  const shape = detectDeliveryShape(editing ? draft : intake);
  const drifted =
    shape === "browser_extension" && /Next\.js App Router|src\/app\/page\.tsx/.test(promptText) && !/manifest|content script|擴充功能/i.test(promptText);
  const shown = editing ? draft : intake;
  const show = (value: string) => value.trim() || labels.empty;

  function startEdit() {
    setDraft(readProjectIntake(project).intake);
    setEditing(true);
  }

  function update(patch: Partial<ProjectIntake>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  async function save() {
    const name = draft.name.trim();
    if (!name) {
      toast.error(labels.needName);
      return;
    }
    const next: ProjectIntake = {
      ...draft,
      name,
      description: draft.description.trim(),
      goal: draft.goal.trim(),
      target_audience: draft.target_audience.trim(),
      notes: draft.notes.trim(),
      website_url: intake.website_url,
      github_url: intake.github_url,
      fileNames: intake.fileNames,
      locked: true,
    };
    setSaving(true);
    try {
      const intakeRes = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          action: "save_intake",
          lock: true,
          syncProject: true,
          intake: next,
        }),
      });
      if (!intakeRes.ok) throw new Error("intake");
      await onSaved(next.selected_tool as AITool);
      setEditing(false);
      toast.success(labels.save);
    } catch {
      toast.error(labels.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border bg-card px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">{labels.title}</h2>
        {editing ? null : (
          <Button type="button" variant="outline" size="sm" onClick={startEdit}>
            {labels.edit}
          </Button>
        )}
      </div>
      {drifted ? <p className="mt-2 text-sm text-amber-800">{labels.drift}</p> : null}
      {editing ? (
        <div className="mt-4 space-y-3">
          <Field label={labels.name}>
            <Input value={draft.name} onChange={(event) => update({ name: event.target.value })} />
          </Field>
          <Field label={labels.what}>
            <Textarea value={draft.description} onChange={(event) => update({ description: event.target.value })} />
          </Field>
          <Field label={labels.goal}>
            <Textarea value={draft.goal} onChange={(event) => update({ goal: event.target.value })} />
          </Field>
          <Field label={labels.audience}>
            <Input value={draft.target_audience} onChange={(event) => update({ target_audience: event.target.value })} />
          </Field>
          <Field label={labels.type}>
            <Choice
              value={draft.product_type}
              options={labels.productTypes}
              onChange={(product_type) => update({ product_type })}
            />
          </Field>
          <Field label={labels.stage}>
            <Choice value={draft.stage} options={labels.stages} onChange={(stage) => update({ stage })} />
          </Field>
          <Field label={labels.tool}>
            <Choice value={draft.selected_tool} options={labels.tools} onChange={(selected_tool) => update({ selected_tool })} />
          </Field>
          <Field label={labels.notes}>
            <Textarea value={draft.notes} onChange={(event) => update({ notes: event.target.value })} />
          </Field>
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={saving}>
              {labels.cancel}
            </Button>
            <Button type="button" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {labels.save}
            </Button>
          </div>
        </div>
      ) : (
        <dl className="mt-4 space-y-3">
          <Row label={labels.name} value={show(shown.name)} />
          <Row label={labels.what} value={show(shown.description)} />
          <Row label={labels.goal} value={show(shown.goal)} />
          <Row label={labels.audience} value={show(shown.target_audience)} />
          <Row label={labels.type} value={labels.productTypes[shown.product_type] ?? shown.product_type} />
          <Row label={labels.stage} value={labels.stages[shown.stage] ?? shown.stage} />
          <Row label={labels.tool} value={labels.tools[shown.selected_tool] ?? shown.selected_tool} />
          <Row label={labels.notes} value={show(shown.notes)} />
          {shown.fileNames.length ? <Row label={labels.files} value={shown.fileNames.join("、")} /> : null}
          {shown.website_url ? <Row label={labels.website} value={shown.website_url} /> : null}
          {shown.github_url ? <Row label={labels.github} value={shown.github_url} /> : null}
        </dl>
      )}
    </section>
  );
}

function Choice({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
}) {
  const entries = Object.entries(options);
  if (value && !entries.some(([key]) => key === value)) entries.unshift([value, value]);
  const current = entries.some(([key]) => key === value) ? value : (entries[0]?.[0] ?? value);
  return (
    <Select value={current} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger className="w-full max-w-full">
        <span className="truncate">{options[current] ?? current}</span>
      </SelectTrigger>
      <SelectContent>
        {entries.map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
