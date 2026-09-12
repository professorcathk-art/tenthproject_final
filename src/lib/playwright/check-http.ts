export interface WebsiteCheckResult {
  screenshotPath: string;
  screenshotBase64: string;
  consoleErrors: string[];
  accessibilityWarnings: string[];
  resultSummary: string;
  pageTitle: string;
  hasViewport: boolean;
  missingElements: string[];
  httpStatus: number | null;
  durationMs: number;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeCheckUrl(raw: string) {
  const url = new URL(raw);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https URLs can be checked");
  }
  return url.href;
}

export async function runHttpWebsiteCheck(url: string): Promise<WebsiteCheckResult> {
  const target = normalizeCheckUrl(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  const started = Date.now();

  try {
    const response = await fetch(target, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "TenthProject-SiteCheck/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const durationMs = Date.now() - started;
    const html = await response.text();
    const pageTitle = decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const images = html.match(/<img\b[^>]*>/gi) ?? [];
    const missingAlt = images.filter((tag) => !/\balt\s*=/i.test(tag)).length;
    const hasHeading = /<h1\b/i.test(html);
    const hasControl = /<(button|input)\b|<a\b[^>]+role=["']button["']/i.test(html);

    const consoleErrors: string[] = [];
    const accessibilityWarnings: string[] = [];
    const missingElements: string[] = [];

    if (!response.ok) {
      consoleErrors.push(`HTTP ${response.status} ${response.statusText || "error"}`.trim());
    }
    if (!hasViewport) {
      accessibilityWarnings.push("Missing viewport meta tag — may cause mobile layout issues");
    }
    if (missingAlt > 0) {
      accessibilityWarnings.push(`${missingAlt} image(s) missing alt text`);
    }
    if (!hasControl) {
      missingElements.push("No interactive buttons found on page");
    }
    if (!hasHeading) {
      missingElements.push("No H1 heading found — may affect SEO and clarity");
    }

    const issues = [...consoleErrors, ...accessibilityWarnings, ...missingElements];
    const label = pageTitle || target;
    const resultSummary =
      issues.length === 0
        ? `HTTP ${response.status}: "${label}" responded in ${durationMs}ms with no obvious markup issues. Full browser/screenshot checks run locally.`
        : `HTTP ${response.status} check found ${issues.length} issue(s) in ${durationMs}ms: ${issues.slice(0, 3).join("; ")}${issues.length > 3 ? "..." : ""}`;

    return {
      screenshotPath: "",
      screenshotBase64: "",
      consoleErrors,
      accessibilityWarnings,
      missingElements,
      resultSummary,
      pageTitle,
      hasViewport,
      httpStatus: response.status,
      durationMs,
    };
  } catch (error) {
    const durationMs = Date.now() - started;
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Timed out after 15s"
        : error instanceof Error
          ? error.message
          : "Unknown error";
    return {
      screenshotPath: "",
      screenshotBase64: "",
      consoleErrors: [message],
      accessibilityWarnings: [],
      missingElements: [],
      resultSummary: `Failed to check website: ${message}`,
      pageTitle: "",
      hasViewport: false,
      httpStatus: null,
      durationMs,
    };
  } finally {
    clearTimeout(timer);
  }
}
