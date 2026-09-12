import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BrowserMockup({
  children,
  url = "app.tenthproject.com",
  className,
}: {
  children: ReactNode;
  url?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-2xl dark:border-slate-800",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-slate-700/50 bg-slate-800/80 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <div className="mx-auto rounded-md border border-slate-700/40 bg-slate-900/60 px-3 py-1 font-mono text-xs text-slate-400">
          {url}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
