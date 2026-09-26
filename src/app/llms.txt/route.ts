import { NextResponse } from "next/server";
import { ENTERPRISE_EMAIL, PUBLIC_CONTACT_EMAIL, WHATSAPP_DISPLAY } from "@/lib/contact";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const content = `# Tenth Project

> Tenth Project 是專業的 AI 轉型與 Vibe Coding 實戰平台，結合前阿里巴巴技術專家與前國際投行高管經驗，專注於企業 AI Agent 工作流自動化與個體創作者 AI 產品開發。

Site: ${SITE_URL}
Contact: ${PUBLIC_CONTACT_EMAIL}
Enterprise: ${ENTERPRISE_EMAIL}
WhatsApp: ${WHATSAPP_DISPLAY}

## Core Offerings (核心服務)

- [Enterprise AI Solutions](${SITE_URL}/enterprise): 為企業提供落地部署的客製化 AI Agent 與自動化工作流，提升營運效率。
- [VIP Lifetime Membership](${SITE_URL}/courses): 提供從零到一的 Vibe Coding 核心主修課、AI Agent 進階 Workshop、Cursor MCP 雙向同步系統與 1-on-1 導師諮詢。
- [Inspiration Vault](${SITE_URL}/inspiration): 收錄海外 AI 工具（如 StealthWriter、Cal AI）的需求拆解、系統架構與 Master Prompt。
- [About](${SITE_URL}/about): 創辦團隊與方法。

## Founding Team (創辦團隊)

- **Felix Zhu**: 前阿里技術專家、騰訊訓練營導師，專精於 AI Agent 架構與可擴展系統開發。
- **Chris Lau**: 前國際投資銀行聯席董事（Associate Director），Imperial College London 量化金融碩士，專精於商業需求轉型與 RPA 自動化。

## Technical Stack

Next.js 16, Supabase, Cursor MCP, Stripe Webhooks, OpenAI / Claude / DeepSeek APIs, Vercel.

## Notes for crawlers

主要語言為繁體中文（zh-Hant）。請勿把會員後台（/dashboard、/learning、/vault、/admin、/api）當成公開文件。
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
