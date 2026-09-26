import type { AIAnalysis } from "@/types";

type DraftTask = AIAnalysis["tasks"][number];

const EMOJI = /^\p{Extended_Pictographic}/u;
const GRANULAR_TITLE =
  /install tailwind|setup next|create postgres|initialize next|configure shadcn|next\.?js|tailwind|shadcn|supabase|postgresql|schema|\bapi\b|路由|資料庫|前端組件|基礎設置|基礎架構|認證系統|實作|安裝 tailwind/i;

const BUCKETS: { emoji: string; zh: string; en: string; test: RegExp }[] = [
  { emoji: "🚀", zh: "搭建網站骨架與外觀", en: "Site shell and visual system", test: /next\.?js|tailwind|shadcn|基礎|外觀|layout|骨架|架構/i },
  { emoji: "🔐", zh: "註冊、登入，資料只給本人看", en: "Sign up, sign in, and keep data private", test: /supabase|認證|登入|註冊|auth|rls/i },
  { emoji: "🗄️", zh: "把使用者輸入存下來", en: "Save what people enter", test: /資料庫|postgres|schema|table|資料表/i },
  { emoji: "🎨", zh: "做出使用者真正要完成的事", en: "The thing people came here to do", test: /表單|組件|api|生成|行程|component|畫面/i },
  { emoji: "📱", zh: "手機上可以完成，出錯看得到說明", en: "Works on a phone, and errors are visible", test: /手機|375|error|build|responsive|溢出/i },
];

function stripLeadingEmoji(title: string) {
  return title.replace(/^(?:\p{Extended_Pictographic}|\uFE0F|\u200D)+/gu, "").trim();
}

function founderPhrase(title: string) {
  return stripLeadingEmoji(title)
    .replace(/建立|設定|實作|初始化|安裝|開發/g, "")
    .replace(/Next\.js|Tailwind CSS|Tailwind|shadcn\/ui|shadcn|Supabase|API|組件|認證系統|基礎架構|基礎設置|PostgreSQL|Schema/gi, "")
    .replace(/與/g, "、")
    .replace(/\s+/g, "")
    .replace(/、{2,}/g, "、")
    .replace(/^、|、$/g, "")
    .trim();
}

function regroupTechnicalTitles(tasks: DraftTask[], chinese: boolean): DraftTask[] {
  const used = new Set<number>();
  const cards: DraftTask[] = [];
  BUCKETS.forEach((bucket) => {
    const items = tasks.filter((task, index) => {
      if (used.has(index)) return false;
      const blob = `${task.title} ${(task.technical_checklist ?? []).join(" ")}`;
      return bucket.test.test(blob);
    });
    items.forEach((task) => used.add(tasks.indexOf(task)));
    if (!items.length) return;
    const phrase = items.map((task) => founderPhrase(task.title)).find((text) => text.length >= 2 && !/^(專案|系統|功能|網站|設定)$/.test(text));
    cards.push({
      title: `${bucket.emoji} ${phrase || (chinese ? bucket.zh : bucket.en)}`,
      description: items.map((task) => task.description).filter(Boolean).slice(0, 2).join(" "),
      priority: items.some((task) => task.priority === "high") ? "high" : "medium",
      phase: items[0]?.phase,
      technical_checklist: items.flatMap(checklistOrTitle).slice(0, 8),
    });
  });
  const leftover = tasks.filter((_, index) => !used.has(index));
  if (leftover.length) {
    const phrase = leftover.map((task) => founderPhrase(task.title)).find((text) => text.length >= 2 && !/^(專案|系統|功能|網站|設定)$/.test(text));
    cards.push({
      title: withEmoji(phrase || (chinese ? "其餘要做的功能" : "The rest of the feature"), "🧩"),
      description: leftover.map((task) => task.description).filter(Boolean).slice(0, 2).join(" "),
      priority: leftover.some((task) => task.priority === "high") ? "high" : "medium",
      phase: leftover[0]?.phase,
      technical_checklist: leftover.flatMap(checklistOrTitle).slice(0, 8),
    });
  }
  return cards.slice(0, 5);
}

export function normalizeTechnicalChecklist(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split("\n") : [];
  return raw
    .map((item) => String(item).replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 8);
}

function withEmoji(title: string, emoji: string) {
  const trimmed = title.trim();
  if (!trimmed) return `${emoji} 功能`;
  if (EMOJI.test(trimmed)) return trimmed;
  return `${emoji} ${trimmed}`;
}

function checklistOrTitle(task: DraftTask) {
  const steps = normalizeTechnicalChecklist(task.technical_checklist);
  if (steps.length) return steps;
  const line = [task.title, task.description].filter(Boolean).join("。");
  return line ? [line] : [];
}

