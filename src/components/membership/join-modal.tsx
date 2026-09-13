"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/components/i18n/provider";

export function JoinModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { dict } = useI18n();
  const copy = dict.joinLifetime;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/auth/demo")
      .then((res) => res.json())
      .then((data: { user?: { name?: string; email?: string } | null }) => {
        if (cancelled || !data.user?.email) return;
        setSignedIn(true);
        setForm((current) => ({
          ...current,
          name: current.name || data.user?.name || "",
          email: data.user?.email || current.email,
        }));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || copy.error);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(copy.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setError("");
      }}
    >
      <DialogContent className="sm:max-w-md border-white/20 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.subtitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="lifetime-name">{copy.name} *</Label>
            <Input
              id="lifetime-name"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lifetime-email">{copy.email} *</Label>
            <Input
              id="lifetime-email"
              type="email"
              required
              autoComplete="email"
              readOnly={signedIn}
              value={form.email}
              onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lifetime-whatsapp">{copy.whatsapp} *</Label>
            <Input
              id="lifetime-whatsapp"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+852"
              value={form.whatsapp}
              onChange={(e) => setForm((current) => ({ ...current, whatsapp: e.target.value }))}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? copy.submitting : copy.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
