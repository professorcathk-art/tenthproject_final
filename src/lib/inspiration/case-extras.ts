export type CaseExtra = {
  difficulty: 1 | 2 | 3 | 4 | 5;
  pitchDeckUrl?: string;
  clonePromptZh: string;
  clonePromptEn: string;
};

function brief(input: {
  name: string;
  site: string;
  loopZh: string;
  loopEn: string;
  screensZh: string;
  screensEn: string;
  avoidZh: string;
  avoidEn: string;
}): { zh: string; en: string } {
  return {
    zh: `# 規劃簡報：模仿 ${input.name} 的核心迴路（不是品牌本身）

你是產品教練，正在幫一位個人創作者用 Cursor Planning／ChatGPT／Codex 規劃 21 天 MVP。
不要使用對方的商標、視覺識別或專有數據。要模仿的是機制。

## 產品
官網：${input.site}
核心迴路：${input.loopZh}

## 限制
- 一個人、21 天、先打通最窄迴路
- 商業化與產品同時設計（免費體驗 → 付費解鎖）
- 為「魔法瞬間」與付款路徑各寫 1 則 UAT
- 技術棧克制：Next.js + 一個 LLM／視覺 API + 一個資料庫
- 不要自訓模型，除非我明確要求

## 必做畫面
${input.screensZh}

## 不要做
${input.avoidZh}

## 請先規劃、先別寫大段程式
1. 用 5 步重述核心迴路
2. 列出頁面、API、資料表
3. 寫出魔法瞬間與付款的驗收步驟（路徑 + 預期 DOM／API）
4. 拆 Day 1–7／8–14／15–21
5. 輸出可貼進 Cursor 的實作簡報（檔案 → 動作 → 驗收）

只問會卡住迴路的問題。`,
    en: `# Planning brief: imitate the core loop of ${input.name} (not the brand)

You are a product coach helping a solo founder plan a 21-day MVP in Cursor Planning, ChatGPT, or Codex.
Do not reuse trademarks, visual identity, or proprietary data. Imitate the mechanism.

## Product
Site: ${input.site}
Core loop: ${input.loopEn}

## Constraints
- One person, 21 days, narrowest loop first
- Design pricing with the product (free taste → paid unlock)
- Write one UAT for the magic moment and one for payment
- Small stack: Next.js + one LLM/vision API + one database
- Do not train a model unless I explicitly ask

## Must-have screens
${input.screensEn}

## Out of scope
${input.avoidEn}

## Plan first — do not dump production code yet
1. Restate the core loop in 5 steps
2. List pages, API routes, and tables
3. Write acceptance steps for the magic moment and payment (path + expected DOM/API)
4. Split Day 1–7 / 8–14 / 15–21
5. Output a Cursor-ready implementation brief (file → action → acceptance)

Ask questions only if they would block the loop.`,
  };
}

const calai = brief({
  name: "Cal AI",
  site: "https://www.calai.app/",
  loopZh: "拍照／掃條碼／打字 → 第三方視覺 API 估食物與份量 → 回傳熱量與巨量營養素 → 對照每日目標 → 訂閱解鎖繼續掃。",
  loopEn: "Photo, barcode, or text → third-party vision API estimates food and portion → calories + macros → daily goal → subscription unlocks more scans.",
  screensZh: "- 相機記一餐\n- 今日熱量儀表\n- 付費牆（月／年）\n- 歷史餐點",
  screensEn: "- Camera meal log\n- Today calorie dashboard\n- Paywall (month/year)\n- Meal history",
  avoidZh: "自訓視覺模型、完整營養資料庫、社交動態。",
  avoidEn: "Training a vision model, a full nutrition graph, or a social feed.",
});

const stealth = brief({
  name: "StealthWriter",
  site: "https://stealthwriter.ai/",
  loopZh: "貼上 AI 味很重的文章 → 選語氣／強度 → LLM 改寫得像人寫 → 對照輸出 → 額度用完就付費。",
  loopEn: "Paste AI-sounding draft → pick tone/strength → LLM humanizes it → compare output → pay when credits run out.",
  screensZh: "- 輸入／輸出對照編輯器\n- 語氣與強度控制\n- 額度與升級頁",
  screensEn: "- Side-by-side editor\n- Tone and strength controls\n- Credits + upgrade page",
  avoidZh: "宣稱「可過所有 AI 偵測」、瀏覽器外掛、企業 SSO。",
  avoidEn: "Claims about beating every detector, a browser extension, or enterprise SSO.",
});

