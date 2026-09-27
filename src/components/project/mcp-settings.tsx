"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/components/i18n/provider";
import { CreateKeyModal } from "@/components/mcp/create-key-modal";
import { PromptModal } from "@/components/mcp/prompt-modal";
import { generateCursorSetupPrompt } from "@/lib/mcp/cursor-setup-prompt";

interface ProjectOption {
  id: string;
  name: string;
  tool?: string;
}

interface KeyRow {
  id: string;
  projectId: string;
  projectName: string;
  tool?: string;
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
  const visibleProjects = useMemo(
    () => (lockedProjectId ? projects.filter((project) => project.id === lockedProjectId) : projects),
    [lockedProjectId, projects],
  );
  const [rows, setRows] = useState<KeyRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const requestId = useRef(0);
  const [secrets, setSecrets] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [revokeRow, setRevokeRow] = useState<KeyRow | null>(null);
  const [revoking, setRevoking] = useState(false);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    const lists = await Promise.all(
      visibleProjects.map(async (project) => {
        const response = await fetch(`/api/mcp-keys?projectId=${project.id}`);
        const data = (await response.json().catch(() => ({}))) as { keys?: Omit<KeyRow, "projectId" | "projectName" | "tool">[] };
        return (data.keys ?? []).map((key) => ({ ...key, projectId: project.id, projectName: project.name, tool: project.tool }));
      }),
    );
    if (id !== requestId.current) return;
    setRows(lists.flat().sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
    setLoaded(true);
  }, [visibleProjects]);

  useEffect(() => {
    load().catch(() => {
      setRows([]);
      setLoaded(true);
    });
  }, [load]);

  function promptFor(secret: string, projectName: string, tool?: string) {
    return generateCursorSetupPrompt(secret, { mcpUrl, projectName, tool });
  }

  function openPrompt(row: KeyRow) {
    const secret = secrets[row.id];
    setApiKey(secret ?? null);
    setPrompt(secret ? promptFor(secret, row.projectName, row.tool) : null);
    setPromptOpen(true);
  }

  async function createKey(input: { projectId: string; label: string }) {
    const project = visibleProjects.find((item) => item.id === input.projectId) ?? projects.find((item) => item.id === input.projectId);
    const response = await fetch("/api/mcp-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: input.projectId, label: input.label }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      key?: string;
      record?: { id: string; key_prefix: string; label: string; created_at: string };
      error?: string;
    };
    if (!response.ok || !data.key || !data.record || !project) return data.error || m.keyError;
    requestId.current += 1;
    setSecrets((current) => ({ ...current, [data.record!.id]: data.key! }));
    setRows((current) => [
      {
        id: data.record!.id,
        projectId: project.id,
        projectName: project.name,
        tool: project.tool,
        key_prefix: data.record!.key_prefix,
        label: data.record!.label,
        last_used_at: null,
        created_at: data.record!.created_at,
      },
      ...current,
    ]);
    setApiKey(data.key);
    setPrompt(promptFor(data.key, project.name, project.tool));
    setPromptOpen(true);
    return null;
  }

  async function revoke() {
    if (!revokeRow) return;
    setRevoking(true);
    try {
      const response = await fetch("/api/mcp-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyId: revokeRow.id }),
      });
      if (!response.ok) return;
      requestId.current += 1;
      setRows((current) => current.filter((row) => row.id !== revokeRow.id));
      setSecrets((current) => {
        const next = { ...current };
        delete next[revokeRow.id];
        return next;
      });
      setRevokeRow(null);
    } finally {
      setRevoking(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">{m.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.subtitle}</p>
          <ol className="mt-3 space-y-1 text-sm leading-relaxed text-slate-600">
            {(lockedProjectId ? [m.how1Locked, m.how2, m.how3] : [m.how1, m.how2, m.how3]).map((step, index) => (
              <li key={step}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </div>
        <Button onClick={() => setCreateOpen(true)}>{m.create}</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {!lockedProjectId ? <TableHead>{m.colProject}</TableHead> : null}
            <TableHead>{m.colKey}</TableHead>
            <TableHead>{m.colCreated}</TableHead>
            <TableHead>{m.colUsed}</TableHead>
            <TableHead>{m.colStatus}</TableHead>
            <TableHead>{m.colActions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loaded ? (
            <TableRow>
              <TableCell colSpan={lockedProjectId ? 5 : 6} className="py-8 text-slate-500">
                {dict.common.loading}
              </TableCell>
            </TableRow>
          ) : rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {!lockedProjectId ? (
                  <TableCell className="font-medium">
                    {row.projectName}
                    {extraLabel(row) ? <div className="text-xs font-normal text-slate-500">{extraLabel(row)}</div> : null}
                  </TableCell>
                ) : null}
                <TableCell className="font-mono text-xs">{row.key_prefix}…</TableCell>
                <TableCell>{row.created_at.slice(0, 10)}</TableCell>
                <TableCell>{lastUsedLabel(row.last_used_at, m)}</TableCell>
                <TableCell>
                  <Badge variant={row.last_used_at ? "secondary" : "outline"}>{row.last_used_at ? m.live : m.idle}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => openPrompt(row)}>
                      {m.copyRow}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setRevokeRow(row)}>
                      {m.revoke}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={lockedProjectId ? 5 : 6} className="py-8 text-slate-500">
                {m.empty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateKeyModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        projects={visibleProjects}
        lockedProjectId={lockedProjectId}
        labels={{
          title: m.createTitle,
          cancel: m.cancel,
          submit: m.createSubmit,
          creating: m.creating,
          whichProject: m.whichProject,
          connectsTo: m.connectsTo,
          keyError: m.keyError,
          netError: m.netError,
        }}
        onCreate={createKey}
      />
      <PromptModal
        open={promptOpen}
        onOpenChange={setPromptOpen}
        prompt={prompt}
        apiKey={apiKey}
        labels={{
          title: m.promptTitle,
          subtitle: m.promptSubtitle,
          keyLabel: m.keyLabel,
          promptLabel: m.promptLabel,
          copy: m.copySetup,
          copyKey: m.copyKey,
          toast: m.copiedToast,
          copiedKey: m.copiedKey,
          shownOnce: m.shownOnce,
          lost: m.lostSecret,
          fail: m.clipboardFail,
        }}
      />

      <Dialog open={Boolean(revokeRow)} onOpenChange={(open) => !open && setRevokeRow(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{m.revokeTitle}</DialogTitle>
            <DialogDescription className="leading-relaxed">{m.revokeBody}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRevokeRow(null)} disabled={revoking}>
              {m.cancel}
            </Button>
            <Button type="button" variant="destructive" onClick={revoke} disabled={revoking}>
              {m.revokeConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function extraLabel(row: KeyRow) {
  const label = row.label?.trim();
  if (!label || label === row.projectName || label === "Cursor MCP" || label === "MCP") return null;
  return label;
}

function lastUsedLabel(
  value: string | null,
  labels: { neverUsed: string; justNow: string; minutesAgo: string; hoursAgo: string; daysAgo: string },
) {
  if (!value) return labels.neverUsed;
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
  if (!Number.isFinite(minutes) || minutes < 1) return labels.justNow;
  if (minutes < 60) return labels.minutesAgo.replace("{n}", String(minutes));
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return labels.hoursAgo.replace("{n}", String(hours));
  return labels.daysAgo.replace("{n}", String(Math.floor(hours / 24)));
}
