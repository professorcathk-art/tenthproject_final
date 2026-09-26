import { ENTERPRISE_EMAIL, PUBLIC_CONTACT_EMAIL, SKOOL_URL, WHATSAPP_DISPLAY } from "@/lib/contact";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export function JsonLd() {
  const organizationId = `${SITE_URL}/#organization`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.jpg`,
        image: `${SITE_URL}/og-image.jpg`,
        email: PUBLIC_CONTACT_EMAIL,
        telephone: WHATSAPP_DISPLAY,
        areaServed: ["HK", "TW", "MO"],
        sameAs: [SKOOL_URL],
        description: "企業 AI 轉型、AI Agent 客製化部署與 Vibe Coding 實戰培訓平台。",
        founder: [
          { "@id": `${SITE_URL}/#felix-zhu` },
          { "@id": `${SITE_URL}/#chris-lau` },
        ],
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#felix-zhu`,
        name: "Felix Zhu",
        jobTitle: "技術負責人",
        description: "前阿里技術專家、騰訊訓練營導師，專精於 AI Agent 架構與可擴展系統開發。",
        worksFor: { "@id": organizationId },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#chris-lau`,
        name: "Chris Lau",
        jobTitle: "商業需求與轉型負責人",
        description: "前國際投資銀行聯席董事（Associate Director），Imperial College London 量化金融碩士，專精於商業需求轉型與 RPA 自動化。",
        email: ENTERPRISE_EMAIL,
        worksFor: { "@id": organizationId },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: ["zh-Hant", "en"],
        publisher: { "@id": organizationId },
        description: "用 AI 重新定義企業流程，並提供 Vibe Coding 從零到一實戰培訓。",
      },
      {
        "@type": "Course",
        "@id": `${SITE_URL}/courses#course`,
        name: "Tenth Project VIP Vibe Coding 與 AI Agent 實戰",
        description: "從零開始使用 Cursor、Next.js 與 Supabase 實戰開發並上線可收款的海外級 AI SaaS 產品。",
        url: `${SITE_URL}/courses`,
        provider: { "@id": organizationId },
        inLanguage: "zh-Hant",
        teaches: ["Vibe Coding", "AI Agent", "Cursor MCP", "Next.js", "Supabase", "Stripe"],
      },
      {
        "@type": "ProfessionalService",
        name: "Tenth Project 企業 AI 方案",
        url: `${SITE_URL}/enterprise`,
        provider: { "@id": organizationId },
        areaServed: "HK",
        serviceType: ["客製化 AI Agent", "工作流自動化", "數位轉型"],
        description: "為企業提供落地部署的客製化 AI Agent 與自動化工作流。",
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
  );
}
