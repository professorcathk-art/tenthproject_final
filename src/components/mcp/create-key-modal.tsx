"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
    keyName: string;
    placeholder: string;
    nameRequired: string;
    cancel: string;
    submit: string;
    creating: string;
    whichProject: string;
    keyError: string;
    netError: string;
  };
  onCreate: (input: { projectId: string; label: string }) => Promise<string | null>;
}) {
  const initialProject = lockedProjectId || projects[0]?.id || "";
  const [projectId, setProjectId] = useState(initialProject);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const multiple = !lockedProjectId && projects.length > 1;

  useEffect(() => {
    if (!open) return;
    setProjectId(lockedProjectId || projects[0]?.id || "");
    setName("");
    setError("");
  }, [open, lockedProjectId, projects]);

  async function submit() {
    const label = name.replace(/\s+/g, " ").trim().slice(0, 40);
    if (!label || !projectId) {
      setError(labels.nameRequired);
      return;
    }
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
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="mcp-key-name">{labels.keyName}</Label>
          <Input
            id="mcp-key-name"
            value={name}
            maxLength={40}
            placeholder={labels.placeholder}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error === "key" ? labels.keyError : error}</p> : null}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {labels.cancel}
          </Button>
          <Button type="button" onClick={submit} disabled={loading || !name.trim()}>
            {loading ? labels.creating : labels.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
