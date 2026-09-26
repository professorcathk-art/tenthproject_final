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

export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Tenth Project｜企業 AI 轉型與 Vibe Coding 實戰平台",
} as const;

export const SITE_KEYWORDS = [
  "Tenth Project",
  "AI Agent",
  "Vibe Coding",
  "Cursor MCP",
  "企業 AI 轉型",
  "工作流自動化",
  "Supabase",
  "Next.js 16",
  "Stripe 變現",
  "AI SaaS 開發",
  "香港 AI 培訓",
  "數位轉型",
];

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
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
