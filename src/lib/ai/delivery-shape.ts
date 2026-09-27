export interface ShapeSource {
  name?: string | null;
  description?: string | null;
  goal?: string | null;
  target_audience?: string | null;
  product_type?: string | null;
  notes?: string | null;
  fileNames?: string[];
}

export type DeliveryShape =
  | "browser_extension"
  | "web_app"
  | "landing_page"
  | "dashboard"
  | "automation"
  | "unspecified";

const EXTENSION_RE =
  /chrome\s*extension|browser\s*extension|content\s*script|manifest\.json|chrome\.storage|擴充功能|瀏覽器擴充|瀏覽器外掛|插件/i;
const AUTOFILL_RE = /auto[\s-]?fill|autofill|自動填/i;

export function detectDeliveryShape(source: ShapeSource): DeliveryShape {
  const blob = [
    source.name,
    source.description,
    source.goal,
    source.target_audience,
    source.notes,
    ...(source.fileNames ?? []),
  ]
    .filter(Boolean)
    .join("\n");
  if (EXTENSION_RE.test(blob) || AUTOFILL_RE.test(blob)) return "browser_extension";
  if (source.product_type === "landing_page" || /登陸頁|landing page/i.test(blob)) return "landing_page";
  if (source.product_type === "dashboard" || /\bdashboard\b|儀表板/i.test(blob)) return "dashboard";
  if (source.product_type === "automation") return "automation";
  if (source.product_type === "webapp" || source.product_type === "small_tool" || source.product_type === "software") {
    return "web_app";
  }
  return "unspecified";
}

export function deliveryShapeLabel(shape: DeliveryShape, zh: boolean) {
  const labels: Record<DeliveryShape, [string, string]> = {
    browser_extension: ["瀏覽器擴充功能", "Browser extension"],
    web_app: ["網頁應用", "Web app"],
    landing_page: ["登陸頁", "Landing page"],
    dashboard: ["儀表板", "Dashboard"],
    automation: ["自動化", "Automation"],
    unspecified: ["照填寫內容，不預設成網站", "Follow the form, do not assume a website"],
  };
  return labels[shape][zh ? 0 : 1];
}

export function deliveryGuard(shape: DeliveryShape, zh: boolean) {
  if (shape === "browser_extension") {
    return zh
      ? "產品形態：瀏覽器擴充功能（Chrome Manifest V3），不是網站。檔案是 manifest.json、popup、content script、service worker。用 chrome.storage 記住要填的資料，content script 在別人的網頁表單上填進去。不要建立 Next.js 網站、登入頁、儀表板或 Supabase，除非使用者原文明確要求一個配套網站。"
      : "Delivery shape: a Chrome Manifest V3 browser extension, not a website. Files are manifest.json, a popup, a content script, and a service worker. Save the profile in chrome.storage and fill fields on other sites from the content script. Do not create a Next.js site, login, dashboard, or Supabase unless the founder's own words ask for a companion website.";
  }
  if (shape === "unspecified") {
    return zh
      ? "產品類型選了「其他」。照使用者每一欄的原文做，不要改成 Next.js 網站、登入或儀表板。只有原文明確要網站時才做網站。"
      : "Product type is Other. Follow every field the founder wrote. Do not turn it into a Next.js website, login, or dashboard unless their own words ask for a website.";
  }
  if (shape === "automation") {
    return zh
      ? "產品形態：自動化工作，不是一個給人瀏覽的行銷網站。做排程、API 和紀錄即可。"
      : "Delivery shape: an automation job, not a marketing website. Build the schedule, the API, and the log.";
  }
  return zh
    ? `產品形態：${deliveryShapeLabel(shape, true)}。照這個形態寫檔案和路線，不要改成另一種產品。`
    : `Delivery shape: ${deliveryShapeLabel(shape, false)}. Keep the files and routes in this shape. Do not swap in a different product.`;
}

export function extensionFiles() {
  return {
    stack: "Chrome Extension Manifest V3, TypeScript, a popup, a content script, chrome.storage. No website framework.",
    structure: `manifest.json
src/
  popup.html
  popup.ts
  content.ts
  background.ts
  styles.css`,
    pages: [
      { route: "popup", purpose: "Small window where the user saves the details that should be filled in" },
      { route: "content script", purpose: "Runs on the job-application page and writes those details into the form" },
      { route: "service worker", purpose: "Wakes the extension and stores nothing secret in page JavaScript" },
    ],
  };
}

export function promptMatchesShape(prompt: string, shape: DeliveryShape) {
  if (shape !== "browser_extension") return true;
  const hasExtension = /manifest|content script|擴充功能|chrome\.storage/i.test(prompt);
  const websiteInstead = /Next\.js App Router|src\/app\/page\.tsx/.test(prompt) && !hasExtension;
  return hasExtension && !websiteInstead;
}
