import type { Locale } from "@/i18n/dictionaries";
import { CASE_LOCALE_SPLIT, CASE_SEED_MARKER } from "@/lib/inspiration/constants";

export function localizedCaseText(raw: string, locale: Locale): string {
  const parts = raw.split(CASE_LOCALE_SPLIT);
  const zh = (parts[0] ?? raw).replace(CASE_SEED_MARKER, "").trim();
  const en = (parts[1] ?? zh).trim();
  return locale === "en" ? en : zh;
}
