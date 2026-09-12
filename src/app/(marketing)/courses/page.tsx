import type { Metadata } from "next";
import { AcademyBrochure } from "@/components/marketing/academy-brochure";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Vibe Coding 課程與 Lifetime 社群福利",
  description:
    "項目導向學習 × AI。21 天內從零打造可盈利海外工具站，含 Stripe、教室章節與 Lifetime 會員社群。",
  path: "/courses",
  keywords: ["Vibe Coding", "AI 課程", "Lifetime 會員", "香港 AI 培訓"],
});

export default function CoursesPage() {
  return <AcademyBrochure />;
}
