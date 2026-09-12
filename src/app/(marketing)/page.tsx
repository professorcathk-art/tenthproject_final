import type { Metadata } from "next";
import { LandingView } from "@/components/marketing/landing-view";
import { pageMetadata } from "@/lib/seo";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDict();
  return pageMetadata({ title: dict.meta.title, description: dict.meta.description, path: "/" });
}

export default function LandingPage() {
  return <LandingView />;
}
