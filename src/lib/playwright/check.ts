import { runHttpWebsiteCheck, type WebsiteCheckResult } from "@/lib/playwright/check-http";

export type { WebsiteCheckResult };

export async function runWebsiteCheck(url: string, projectId: string): Promise<WebsiteCheckResult> {
  const serverless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (!serverless) {
    try {
      const { runPlaywrightWebsiteCheck } = await import("./check-playwright");
      return await runPlaywrightWebsiteCheck(url, projectId);
    } catch (error) {
      const fallback = await runHttpWebsiteCheck(url);
      const reason = error instanceof Error ? error.message : "browser unavailable";
      return {
        ...fallback,
        resultSummary: `Browser check unavailable (${reason}). ${fallback.resultSummary}`,
      };
    }
  }
  return runHttpWebsiteCheck(url);
}
