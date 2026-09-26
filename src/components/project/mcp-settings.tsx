"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Copy, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/components/i18n/provider";

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
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
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
    setError("");
    setReplaced(false);
  }

  async function generateKey() {
    if (!projectId) return;
    setLoading(true);
    setError("");
    const previous = keys;
    try {
      const response = await fetch("/api/mcp-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, label: "Cursor MCP" }),
      });
      const data = (await response.json().catch(() => ({}))) as { key?: string; record?: KeyRecord; error?: string };
      if (!response.ok || !data.key || !data.record) {
        setError(data.error || m.keyError);
        return;
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
      setNewKey(data.key);
      setKeys([{ ...data.record, last_used_at: data.record.last_used_at ?? null }]);
      setReplaced(previous.length > 0);
    } catch {
      setError(m.netError);
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 2000);
  }

  const capabilities = [m.toolRoadmap, m.toolTask, m.toolUat, m.toolUpdate, m.toolSprint, m.toolBug, m.toolBuild];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.title}</CardTitle>
          <CardDescription className="text-sm leading-relaxed">{m.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
          ) : project ? (
            <p className="text-sm leading-relaxed text-slate-600">{m.boundTo.replace("{name}", project.name)}</p>
          ) : null}

          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Step 1</Badge>
              <h2 className="text-sm font-semibold">{m.step1}</h2>
            </div>
            {latest ? (
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono">
                  {latest.key_prefix}…
                </Badge>
                {latest.last_used_at ? <span className="text-xs text-emerald-700">{m.connected}</span> : null}
              </div>
            ) : null}
            <Button onClick={generateKey} disabled={loading || !projectId}>
              <KeyRound className="mr-1 h-4 w-4" />
              {loading ? m.generating : latest || newKey ? m.regenerate : m.generate}
            </Button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {newKey ? <p className="max-w-2xl text-sm leading-relaxed text-amber-900">{m.saveOnce}</p> : null}
            {newKey && replaced ? <p className="max-w-2xl text-sm leading-relaxed text-slate-500">{m.rotateHint}</p> : null}
            {!newKey && latest ? (
              <p className="max-w-2xl text-sm leading-relaxed text-slate-500">{m.oldKey.replace("{prefix}", latest.key_prefix)}</p>
            ) : null}
          </section>

          {newKey ? (
            <>
              <section className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Step 2</Badge>
                  <h2 className="text-sm font-semibold">{m.step2}</h2>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{m.step2Body}</p>
                <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">{config}</pre>
                <Button type="button" variant="outline" onClick={() => copy(config, "cfg")}>
                  {copied === "cfg" ? <CheckCircle2 className="mr-1 h-4 w-4 text-green-600" /> : <Copy className="mr-1 h-4 w-4" />}
                  {copied === "cfg" ? m.copied : m.copyConfig}
                </Button>
              </section>

              <section className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Step 3</Badge>
                  <h2 className="text-sm font-semibold">{m.step3}</h2>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{m.step3Body}</p>
                <div className="rounded-xl border bg-slate-50 p-4 text-sm leading-relaxed dark:bg-slate-900">{m.example1}</div>
                <Button type="button" variant="outline" onClick={() => copy(m.example1, "prompt")}>
                  {copied === "prompt" ? <CheckCircle2 className="mr-1 h-4 w-4 text-green-600" /> : <Copy className="mr-1 h-4 w-4" />}
                  {copied === "prompt" ? m.copied : m.copyPrompt}
                </Button>
                <p className="text-sm leading-relaxed text-emerald-800">{m.success}</p>
              </section>
            </>
          ) : null}
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
