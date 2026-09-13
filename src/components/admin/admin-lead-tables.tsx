"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BUDGET_RANGES, COMPANY_SIZES, SERVICE_TYPES, type EnterpriseEnquiry, type WebinarSignup } from "@/types/platform";

type AdminCopy = {
  pending: string;
  contacted: string;
  closed: string;
  delete: string;
  exportCsv: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  service: string;
  companySize: string;
  budget: string;
  projectDesc: string;
  status: string;
  createdAt: string;
  name: string;
  whatsapp: string;
  leadsHint: string;
  webinarsHint: string;
};

function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map((cell) => escape(cell ?? "")).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function labelFor(list: { value: string; zh: string; en: string }[], value: string | null, locale: string) {
  const item = list.find((entry) => entry.value === value);
  if (!item) return value || "—";
  return locale === "en" ? item.en : item.zh;
}

function StatusSelect({
  value,
  labels,
  onChange,
}: {
  value: string;
  labels: AdminCopy;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger className="h-8 w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">{labels.pending}</SelectItem>
        <SelectItem value="contacted">{labels.contacted}</SelectItem>
        <SelectItem value="closed">{labels.closed}</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function EnterpriseLeadsTable({
  rows,
  locale,
  labels,
  onStatus,
  onDelete,
}: {
  rows: EnterpriseEnquiry[];
  locale: string;
  labels: AdminCopy;
  onStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">{labels.leadsHint}</p>
        {rows.length > 0 ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadCsv(
                "enterprise-leads.csv",
                [labels.createdAt, labels.company, labels.contact, labels.email, labels.phone, labels.service, labels.companySize, labels.budget, labels.projectDesc, labels.status],
                rows.map((row) => [
                  new Date(row.created_at).toLocaleString(),
                  row.company_name,
                  row.contact_name,
                  row.email,
                  row.phone ?? "",
                  labelFor(SERVICE_TYPES, row.service_type, locale),
                  labelFor(COMPANY_SIZES, row.company_size, locale),
                  labelFor(BUDGET_RANGES, row.budget_range, locale),
                  row.project_description,
                  row.status,
                ]),
              )
            }
          >
            {labels.exportCsv}
          </Button>
        ) : null}
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">{labels.leadsHint}</p>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-900">
                <TableHead>{labels.createdAt}</TableHead>
                <TableHead>{labels.company}</TableHead>
                <TableHead>{labels.contact}</TableHead>
                <TableHead>{labels.email}</TableHead>
                <TableHead>{labels.phone}</TableHead>
                <TableHead>{labels.service}</TableHead>
                <TableHead>{labels.companySize}</TableHead>
                <TableHead>{labels.budget}</TableHead>
                <TableHead className="min-w-64">{labels.projectDesc}</TableHead>
                <TableHead>{labels.status}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-xs text-slate-500">{new Date(row.created_at).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{row.company_name}</TableCell>
                  <TableCell>{row.contact_name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone || "—"}</TableCell>
                  <TableCell>{labelFor(SERVICE_TYPES, row.service_type, locale)}</TableCell>
                  <TableCell>{labelFor(COMPANY_SIZES, row.company_size, locale)}</TableCell>
                  <TableCell>{labelFor(BUDGET_RANGES, row.budget_range, locale)}</TableCell>
                  <TableCell className="max-w-xs whitespace-normal text-slate-600">{row.project_description}</TableCell>
                  <TableCell>
                    <StatusSelect value={row.status} labels={labels} onChange={(status) => onStatus(row.id, status)} />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(row.id)}>
                      {labels.delete}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export function WebinarLeadsTable({
  rows,
  labels,
  onStatus,
  onDelete,
}: {
  rows: WebinarSignup[];
  labels: AdminCopy;
  onStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">{labels.webinarsHint}</p>
        {rows.length > 0 ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadCsv(
                "webinar-signups.csv",
                [labels.createdAt, labels.name, labels.email, labels.whatsapp, labels.status],
                rows.map((row) => [new Date(row.created_at).toLocaleString(), row.name, row.email, row.whatsapp, row.status]),
              )
            }
          >
            {labels.exportCsv}
          </Button>
        ) : null}
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">{labels.webinarsHint}</p>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-900">
                <TableHead>{labels.createdAt}</TableHead>
                <TableHead>{labels.name}</TableHead>
                <TableHead>{labels.email}</TableHead>
                <TableHead>{labels.whatsapp}</TableHead>
                <TableHead>{labels.status}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-xs text-slate-500">{new Date(row.created_at).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.whatsapp}</TableCell>
                  <TableCell>
                    <StatusSelect value={row.status} labels={labels} onChange={(status) => onStatus(row.id, status)} />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(row.id)}>
                      {labels.delete}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
