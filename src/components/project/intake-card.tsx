import { deliveryShapeLabel, detectDeliveryShape } from "@/lib/ai/delivery-shape";
import { readProjectIntake } from "@/lib/project/intake";
import type { ProjectWithRelations } from "@/types";

interface IntakeCardProps {
  project: ProjectWithRelations;
  labels: {
    title: string;
    hint: string;
    missingNotes: string;
    empty: string;
    shape: string;
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
  chinese: boolean;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="text-sm whitespace-pre-wrap text-slate-800">{value}</dd>
    </div>
  );
}

export function IntakeCard({ project, labels, promptText, chinese }: IntakeCardProps) {
  const { intake, saved } = readProjectIntake(project);
  const shape = detectDeliveryShape(intake);
  const drifted =
    shape === "browser_extension" && /Next\.js App Router|src\/app\/page\.tsx/.test(promptText) && !/manifest|content script|擴充功能/i.test(promptText);
  const show = (value: string) => value.trim() || labels.empty;

  return (
    <section className="rounded-xl border bg-card px-4 py-4">
      <h2 className="text-base font-semibold text-slate-900">{labels.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{labels.hint}</p>
      <p className="mt-3 text-sm text-slate-700">
        {labels.shape}：{deliveryShapeLabel(shape, chinese)}
      </p>
      {drifted ? <p className="mt-2 text-sm text-amber-800">{labels.drift}</p> : null}
      {!saved ? <p className="mt-2 text-sm text-slate-500">{labels.missingNotes}</p> : null}
      <dl className="mt-4 space-y-3">
        <Row label={labels.name} value={show(intake.name)} />
        <Row label={labels.what} value={show(intake.description)} />
        <Row label={labels.goal} value={show(intake.goal)} />
        <Row label={labels.audience} value={show(intake.target_audience)} />
        <Row label={labels.type} value={labels.productTypes[intake.product_type] ?? intake.product_type} />
        <Row label={labels.stage} value={labels.stages[intake.stage] ?? intake.stage} />
        <Row label={labels.tool} value={labels.tools[intake.selected_tool] ?? intake.selected_tool} />
        <Row label={labels.notes} value={show(intake.notes)} />
        {intake.fileNames.length ? <Row label={labels.files} value={intake.fileNames.join("、")} /> : null}
        {intake.website_url ? <Row label={labels.website} value={intake.website_url} /> : null}
        {intake.github_url ? <Row label={labels.github} value={intake.github_url} /> : null}
      </dl>
    </section>
  );
}
