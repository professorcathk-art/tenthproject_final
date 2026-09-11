"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Key, Trash2, Plug } from "lucide-react";

interface McpSettingsProps {
  projectId: string;
  projectName: string;
}

interface KeyRecord {
  id: string;
  key_prefix: string;
  label: string;
  last_used_at: string | null;
  created_at: string;
}

export function McpSettings({ projectId, projectName }: McpSettingsProps) {
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mcpConfig = JSON.stringify({
    mcpServers: {
      tenthproject: {
        url: `${typeof window !== "undefined" ? window.location.origin : "https://tenthproject-final.vercel.app"}/api/mcp`,
        headers: { Authorization: `Bearer ${newKey ?? "YOUR_TENTHPROJECT_API_KEY"}` },
      },
    },
  }, null, 2);

  useEffect(() => {
    fetch(`/api/mcp-keys?projectId=${projectId}`)
      .then((r) => r.json())
      .then((d) => setKeys(d.keys ?? []));
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
    await fetch("/api/mcp-keys", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyId }) });
    setKeys((k) => k.filter((x) => x.id !== keyId));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Plug className="h-4 w-4" /> Connect Cursor MCP
        </CardTitle>
        <CardDescription>
          Sync UAT status, fetch roadmap, and log bugs directly from Cursor IDE.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={generateKey} disabled={loading}>
            <Key className="h-4 w-4 mr-1" /> Generate API Key
          </Button>
        </div>

        {newKey && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
            <p className="text-sm font-medium text-amber-800">Save this key now — it won&apos;t be shown again:</p>
            <div className="flex gap-2">
              <Input readOnly value={newKey} className="font-mono text-xs" />
              <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(newKey)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {keys.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Active keys</p>
            {keys.map((k) => (
              <div key={k.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                <div>
                  <Badge variant="secondary">{k.key_prefix}...</Badge>
                  <span className="ml-2 text-slate-500">{k.label}</span>
                </div>
                <Button size="icon" variant="ghost" onClick={() => revokeKey(k.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2">Add to <code className="text-xs bg-slate-100 px-1 rounded">.cursor/mcp.json</code>:</p>
          <pre className="rounded-lg bg-slate-900 text-slate-100 p-3 text-xs overflow-x-auto">{mcpConfig}</pre>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => navigator.clipboard.writeText(mcpConfig)}>
            <Copy className="h-3 w-3 mr-1" /> Copy MCP Config
          </Button>
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <p><strong>Available MCP tools:</strong> get_active_roadmap, fetch_uat_status, update_uat_item, log_bug</p>
          <p>Project: {projectName} · ID: {projectId}</p>
        </div>
      </CardContent>
    </Card>
  );
}