const imagePrompt = brief({
  name: "Image Prompt",
  site: "https://image-prompt.org/",
  loopZh: "搜提示詞／範例圖 → 複製可跑的 prompt → （可選）連到生成模型試一張 → SEO 頁帶來流量。",
  loopEn: "Search prompts or example images → copy a runnable prompt → optional one-click generate → SEO pages bring traffic.",
  screensZh: "- 提示詞搜尋與分類\n- 單篇 SEO 頁（圖 + prompt + 複製）\n- 簡單收藏",
  screensEn: "- Prompt search and tags\n- SEO article page (image + prompt + copy)\n- Simple saves",
  avoidZh: "自建繪圖模型、社群動態、複雜帳號體系。",
  avoidEn: "Hosting an image model, a social feed, or a heavy account system.",
});

const humanai = brief({
  name: "HumanAI",
  site: "https://humanaiagent.com/",
  loopZh: "使用者交代目標 → Agent 規劃步驟並呼叫工具 → 卡住時把決策丟回給人 → 人批准後繼續 → 留下可追蹤的執行紀錄。",
  loopEn: "User states a goal → agent plans steps and calls tools → escalates a decision to a human when stuck → resumes after approval → leaves an audit trail.",
  screensZh: "- 任務inbox\n- Agent 步驟時間線\n- 人工批准抽屜\n- 工具呼叫紀錄",
  screensEn: "- Task inbox\n- Agent step timeline\n- Human-approval drawer\n- Tool-call log",
  avoidZh: "一次做通用自主員工、自訓權重、無人工閘門的全自動執行。",
  avoidEn: "A general autonomous employee, training weights, or fully unattended execution.",
});

const toyScout = brief({
  name: "Happy Toy Scout",
  site: "https://happytoyscout.com/",
  loopZh: "輸入地區 → 地圖看附近點位與最新回報 → 到現場後一鍵回報有／缺 → 其他人立刻看到時間戳。",
  loopEn: "Enter an area → map nearby spots and latest reports → one-tap in-stock/out-of-stock after a visit → others see the timestamp.",
  screensZh: "- 地圖 + 篩選\n- 點位詳情\n- 一鍵回報表單\n- 簡單排行／最近回報",
  screensEn: "- Map + filters\n- Spot detail\n- One-tap report form\n- Recent reports",
  avoidZh: "官方庫存 API、金流、原生 App。先做 web 地圖。",
  avoidEn: "Official inventory APIs, payments, or a native app. Ship a web map first.",
});

const clad = brief({
  name: "Clad Labs",
  site: "https://www.clad.sh/",
  loopZh: "開一個專案 → 把目標拆成多個 agent 任務 → 在同一工作區看 diff／終端機／預覽 → 人批准合併。",
  loopEn: "Open a project → split a goal into multi-agent tasks → watch diff/terminal/preview in one workspace → human approves the merge.",
  screensZh: "- 專案工作區\n- Agent 任務列\n- Diff 檢視\n- 批准／重跑",
  screensEn: "- Project workspace\n- Agent task rail\n- Diff view\n- Approve / rerun",
  avoidZh: "完整複製 Xcode／VS Code、自研編譯器、多租戶 IDE 雲。可先做 web 工作區。",
  avoidEn: "Cloning Xcode/VS Code, a custom compiler, or a multi-tenant cloud IDE. A web workspace is enough.",
});

const fambot = brief({
  name: "Fambot",
  site: "https://www.fambot.ai/",
  loopZh: "接上一個家庭共用收件匣（先用 Gmail 標籤模擬）→ Agent 整理活動／作業／預約 → 家長用一句話批准 → 寫回日曆或訊息。",
  loopEn: "Connect a shared family inbox (start with a Gmail label) → agent groups events/homework/appointments → a parent approves in one sentence → write back to calendar or chat.",
  screensZh: "- 連接信箱說明\n- 待批准卡片\n- 家庭時間線\n- 隱私開關（誰能看什麼）",
  screensEn: "- Inbox connect explainer\n- Approval cards\n- Family timeline\n- Privacy toggles",
  avoidZh: "一次接 WhatsApp 商業 API、兒童帳號、跨國合規。先做「一封信 → 一張卡片 → 一個批准」。",
  avoidEn: "WhatsApp Business, child accounts, or cross-border compliance on day one. Ship email → card → approve.",
});

