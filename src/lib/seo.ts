import type { Metadata } from "next";

export function canonicalizeSiteUrl(raw: string) {
  const trimmed = raw.replace(/\/$/, "");
  try {
    const parsed = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    if (parsed.hostname === "tenthproject.com") {
      parsed.hostname = "www.tenthproject.com";
    }
    return parsed.origin;
  } catch {
    return trimmed;
  }
}

export const SITE_URL = canonicalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://www.tenthproject.com"),
);

export const SITE_NAME = "Tenth Project";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title}｜${SITE_NAME}`;
  return {
    title: { absolute: fullTitle },
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "zh_HK",
      alternateLocale: ["en_US"],
      title: fullTitle,
      description,
      url,
      images: [{ url: "/logo.jpg", width: 1024, height: 1024, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/logo.jpg"],
    },
  };
}
