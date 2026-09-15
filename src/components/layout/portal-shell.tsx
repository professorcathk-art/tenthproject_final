"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  FolderKanban,
  KeyRound,
  LifeBuoy,
  Lightbulb,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useI18n } from "@/components/i18n/provider";
import { JoinLifetimeButton } from "@/components/membership/join-lifetime-button";
import { FREE_PROJECT_LIMIT } from "@/lib/membership/constants";
import { cn } from "@/lib/utils";

type PortalUser = { email: string; name?: string; isAdmin: boolean };

function PortalNavLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: { href: string; label: string; icon: typeof FolderKanban }[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              current
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
            )}
          >
            <Icon className={cn("h-4 w-4", item.href === "/vault" && "portal-bulb")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function PortalShell({
  user,
  children,
  paid,
  projectCount,
}: {
  user: PortalUser;
  children: React.ReactNode;
  paid: boolean;
  projectCount: number;
}) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const [navPath, setNavPath] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const navOpen = navPath === pathname;

  const nav = useMemo(
    () => [
      { href: "/dashboard", label: dict.portal.hub, icon: FolderKanban },
      { href: "/learning", label: dict.portal.learning, icon: BookOpen },
      { href: "/mcp", label: dict.portal.mcp, icon: KeyRound },
      { href: "/vault", label: dict.portal.vault, icon: Lightbulb },
      { href: "/settings", label: dict.portal.settings, icon: Settings },
      ...(user.isAdmin ? [{ href: "/admin", label: dict.nav.admin, icon: Shield }] : []),
    ],
    [dict.nav.admin, dict.portal.hub, dict.portal.learning, dict.portal.mcp, dict.portal.settings, dict.portal.vault, user.isAdmin],
  );

  const commands = useMemo(
    () => [
      ...nav,
      { href: "/projects/new", label: dict.portal.newProject, icon: Plus },
    ],
    [dict.portal.newProject, nav],
  );

  const filtered = commands.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (event.key === "Escape") setCommandOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function logout() {
    await fetch("/api/auth/demo", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  const initials = (user.name || user.email || "M")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white px-4 py-5 lg:flex dark:border-slate-800 dark:bg-slate-950">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2 font-semibold">
          <Image src="/logo.jpg" alt="Tenth Project" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
          <span className="tracking-tight">{dict.portal.brand}</span>
        </Link>
        <PortalNavLinks items={nav} pathname={pathname} />
        <div className="mt-auto space-y-3">
          {paid ? null : (
            <JoinLifetimeButton className="h-10 w-full shadow-[0_0_18px_rgba(251,191,36,0.45)]">
              ⚡ 升級 VIP 終身會員
            </JoinLifetimeButton>
          )}
          <div className="rounded-2xl border border-slate-200/80 px-3 py-3 text-xs text-slate-500 dark:border-slate-800">
            <p className="font-semibold text-slate-900 dark:text-white">
              {paid ? dict.portal.lifetime : `專案額度: ${projectCount}/${FREE_PROJECT_LIMIT} (免費版)`}
            </p>
            <p className="mt-1 truncate">{user.email}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 lg:bg-white/80 lg:backdrop-blur-md lg:dark:bg-slate-950/70">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Sheet open={navOpen} onOpenChange={(open) => setNavPath(open ? pathname : null)}>
              <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="mt-10">
                  <PortalNavLinks items={nav} pathname={pathname} onNavigate={() => setNavPath(null)} />
                </div>
              </SheetContent>
            </Sheet>
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-left text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 truncate">{dict.portal.search}</span>
              <kbd className="hidden rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium sm:inline dark:border-slate-700">
                ⌘K
              </kbd>
            </button>
          </div>
          <div className="flex items-center gap-2">
            {paid ? null : (
              <JoinLifetimeButton className="hidden h-9 px-4 text-xs shadow-[0_0_18px_rgba(251,191,36,0.45)] sm:inline-flex">
                ⚡ 升級 VIP 終身會員
              </JoinLifetimeButton>
            )}
            <Link href="/projects/new" className="hidden sm:block">
              <Button size="sm" className="rounded-full font-semibold">
                <Plus className="mr-1 h-4 w-4" />
                {dict.portal.newProject}
              </Button>
            </Link>
            <ThemeToggle />
            <LanguageToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
                {initials}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="h-4 w-4" />
                  {dict.portal.settings}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/mcp")}>
                  <LifeBuoy className="h-4 w-4" />
                  {dict.portal.help}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  {dict.portal.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>

      {commandOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 p-4 pt-[15vh]" onClick={() => setCommandOpen(false)}>
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-100 p-3 dark:border-slate-800">
              <Input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={dict.portal.search}
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.map((item) => {
                const Icon = item.icon;
                const external = "external" in item && item.external;
                const className = "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800";
                return external ? (
                  <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className={className} onClick={() => setCommandOpen(false)}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} className={className} onClick={() => setCommandOpen(false)}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
