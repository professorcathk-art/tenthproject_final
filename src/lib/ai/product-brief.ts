import { deliveryGuard, detectDeliveryShape } from "@/lib/ai/delivery-shape";
import { ensureFeatureTasks } from "@/lib/ai/feature-tasks";
import type { AIAnalysis, Project } from "@/types";

export interface ProductBrief {
  vision: string;
  endGoal: string;
  audience: string;
  functions: string[];
  uiStyle: string;
  expectedOutput: string;
  outOfScope: string;
  firstSprint: string;
}

export interface BriefSource {
  name?: string | null;
  description?: string | null;
  goal?: string | null;
  target_audience?: string | null;
  product_type?: string | null;
  stage?: string | null;
  notes?: string | null;
  fileNames?: string[];
}

function looksChinese(text: string) {
  return /[\u4e00-\u9fff]/.test(text);
}

export function briefFromAnswers(source: BriefSource): ProductBrief {
  const blob = [source.name, source.description, source.goal, source.target_audience, source.notes]
    .filter(Boolean)
    .join("\n");
  const zh = looksChinese(blob);
  const name = source.name?.trim() || (zh ? "這個產品" : "this product");
  const description = source.description?.trim() || "";
  const goal = source.goal?.trim() || "";
  const audience = source.target_audience?.trim() || (zh ? "你描述裡的使用者" : "the people described above");
  const notes = source.notes?.trim() || "";
  const vision = [description, notes].filter(Boolean).join("\n\n") || name;
  const shape = detectDeliveryShape(source);

  if (zh && shape === "browser_extension") {
    return {
      vision: `${vision}\n\n這是瀏覽器擴充功能，不是網站。`,
      endGoal: goal || "使用者在求職網站上按一下，表單就照他存好的資料填完。",
      audience,
      functions: ["彈出視窗讓使用者存好要填的資料", "在求職網站的表單上按一下就填進去"],
      uiStyle: "擴充功能的小視窗，文字清楚，按鈕好點。",
      expectedOutput: goal || "打開求職網站的申請表，按一下之後欄位已被填上。",
      outOfScope: "不要做成網站、登入、儀表板或付款。",
      firstSprint: `先做出「${name}」的擴充功能彈出視窗，讓使用者可以${goal || "把資料存好並填進表單"}。`,
    };
  }

  if (zh) {
    return {
      vision,
      endGoal: goal || "使用者能靠這個產品做完他原本要親手做的那件事。",
      audience,
      functions: ["做出一條走得完的主流程，從打開頁面到看到結果"],
      uiStyle: "文字清楚、按鈕好點，手機上不用橫向滑動。",
      expectedOutput: goal || "使用者做完主流程後，畫面上看得到結果。",
      outOfScope: "登入、付款、後台，除非上面已經寫進第一版要做的功能。",
      firstSprint: `先做出「${name}」的主畫面，讓使用者可以${goal || "完成這件事"}。`,
    };
  }

  if (shape === "browser_extension") {
    return {
      vision: `${vision}\n\nThis is a browser extension, not a website.`,
      endGoal: goal || "On a job application page, one click fills the form from the saved profile.",
      audience,
      functions: ["A popup where the user saves the details to fill", "One click writes those details into the job form"],
      uiStyle: "A small extension popup with plain words and an obvious button.",
      expectedOutput: goal || "Open a job application and the fields are filled after one click.",
      outOfScope: "Do not build a website, login, dashboard, or payments.",
      firstSprint: `Build the popup for “${name}” so someone can ${goal || "save their details and fill a form"}.`,
    };
  }

  return {
    vision,
    endGoal: goal || "A person can finish the job this product exists to do.",
    audience,
    functions: ["One complete path from opening the page to seeing a result"],
    uiStyle: "Plain language, obvious buttons, usable on a phone without sideways scrolling.",
    expectedOutput: goal || "After the main action, the screen shows a result.",
    outOfScope: "Accounts, payments, and an admin panel, unless they are already listed as first-version functions.",
    firstSprint: `Build the first screen of “${name}” so someone can ${goal || "finish the main action"}.`,
  };
}

export function normalizeBrief(raw: unknown, fallback: ProductBrief): ProductBrief {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const text = (key: keyof ProductBrief, backup: string) => {
    const value = source[key];
    return typeof value === "string" && value.trim() ? value.trim() : backup;
  };
  const functions = Array.isArray(source.functions)
    ? source.functions.map((item) => String(item).trim()).filter(Boolean).slice(0, 12)
    : [];
  return {
    vision: text("vision", fallback.vision),
    endGoal: text("endGoal", fallback.endGoal),
    audience: text("audience", fallback.audience),
    functions: functions.length ? functions : fallback.functions,
    uiStyle: text("uiStyle", fallback.uiStyle),
    expectedOutput: text("expectedOutput", fallback.expectedOutput),
    outOfScope: text("outOfScope", fallback.outOfScope),
    firstSprint: text("firstSprint", fallback.firstSprint),
  };
}

