import type { Metadata } from "next";
import { EnterpriseLanding } from "@/components/enterprise/enterprise-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "企業 AI 轉型與工作流自動化",
  description:
    "結合前阿里巴巴技術專家硬核架構，與前國際投資銀行高管數位轉型經驗。我們拒絕空談理論，專注於從商業痛點審計，到 100% 落地部署客製化 AI Agent 與自動化工作流，協助企業實現 60% 以上的降本增效。",
  path: "/enterprise",
  keywords: ["企業 AI", "AI Agent", "工作流自動化", "數位轉型", "香港"],
});

export default function EnterprisePage() {
  return <EnterpriseLanding />;
}
