import { UNMARKED_UAT } from "@/lib/project/founder-copy";

export const SHIPPING_RULES = `你是 Tenth Project 的出貨助手。這把連線只對應一個專案。
每次只推進一件事。先呼叫 get_active_roadmap，只把 shipping.nextStep.say 原文問使用者，然後停下。
使用者回覆「確認」、「好」、「yes」或「confirm」都算同意。同意之後只做 shipping.nextStep.onConfirm 寫的那一件，做完再呼叫 get_active_roadmap，問下一句。
不要一次列出很多步驟。沒有這一次的確認，不要改程式，也不要自己開下一輪。
你看不到使用者的螢幕截圖，伺服器也不會替你分析畫面。驗收前請在本機打開 nextStep 裡的路徑看結果。沒看過就不要假裝測過。使用者回覆「確認失敗」時，把該驗收標成 failed。`;

type TaskItem = { id: string; title: string; status: string; priority?: string | null };
type UatItem = {
  id: string;
  title: string;
  status: string;
  expected_result?: string | null;
  test_path?: string | null;
};

function isOpenTask(status: string) {
  return status !== "done" && status !== "completed";
}

function priorityRank(priority?: string | null) {
  if (priority === "high") return 0;
  if (priority === "medium") return 1;
  if (priority === "low") return 2;
  return 3;
}

export function shippingCue(input: {
  tasks?: TaskItem[];
  uatItems?: UatItem[];
  openBugCount?: number;
}) {
  const openTasks = (input.tasks ?? [])
    .filter((item) => isOpenTask(item.status))
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
  const unmarked = (input.uatItems ?? []).filter((item) => UNMARKED_UAT.has(item.status));
  const failed = (input.uatItems ?? []).filter((item) => item.status === "failed" || item.status === "reopened");
  const openBugCount = input.openBugCount ?? 0;
  const counts = {
    openTasks: openTasks.length,
    unmarkedUat: unmarked.length,
    failedUat: failed.length,
    openBugs: openBugCount,
  };
  const unmarkedUat = unmarked.map(({ id, title, status }) => ({ id, title, status }));
  const openTaskBrief = openTasks.map(({ id, title, status }) => ({ id, title, status }));

  let phase: "build" | "waiting_for_uat" | "sprint_boundary" | "idle" = "idle";
  let nextStep: { say: string; onConfirm: string };

  if (openTasks.length) {
    const task = openTasks[0];
    phase = "build";
    nextStep = {
      say: `下一步：做出「${task.title}」。回覆「確認」，我就開始。`,
      onConfirm: `只完成任務 ${task.id}「${task.title}」的 technical_checklist。做完呼叫 update_task_status 把這個任務標成 completed，再呼叫 get_active_roadmap。不要同時做其他任務。`,
    };
  } else if (unmarked.length) {
    const item = unmarked[0];
    const path = item.test_path?.trim() || "這個產品的相關頁面";
    const expected = item.expected_result?.trim() || "這項驗收描述的結果";
    phase = "waiting_for_uat";
    nextStep = {
      say: `下一步：驗收「${item.title}」。請先在本機打開 ${path}，看是否符合「${expected}」。符合就回覆「確認」，我會標成通過。不符合就回覆「確認失敗」。`,
      onConfirm: `使用者回覆確認：呼叫 update_uat_item，uat_id 為 ${item.id}，status 為 passed。使用者回覆確認失敗：status 為 failed，remark 寫你看到的問題。然後再呼叫 get_active_roadmap。不要一次改其他驗收。`,
    };
  } else if (failed.length || openBugCount) {
    phase = "sprint_boundary";
    nextStep = {
      say: "下一步：開下一衝刺，先修失敗的驗收和未解錯誤。回覆「確認」就開始。",
      onConfirm: "呼叫 start_next_sprint，confirmed 為 true。不要傳入使用者沒點名的 task_ids。拿到提示詞後照它做完這一輪，再呼叫 get_active_roadmap。",
    };
  } else {
    phase = "idle";
    nextStep = {
      say: "這一輪已經做完。回覆「確認」就停在這裡。若你想做新功能，用一句話說要做什麼，我再請你確認。",
      onConfirm: "使用者只回覆確認：不要開下一輪，告訴他可以先停。使用者提出新功能：先把那一句復述出來，再等他回覆確認，才開始做。",
    };
  }

  return {
    phase,
    mustStop: true,
    counts,
    unmarkedUat,
    openTasks: openTaskBrief,
    askUser: nextStep.say,
    nextStep,
  };
}
