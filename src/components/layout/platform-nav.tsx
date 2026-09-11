import Link from "next/link";
import { Sparkles, GraduationCap, Lightbulb, Building2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlatformHeader({ showAuth = true }: { showAuth?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline">Tenth Project</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/courses" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <GraduationCap className="h-4 w-4" /> Academy
          </Link>
          <Link href="/inspiration" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <Lightbulb className="h-4 w-4" /> Inspiration
          </Link>
          <Link href="/enterprise" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <Building2 className="h-4 w-4" /> Enterprise
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <LayoutDashboard className="h-4 w-4" /> Project Hub
          </Link>
        </nav>

        {showAuth && (
          <div className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link href="/signup"><Button size="sm">Get started</Button></Link>
          </div>
        )}
      </div>
    </header>
  );
}
