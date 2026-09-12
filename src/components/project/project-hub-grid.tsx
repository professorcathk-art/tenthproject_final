"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { enUS, zhTW } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/provider";
import type { Project } from "@/types";

export function ProjectHubGrid({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const { dict, locale } = useI18n();
  const dateLocale = locale === "zh" ? zhTW : enUS;

  async function remove(project: Project) {
    if (!window.confirm(dict.project.deleteProjectConfirm)) return;
    const res = await fetch(`/api/projects?id=${project.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || dict.project.deleteProject);
      return;
    }
    toast.success(dict.project.deleteProjectDone);
    router.refresh();
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="relative h-full transition-all hover:border-slate-300 hover:shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <Link href={`/projects/${project.id}`} className="min-w-0 flex-1">
                <CardTitle className="text-base">{project.name}</CardTitle>
              </Link>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={dict.dashboard.deleteProject}
                  onClick={() => void remove(project)}
                >
                  <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" />
                </Button>
                <Link href={`/projects/${project.id}`} aria-label={project.name}>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              </div>
            </div>
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/projects/${project.id}`} className="block">
              <div className="mb-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs">{project.product_type.replace("_", " ")}</Badge>
                <Badge variant="outline" className="text-xs">{project.stage.replace("_", " ")}</Badge>
              </div>
              <p className="text-xs text-slate-400">
                {dict.dashboard.updated} {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true, locale: dateLocale })}
              </p>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
