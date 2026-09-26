export const UNMARKED_UAT = new Set(["not_started", "in_progress", "needs_review"]);

const KNOWN: Record<string, { zh: string; en: string; zhBody: string; enBody: string }> = {
  "Skeleton for async panels": {
    zh: "⏳ 資料載入時，先看到等待的樣子",
    en: "Show a waiting state while data loads",
    zhBody: "資料還沒回來的時候，畫面不應該空白。這一項會先放上灰色占位，讓人知道系統還在準備。",
    enBody: "While data is still loading, the screen should not go blank. This shows a placeholder so people can tell the page is working.",
  },
  "Error boundary for fetch 500": {
    zh: "⚠️ 出錯時顯示說明，並可以再試一次",
    en: "Show an explanation and a retry when something fails",
    zhBody: "如果伺服器出錯，使用者不應該只看到白畫面。這一項會改成顯示說明，並讓人再試一次。",
    enBody: "If the server fails, people should see an explanation and a way to try again, not a blank screen.",
  },
};

export function founderCard(
  item: { title: string; description?: string | null },
  locale: "zh" | "en",
) {
  const known = KNOWN[item.title.trim()];
  if (known) {
    return {
      title: locale === "zh" ? known.zh : known.en,
      summary: locale === "zh" ? known.zhBody : known.enBody,
    };
  }
  const description = item.description?.trim() ?? "";
  const technical = /Target:|src\/app|className=|error\.tsx|Skeleton/i.test(description);
  if (!technical) return { title: item.title, summary: description };
  return {
    title: item.title,
    summary:
      locale === "zh"
        ? "這是一項技術修改。畫面上先看這句話就好，程式步驟會寫進 Cursor 的提示詞。"
        : "This is a technical change. The coding steps go into the Cursor prompt.",
  };
}

export function technicalStepsFrom(description?: string | null) {
  const text = description?.trim() ?? "";
  if (!text) return [];
  if (!/Target:|Action:|src\/app|className=/i.test(text)) return [];
  return [text];
}
