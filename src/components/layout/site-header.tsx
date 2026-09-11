"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Plus,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  GraduationCap,
  Lightbulb,
  Building2,
  Plug,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  variant?: "marketing" | "app";
  showAuth?: boolean;
}

export function SiteHeader({ variant = "marketing", showAuth = true }: SiteHeaderProps) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<{ email: string; isAdmin: boolean } | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/demo")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setMe(d.user ?? null))
      .catch(() => setMe(null));
  }, [pathname]);

  const loggedIn = Boolean(me);
  const isAdmin = Boolean(me?.isAdmin);

  const publicLinks = [
    { href: "/courses", label: dict.nav.academy, icon: GraduationCap },
    { href: "/inspiration", label: dict.nav.inspiration, icon: Lightbulb },
    { href: "/enterprise", label: dict.nav.enterprise, icon: Building2 },
    { href: "/mcp", label: dict.nav.mcp, icon: Plug },
    { href: "/dashboard", label: dict.nav.hub, icon: LayoutDashboard },
  ];

  const appLinks = [
    { href: "/dashboard", label: dict.nav.hub, icon: LayoutDashboard },
    { href: "/courses", label: dict.nav.academy, icon: GraduationCap },
    { href: "/inspiration", label: dict.nav.inspiration, icon: Lightbulb },
    { href: "/enterprise", label: dict.nav.enterprise, icon: Building2 },
    { href: "/projects/new", label: dict.nav.newProject, icon: Plus },
    ...(isAdmin ? [{ href: "/admin", label: dict.nav.admin, icon: Shield }] : []),
    { href: "/settings", label: dict.nav.settings, icon: Settings },
  ];

  const links = variant === "app" ? appLinks : publicLinks;

  async function handleLogout() {
    await fetch("/api/auth/demo", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6 min-w-0">
          <Link href={variant === "app" ? "/dashboard" : "/"} className="flex items-center gap-2.5 font-semibold text-slate-900 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline tracking-tight">Tenth Project</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-0.5">
            {links.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          {variant === "app" ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:flex text-slate-600">
              <LogOut className="h-4 w-4 mr-1" />
              {dict.nav.logout}
            </Button>
          ) : showAuth ? (
            loggedIn ? (
              <>
                <Link href="/courses/ai-vibecoding" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="font-semibold">{dict.nav.continueLearning}</Button>
                </Link>
                <Link href="/courses">
                  <Button size="sm" className="font-semibold">{dict.nav.classroom}</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login?redirect=/courses" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="font-semibold">{dict.nav.login}</Button>
                </Link>
                <Link href="/courses">
                  <Button size="sm" className="font-semibold">{dict.nav.signup}</Button>
                </Link>
              </>
            )
          ) : null}

          <Sheet>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-slate-100">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-10">
                {links.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                {variant === "app" && (
                  <Button variant="ghost" onClick={handleLogout} className="justify-start mt-4 text-slate-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    {dict.nav.logout}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
