import type { Metadata } from "next";
import { Noto_Sans_TC, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/components/i18n/provider";
import { ThemeProvider } from "@/components/theme/provider";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { getLocale, getDict } from "@/lib/i18n/server";
import "./globals.css";

const notoSans = Noto_Sans_TC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return {
    title: dict.meta.title,
    description: dict.meta.description,
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
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <I18nProvider initialLocale={locale}>{children}</I18nProvider>
          <WhatsAppFloat />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
