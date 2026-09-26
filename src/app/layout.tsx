import type { Metadata } from "next";
import { Noto_Sans_TC, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/components/i18n/provider";
import { JoinLifetimeProvider } from "@/components/membership/join-lifetime-provider";
import { ThemeProvider } from "@/components/theme/provider";
import { JsonLd } from "@/components/seo/json-ld";
import { getLocale, getDict } from "@/lib/i18n/server";
import { OG_IMAGE, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const notoSans = Noto_Sans_TC({
  variable: "--font-noto",
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  const chinese = dict.meta.title.includes("重新定義");
  const socialTitle = chinese
    ? "Tenth Project｜企業 AI 轉型與 Vibe Coding 實戰平台"
    : "Tenth Project | Enterprise AI transformation and hands-on Vibe Coding";
  const socialDescription = chinese
    ? "從企業流程自動化到個人 AI SaaS 產品開發，提供可落地的技術方案與 VIP 導師社群。"
    : dict.meta.description;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: `%s｜${SITE_NAME}`,
    },
    description: dict.meta.description,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [
      { name: "Felix Zhu", url: SITE_URL },
      { name: "Chris Lau", url: SITE_URL },
    ],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/tp-logo.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      locale: "zh_HK",
      alternateLocale: ["en_US"],
      siteName: SITE_NAME,
      title: socialTitle,
      description: socialDescription,
      url: SITE_URL,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: chinese
        ? "結合大廠架構與投行視野，提供企業 AI Agent 部署與 Vibe Coding 實戰課程。"
        : dict.meta.description,
      images: [OG_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale === "zh" ? "zh-Hant" : "en"}
      className={`${notoSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${notoSans.className} min-h-full flex flex-col font-sans`}>
        <JsonLd />
        <ThemeProvider>
          <I18nProvider initialLocale={locale}>
            <JoinLifetimeProvider>{children}</JoinLifetimeProvider>
          </I18nProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
