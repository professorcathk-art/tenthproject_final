"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, GraduationCap, Lightbulb, Menu, Sparkles, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";

export function MarketingHeader({ loggedIn = false }: { loggedIn?: boolean }) {
  const { dict } = useI18n();
  const pathname = usePathname();

  const links = [
    { href: "/#about", label: dict.nav.about, icon: Users },
    { href: "/#membership", label: dict.nav.academyMembers, icon: GraduationCap },
    { href: "/inspiration", label: dict.nav.inspiration, icon: Lightbulb },
    { href: "/enterprise", label: dict.nav.enterprise, icon: Building2 },
  ];

  function active(href: string) {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/65 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/55">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 font-semibold text-slate-900 dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="hidden tracking-tight sm:inline">Tenth Project</span>
          </Link>
          <nav className="hidden items-center gap-0.5 lg:flex">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active(item.href)
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
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
          <ThemeToggle />
          <LanguageToggle />
          {loggedIn ? (
            <Link href="/dashboard" className={cn(buttonVariants({ size: "sm" }), "rounded-full font-semibold")}>
              {dict.nav.enterPortal}
            </Link>
          ) : (
            <>
              <Link
                href="/login?redirect=/dashboard"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden font-semibold sm:inline-flex")}
              >
                {dict.nav.login}
              </Link>
              <Link
                href="/enterprise#booking"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden rounded-full font-semibold md:inline-flex")}
              >
                {dict.nav.bookConsult}
              </Link>
              <Link
                href="/signup?redirect=/dashboard"
                className={cn(buttonVariants({ size: "sm" }), "rounded-full font-semibold hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]")}
              >
                {dict.nav.signup}
              </Link>
            </>
          )}

          <Sheet>
            <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-10 flex flex-col gap-1">
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
                {loggedIn ? (
                  <Link href="/dashboard" className="mt-3 px-3 py-2 text-sm font-semibold">
                    {dict.nav.enterPortal}
                  </Link>
                ) : (
                  <>
                    <Link href="/login?redirect=/dashboard" className="mt-3 px-3 py-2 text-sm font-semibold">
                      {dict.nav.login}
                    </Link>
                    <Link href="/enterprise#booking" className="px-3 py-2 text-sm font-semibold">
                      {dict.nav.bookConsult}
                    </Link>
                    <Link href="/signup?redirect=/dashboard" className="px-3 py-2 text-sm font-semibold">
                      {dict.nav.signup}
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
