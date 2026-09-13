import type { Metadata } from "next";
import { AcademyBrochure } from "@/components/marketing/academy-brochure";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Tenth Project VIP 會員：Vibe Coding 與 AI Agent 從零到高手全攻略",
  description: "一次加入，永久享用所有核心主修課、高階實戰 Workshop、AI 專案規劃工具與導師社群支援。",
  path: "/courses",
  keywords: ["Vibe Coding", "AI Agent", "Lifetime 會員", "StealthWriter"],
});

export default function CoursesPage() {
  return <AcademyBrochure />;
}
