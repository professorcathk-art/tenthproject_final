"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UAT_STATUSES, type UATItem, type UATRemark } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface UATDetailProps {
  projectId: string;
  projectName: string;
  item: UATItem;
  remarks: UATRemark[];
}

export function UATDetailView({ projectId, projectName, item: initialItem, remarks: initialRemarks }: UATDetailProps) {
  const [item, setItem] = useState(initialItem);
  const [remarks, setRemarks] = useState(initialRemarks);
  const [newRemark, setNewRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const statusConfig = UAT_STATUSES.find((s) => s.value === item.status);

  async function updateStatus(status: string) {
    setLoading(true);
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        action: "update_uat",
        uatId: item.id,
        data: { status, remark: newRemark || item.remark },
        remark: newRemark ? { text: newRemark, updatedBy: "Demo User" } : undefined,
      }),
    });
    setItem({ ...item, status: status as UATItem["status"], remark: newRemark || item.remark });
    if (newRemark) {
      setRemarks([
        {
          id: crypto.randomUUID(),
          uat_item_id: item.id,
          remark: newRemark,
          status_before: initialItem.status,
          status_after: status,
          evidence_url: null,
          updated_by: "Demo User",
          created_at: new Date().toISOString(),
        },
        ...remarks,
      ]);
      setNewRemark("");
    }
    setLoading(false);
  }

  async function retest() {
    setLoading(true);
    const res = await fetch("/api/ai/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, promptType: "re-test" }),
    });
    const data = await res.json();
    if (data.promptRun) {
      navigator.clipboard.writeText(data.promptRun.prompt_text);
      alert("Re-test prompt copied to clipboard!");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/projects/${projectId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {projectName}
        </Link>
        <h1 className="text-xl font-bold">{item.title}</h1>
        <div className="flex gap-2 mt-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig?.color}`}>
            {statusConfig?.label}
          </span>
          <Badge variant="outline">{item.severity}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Expected result</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-slate-600">{item.expected_result}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Actual result</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">{item.actual_result || "Not recorded yet."}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Update status</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Add a remark, e.g. 'CTA button too small on mobile'"
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
            rows={3}
          />
          <div className="flex flex-wrap gap-2">
            {(["passed", "failed", "fixed", "verified", "reopened", "needs_review"] as const).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={item.status === status ? "default" : "outline"}
                onClick={() => updateStatus(status)}
                disabled={loading}
              >
                {UAT_STATUSES.find((s) => s.value === status)?.label}
              </Button>
            ))}
          </div>
          <Button variant="outline" onClick={retest} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Re-test (copy prompt)
          </Button>
        </CardContent>
      </Card>

      {item.evidence_url && (
        <Card>
          <CardHeader><CardTitle className="text-base">Evidence</CardTitle></CardHeader>
          <CardContent>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.evidence_url} alt="Evidence" className="rounded-lg border max-w-full" />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Remark history</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {remarks.length === 0 ? (
            <p className="text-sm text-slate-500">No remarks yet.</p>
          ) : (
            remarks.map((r) => (
              <div key={r.id} className="border-b pb-3 last:border-0">
                <p className="text-sm">{r.remark}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {r.updated_by} · {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                  {r.status_before && r.status_after && ` · ${r.status_before} → ${r.status_after}`}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
