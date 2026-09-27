"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PromptModal({
  open,
  onOpenChange,
  prompt,
  labels,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string | null;
  labels: {
    title: string;
    subtitle: string;
    copy: string;
    toast: string;
    lost: string;
    fail: string;
  };
}) {
  const [failed, setFailed] = useState(false);

  async function copy() {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setFailed(false);
      toast.success(labels.toast);
    } catch {
      setFailed(true);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{prompt ? labels.title : labels.lost}</DialogTitle>
          {prompt ? <DialogDescription className="leading-relaxed">{labels.subtitle}</DialogDescription> : null}
        </DialogHeader>
        {prompt ? (
          <Button type="button" size="lg" className="h-auto whitespace-normal px-4 py-3" onClick={copy}>
            {labels.copy}
          </Button>
        ) : null}
        {failed && prompt ? (
          <div className="space-y-2">
            <p className="text-sm text-amber-800">{labels.fail}</p>
            <pre className="max-h-64 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed whitespace-pre-wrap text-slate-100">{prompt}</pre>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
