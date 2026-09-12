import { chromium } from "playwright";
import { promises as fs } from "fs";
import path from "path";
import { normalizeCheckUrl, type WebsiteCheckResult } from "@/lib/playwright/check-http";

export async function runPlaywrightWebsiteCheck(url: string, projectId: string): Promise<WebsiteCheckResult> {
  const target = normalizeCheckUrl(url);
  const screenshotsDir = path.join(process.cwd(), "public", "screenshots", projectId);
  await fs.mkdir(screenshotsDir, { recursive: true });

  const timestamp = Date.now();
  const screenshotPath = path.join(screenshotsDir, `check-${timestamp}.png`);
  const publicPath = `/screenshots/${projectId}/check-${timestamp}.png`;

  const consoleErrors: string[] = [];
  const accessibilityWarnings: string[] = [];
  const missingElements: string[] = [];
  const started = Date.now();

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    const navigation = await page.goto(target, { waitUntil: "networkidle", timeout: 30000 });
    const httpStatus = navigation?.status() ?? null;
    await page.screenshot({ path: screenshotPath, fullPage: false });

    const pageTitle = await page.title();
    const hasViewport = Boolean(await page.$('meta[name="viewport"]'));

    if (!hasViewport) {
      accessibilityWarnings.push("Missing viewport meta tag — may cause mobile layout issues");
    }

    const imagesWithoutAlt = await page.$$eval("img:not([alt])", (imgs) => imgs.length);
    if (imagesWithoutAlt > 0) {
      accessibilityWarnings.push(`${imagesWithoutAlt} image(s) missing alt text`);
    }

    const buttons = await page.$$("button, a[role='button'], input[type='submit']");
    if (buttons.length === 0) {
      missingElements.push("No interactive buttons found on page");
    }

    const h1 = await page.$("h1");
    if (!h1) {
      missingElements.push("No H1 heading found — may affect SEO and clarity");
    }

    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
    await mobilePage.goto(target, { waitUntil: "networkidle", timeout: 30000 });

    const overflowElements = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    if (overflowElements) {
      accessibilityWarnings.push("Horizontal scroll detected on mobile viewport");
    }

    await mobilePage.close();

    const durationMs = Date.now() - started;
    const issues = [...consoleErrors, ...accessibilityWarnings, ...missingElements];
    const statusLabel = httpStatus ?? "unknown";
    const resultSummary =
      issues.length === 0
        ? `HTTP ${statusLabel}: "${pageTitle}" loaded in ${durationMs}ms with no obvious issues detected.`
        : `HTTP ${statusLabel} found ${issues.length} issue(s) in ${durationMs}ms: ${issues.slice(0, 3).join("; ")}${issues.length > 3 ? "..." : ""}`;

    const buffer = await fs.readFile(screenshotPath);

    return {
      screenshotPath: publicPath,
      screenshotBase64: buffer.toString("base64"),
      consoleErrors,
      accessibilityWarnings,
      missingElements,
      resultSummary,
      pageTitle,
      hasViewport,
      httpStatus,
      durationMs,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
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
      durationMs: Date.now() - started,
    };
  } finally {
    if (browser) await browser.close();
  }
}
