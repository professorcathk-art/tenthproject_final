import Link from "next/link";
import {
  BookOpen,
  FolderKanban,
  Hammer,
  KeyRound,
  Lightbulb,
  Megaphone,
  Settings,
  Shield,
} from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getDict } from "@/lib/i18n/server";

export default async function MemberMenuPage() {
  const [{ user }, dict] = await Promise.all([getSession(), getDict()]);
  const p = dict.portal;
  const items = [
    { href: "/dashboard", label: p.hub, icon: FolderKanban },
    { href: "/learning", label: p.learning, icon: BookOpen },
    { href: "/dashboard/production-guide", label: p.productionGuide, icon: Hammer },
    { href: "/dashboard/marketing-guide", label: p.marketingGuide, icon: Megaphone },
    { href: "/mcp", label: p.mcp, icon: KeyRound },
    { href: "/vault", label: p.vault, icon: Lightbulb },
    { href: "/settings", label: p.settings, icon: Settings },
    ...(user?.isAdmin ? [{ href: "/admin", label: dict.nav.admin, icon: Shield }] : []),
  ];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">{p.menuTitle}</h1>
      <p className="mt-2 text-sm text-slate-500 sm:text-base">{p.menuHint}</p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base font-semibold text-slate-950 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 leading-snug">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
