import type { AiSuggestion, ProjectWithRelations } from "@/types";

export function collectSprintBacklog(project: ProjectWithRelations, approved: AiSuggestion[] = []) {
  const openBugs = (project.bugs ?? []).filter((bug) => bug.status === "open" || bug.status === "in_progress");
  const failedUat = (project.uat_items ?? []).filter(
    (item) => item.status === "failed" || item.status === "reopened",
  );
  const todoTasks = (project.tasks ?? []).filter((task) => task.status === "todo" || task.status === "blocked");

  return { openBugs, failedUat, todoTasks, approved };
}

export function synthesizeSprintPrompt(project: ProjectWithRelations, approved: AiSuggestion[] = []) {
  const { openBugs, failedUat, todoTasks } = collectSprintBacklog(project, approved);
  const url = project.website_url ?? "（尚未填寫）";
  const github = project.github_url ?? "（尚未填寫）";
  const tool = project.selected_tool || "cursor";

  const suggestionLines = approved.length
    ? approved
        .map(
          (item, index) =>
            `${index + 1}. **[${item.category} / ${item.severity}] ${item.title}**\n   ${item.description}`,
        )
        .join("\n")
    : "- （本輪沒有新的 AI 建議）";

  const bugLines = openBugs.length
    ? openBugs
        .map((bug) => `- **${bug.title}** (${bug.severity}, ${bug.status})${bug.description ? ` — ${bug.description}` : ""}`)
        .join("\n")
    : "- 無未解錯誤";

  const uatLines = failedUat.length
    ? failedUat
        .map(
          (item) =>
            `- **${item.title}** (${item.status})\n  預期：${item.expected_result ?? "未填"}${item.remark ? `\n  備註：${item.remark}` : ""}`,
        )
        .join("\n")
    : "- 沒有失敗或重開的 UAT";

  const taskLines = todoTasks.length
    ? todoTasks.map((task) => `- [${task.priority}] ${task.title}${task.description ? ` — ${task.description}` : ""}`).join("\n")
    : "- 待辦任務已清空，請只處理上方建議／錯誤／UAT";

  return `# Cursor Master Prompt — ${project.name}

> 由 Tenth Project 工作台合成。工具：${tool}。貼上後先讀現有程式，再依優先順序改，不要重寫整個專案。

## 1. Product context
- **產品：** ${project.name}
- **說明：** ${project.description ?? "（無）"}
- **目標：** ${project.goal ?? "（無）"}
- **對象：** ${project.target_audience ?? "（無）"}
- **階段：** ${project.stage} · 類型：${project.product_type}
- **Live URL：** ${url}
- **GitHub：** ${github}

## 2. This sprint objective
只處理「已批准的 AI 建議 + 未解錯誤 + 失敗／重開 UAT」。做完一項就對應更新狀態，不要擴 scope。

## 3. Approved AI suggestions
${suggestionLines}

## 4. Open bugs
${bugLines}

## 5. Failed / reopened UAT
${uatLines}

## 6. Existing todo / blocked tasks
${taskLines}

## 7. Execution rules (Cursor)
1. 先掃現有檔案與元件，沿用既有 naming、shadcn、Tailwind 與路由。
2. 優先修 critical / high，再做 medium，最後才做 feature polish。
3. 每個修正都要有 loading / empty / error 其中缺的那一態。
4. 改 UI 後用 375px 與桌面各走一次主流程。
5. 不要新增未要求的套件、不要改無關頁面。
6. 完成後跑 \`npm run build\`，並用條列回報：改了什麼、怎麼驗、還有什麼沒做。

## 8. Acceptance checklist
- [ ] 每個批准建議都有對應的可見結果
- [ ] 每個 open bug 已修或標明被什麼擋住
- [ ] 失敗 UAT 可再測，並寫出實際結果
- [ ] Live URL 若可達，相關畫面不再出現同樣的檢查器錯誤
- [ ] 手機主流程可完成，沒有橫向溢出

## 9. Out of scope
付款、多租戶、重做設計系統、與本輪無關的重構。
`;
}
