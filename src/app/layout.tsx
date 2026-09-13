import type { Metadata } from "next";
import { Noto_Sans_TC, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/components/i18n/provider";
import { JoinLifetimeProvider } from "@/components/membership/join-lifetime-provider";
import { ThemeProvider } from "@/components/theme/provider";
import { getLocale, getDict } from "@/lib/i18n/server";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const notoSans = Noto_Sans_TC({
  variable: "--font-noto",
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: `%s｜${SITE_NAME}`,
    },
    description: dict.meta.description,
    keywords: [
      "Tenth Project",
      "企業 AI",
      "Vibe Coding",
      "AI Agent",
      "工作流自動化",
      "香港 AI 培訓",
      "數位轉型",
    ],
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      locale: "zh_HK",
      alternateLocale: ["en_US"],
      siteName: SITE_NAME,
      title: dict.meta.title,
      description: dict.meta.description,
      url: SITE_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
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
