"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n/provider";
import { LanguageToggle } from "@/components/i18n/language-toggle";

export function SiteFooter() {
  const { dict } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              Tenth Project
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{dict.footer.tagline}</p>
            <LanguageToggle />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">{dict.footer.product}</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/courses" className="hover:text-slate-900">{dict.nav.academy}</Link></li>
              <li><Link href="/inspiration" className="hover:text-slate-900">{dict.nav.inspiration}</Link></li>
              <li><Link href="/enterprise" className="hover:text-slate-900">{dict.nav.enterprise}</Link></li>
              <li><Link href="/dashboard" className="hover:text-slate-900">{dict.nav.hub}</Link></li>
              <li><Link href="/mcp" className="hover:text-slate-900">{dict.nav.mcp}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">{dict.footer.company}</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-slate-900">{dict.nav.about}</Link></li>
              <li><Link href="/login" className="hover:text-slate-900">{dict.nav.login}</Link></li>
              <li><Link href="/signup" className="hover:text-slate-900">{dict.nav.signup}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">{dict.footer.legal}</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/privacy" className="hover:text-slate-900">{dict.nav.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900">{dict.nav.terms}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-400">
          <span>© {year} {dict.footer.copyright}</span>
          <a href="mailto:professor.cat.hk@gmail.com" className="hover:text-slate-600">professor.cat.hk@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}
