"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Copy } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/components/i18n/provider";
import { generateCursorSetupPrompt } from "@/lib/mcp/cursor-setup-prompt";

interface ProjectOption {
  id: string;
  name: string;
}

interface KeyRecord {
  id: string;
  key_prefix: string;
  label: string;
  last_used_at: string | null;
  created_at: string;
}

export function McpSettings({
  projects,
  lockedProjectId,
  mcpUrl,
}: {
  projects: ProjectOption[];
  lockedProjectId?: string;
  mcpUrl: string;
}) {
  const { dict } = useI18n();
  const m = dict.mcp;
  const initialId = lockedProjectId || projects[0]?.id || "";
  const [projectId, setProjectId] = useState(initialId);
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [setupPrompt, setSetupPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const [error, setError] = useState("");
  const [replaced, setReplaced] = useState(false);

  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const multiple = !lockedProjectId && projects.length > 1;
  const latest = keys[0];

  const config = newKey
    ? JSON.stringify(
        {
          mcpServers: {
            tenthproject: {
              url: mcpUrl,
              headers: { Authorization: `Bearer ${newKey}` },
            },
          },
        },
        null,
        2,
      )
    : "";

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    fetch(`/api/mcp-keys?projectId=${projectId}`)
      .then((response) => response.json())
      .then((data: { keys?: KeyRecord[] }) => {
        if (!cancelled) setKeys(data.keys ?? []);
      })
      .catch(() => {
        if (!cancelled) setKeys([]);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  function chooseProject(nextId: string) {
    setProjectId(nextId);
    setNewKey(null);
    setSetupPrompt(null);
    setCopyFailed(false);
    setError("");
    setReplaced(false);
  }

  function promptFor(apiKey: string) {
    return generateCursorSetupPrompt(apiKey, {
      mcpUrl,
      projectName: project?.name || m.project,
      testPrompt: m.example1,
    });
  }

  async function writeClipboard(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setCopyFailed(false);
      window.setTimeout(() => setCopied((current) => (current === id ? null : current)), 2000);
      if (id === "setup") toast.success(m.copiedToast);
      return true;
    } catch {
      setCopyFailed(true);
      return false;
    }
  }

  async function issueKey() {
    if (!projectId || !project) return null;
    const listed = await fetch(`/api/mcp-keys?projectId=${projectId}`).then((response) => response.json().catch(() => ({})));
    const previous = (listed as { keys?: KeyRecord[] }).keys ?? keys;
    const response = await fetch("/api/mcp-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, label: "Cursor MCP" }),
    });
    const data = (await response.json().catch(() => ({}))) as { key?: string; record?: KeyRecord; error?: string };
    if (!response.ok || !data.key || !data.record) {
      setError(data.error || m.keyError);
      return null;
    }
    await Promise.all(
      previous.map((key) =>
        fetch("/api/mcp-keys", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyId: key.id }),
        }),
      ),
    );
    const prompt = promptFor(data.key);
    setNewKey(data.key);
    setSetupPrompt(prompt);
    setKeys([{ ...data.record, last_used_at: data.record.last_used_at ?? null }]);
    setReplaced(previous.length > 0);
    return prompt;
  }

  async function copySetup(rotate: boolean) {
    if (!projectId) return;
    setError("");
    if (!rotate && setupPrompt) {
      await writeClipboard(setupPrompt, "setup");
      return;
    }
    setLoading(true);
    try {
      const prompt = await issueKey();
      if (!prompt) return;
      const ok = await writeClipboard(prompt, "setup");
      if (!ok) setCopyFailed(true);
    } catch {
      setError(m.netError);
    } finally {
      setLoading(false);
    }
  }

  const binding = lockedProjectId && project
    ? m.step1Locked.replace("{name}", project.name)
    : multiple || !project
      ? m.step1Body
      : m.step1Only.replace("{name}", project.name);

  const primaryLabel = loading ? m.generating : setupPrompt ? m.copyAgain : latest ? m.regenerateCopy : m.generate;
  const capabilities = [m.toolRoadmap, m.toolTask, m.toolUat, m.toolUpdate, m.toolSprint, m.toolBug, m.toolBuild];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.title}</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-relaxed">{m.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>1</Badge>
              <h2 className="text-sm font-semibold">{m.step1}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{binding}</p>
            {multiple ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">{m.pickProject}</p>
                <Select value={projectId} onValueChange={(value) => value && chooseProject(value)}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-500">{m.pickHint}</p>
              </div>
            ) : null}
            {latest ? (
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono">
                  {latest.key_prefix}…
                </Badge>
                {latest.last_used_at ? <span className="text-xs text-emerald-700">{m.connected}</span> : null}
              </div>
            ) : null}
            {!setupPrompt && latest ? (
              <p className="max-w-2xl text-sm leading-relaxed text-slate-500">{m.oldKey.replace("{prefix}", latest.key_prefix)}</p>
            ) : null}
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap">
              <Button
                size="lg"
                className="h-auto whitespace-normal px-4 py-3 text-left"
                onClick={() => copySetup(false)}
                disabled={loading || !projectId}
              >
                {copied === "setup" ? <CheckCircle2 className="mr-1 h-4 w-4" /> : null}
                {copied === "setup" ? m.copied : primaryLabel}
              </Button>
              {setupPrompt ? (
                <Button type="button" variant="outline" onClick={() => copySetup(true)} disabled={loading}>
                  {m.regenerate}
                </Button>
              ) : null}
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {setupPrompt && !copyFailed ? <p className="max-w-2xl text-sm leading-relaxed text-amber-900">{m.saveOnce}</p> : null}
            {setupPrompt && replaced ? <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{m.rotateHint}</p> : null}
            {copyFailed && setupPrompt ? (
              <div className="space-y-2">
                <p className="max-w-2xl text-sm leading-relaxed text-amber-900">{m.clipboardFail}</p>
                <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed whitespace-pre-wrap text-slate-100">{setupPrompt}</pre>
              </div>
            ) : null}
          </section>

          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>2</Badge>
              <h2 className="text-sm font-semibold">{m.step2}</h2>
            </div>
            <div className="max-w-2xl space-y-3 rounded-xl border bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p>1. {m.step2Line1}</p>
              <p>2. {m.step2Line2}</p>
              <p>3. {m.step2Line3}</p>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{m.step3Body}</p>
            <div className="rounded-xl border bg-slate-50 p-4 text-sm leading-relaxed dark:bg-slate-900">{m.example1}</div>
            <Button type="button" variant="outline" onClick={() => writeClipboard(m.example1, "prompt")}>
              {copied === "prompt" ? <CheckCircle2 className="mr-1 h-4 w-4 text-green-600" /> : <Copy className="mr-1 h-4 w-4" />}
              {copied === "prompt" ? m.copied : m.copyPrompt}
            </Button>
            <p className="text-sm leading-relaxed text-emerald-800">{m.success}</p>
          </section>

          <Accordion>
            <AccordionItem value="manual">
              <AccordionTrigger className="text-sm font-medium">{m.manualTitle}</AccordionTrigger>
              <AccordionContent className="space-y-3">
                {newKey && config ? (
                  <>
                    <p className="max-w-2xl leading-relaxed text-slate-600">{m.manualBody}</p>
                    <p className="font-mono text-xs text-slate-500">.cursor/mcp.json</p>
                    <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">{config}</pre>
                    <Button type="button" variant="outline" onClick={() => writeClipboard(config, "cfg")}>
                      {copied === "cfg" ? <CheckCircle2 className="mr-1 h-4 w-4 text-green-600" /> : <Copy className="mr-1 h-4 w-4" />}
                      {copied === "cfg" ? m.copied : m.copyConfig}
                    </Button>
                    <p className="max-w-2xl leading-relaxed text-amber-950">{m.gitignore}</p>
                  </>
                ) : (
                  <p className="max-w-2xl leading-relaxed text-slate-500">{m.manualWaiting}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{m.notesTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-slate-600">
          <p>{lockedProjectId ? m.switchElsewhere : multiple ? m.switchHere : m.switchLater}</p>
          <p>{m.rotateHint}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{m.toolsTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
            {capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