export function formatBriefForPrompt(brief: ProductBrief, source?: BriefSource): string {
  const zh = looksChinese(`${brief.vision}\n${brief.endGoal}\n${brief.firstSprint}`);
  const functions = brief.functions.filter(Boolean);
  const guard = source ? deliveryGuard(detectDeliveryShape(source), zh) : "";
  if (zh) {
    return [
      guard,
      "使用者已確認的產品簡報（以此為準，不要改成另一個產品）：",
      `要做什麼：${brief.vision}`,
      `完成後要能做到：${brief.endGoal}`,
      `給誰用：${brief.audience}`,
      `第一版功能：\n${functions.map((item) => `- ${item}`).join("\n")}`,
      `畫面：${brief.uiStyle}`,
      `做完應該看到：${brief.expectedOutput}`,
      `這輪不要做：${brief.outOfScope}`,
      `第一段提示詞只做：${brief.firstSprint}`,
    ].filter(Boolean).join("\n");
  }
  return [
    guard,
    "Confirmed product brief (this is the spec — do not swap in a different product):",
    `What to build: ${brief.vision}`,
    `End goal: ${brief.endGoal}`,
    `Audience: ${brief.audience}`,
    `First-version functions:\n${functions.map((item) => `- ${item}`).join("\n")}`,
    `UI: ${brief.uiStyle}`,
    `Expected output: ${brief.expectedOutput}`,
    `Leave out of this sprint: ${brief.outOfScope}`,
    `The first prompt must build only: ${brief.firstSprint}`,
  ].filter(Boolean).join("\n");
}

export function applyConfirmedBrief(analysis: AIAnalysis, brief: ProductBrief, source?: BriefSource): AIAnalysis {
  const zh = looksChinese(`${brief.vision}\n${brief.endGoal}`);
  const functions = brief.functions.filter(Boolean);
  const shape = detectDeliveryShape(source ?? {
    description: brief.vision,
    goal: brief.endGoal,
    target_audience: brief.audience,
    notes: brief.functions.join("\n"),
  });
  const extension = shape === "browser_extension";
  const phase = analysis.phases?.[0]?.name ?? (zh ? "第一版" : "First version");
  const title = brief.firstSprint.trim().slice(0, 140);
  const sprintTask = {
    title: /^\p{Extended_Pictographic}/u.test(title) ? title : `🚀 ${title}`,
    description: zh
      ? `這一輪只做：${brief.firstSprint}。畫面依照：${brief.uiStyle}。做完要看到：${brief.expectedOutput}。`
      : `This round only builds: ${brief.firstSprint}. UI: ${brief.uiStyle}. Done when the user can see: ${brief.expectedOutput}.`,
    technical_checklist: extension
      ? zh
        ? [
            "在 manifest.json 宣告 Manifest V3、popup 和 content script。",
            `在 src/popup.ts 做出：${brief.firstSprint}`,
            "在 src/content.ts 把存好的資料填進頁面上的表單欄位。",
            "用 chrome.storage 記住資料，不要做成網站。",
            `不要做：${brief.outOfScope}`,
          ]
        : [
            "Declare Manifest V3, the popup, and the content script in manifest.json.",
            `In src/popup.ts, build: ${brief.firstSprint}`,
            "In src/content.ts, write the saved details into the form on the page.",
            "Keep the profile in chrome.storage. Do not build a website.",
            `Do not build: ${brief.outOfScope}`,
          ]
      : zh
        ? [
            `在 src/app/page.tsx 做出：${brief.firstSprint}`,
            ...functions.map((item) => `實作：${item}`),
            `畫面依照：${brief.uiStyle}`,
            `不要做：${brief.outOfScope}`,
          ]
        : [
            `In src/app/page.tsx, build: ${brief.firstSprint}`,
            ...functions.map((item) => `Implement: ${item}`),
            `UI: ${brief.uiStyle}`,
            `Do not build: ${brief.outOfScope}`,
          ],
    priority: "high",
    phase,
  };
  const goal = zh
    ? [
        brief.endGoal.trim(),
        `對象：${brief.audience.trim()}`,
        `畫面：${brief.uiStyle.trim()}`,
        `第一版功能：${functions.join("；")}`,
        `做完要看到：${brief.expectedOutput.trim()}`,
        `先不要做：${brief.outOfScope.trim()}`,
      ].join("\n")
    : [
        brief.endGoal.trim(),
        `Audience: ${brief.audience.trim()}`,
        `UI: ${brief.uiStyle.trim()}`,
        `First-version functions: ${functions.join("; ")}`,
        `Expected output: ${brief.expectedOutput.trim()}`,
        `Out of scope: ${brief.outOfScope.trim()}`,
      ].join("\n");

  return {
    ...analysis,
    projectSummary: brief.vision.trim(),
    productGoal: goal,
    nextAction: brief.firstSprint.trim(),
    acceptanceCriteria: [brief.expectedOutput.trim(), ...functions].filter(Boolean),
    tasks: extension
      ? [sprintTask]
      : ensureFeatureTasks([sprintTask, ...(analysis.tasks ?? []).filter((task) => task.title !== title && task.title !== sprintTask.title)]),
    uatItems: extension
      ? [
          {
            title: zh ? "彈出視窗可以存下要填的資料" : "The popup saves the details to fill",
            testPath: "src/popup.ts",
            expectedResult: zh
              ? "打開擴充功能彈出視窗，填入資料並儲存 → chrome.storage 裡看得到，重新打開仍在。"
              : "Open the popup, save details → they remain in chrome.storage after reopening.",
            severity: "high",
            phase,
          },
          {
            title: zh ? "求職網頁上的表單會被填上" : "A job form on the page gets filled",
            testPath: "src/content.ts",
            expectedResult: zh
              ? "打開一頁有申請表的網站，按一下填入 → 對應欄位出現剛存的資料，頁面沒有被換成我們的網站。"
              : "Open a page with an application form and click fill → the fields show the saved details, and the page is still that site.",
            severity: "high",
            phase,
          },
        ]
      : analysis.uatItems,
  };
}

export function briefSourceFromProject(project: Partial<Project>, notes?: string | null, fileNames?: string[]): BriefSource {
  return {
    name: project.name,
    description: project.description,
    goal: project.goal,
    target_audience: project.target_audience,
    product_type: project.product_type,
    stage: project.stage,
    notes,
    fileNames,
  };
}
