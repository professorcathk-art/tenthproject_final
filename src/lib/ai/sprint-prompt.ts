import type { AiSuggestion, Enhancement, ProjectWithRelations } from "@/types";
import { extractSpecFromSuggestion, inferTargetFile, specBlock, SPRINT_PROMPT_SYSTEM } from "@/lib/ai/executable-spec";

export { SPRINT_PROMPT_SYSTEM };

export function collectSprintBacklog(
  project: ProjectWithRelations,
  approved: AiSuggestion[] = [],
  selectedEnhancements: Enhancement[] = [],
) {
  const openBugs = (project.bugs ?? []).filter((bug) => bug.status === "open" || bug.status === "in_progress");
  const failedUat = (project.uat_items ?? []).filter(
    (item) => item.status === "failed" || item.status === "reopened",
  );
  const todoTasks = (project.tasks ?? []).filter((task) => task.status === "todo" || task.status === "blocked");
  const openUat = (project.uat_items ?? []).filter(
    (item) => item.status === "not_started" || item.status === "in_progress" || item.status === "needs_review",
  );

  return { openBugs, failedUat, todoTasks, approved, selectedEnhancements, openUat };
}

function collectTargetFiles(
  project: ProjectWithRelations,
  approved: AiSuggestion[],
  selectedEnhancements: Enhancement[] = [],
) {
  const files = new Set<string>();
  for (const item of approved) files.add(extractSpecFromSuggestion(item).file);
  for (const bug of project.bugs ?? []) {
    if (bug.status === "open" || bug.status === "in_progress") {
      files.add(inferTargetFile(`${bug.title}\n${bug.description ?? ""}`));
    }
  }
  for (const uat of project.uat_items ?? []) {
    if (uat.status === "failed" || uat.status === "reopened") {
      files.add(uat.test_path?.trim() || inferTargetFile(`${uat.title}\n${uat.expected_result ?? ""}`));
    }
  }
  for (const task of project.tasks ?? []) {
    if (task.status === "todo" || task.status === "blocked") {
      files.add(inferTargetFile(`${task.title}\n${task.description ?? ""}`));
    }
  }
  for (const item of selectedEnhancements) {
    files.add(inferTargetFile(`${item.title}\n${item.description ?? ""}`));
  }
  return [...files];
}

