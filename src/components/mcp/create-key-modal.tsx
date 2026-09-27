"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CreateKeyModal({
  open,
  onOpenChange,
  projects,
  lockedProjectId,
  labels,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: { id: string; name: string }[];
  lockedProjectId?: string;
  labels: {
    title: string;
    cancel: string;
    submit: string;
    creating: string;
    whichProject: string;
    connectsTo: string;
    keyError: string;
    netError: string;
  };
  onCreate: (input: { projectId: string; label: string }) => Promise<string | null>;
}) {
  const initialProject = lockedProjectId || projects[0]?.id || "";
  const [projectId, setProjectId] = useState(initialProject);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const multiple = !lockedProjectId && projects.length > 1;
  const selected = projects.find((project) => project.id === projectId) ?? projects[0];

  useEffect(() => {
    if (!open) return;
    setProjectId(lockedProjectId || projects[0]?.id || "");
    setError("");
  }, [open, lockedProjectId, projects]);

  async function submit() {
    if (!projectId || !selected) {
      setError(labels.keyError);
      return;
    }
    const label = selected.name.replace(/\s+/g, " ").trim().slice(0, 40) || "MCP";
    setLoading(true);
    setError("");
    try {
      const message = await onCreate({ projectId, label });
      if (message) setError(message);
      else onOpenChange(false);
    } catch {
      setError(labels.netError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
        </DialogHeader>
        {multiple ? (
          <div className="space-y-2">
            <Label>{labels.whichProject}</Label>
            <Select value={projectId} onValueChange={(value) => value && setProjectId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-slate-600">{labels.connectsTo.replace("{name}", selected?.name ?? "")}</p>
        )}
        {error ? <p className="text-sm text-red-600">{error === "key" ? labels.keyError : error}</p> : null}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {labels.cancel}
          </Button>
          <Button type="button" onClick={submit} disabled={loading || !projectId}>
            {loading ? labels.creating : labels.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
