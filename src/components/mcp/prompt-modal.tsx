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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PromptModal({
  open,
  onOpenChange,
  prompt,
  apiKey,
  labels,
  onCreateNew,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string | null;
  apiKey: string | null;
  labels: {
    title: string;
    subtitle: string;
    keyLabel: string;
    promptLabel: string;
    copy: string;
    copyKey: string;
    toast: string;
    copiedKey: string;
    shownOnce: string;
    lost: string;
    lostAction: string;
    fail: string;
  };
  onCreateNew?: () => void;
}) {
  const [failed, setFailed] = useState(false);

  async function copyText(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      setFailed(false);
      toast.success(message);
    } catch {
      setFailed(true);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{prompt && apiKey ? labels.title : labels.lost}</DialogTitle>
          {prompt && apiKey ? <DialogDescription className="leading-relaxed">{labels.subtitle}</DialogDescription> : null}
        </DialogHeader>
        {prompt && apiKey ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label>{labels.keyLabel}</Label>
                <Button type="button" size="sm" variant="outline" onClick={() => copyText(apiKey, labels.copiedKey)}>
                  {labels.copyKey}
                </Button>
              </div>
              <Input readOnly value={apiKey} className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label>{labels.promptLabel}</Label>
              <pre className="max-h-64 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed whitespace-pre-wrap text-slate-100">{prompt}</pre>
            </div>
            <Button type="button" size="lg" className="h-auto w-full whitespace-normal px-4 py-3" onClick={() => copyText(prompt, labels.toast)}>
              {labels.copy}
            </Button>
            <p className="text-xs leading-relaxed text-slate-500">{failed ? labels.fail : labels.shownOnce}</p>
          </div>
        ) : (
          <Button type="button" onClick={onCreateNew}>
            {labels.lostAction}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
