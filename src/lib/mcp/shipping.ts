import { UNMARKED_UAT } from "@/lib/project/founder-copy";

export const SHIPPING_RULES = `你是 Tenth Project 的出貨助手。這把連線只對應一個專案。
這一輪裡的任務和驗收，直接做完，不要中途問使用者確認。
驗收時在本機打開 test_path 看結果，自己呼叫 update_uat_item 標成 passed 或 failed。你看不到伺服器截圖。不要叫使用者逐項回覆通過或失敗。
做完這一輪再呼叫 get_active_roadmap。只有 shipping.mustStop 是 true 時才停下來，把 shipping.nextStep.say 原文問使用者。
使用者回覆「確認」、「好」、「yes」或「confirm」才呼叫 start_next_sprint，confirmed 為 true。沒有這一次的確認，不要開下一輪。`;

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
  backlogCount?: number;
}) {
  const openTasks = (input.tasks ?? [])
    .filter((item) => isOpenTask(item.status))
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
  const unmarked = (input.uatItems ?? []).filter((item) => UNMARKED_UAT.has(item.status));
  const failed = (input.uatItems ?? []).filter((item) => item.status === "failed" || item.status === "reopened");
  const openBugCount = input.openBugCount ?? 0;
  const backlogCount = input.backlogCount ?? 0;
  const counts = {
    openTasks: openTasks.length,
    unmarkedUat: unmarked.length,
    failedUat: failed.length,
    openBugs: openBugCount,
    backlog: backlogCount,
  };
  const unmarkedUat = unmarked.map(({ id, title, status, test_path, expected_result }) => ({
    id,
    title,
    status,
    test_path: test_path ?? null,
    expected_result: expected_result ?? null,
  }));
  const openTaskBrief = openTasks.map(({ id, title, status }) => ({ id, title, status }));

  let phase: "build" | "waiting_for_uat" | "sprint_boundary" | "idle" = "idle";
  let mustStop = true;
  let nextStep: { say: string; onConfirm: string };
  let askUser: string;

  if (openTasks.length || unmarked.length) {
    phase = openTasks.length ? "build" : "waiting_for_uat";
    mustStop = false;
    const taskLine = openTasks.length ? `先做完未完成的任務，從「${openTasks[0].title}」開始。` : "";
    const uatLine = unmarked.length
      ? `還有 ${unmarked.length} 項驗收未標。在本機打開路徑自己看，呼叫 update_uat_item 標成 passed 或 failed。`
      : "";
    askUser = `${taskLine}${uatLine}做完再呼叫 get_active_roadmap。不要問使用者確認。`.trim();
    nextStep = { say: askUser, onConfirm: askUser };
  } else if (failed.length || openBugCount || backlogCount) {
    phase = "sprint_boundary";
    mustStop = true;
    nextStep = {
      say: "這一輪做完了。要開下一衝刺嗎？回覆「確認」就開始。",
      onConfirm: "呼叫 start_next_sprint，confirmed 為 true。拿到提示詞後把這一輪做完，途中不要再問確認。做完再呼叫 get_active_roadmap。",
    };
    askUser = nextStep.say;
  } else {
    phase = "idle";
    mustStop = true;
    nextStep = {
      say: "這一輪做完了，目前沒有下一輪要開。若要加新功能，用一句話說要做什麼。",
      onConfirm: "不要開下一輪。若使用者提出新功能，先復述那一句，等他回覆確認再開始做。",
    };
    askUser = nextStep.say;
  }

  return {
    phase,
    mustStop,
    counts,
    unmarkedUat,
    openTasks: openTaskBrief,
    askUser,
    nextStep,
  };
}
