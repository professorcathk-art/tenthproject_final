import { PUBLIC_CONTACT_EMAIL, SKOOL_URL, WHATSAPP_DISPLAY } from "@/lib/contact";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        email: PUBLIC_CONTACT_EMAIL,
        telephone: WHATSAPP_DISPLAY,
        areaServed: ["HK", "TW", "MO"],
        sameAs: [SKOOL_URL],
        description:
          "企業 AI 顧問與 Vibe Coding 學院：客製 AI Agent、工作流自動化，以及 Lifetime 會員教室。",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: ["zh-Hant", "en"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Course",
        name: "Tenth Project Vibe Coding 課程 + Lifetime 社群",
        description: "項目導向學習 × AI，從零打造可盈利海外工具站，含 Stripe 與上線節奏。",
        url: `${SITE_URL}/courses`,
        provider: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "zh-Hant",
      },
      {
        "@type": "ProfessionalService",
        name: "Tenth Project 企業 AI 方案",
        url: `${SITE_URL}/enterprise`,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "HK",
        serviceType: ["AI Agent development", "Workflow automation", "Digital transformation"],
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
  );
}
