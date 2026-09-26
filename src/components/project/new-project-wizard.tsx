"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { PRODUCT_TYPES, PROJECT_STAGES, AI_TOOLS, type ProductType, type ProjectStage, type AITool } from "@/types";
import type { ProductBrief } from "@/lib/ai/product-brief";
import { useI18n } from "@/components/i18n/provider";

export function NewProjectWizard() {
  const { dict } = useI18n();
  const w = dict.wizard;
  const STEPS = w.steps;
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [brief, setBrief] = useState<ProductBrief | null>(null);
  const [promptText, setPromptText] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
    target_audience: "",
    product_type: "webapp" as ProductType,
    stage: "idea" as ProjectStage,
    selected_tool: "cursor" as AITool,
    website_url: "",
    github_url: "",
    notes: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const progress = ((step + 1) / STEPS.length) * 100;

  function updateForm(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateBrief(key: keyof ProductBrief, value: string) {
    setBrief((prev) => {
      if (!prev) return prev;
      if (key === "functions") return { ...prev, functions: value.split("\n") };
      return { ...prev, [key]: value };
    });
  }

  async function saveProjectFields(id: string) {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: id,
        name: form.name,
        description: form.description,
        goal: form.goal,
        target_audience: form.target_audience,
        product_type: form.product_type,
        stage: form.stage,
        selected_tool: form.selected_tool,
        website_url: form.website_url || null,
        github_url: form.github_url || null,
      }),
    });
  }

  async function createProjectAndPolish() {
    setAnalyzing(true);
    setError("");
    try {
      let id = projectId;
      if (!id) {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = (await res.json()) as { project?: { id: string }; error?: string; message?: string };
        if (!res.ok || !data.project) throw new Error(data.message || data.error || "Failed");
        id = data.project.id;
        setProjectId(id);

        for (const file of files) {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("projectId", id);
          fd.append("type", file.type.startsWith("image/") ? "screenshot" : "doc");
          fd.append("title", file.name);
          await fetch("/api/upload", { method: "POST", body: fd });
        }
      } else {
        await saveProjectFields(id);
      }

      const briefRes = await fetch("/api/ai/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          notes: form.notes,
          fileNames: files.map((file) => file.name),
        }),
      });
      const briefData = (await briefRes.json()) as { brief?: ProductBrief; error?: string };
      if (!briefRes.ok || !briefData.brief) throw new Error(briefData.error || "Failed");
      setBrief(briefData.brief);
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  }

  async function confirmBrief() {
    if (!projectId || !brief) return;
    const functions = brief.functions.map((item) => item.trim()).filter(Boolean);
    if (!brief.vision.trim() || !brief.endGoal.trim() || !brief.firstSprint.trim()) {
      setError(w.briefNeed);
      return;
    }
    setConfirming(true);
    setError("");
    const confirmed = { ...brief, functions };
    try {
      const saved = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          description: confirmed.vision,
          goal: confirmed.endGoal,
          target_audience: confirmed.audience,
        }),
      });
      if (!saved.ok) {
        const data = (await saved.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Failed");
      }

      const analyzeRes = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, promptType: "initial", brief: confirmed }),
      });
      const analyzeData = (await analyzeRes.json()) as { error?: string; promptRun?: { prompt_text?: string } };
      if (!analyzeRes.ok || analyzeData.error) throw new Error(analyzeData.error || "Failed");
      setPromptText(analyzeData.promptRun?.prompt_text ?? "");
      setStep(6);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setConfirming(false);
    }
  }

  async function handleNext() {
    if (step === 4) {
      await createProjectAndPolish();
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function canProceed() {
    switch (step) {
      case 0:
        return form.name.trim() && form.description.trim() && form.goal.trim();
      case 1:
        return form.product_type;
      case 2:
        return form.stage;
      case 3:
        return form.selected_tool;
      default:
        return true;
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            {w.stepOf.replace("{n}", String(step + 1)).replace("{total}", String(STEPS.length))}
          </span>
          <span className="text-sm text-slate-500">{STEPS[step]}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
          <CardDescription>{w.hints[step]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{w.name}</Label>
                <Input
                  id="name"
                  placeholder={w.namePh}
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{w.what}</Label>
                <Textarea
                  id="description"
                  placeholder={w.whatPh}
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">{w.goal}</Label>
                <Textarea
                  id="goal"
                  placeholder={w.goalPh}
                  rows={2}
                  value={form.goal}
                  onChange={(e) => updateForm("goal", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">{w.audience}</Label>
                <Input
                  id="audience"
                  placeholder={w.audiencePh}
                  value={form.target_audience}
                  onChange={(e) => updateForm("target_audience", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PRODUCT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateForm("product_type", type.value)}
                  className={`rounded-lg border-2 p-4 text-left text-sm font-medium transition-all ${
                    form.product_type === type.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {w.productTypes[type.value]}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {PROJECT_STAGES.map((stage) => (
                <button
                  key={stage.value}
                  type="button"
                  onClick={() => updateForm("stage", stage.value)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    form.stage === stage.value
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="font-medium">{w.stages[stage.value].label}</div>
                  <div className="text-sm text-slate-500 mt-1">{w.stages[stage.value].desc}</div>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {AI_TOOLS.map((tool) => (
                <button
                  key={tool.value}
                  type="button"
                  onClick={() => updateForm("selected_tool", tool.value)}
                  className={`rounded-lg border-2 p-4 text-center text-sm font-medium transition-all ${
                    form.selected_tool === tool.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">{w.website}</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-app.vercel.app"
                  value={form.website_url}
                  onChange={(e) => updateForm("website_url", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">{w.github}</Label>
                <Input
                  id="github"
                  type="url"
                  placeholder="https://github.com/you/your-repo"
                  value={form.github_url}
                  onChange={(e) => updateForm("github_url", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">{w.notes}</Label>
                <Textarea
                  id="notes"
                  placeholder={w.notesPh}
                  rows={4}
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{w.files}</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.md,.txt"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                />
                {files.length > 0 && (
                  <p className="text-sm text-slate-500">{files.length} {w.filesSelected}</p>
                )}
              </div>
            </div>
          )}

          {step === 5 && brief && (
            <div className="space-y-4">
              {(
                [
                  ["vision", w.briefVision, 4],
                  ["endGoal", w.briefGoal, 3],
                  ["audience", w.briefAudience, 2],
                ] as const
              ).map(([key, label, rows]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Textarea
                    id={key}
                    rows={rows}
                    value={brief[key]}
                    onChange={(e) => updateBrief(key, e.target.value)}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="functions">{w.briefFunctions}</Label>
                <Textarea
                  id="functions"
                  rows={5}
                  placeholder={w.briefFunctionsPh}
                  value={brief.functions.join("\n")}
                  onChange={(e) => updateBrief("functions", e.target.value)}
                />
              </div>
              {(
                [
                  ["uiStyle", w.briefUi, 2],
                  ["expectedOutput", w.briefOutput, 3],
                  ["outOfScope", w.briefOut, 2],
                  ["firstSprint", w.briefSprint, 3],
                ] as const
              ).map(([key, label, rows]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Textarea
                    id={key}
                    rows={rows}
                    value={brief[key]}
                    onChange={(e) => updateBrief(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 text-sm">
                <Check className="h-4 w-4" />
                {w.ready} {form.selected_tool}.
              </div>
              <div className="relative">
                <pre className="rounded-lg bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto whitespace-pre-wrap max-h-[32rem]">
                  {promptText}
                </pre>
                <Button
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => navigator.clipboard.writeText(promptText)}
                >
                  {w.copy}
                </Button>
              </div>
              <Button
                className="w-full"
                onClick={() => router.push(`/projects/${projectId}`)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {w.goDashboard}
              </Button>
            </div>
          )}

          {error && step < 6 ? <p className="text-sm text-red-600">{error}</p> : null}

          {step < 5 && (
            <div className="flex justify-between pt-4 border-t">
              <Button variant="ghost" onClick={handleBack} disabled={step === 0 || analyzing}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                {w.back}
              </Button>
              <Button onClick={handleNext} disabled={!canProceed() || analyzing}>
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {w.analyzing}
                  </>
                ) : step === 4 ? (
                  <>
                    {w.generate}
                    <Sparkles className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    {w.continue}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 5 && (
            <div className="flex justify-between pt-4 border-t">
              <Button variant="ghost" onClick={handleBack} disabled={confirming}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                {w.back}
              </Button>
              <Button onClick={confirmBrief} disabled={confirming || !brief}>
                {confirming ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {w.confirming}
                  </>
                ) : (
                  <>
                    {w.confirm}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
