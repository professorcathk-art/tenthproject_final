import OpenAI from "openai";
import { deliveryGuard, detectDeliveryShape } from "@/lib/ai/delivery-shape";
import { briefFromAnswers, normalizeBrief, type BriefSource, type ProductBrief } from "@/lib/ai/product-brief";

const POLISH_SYSTEM = `You rewrite a founder's rough answers into a product brief they can edit.
Rules:
- Keep their product. Do not invent a different app, a new market, or features they did not imply.
- Obey the delivery shape. A browser extension stays an extension. Do not rewrite it as a website, Next.js app, login, or dashboard.
- Make each field concrete enough that a coding agent can build the first slice.
- functions: 3 to 7 items, each one a thing the first version actually does.
- firstSprint: one buildable slice, not the whole company.
- outOfScope: name what the first prompt must leave out.
- Write in the same language as the user's answers. Traditional Chinese stays Traditional Chinese. Do not translate Chinese into English.
Return ONLY JSON:
{
  "vision": "string",
  "endGoal": "string",
  "audience": "string",
  "functions": ["string"],
  "uiStyle": "string",
  "expectedOutput": "string",
  "outOfScope": "string",
  "firstSprint": "string"
}`;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AIML_API_KEY;
  const baseURL = process.env.AIML_API_KEY ? process.env.AIML_BASE_URL || "https://api.aimlapi.com/v1" : undefined;
  if (!apiKey) return null;
  return new OpenAI({ apiKey, baseURL });
}

export async function polishProductBrief(source: BriefSource): Promise<ProductBrief> {
  const fallback = briefFromAnswers(source);
  const client = getClient();
  if (!client) return fallback;

  const user = [
    `Name: ${source.name ?? ""}`,
    `What they want to build: ${source.description ?? ""}`,
    `End goal they wrote: ${source.goal ?? ""}`,
    `Audience they wrote: ${source.target_audience ?? ""}`,
    `Product type: ${source.product_type ?? ""}`,
    `Stage: ${source.stage ?? ""}`,
    `Extra notes: ${source.notes ?? ""}`,
    `Files: ${(source.fileNames ?? []).join(", ") || "none"}`,
    deliveryGuard(detectDeliveryShape(source), /[\u4e00-\u9fff]/.test([source.name, source.description, source.goal, source.notes].join("\n"))),
  ].join("\n");

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: POLISH_SYSTEM },
        { role: "user", content: user },
      ],
    });
    const content = response.choices[0]?.message?.content;
    if (!content) return fallback;
    return normalizeBrief(JSON.parse(content), fallback);
  } catch (error) {
    console.error("Brief polish failed:", error);
    return fallback;
  }
}
