"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n/provider";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { PUBLIC_CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";

export function SiteFooter() {
  const { dict } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/40">
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
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">{dict.footer.product}</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/courses" className="hover:text-slate-900">{dict.nav.academyMembers}</Link></li>
              <li><Link href="/inspiration" className="hover:text-slate-900">{dict.nav.inspiration}</Link></li>
              <li><Link href="/enterprise" className="hover:text-slate-900">{dict.nav.enterprise}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">{dict.footer.company}</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-slate-900">{dict.nav.about}</Link></li>
              <li><Link href="/login?redirect=/dashboard" className="hover:text-slate-900">{dict.nav.login}</Link></li>
              <li><Link href="/signup?redirect=/dashboard" className="hover:text-slate-900">{dict.nav.signup}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">{dict.footer.contact}</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href={`mailto:${PUBLIC_CONTACT_EMAIL}`} className="hover:text-slate-900">
                  {PUBLIC_CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">
                  WhatsApp {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li><Link href="/privacy" className="hover:text-slate-900">{dict.nav.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900">{dict.nav.terms}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-400">
          <span>© {year} {dict.footer.copyright}</span>
          <span>Hong Kong</span>
        </div>
      </div>
    </footer>
  );
}
