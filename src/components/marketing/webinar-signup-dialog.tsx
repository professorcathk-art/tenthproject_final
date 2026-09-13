"use client";

import { useState } from "react";
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

export function WebinarSignupButton({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/webinar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      setError(dict.courses.webinarError);
      return;
    }
    setSubmitted(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setSubmitted(false);
          setError("");
        }}
        className={
          variant === "dark"
            ? `inline-flex h-11 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white ${className}`
            : `inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:bg-transparent dark:text-white ${className}`
        }
      >
        {dict.courses.webinarCta}
      </button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setSubmitted(false);
            setError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dict.courses.webinarCta}</DialogTitle>
            <DialogDescription>{dict.courses.webinarHint}</DialogDescription>
          </DialogHeader>
          {submitted ? (
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{dict.courses.webinarSuccess}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="webinar-name">{dict.courses.webinarName} *</Label>
                <Input
                  id="webinar-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="webinar-whatsapp">{dict.courses.webinarWhatsapp} *</Label>
                <Input
                  id="webinar-whatsapp"
                  type="tel"
                  required
                  placeholder="+852"
                  value={form.whatsapp}
                  onChange={(e) => setForm((current) => ({ ...current, whatsapp: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="webinar-email">{dict.courses.webinarEmail} *</Label>
                <Input
                  id="webinar-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? dict.courses.webinarSubmitting : dict.courses.webinarSubmit}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
