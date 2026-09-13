"use client";

import { useCallback, useState } from "react";
import type { CaseMarkStatus } from "@/types/platform";

export function useCaseMarks(initialMarks: Record<string, CaseMarkStatus> = {}) {
  const [marks, setMarks] = useState<Record<string, CaseMarkStatus>>(initialMarks);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  const toggle = useCallback(async (slug: string, status: CaseMarkStatus) => {
    const next = marks[slug] === status ? null : status;
    const previous = marks;
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
        body: JSON.stringify({ slug, status: next }),
      });
      const data = (await res.json()) as { marks?: Record<string, CaseMarkStatus> };
      if (!res.ok || !data.marks) {
        setMarks(previous);
        return;
      }
      setMarks(data.marks);
    } catch {
      setMarks(previous);
    } finally {
      setPendingSlug(null);
    }
  }, [marks]);

  return { marks, toggle, pendingSlug };
}
