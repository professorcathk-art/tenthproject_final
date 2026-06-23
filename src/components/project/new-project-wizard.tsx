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
import {
  PRODUCT_TYPES,
  PROJECT_STAGES,
  AI_TOOLS,
  type ProductType,
  type ProjectStage,
  type AITool,
} from "@/types";

const STEPS = [
  "Describe your idea",
  "Product type",
  "Current stage",
  "AI tool",
  "Upload context",
  "AI brief",
  "First prompt",
];

export function NewProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Record<string, unknown> | null>(null);
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

  async function createProjectAndAnalyze() {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const { project, error } = await res.json();
      if (error) throw new Error(error);

      setProjectId(project.id);

      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("projectId", project.id);
        fd.append("type", file.type.startsWith("image/") ? "screenshot" : "doc");
        fd.append("title", file.name);
        await fetch("/api/upload", { method: "POST", body: fd });
      }

      if (form.website_url) {
        await fetch("/api/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: project.id, website_url: form.website_url }),
        });
      }

      if (form.github_url) {
        await fetch("/api/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: project.id, github_url: form.github_url }),
        });
      }

      const analyzeRes = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, promptType: "initial" }),
      });
      const analyzeData = await analyzeRes.json();
      if (analyzeData.error) throw new Error(analyzeData.error);

      setAnalysis(analyzeData.analysis);
      setPromptText(analyzeData.promptRun?.prompt_text ?? "");
      setStep(5);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleNext() {
    if (step === 4) {
      await createProjectAndAnalyze();
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-sm text-slate-500">{STEPS[step]}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
          <CardDescription>
            {step === 0 && "Tell us about your product idea in plain language."}
            {step === 1 && "What kind of thing are you building?"}
            {step === 2 && "Where are you in the journey?"}
            {step === 3 && "Which AI tool are you using to build?"}
            {step === 4 && "Share anything you already have — screenshots, URLs, docs."}
            {step === 5 && "Review your AI-generated project brief."}
            {step === 6 && "Copy your first prompt and start building!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project name</Label>
                <Input
                  id="name"
                  placeholder="e.g. My Fitness Tracker"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">What do you want to build?</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your idea in a sentence or two..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">What&apos;s the end goal?</Label>
                <Textarea
                  id="goal"
                  placeholder="What should users be able to do when it's done?"
                  rows={2}
                  value={form.goal}
                  onChange={(e) => updateForm("goal", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Who is it for?</Label>
                <Input
                  id="audience"
                  placeholder="e.g. Busy professionals who want to track workouts"
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
                  {type.label}
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
                  <div className="font-medium">{stage.label}</div>
                  <div className="text-sm text-slate-500 mt-1">{stage.description}</div>
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
                <Label htmlFor="website">Website URL (if you have one)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-app.vercel.app"
                  value={form.website_url}
                  onChange={(e) => updateForm("website_url", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub repo URL</Label>
                <Input
                  id="github"
                  type="url"
                  placeholder="https://github.com/you/your-repo"
                  value={form.github_url}
                  onChange={(e) => updateForm("github_url", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes / PRD / extra context</Label>
                <Textarea
                  id="notes"
                  placeholder="Paste any notes, requirements, or context here..."
                  rows={4}
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Screenshots or files</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.md,.txt"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                />
                {files.length > 0 && (
                  <p className="text-sm text-slate-500">{files.length} file(s) selected</p>
                )}
              </div>
            </div>
          )}

          {step === 5 && analysis && (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="font-medium mb-2">Summary</h3>
                <p className="text-sm text-slate-600">{String(analysis.projectSummary)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="font-medium mb-2">Next action</h3>
                <p className="text-sm text-slate-600">{String(analysis.nextAction)}</p>
              </div>
              {Array.isArray(analysis.phases) && (
                <div>
                  <h3 className="font-medium mb-2">Phases</h3>
                  <div className="space-y-2">
                    {(analysis.phases as Array<{ name: string; description: string }>).map((p, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium">
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-slate-500">{p.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(analysis.uatItems) && (
                <p className="text-sm text-slate-500">
                  {(analysis.uatItems as unknown[]).length} UAT items ·{" "}
                  {Array.isArray(analysis.tasks) ? (analysis.tasks as unknown[]).length : 0} tasks generated
                </p>
              )}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 text-sm">
                <Check className="h-4 w-4" />
                Your project is ready! Copy the prompt below into {form.selected_tool}.
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
                  Copy
                </Button>
              </div>
              <Button
                className="w-full"
                onClick={() => router.push(`/projects/${projectId}`)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Go to project dashboard
              </Button>
            </div>
          )}

          {step < 6 && (
            <div className="flex justify-between pt-4 border-t">
              <Button variant="ghost" onClick={handleBack} disabled={step === 0 || analyzing}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!canProceed() || analyzing}>
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : step === 4 ? (
                  <>
                    Generate plan
                    <Sparkles className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 5 && (
            <div className="flex justify-between pt-4 border-t">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button onClick={() => setStep(6)}>
                View prompt
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