export function ensureFeatureTasks(tasks: DraftTask[] | undefined): DraftTask[] {
  const normalized = (tasks ?? [])
    .map((task) => ({
      ...task,
      title: (task.title ?? "").trim(),
      description: (task.description ?? "").trim(),
      priority: task.priority || "medium",
      technical_checklist: normalizeTechnicalChecklist(task.technical_checklist),
    }))
    .filter((task) => task.title);

  const chinese = normalized.some((task) => /[\u4e00-\u9fff]/.test(`${task.title} ${task.description}`));
  const granular = normalized.filter((task) => GRANULAR_TITLE.test(task.title)).length;
  const mostlyGranular = granular >= Math.ceil(normalized.length / 2);
  if (mostlyGranular) return regroupTechnicalTitles(normalized, chinese);
  const ready = normalized.filter((task) => task.technical_checklist.length > 0);
  if (ready.length >= 1 && ready.length <= 5 && ready.length === normalized.length) {
    return ready.map((task) => ({ ...task, title: withEmoji(task.title, "✨") }));
  }

  if (ready.length > 5) {
    const head = ready.slice(0, 4).map((task) => ({ ...task, title: withEmoji(task.title, "✨") }));
    const rest = ready.slice(4);
    head.push({
      title: withEmoji("其餘功能", "🧩"),
      description: rest.map((task) => task.title.replace(EMOJI, "").trim()).join("；"),
      priority: rest.some((task) => task.priority === "high") ? "high" : "medium",
      phase: rest[0]?.phase,
      technical_checklist: rest.flatMap((task) => task.technical_checklist).slice(0, 8),
    });
    return head;
  }

  const groups = new Map<string, DraftTask[]>();
  for (const task of normalized) {
    const key = task.phase?.trim() || "第一版";
    const bucket = groups.get(key) ?? [];
    bucket.push(task);
    groups.set(key, bucket);
  }

  const grouped = [...groups.entries()].slice(0, 5).map(([phase, items]) => ({
    title: withEmoji(phase, "✨"),
    description: items.map((task) => task.description || task.title).filter(Boolean).slice(0, 2).join(" "),
    priority: items.some((task) => task.priority === "high") ? "high" : items[0]?.priority || "medium",
    phase,
    technical_checklist: items.flatMap(checklistOrTitle).slice(0, 8),
  }));

  return grouped.length ? grouped : normalized.slice(0, 5);
}

export function fallbackFeatureTasks(chinese: boolean): DraftTask[] {
  if (chinese) {
    return [
      {
        title: "🚀 基礎建設：搭建網站骨架與外觀",
        description: "先把網站的框架和版面立起來，後面的畫面才有地方放。",
        priority: "high",
        phase: "第一版",
        technical_checklist: [
          "建立 Next.js App Router 專案，並接上 TypeScript。",
          "設定 Tailwind CSS 與 shadcn/ui。",
          "在 src/app/layout.tsx 放上全站版面，手機寬度不要橫向溢出。",
        ],
      },
      {
        title: "🎨 主畫面：讓使用者完成第一件事",
        description: "首頁要讓人一看就知道按哪裡，並且把結果顯示出來。",
        priority: "high",
        phase: "第一版",
        technical_checklist: [
          "在 src/app/page.tsx 做出主按鈕和表單。",
          "送出後用 server action 或 API 回傳結果。",
          "空資料、載入中、失敗三種狀態都要看得到。",
        ],
      },
      {
        title: "🔐 資料：把使用者輸入存下來",
        description: "需要記住的內容要進資料庫，而且只能由本人讀寫。",
        priority: "high",
        phase: "第一版",
        technical_checklist: [
          "接上 Supabase client。",
          "建立資料表，並加上 Row Level Security。",
          "把表單結果寫入資料表，重新整理後仍然看得到。",
        ],
      },
      {
        title: "📱 上線前：手機可以點、出錯有說明",
        description: "用手機打開不會破版，程式出錯時畫面上有說明，而不是一片空白。",
        priority: "medium",
        phase: "上線前",
        technical_checklist: [
          "375px 下主按鈕至少 44px，版面用 grid-cols-1。",
          "在 src/app/error.tsx 顯示可重試的錯誤說明。",
          "跑過 npm run build。",
        ],
      },
    ];
  }

  return [
    {
      title: "🚀 Foundation: site shell and visual system",
      description: "Stand up the app frame so later screens have a place to live.",
      priority: "high",
      phase: "Foundation",
      technical_checklist: [
        "Initialize a Next.js App Router project with TypeScript.",
        "Install and configure Tailwind CSS and shadcn/ui.",
        "Add a global layout in src/app/layout.tsx that does not overflow on a phone.",
      ],
    },
    {
      title: "🎨 Main screen: the first thing a user does",
      description: "The home page shows where to click, then shows the result.",
      priority: "high",
      phase: "Foundation",
      technical_checklist: [
        "Build the primary form and button in src/app/page.tsx.",
        "Submit through a server action or API and render the result.",
        "Show loading, empty, and error states.",
      ],
    },
    {
      title: "🔐 Data: save what the user entered",
      description: "Anything that must be remembered goes into the database, readable only by its owner.",
      priority: "high",
      phase: "Core",
      technical_checklist: [
        "Connect the Supabase client.",
        "Create the tables and enable Row Level Security.",
        "Write form results so they are still there after refresh.",
      ],
    },
    {
      title: "📱 Before launch: phone layout and a visible error",
      description: "A phone can use the page, and a crash shows an explanation instead of a blank screen.",
      priority: "medium",
      phase: "Polish",
      technical_checklist: [
        "At 375px, keep the main button at least 44px and use a single column.",
        "Add src/app/error.tsx with a retry action.",
        "Run npm run build.",
      ],
    },
  ];
}

export function formatTaskForPrompt(task: DraftTask) {
  const steps = normalizeTechnicalChecklist(task.technical_checklist)
    .map((step) => `    - ${step}`)
    .join("\n");
  const line = `- [${task.priority}] ${task.title}: ${task.description ?? ""}`;
  return steps ? `${line}\n  Cursor checklist:\n${steps}` : line;
}
