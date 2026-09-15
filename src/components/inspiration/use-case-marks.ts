"use client";

import { useCallback, useState } from "react";
import type { CaseMarkStatus } from "@/types/platform";

type MarkState = {
  marks: Record<string, CaseMarkStatus>;
  reads: string[];
};

export function useCaseMarks(initialMarks: Record<string, CaseMarkStatus> = {}, initialReads: string[] = []) {
  const [marks, setMarks] = useState<Record<string, CaseMarkStatus>>(initialMarks);
  const [reads, setReads] = useState<string[]>(initialReads);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  const applyState = useCallback((state: MarkState) => {
    setMarks(state.marks);
    setReads(state.reads);
  }, []);

  const toggle = useCallback(async (slug: string, status: CaseMarkStatus) => {
    const next = marks[slug] === status ? null : status;
    const previousMarks = marks;
    setMarks((current) => {
      const copy = { ...current };
      if (!next) delete copy[slug];
      else copy[slug] = next;
      return copy;
    });
    setPendingSlug(slug);
    try {
      const res = await fetch("/api/inspiration/marks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status: next, read: true }),
      });
      const data = (await res.json()) as Partial<MarkState> & { error?: string };
      if (!res.ok || !data.marks) {
        setMarks(previousMarks);
        return;
      }
      applyState({ marks: data.marks, reads: data.reads ?? reads });
    } catch {
      setMarks(previousMarks);
    } finally {
      setPendingSlug(null);
    }
  }, [applyState, marks, reads]);

  const markRead = useCallback(async (slug: string) => {
    if (reads.includes(slug)) return;
    setReads((current) => (current.includes(slug) ? current : [...current, slug]));
    try {
      const res = await fetch("/api/inspiration/marks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, read: true }),
      });
      const data = (await res.json()) as Partial<MarkState>;
      if (res.ok && data.marks && data.reads) applyState({ marks: data.marks, reads: data.reads });
    } catch {
      setReads((current) => current.filter((item) => item !== slug));
    }
  }, [applyState, reads]);

  return { marks, reads, toggle, markRead, pendingSlug };
}
