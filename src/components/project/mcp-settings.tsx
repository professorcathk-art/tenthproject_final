"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Key, Trash2, Plug, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/components/i18n/provider";

interface McpSettingsProps {
  projectId: string;
  projectName: string;
  compact?: boolean;
}

interface KeyRecord {
  id: string;
  key_prefix: string;
  label: string;
  last_used_at: string | null;
  created_at: string;
}

export function McpSettings({ projectId, projectName, compact = false }: McpSettingsProps) {
  const { dict, locale } = useI18n();
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [endpointOk, setEndpointOk] = useState<boolean | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://tenthproject-final.vercel.app";
  const mcpConfig = JSON.stringify(
    {
      mcpServers: {
        tenthproject: {
          url: `${origin}/api/mcp`,
          headers: { Authorization: `Bearer ${newKey ?? "YOUR_TENTHPROJECT_API_KEY"}` },
        },
      },
    },
    null,
    2
  );

  useEffect(() => {
    fetch(`/api/mcp-keys?projectId=${projectId}`)
      .then((r) => r.json())
      .then((d) => setKeys(d.keys ?? []));
    fetch("/api/mcp")
      .then((r) => setEndpointOk(r.ok))
      .catch(() => setEndpointOk(false));
  }, [projectId]);

  async function generateKey() {
    setLoading(true);
    const res = await fetch("/api/mcp-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, label: "Cursor MCP" }),
    });
    const data = await res.json();
    if (data.key) {
      setNewKey(data.key);
      setKeys((k) => [data.record, ...k]);
    }
    setLoading(false);
  }

  async function revokeKey(keyId: string) {
    await fetch("/api/mcp-keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyId }),
    });
    setKeys((k) => k.filter((x) => x.id !== keyId));
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const steps = [dict.mcp.step1, dict.mcp.step2, dict.mcp.step3];
  const tools = [
    { name: "get_active_roadmap", desc: dict.mcp.toolRoadmap },
    { name: "fetch_uat_status", desc: dict.mcp.toolUat },
    { name: "update_uat_item", desc: dict.mcp.toolUpdate },
    { name: "log_bug", desc: dict.mcp.toolBug },
  ];
  const examples = [dict.mcp.example1, dict.mcp.example2, dict.mcp.example3];

  const recentlyUsed = keys.some((key) => key.last_used_at);
  const keyPanel = (
    <>
      <div className="rounded-lg border px-3 py-2 text-sm flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">{endpointOk ? dict.project.mcpReady : dict.mcp.title}</div>
          <p className="text-xs text-slate-500">
            {recentlyUsed ? dict.project.mcpLive : dict.project.mcpIdle}
          </p>
        </div>
        <Badge variant={endpointOk ? "secondary" : "outline"}>{endpointOk ? "live" : "…"}</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={generateKey} disabled={loading}>
          <Key className="h-4 w-4 mr-1" /> {dict.mcp.generate}
        </Button>
      </div>

      {newKey && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
          <p className="text-sm font-medium text-amber-900">{dict.mcp.saveOnce}</p>
          <div className="flex gap-2">
            <Input readOnly value={newKey} className="font-mono text-xs bg-white" />
            <Button size="icon" variant="outline" onClick={() => copy(newKey, "key")}>
              {copied === "key" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {keys.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{dict.mcp.activeKeys}</p>
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
              <div>
                <Badge variant="secondary">{k.key_prefix}...</Badge>
                <span className="ml-2 text-slate-500">{k.label}</span>
                {k.last_used_at ? (
                  <span className="ml-2 text-xs text-emerald-600">{dict.mcp.connected}</span>
                ) : null}
              </div>
              <Button size="icon" variant="ghost" onClick={() => revokeKey(k.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="text-sm font-medium mb-2">
          {locale === "zh" ? "貼到專案根目錄" : "Paste into"}{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">.cursor/mcp.json</code>
        </p>
        <pre className="rounded-lg bg-slate-900 text-slate-100 p-3 text-xs overflow-x-auto">{mcpConfig}</pre>
        <Button size="sm" variant="outline" className="mt-2" onClick={() => copy(mcpConfig, "cfg")}>
          {copied === "cfg" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {dict.mcp.copyConfig}
        </Button>
      </div>
    </>
  );

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plug className="h-4 w-4" /> {projectName}
          </CardTitle>
          <CardDescription>
            {dict.mcp.project}: {projectId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">{keyPanel}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plug className="h-4 w-4" /> {dict.mcp.title}
          </CardTitle>
          <CardDescription>{dict.mcp.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-semibold mb-1">{dict.mcp.whatTitle}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{dict.mcp.whatBody}</p>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">{dict.mcp.stepsTitle}</p>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          {keyPanel}

        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{dict.mcp.toolsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tools.map((t) => (
              <div key={t.name}>
                <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">{t.name}</code>
                <p className="text-sm text-slate-600 mt-1">{t.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{dict.mcp.exampleTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {examples.map((ex) => (
              <p key={ex} className="text-sm text-slate-600 rounded-lg bg-slate-50 border p-3 leading-relaxed">
                “{ex}”
              </p>
            ))}
            <p className="text-xs text-slate-400">
              {dict.mcp.project}: {projectName} · ID: {projectId}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