export function synthesizeSprintPrompt(
  project: ProjectWithRelations,
  approved: AiSuggestion[] = [],
  selectedEnhancements: Enhancement[] = [],
) {
  const { openBugs, failedUat, todoTasks } = collectSprintBacklog(project, approved, selectedEnhancements);
  const url = project.website_url ?? "（尚未填寫）";
  const github = project.github_url ?? "（尚未填寫）";
  const tool = project.selected_tool || "cursor";
  const targets = collectTargetFiles(project, approved, selectedEnhancements);

  const suggestionLines = approved.length
    ? approved
        .map((item, index) => {
          const spec = extractSpecFromSuggestion(item);
          return `${index + 1}. **[${item.category} / ${item.severity}] ${item.title}**\n${specBlock(spec)}`;
        })
        .join("\n")
    : "- （本輪沒有新的 AI 建議）";

  const bugLines = openBugs.length
    ? openBugs
        .map((bug) => {
          const file = inferTargetFile(`${bug.title}\n${bug.description ?? ""}`);
          return specBlock({
            file,
            action: `Fix ${bug.title} (${bug.severity}, ${bug.status})`,
            acceptance: bug.description || "Regression-free; npm run build passes",
          });
        })
        .join("\n")
    : "- 無未解錯誤";

  const uatLines = failedUat.length
    ? failedUat
        .map((item) => {
          const file = item.test_path?.trim() || inferTargetFile(`${item.title}\n${item.expected_result ?? ""}`);
          return specBlock({
            file,
            action: `Re-test failed UAT 「${item.title}」 (${item.status}${item.priority ? `, ${item.priority}` : ""})`,
            acceptance: `${item.expected_result ?? "未填步驟"}${item.remark ? `；備註：${item.remark}` : ""}`,
          });
        })
        .join("\n")
    : "- 沒有失敗或重開的 UAT";

  const taskLines = todoTasks.length
    ? todoTasks
        .map((task) => {
          const file = inferTargetFile(`${task.title}\n${task.description ?? ""}`);
          return specBlock({
            file,
            action: `[${task.priority}] ${task.title}`,
            acceptance: task.description || "Visible result + npm run build",
          });
        })
        .join("\n")
    : "- 待辦任務已清空，請只處理上方建議／錯誤／UAT";

  const enhancementLines = selectedEnhancements.length
    ? selectedEnhancements
        .map((item) => {
          const file = inferTargetFile(`${item.title}\n${item.description ?? ""}`);
          return specBlock({
            file,
            action: `[${item.priority}] ${item.title}`,
            acceptance: item.description || "Visible result + matching UAT passes",
          });
        })
        .join("\n")
    : "- 本輪沒有勾選額外增強";

  const fileList = targets.length ? targets.map((file) => `- \`${file}\``).join("\n") : "- `src/app/page.tsx`";

  return `# Cursor Master Prompt — ${project.name}

> Tenth Project executable spec. Tool: ${tool}.
> ${SPRINT_PROMPT_SYSTEM.split("\n")[2]}

## 1. Product context
- **產品：** ${project.name}
- **說明：** ${project.description ?? "（無）"}
- **目標：** ${project.goal ?? "（無）"}
- **對象：** ${project.target_audience ?? "（無）"}
- **階段：** ${project.stage} · 類型：${project.product_type}
- **Live URL：** ${url}
- **GitHub：** ${github}

## 2. Exact target files
只改下列檔案（及它們直接 import 的子元件）。禁止「improve UI」這種空話。

${fileList}

## 3. This sprint objective
只處理使用者勾選的 AI 建議／增強 + 未解錯誤 + 失敗／重開 UAT。勾選項目已自動寫入 UAT。每一項都必須寫成：檔案 → 具體 Tailwind/React 動作 → 驗收。

## 4. Step-by-step code modifications

### 4a. Approved AI suggestions
${suggestionLines}

### 4b. Open bugs
${bugLines}

### 4c. Failed / reopened UAT
${uatLines}

### 4d. Existing todo / blocked tasks
${taskLines}

### 4e. Selected enhancements (this sprint)
${enhancementLines}

## 5. Execution rules (Cursor)
1. 先 \`Glob\`/\`Grep\` 確認目標檔存在；沒有就在最近的 App Router 路徑新建，不要重寫整個 repo。
2. 優先 critical / high。每個畫面補齊 loading / empty / error 缺的那一態。
3. 版面問題用 \`w-full max-w-xl mx-auto\` 或 \`grid-cols-1 md:grid-cols-3\`，並在 375px 重測。
4. 首屏 >3s：\`next/dynamic\` 拆 chart/map/editor，搭配 Skeleton。
5. HTTP 4xx/5xx：修 \`src/app/error.tsx\` / \`src/app/not-found.tsx\` / 對應 \`src/app/api/*\`。
6. 不要新增未要求的套件。

## 6. Build & verification command
\`\`\`bash
npm run build
\`\`\`
通過後用條列回報：改了哪個檔、怎麼驗（路徑 + 步驟 + 預期 DOM/API）、還有什麼沒做。

## 7. Acceptance checklist
- [ ] 每個批准建議都對到一個具體檔案 diff
- [ ] 每個 open bug 已修或寫明擋住它的檔案
- [ ] 失敗 UAT 可依「路徑 + 步驟」再測
- [ ] Live URL 不再出現同一則檢查器錯誤
- [ ] 375px 主流程可完成，沒有橫向溢出
- [ ] \`npm run build\` 通過

## 8. Out of scope
付款、多租戶、重做設計系統、與本輪無關的重構。
`;
}
