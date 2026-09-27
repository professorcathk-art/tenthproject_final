import type { ProjectArtifact, ProjectWithRelations } from "@/types";

export const INTAKE_TITLE = "建立專案時填的表";

export interface ProjectIntake {
  name: string;
  description: string;
  goal: string;
  target_audience: string;
  product_type: string;
  stage: string;
  selected_tool: string;
  website_url: string;
  github_url: string;
  notes: string;
  fileNames: string[];
  locked: boolean;
}

export function intakeFromProject(
  project: Partial<ProjectWithRelations>,
  extra?: { notes?: string | null; fileNames?: string[] },
): ProjectIntake {
  return {
    name: project.name?.trim() ?? "",
    description: project.description?.trim() ?? "",
    goal: project.goal?.trim() ?? "",
    target_audience: project.target_audience?.trim() ?? "",
    product_type: project.product_type ?? "other",
    stage: project.stage ?? "idea",
    selected_tool: project.selected_tool ?? "cursor",
    website_url: project.website_url?.trim() ?? "",
    github_url: project.github_url?.trim() ?? "",
    notes: extra?.notes?.trim() ?? "",
    fileNames: extra?.fileNames ?? [],
    locked: false,
  };
}

export function parseIntake(artifact: ProjectArtifact | undefined): ProjectIntake | null {
  if (!artifact?.extracted_text) return null;
  try {
    const raw = JSON.parse(artifact.extracted_text) as Partial<ProjectIntake>;
    if (!raw || typeof raw !== "object") return null;
    return {
      name: String(raw.name ?? ""),
      description: String(raw.description ?? ""),
      goal: String(raw.goal ?? ""),
      target_audience: String(raw.target_audience ?? ""),
      product_type: String(raw.product_type ?? "other"),
      stage: String(raw.stage ?? "idea"),
      selected_tool: String(raw.selected_tool ?? "cursor"),
      website_url: String(raw.website_url ?? ""),
      github_url: String(raw.github_url ?? ""),
      notes: String(raw.notes ?? ""),
      fileNames: Array.isArray(raw.fileNames) ? raw.fileNames.map((name) => String(name)).slice(0, 12) : [],
      locked: Boolean(raw.locked),
    };
  } catch {
    return null;
  }
}

export function findIntakeArtifact(artifacts: ProjectArtifact[] | undefined) {
  return (artifacts ?? []).find((item) => item.title === INTAKE_TITLE && item.type === "note");
}

export function readProjectIntake(project: Partial<ProjectWithRelations>): { intake: ProjectIntake; saved: boolean } {
  const parsed = parseIntake(findIntakeArtifact(project.artifacts));
  if (parsed) return { intake: parsed, saved: true };
  return { intake: intakeFromProject(project), saved: false };
}
