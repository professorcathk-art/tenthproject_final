"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, GraduationCap, Lightbulb, Menu, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useI18n } from "@/components/i18n/provider";
import { cn } from "@/lib/utils";

export function MarketingHeader({ loggedIn = false }: { loggedIn?: boolean }) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [heroScroll, setHeroScroll] = useState(true);
  const overHero = isHome && heroScroll;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setHeroScroll(window.scrollY < 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const links = [
    { href: "/#about", label: dict.nav.about, icon: Users },
    { href: "/courses", label: dict.nav.academyMembers, icon: GraduationCap },
    { href: "/inspiration", label: dict.nav.inspiration, icon: Lightbulb },
    { href: "/enterprise", label: dict.nav.enterprise, icon: Building2 },
  ];

  function active(href: string) {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className={cn(
        "z-50 transition-colors duration-300",
        isHome ? "fixed inset-x-0 top-0" : "sticky top-0",
        overHero
          ? "border-b border-white/10 bg-slate-950/80 text-white backdrop-blur-md"
          : "border-b border-slate-200/60 bg-white/65 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/55",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/"
            className={cn(
              "shrink-0 font-semibold tracking-tight",
              overHero ? "text-white" : "text-slate-900 dark:text-white",
            )}
          >
            Tenth Project
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
                    overHero
                      ? active(item.href)
                        ? "bg-white/15 text-white"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                      : active(item.href)
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
          <ThemeToggle
            className={overHero ? "border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white" : undefined}
          />
          <LanguageToggle tone={overHero ? "inverse" : "default"} />
          {loggedIn ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden rounded-full font-semibold min-[400px]:inline-flex",
                overHero && "bg-white text-slate-950 hover:bg-white/90",
              )}
            >
              {dict.nav.enterPortal}
            </Link>
          ) : (
            <>
              <Link
                href="/login?redirect=/dashboard"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "hidden font-semibold sm:inline-flex",
                  overHero && "text-white hover:bg-white/10 hover:text-white",
                )}
              >
                {dict.nav.login}
              </Link>
              <Link
                href="/enterprise#booking"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden rounded-full font-semibold md:inline-flex",
                  overHero && "border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white",
                )}
              >
                {dict.nav.bookConsult}
              </Link>
              <Link
                href="/signup?redirect=/dashboard"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full font-semibold",
                  overHero ? "bg-white text-slate-950 hover:bg-white/90" : "hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
                )}
              >
                {dict.nav.signup}
              </Link>
            </>
          )}

          <Sheet>
            <SheetTrigger
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md lg:hidden",
                overHero ? "text-white hover:bg-white/10" : "hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
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
