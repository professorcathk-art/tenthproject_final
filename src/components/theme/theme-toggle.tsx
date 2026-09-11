"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-600 backdrop-blur-md transition-colors hover:text-slate-900 dark:border-slate-800/60 dark:bg-slate-950/50 dark:text-slate-300",
        className
      )}
      aria-label="Toggle color theme"
    >
      <Sun className="hidden h-3.5 w-3.5 dark:block" />
      <Moon className="h-3.5 w-3.5 dark:hidden" />
    </button>
  );
}
