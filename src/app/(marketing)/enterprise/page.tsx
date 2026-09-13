import type { Metadata } from "next";
import { EnterpriseLanding } from "@/components/enterprise/enterprise-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "企業 AI 轉型與工作流自動化",
  description:
    "結合前阿里巴巴技術專家的大型系統架構經驗，與前國際投行高管的數位轉型視野。我們專注於深入評估業務流程，為企業量身打造並 100% 落地部署 AI Agent 與自動化工作流，實質提升營運效益。",
  path: "/enterprise",
  keywords: ["企業 AI", "AI Agent", "工作流自動化", "數位轉型", "香港"],
});

export default function EnterprisePage() {
  return <EnterpriseLanding />;
}