const series = brief({
  name: "Series",
  site: "https://www.series.so/",
  loopZh: "使用者說想認識哪種人 → Agent 在名單裡找雙向同意的配對 → 開一個介紹對話 → 雙方都點頭才交換聯絡。",
  loopEn: "User says who they want to meet → agent finds a double-opt-in match → starts an intro thread → contacts are shared only after both accept.",
  screensZh: "- 我在找什麼\n- 配對卡片\n- 介紹對話\n- 雙向同意後的聯絡方式",
  screensEn: "- What I’m looking for\n- Match cards\n- Intro thread\n- Contact share after double opt-in",
  avoidZh: "真的掛上 iMessage／短信通道（平台風險高）。先做 web／WhatsApp 模擬。",
  avoidEn: "Shipping on real iMessage/SMS first (high platform risk). Simulate the loop on web or WhatsApp.",
});

const poke = brief({
  name: "Poke",
  site: "https://poke.com/",
  loopZh: "在一個聊天視窗交代任務 → 路由到合適的模型／工具 → 回傳可用結果 → 記住偏好 → 進階任務才付費。",
  loopEn: "Give a job in one chat thread → route to the right model/tool → return a usable result → remember preferences → charge for advanced jobs.",
  screensZh: "- 單一對話 inbox\n- 工具呼叫氣泡\n- 記憶／偏好\n- 升級方案",
  screensEn: "- Single chat inbox\n- Tool-call bubbles\n- Memory / preferences\n- Upgrade plan",
  avoidZh: "一次接 Apple Messages 正式通道、自訓模型、開放式瀏覽器代理。",
  avoidEn: "Official Apple Messages access, training a model, or an open-ended browser agent on day one.",
});

const gojiberry = brief({
  name: "Gojiberry",
  site: "https://www.gojiberry.ai/",
  loopZh: "貼上官網或 ICP → 找出有意圖訊號的名單 →  enrichment → 寫第一封個人化訊息 → 追蹤回覆／預約。",
  loopEn: "Paste a site or ICP → find people showing intent → enrich → draft the first personalized note → track replies / bookings.",
  screensZh: "- ICP 設定\n- 意圖名單\n- 訊息草稿\n- 回覆／預約看板",
  screensEn: "- ICP setup\n- Intent list\n- Message drafts\n- Reply / booking board",
  avoidZh: "一次接齊 LinkedIn 官方 API、全自動亂槍發送、買全網資料湖。先做「20 個高意圖人 + 人工按下發送」。",
  avoidEn: "Full LinkedIn automation, blast sending, or buying a data lake. Ship 20 high-intent people + human send.",
});

export const CASE_EXTRAS: Record<string, CaseExtra> = {
  calai: { difficulty: 3, clonePromptZh: calai.zh, clonePromptEn: calai.en },
  stealthwriter: { difficulty: 3, clonePromptZh: stealth.zh, clonePromptEn: stealth.en },
  "image-prompt-org": { difficulty: 2, clonePromptZh: imagePrompt.zh, clonePromptEn: imagePrompt.en },
  humanaiagent: { difficulty: 5, clonePromptZh: humanai.zh, clonePromptEn: humanai.en },
  "happy-toy-scout": { difficulty: 2, clonePromptZh: toyScout.zh, clonePromptEn: toyScout.en },
  "clad-labs": { difficulty: 4, clonePromptZh: clad.zh, clonePromptEn: clad.en },
  fambot: { difficulty: 4, clonePromptZh: fambot.zh, clonePromptEn: fambot.en },
  "series-so": {
    difficulty: 4,
    pitchDeckUrl: "https://www.businessinsider.com/series-yale-students-seed-pitch-deck-social-network-imessage-2026-5",
    clonePromptZh: series.zh,
    clonePromptEn: series.en,
  },
  poke: { difficulty: 4, clonePromptZh: poke.zh, clonePromptEn: poke.en },
  "gojiberry-ai": { difficulty: 4, clonePromptZh: gojiberry.zh, clonePromptEn: gojiberry.en },
};
