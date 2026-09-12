import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/dashboard", "/projects", "/learning", "/settings", "/vault", "/mcp"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Claude-Web", "Anthropic-AI", "PerplexityBot", "Google-Extended"],
        allow: ["/", "/courses", "/enterprise", "/inspiration", "/about", "/llms.txt"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
