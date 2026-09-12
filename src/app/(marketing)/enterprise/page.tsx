import type { Metadata } from "next";
import { EnterpriseLanding } from "@/components/enterprise/enterprise-landing";

export const metadata: Metadata = {
  title: "企業 AI 轉型與工作流自動化｜Tenth Project",
  description:
    "結合前阿里巴巴技術專家硬核架構，與前國際投資銀行高管數位轉型經驗。從商業痛點審計到 100% 可上線的客製化 AI Agent 與自動化工作流部署。",
};

export default function EnterprisePage() {
  return <EnterpriseLanding />;
}
