import { UNMARKED_UAT } from "@/lib/project/founder-copy";

export const SHIPPING_RULES = `你是 Tenth Project 的出貨助手。這把連線只對應一個專案。
開始改程式之前，先問使用者要不要出貨。沒有明確同意，不要改程式。
同意之後先呼叫 get_active_roadmap，並遵守回傳的 shipping：
phase 是 build 時，才照任務的 technical_checklist 寫程式。做完呼叫 report_build_status，把做完的任務用 update_task_status 標成 completed，把你測過或使用者確認過的驗收用 update_uat_item 標成 passed 或 failed。
phase 是 waiting_for_uat、sprint_boundary 或 idle 時，立刻停下來，把 shipping.askUser 問使用者。不要繼續改程式，也不要自己開下一輪。
只有使用者明確說要繼續下一衝刺，才呼叫 start_next_sprint，而且 confirmed 必須是 true。沒有點名的新功能不要放進 task_ids。
每一輪結束都要再問一次。不要連續開很多輪。`;

type Item = { id: string; title: string; status: string };

function isOpenTask(status: string) {
  return status !== "done" && status !== "completed";
}

export function shippingCue(input: {
  tasks?: Item[];
  uatItems?: Item[];
  openBugCount?: number;
}) {
  const openTasks = (input.tasks ?? []).filter((item) => isOpenTask(item.status));
  const unmarked = (input.uatItems ?? []).filter((item) => UNMARKED_UAT.has(item.status));
  const failed = (input.uatItems ?? []).filter((item) => item.status === "failed" || item.status === "reopened");
  const openBugCount = input.openBugCount ?? 0;
  const counts = {
    openTasks: openTasks.length,
    unmarkedUat: unmarked.length,
    failedUat: failed.length,
    openBugs: openBugCount,
  };

  if (openTasks.length) {
    return {
      phase: "build" as const,
      mustStop: false,
      counts,
      unmarkedUat: unmarked.map(({ id, title, status }) => ({ id, title, status })),
      openTasks: openTasks.map(({ id, title, status }) => ({ id, title, status })),
      askUser:
        "若這次對話還沒得到同意，先問：要我照目前的路線圖出貨嗎？同意之後再改程式。已經同意就做完開放中的任務，做完要停下來，不要自己開下一衝刺。",
    };
  }

  if (unmarked.length) {
    const lines = unmarked.map((item) => `「${item.title}」`).join("、");
    return {
      phase: "waiting_for_uat" as const,
      mustStop: true,
      counts,
      unmarkedUat: unmarked.map(({ id, title, status }) => ({ id, title, status })),
      openTasks: [],
      askUser: `這一輪先停住。這些驗收還沒有通過或失敗，所以不能開下一衝刺：${lines}。請告訴我每一項是通過還是失敗。`,
    };
  }

  if (failed.length || openBugCount) {
    return {
      phase: "sprint_boundary" as const,
      mustStop: true,
      counts,
      unmarkedUat: [],
      openTasks: [],
      askUser:
        "這一輪可以收了。要我繼續出貨下一衝刺嗎？下一輪會帶上失敗的驗收和未解錯誤。新功能要你點名，我不會自己加。你同意之後我才會開始。",
    };
  }

  return {
    phase: "idle" as const,
    mustStop: true,
    counts,
    unmarkedUat: [],
    openTasks: [],
    askUser: "目前沒有未做完的任務，也沒有失敗的驗收。要繼續的話，請告訴我下一輪要做什麼。我不會自己加新功能。",
  };
}
