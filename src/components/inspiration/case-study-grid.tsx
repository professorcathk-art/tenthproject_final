"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CaseStudy } from "@/types/platform";

export function CaseStudyGrid({ studies }: { studies: CaseStudy[] }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? studies : studies.filter((s) => s.category === filter);

  return (
    <div className="space-y-6">
      <Tabs value={filter} onValueChange={(v) => v && setFilter(v)}>
        <TabsList>
          <TabsTrigger value="all">All ({studies.length})</TabsTrigger>
          <TabsTrigger value="vibe_coding">Vibe Coding ({studies.filter((s) => s.category === "vibe_coding").length})</TabsTrigger>
          <TabsTrigger value="ai_agent">AI Agents ({studies.filter((s) => s.category === "ai_agent").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((study) => (
          <Link key={study.id} href={`/inspiration/${study.slug}`}>
            <Card className="h-full hover:shadow-md hover:border-slate-300 transition-all">
              <CardHeader className="pb-2">
                <Badge variant={study.category === "ai_agent" ? "default" : "secondary"} className="w-fit mb-2">
                  {study.category === "ai_agent" ? "AI Agent" : "Vibe Coding"}
                </Badge>
                <CardTitle className="text-base leading-snug">{study.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 line-clamp-2">{study.summary}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {study.tech_stack.slice(0, 3).map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
