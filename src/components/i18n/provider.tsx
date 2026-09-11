"use client";

import { createContext, useCallback, useContext, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { dictionaries, getDictionary, type Dictionary, type Locale } from "@/i18n/dictionaries";

const I18nContext = createContext<{
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [, startTransition] = useTransition();

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      document.cookie = `tp_locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = next === "zh" ? "zh-Hant" : "en";
      startTransition(() => router.refresh());
    },
    [router]
  );

  const value = useMemo(
    () => ({ locale, dict: getDictionary(locale), setLocale }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: "zh" as Locale,
      dict: dictionaries.zh,
      setLocale: () => {},
    };
  }
  return ctx;
}
