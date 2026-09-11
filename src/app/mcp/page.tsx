import Link from "next/link";
import { MarketingShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Key, FileJson, RefreshCw, Plug } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export default async function McpGuidePage() {
  const dict = await getDict();

  const steps = [
    { icon: Key, title: "1", body: dict.mcp.step1 },
    { icon: FileJson, title: "2", body: dict.mcp.step2 },
    { icon: RefreshCw, title: "3", body: dict.mcp.step3 },
  ];

  const tools = [
    { name: "get_active_roadmap", desc: dict.mcp.toolRoadmap },
    { name: "fetch_uat_status", desc: dict.mcp.toolUat },
    { name: "update_uat_item", desc: dict.mcp.toolUpdate },
    { name: "log_bug", desc: dict.mcp.toolBug },
  ];

  return (
    <MarketingShell>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 mb-6">
          <Plug className="h-4 w-4" /> MCP
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{dict.mcpPage.title}</h1>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl">{dict.mcpPage.subtitle}</p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="font-semibold text-slate-900">{dict.mcpPage.whyTitle}</h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{dict.mcpPage.whyBody}</p>
        </div>

        <ol className="mt-10 space-y-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm text-slate-700 leading-relaxed pt-2">{s.body}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {tools.map((t) => (
            <Card key={t.name} className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono">{t.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{t.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-slate-900 p-8 text-center">
          <p className="text-white font-medium">{dict.mcpPage.needProject}</p>
          <Link href="/dashboard" className="inline-block mt-4">
            <Button variant="secondary">
              {dict.mcpPage.cta} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
