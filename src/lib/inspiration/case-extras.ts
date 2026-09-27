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

const raven = brief({
  name: "Raven",
  site: "https://www.withraven.ai/",
  loopZh: "上傳一張沒有 GPS 的照片 → 視覺模型讀建築／植被／路牌 → 回傳地點候選與信心 → 免費次數用完再導向 App 或付費。",
  loopEn: "Upload a photo with no GPS → vision model reads buildings/plants/signs → ranked places + confidence → free tries, then app or paid.",
  screensZh: "- 拖放上傳\n- 地圖與候選地點\n- 信心與判讀依據\n- 升級／下載 App",
  screensEn: "- Drag-and-drop upload\n- Map + candidates\n- Confidence + rationale\n- Upgrade / app",
  avoidZh: "人臉辨識、大規模存圖、一開始就做執法後台。先做「一張圖 → 一個城市」。",
  avoidEn: "Face ID, storing every photo, or an agency console on day one. Ship photo → city.",
});

const thetawave = brief({
  name: "ThetaWave",
  site: "https://thetawave.ai/",
  loopZh: "上傳講義／錄音 → 抽出知識點 → 依錯題生成筆記與字卡 → 出一組測驗 → 記下盲點再複習。",
  loopEn: "Upload notes or audio → extract concepts → notes and cards from wrong answers → a quiz → restudy the gaps.",
  screensZh: "- 上傳教材\n- 筆記／字卡\n- 測驗\n- 錯題本",
  screensEn: "- Upload\n- Notes / cards\n- Quiz\n- Missed-question list",
  avoidZh: "一次做全校 LMS、直播課、學分認證。先打通一份 PDF → 十張字卡。",
  avoidEn: "A campus LMS, live class, or credits. Ship one PDF → ten cards.",
});

const wokHei = brief({
  name: "鑊氣",
  site: "https://apps.apple.com/hk/app/%E9%91%8A%E6%B0%A3/id6766081667",
  loopZh: "僱主用中文點一道家常菜 → 自動譯成外傭母語步驟 → 標清真／禁忌 → WhatsApp 傳一週菜單。",
  loopEn: "Employer picks a home dish in Chinese → steps in the helper’s language → diet tags → WhatsApp the week’s menu.",
  screensZh: "- 角色選擇（僱主／助理）\n- 菜式列表與過濾\n- 雙語步驟\n- 一週菜單分享",
  screensEn: "- Role picker\n- Dish list + filters\n- Bilingual steps\n- Weekly share",
  avoidZh: "外送、食材電商、完整社交網路。先做 50 道最高頻菜。",
  avoidEn: "Delivery, grocery checkout, or a social network. Ship the 50 most-cooked dishes.",
});

const hideOrDie = brief({
  name: "Hide or Die",
  site: "https://www.roblox.com/games/18799085098",
  loopZh: "配對進房 → 隨機分工躲藏或追捕 → 5–8 分鐘一局 → 解鎖外觀／再來一局。",
  loopEn: "Match into a room → random hider or seeker → 5–8 minutes → unlock a skin / queue again.",
  screensZh: "- 大廳／好友\n- 一局遊玩\n- 結算與外觀店",
  screensEn: "- Lobby / friends\n- One match\n- Results + shop",
  avoidZh: "自建全球伺服器、複雜天賦樹、3A 畫面。先在現成 UGC 平台做最小規則。",
  avoidEn: "Your own global netcode, perk trees, or AAA art. Smallest rules on an existing UGC platform.",
});

const nasCom = brief({
  name: "Nas.com",
  site: "https://nas.com/",
  loopZh: "拍一張產品照 → AI 生成落地頁與文案 → 可選投放廣告 → WhatsApp／Telegram 收款。",
  loopEn: "Photograph a product → AI landing page and copy → optional ads → checkout in WhatsApp/Telegram.",
  screensZh: "- 上傳相片\n- 生成的店鋪預覽\n- 廣告草稿\n- 社群／結帳連結",
  screensEn: "- Photo upload\n- Generated store preview\n- Ad draft\n- Community / checkout link",
  avoidZh: "一次接齊全球物流與自建廣告平台。先做「相片 → 一頁能收款」。",
  avoidEn: "Global logistics and a custom ad network. Ship photo → one page that can take money.",
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

const wayback = brief({
  name: "Wayback Machine",
  site: "https://web.archive.org/",
  loopZh: "使用者貼上一個網址，看到這個網頁以前長什麼樣子。對手改了定價頁，就通知他。",
  loopEn: "A person pastes a URL and sees how that page used to look. When a competitor changes a pricing page, they get a notice.",
  screensZh: "- 貼網址\n- 依日期看舊版\n- 改動通知",
  screensEn: "- Paste a URL\n- Browse old dates\n- Change notice",
  avoidZh: "先不要存整個網路。只盯一種會改的頁面，例如對手的定價頁。",
  avoidEn: "Do not archive the whole web. Watch one kind of page, such as a competitor’s pricing page.",
});

const today = brief({
  name: "Today",
  site: "https://today.ai/",
  loopZh: "使用者用一句話交代今天要做的事。行程被打亂時，他只要確認或拒絕，剩下的事就改到明天早上。",
  loopEn: "A person states today’s plan in one sentence. When the day breaks, they confirm or reject, and the rest moves to tomorrow morning.",
  screensZh: "- 今天的清單\n- 一句話交代\n- 確認或拒絕",
  screensEn: "- Today’s list\n- One spoken instruction\n- Confirm or reject",
  avoidZh: "先不要做一個什麼都能排的人生助理。先做一件你自己每天會用的事，例如健身或讀書。",
  avoidEn: "Do not build a life assistant. Start with one daily plan you already keep, such as workouts or reading.",
});

const plaid = brief({
  name: "Plaid",
  site: "https://plaid.com/",
  loopZh: "使用者在 App 裡點連接帳戶，選一家機構，登入，資料就出現。做 App 的人只接這一個入口。",
  loopEn: "A person taps connect account, picks an institution, signs in, and the data appears. The app builder connects once.",
  screensZh: "- 選機構\n- 登入\n- 接上之後的結果\n- 給開發者試用的假資料",
  screensEn: "- Pick an institution\n- Sign in\n- Connected result\n- Fake data for a test",
  avoidZh: "沒有準備花好幾年，就不要做銀行，也不要保管別人的網銀密碼。先做一種大家都在抱怨的接法，例如租約、病歷或貨況。",
  avoidEn: "Do not connect banks or store banking passwords unless you will spend years on it. Start with one messy handoff, such as leases, records, or shipment status.",
});

const ash = brief({
  name: "Ash",
  site: "https://www.slingshot.xyz/",
  loopZh: "使用者來談心情。產品先問一句，不立刻給三個步驟。危險的時候把人交給真人。",
  loopEn: "A person comes to talk about how they feel. The product asks one question before giving steps, and hands them to a human when it is dangerous.",
  screensZh: "- 第一眼寫明這不是醫生\n- 對話\n- 什麼情況必須轉給真人",
  screensEn: "- First screen says this is not a doctor\n- Conversation\n- Rules for handing off to a human",
  avoidZh: "心理師還沒有一起看過這些話之前，不要寫這是治療。商店頁寫「這是一個可以說話的伴」。",
  avoidEn: "Do not call it therapy before a clinician has reviewed the words. The store page says it is a companion you can talk to.",
});

const astrotalk = brief({
  name: "Astrotalk",
  site: "https://astrotalk.com/",
  loopZh: "使用者選一位已經審核過的師傅，先付一分鐘，用文字、語音或視訊問一個問題。問完還能買一件相關的東西。",
  loopEn: "A person picks a reviewed practitioner, pays for one minute, and asks by text, voice, or video. Afterward they can buy one related item.",
  screensZh: "- 師傅清單和評價\n- 按分鐘計費\n- 問答\n- 問完之後的商品",
  screensEn: "- Practitioner list and reviews\n- Per-minute price\n- The question\n- A product after the session",
  avoidZh: "先不要做占星本身。先找一種線下很分散、人們願意為了焦慮付錢的服務，把第一次開口變得不那麼難。",
  avoidEn: "Do not start by building astrology. Pick a scattered offline service people already pay for when they are anxious, and make the first question easy.",
});

const river = brief({
  name: "River",
  site: "https://river.ai/",
  loopZh: "客戶交出一份自己的文件。同一個問題問兩次，第二次真的比較準。調好的那一份留在客戶手上。",
  loopEn: "A customer hands over one of their own documents. The same question is better the second time. The tuned copy stays with the customer.",
  screensZh: "- 上傳一份文件\n- 調之前和調之後的回答\n- 誰留下那一份模型",
  screensEn: "- Upload one document\n- Answer before and after\n- Who keeps the tuned model",
  avoidZh: "先不要租機器，也不要從零訓練模型。用現成的服務，拿一份真實文件證明回答變準了。",
  avoidEn: "Do not rent a cluster or train from scratch. Use an existing service and prove the answer improved on one real document.",
});

const fish = brief({
  name: "Fish Audio",
  site: "https://fish.audio/",
  loopZh: "使用者上傳一小段自己的聲音，打一段字，再說「這句輕一點」。它就用那個聲音念出來。",
  loopEn: "A person uploads a short clip of their voice, types a line, and says “softer.” It speaks in that voice.",
  screensZh: "- 上傳聲音\n- 輸入文字\n- 用一句話改語氣\n- 聽結果",
  screensEn: "- Upload a voice\n- Type the line\n- Change the tone in one sentence\n- Listen",
  avoidZh: "先不要做一排專業滑桿。語氣用一句人話控制。",
  avoidEn: "Do not start with a row of expert sliders. Control the tone with one spoken sentence.",
});

const tripo = brief({
  name: "Tripo",
  site: "https://www.tripo3d.ai/",
  loopZh: "使用者打一句話或上傳一張照片，得到一個可以轉的立體模型。這個檔案要能放進他們已經在用的軟體裡改。",
  loopEn: "A person types a sentence or uploads a photo and gets a 3D model they can turn. The file must open in the software they already use.",
  screensZh: "- 輸入一句話或上傳照片\n- 可以旋轉的模型\n- 下載後放進設計軟體",
  screensEn: "- A sentence or a photo\n- A model you can rotate\n- A download that opens in design software",
  avoidZh: "先不要什麼都能生成。先把一種東西做順，例如鞋子或一個角色，而且改得動，不用整份重畫。",
  avoidEn: "Do not generate everything. Make one object well, such as a shoe or a character, and make sure it can be edited.",
});

const peec = brief({
  name: "Peec",
  site: "https://peec.ai/",
  loopZh: "行銷人員每週看到：自己的品牌在 ChatGPT 的回答裡有沒有被提到、排第幾、語氣正不正。這週可以跟上週比較。",
  loopEn: "Each week a marketer sees whether their brand was mentioned in ChatGPT, where it ranked, and whether the tone was positive. This week compares with last week.",
  screensZh: "- 十個常見問題\n- 有沒有被提到\n- 跟上一週比較\n- 可以換成代理商招牌的報告",
  screensEn: "- Ten common questions\n- Whether you were mentioned\n- Comparison with last week\n- A report an agency can rebrand",
  avoidZh: "先不要保證排名會上升。先把「這週有沒有出現」量出來，而且能夠按週比較。",
  avoidEn: "Do not promise a better rank. First measure whether you appeared this week, and make the weeks comparable.",
});

const grasp = brief({
  name: "Grasp",
  site: "https://www.grasp-ai.com/",
  loopZh: "分析師交出一個研究題目，拿回來的是他們已經在用的 Excel 和簡報，不用再複製貼上。",
  loopEn: "An analyst submits a research question and gets back the Excel and the slides they already use, without copying and pasting.",
  screensZh: "- 輸入題目\n- 下載試算表\n- 下載簡報",
  screensEn: "- Enter the question\n- Download the spreadsheet\n- Download the slides",
  avoidZh: "先不要做一個聊天窗。先把一種表做準，直接交出那個檔案。",
  avoidEn: "Do not ship another chat window. Make one spreadsheet accurate and deliver that file.",
});

const puppy = brief({
  name: "Puppy Sphere",
  site: "https://thepuppysphere.com/",
  loopZh: "客人預約一個時段，到店裡跟小狗一起上課，結束前拍照。收入來自這一堂課。客人會再來，再開下一間。",
  loopEn: "A guest books a slot, takes a class with puppies, and gets a photo. Revenue is the class fee. Repeat guests come before the next location opens.",
  screensZh: "- 預約時段\n- 到店體驗\n- 這一堂課的收費",
  screensEn: "- Book a slot\n- The in-person hour\n- Payment for that class",
  avoidZh: "課表還沒有穩定、客人還沒有再來之前，不要先做 App。先把第一間店的動線和安全做完。",
  avoidEn: "Do not build an app before the schedule is steady and guests come back. Finish the flow and the safety of the first location.",
});

const rillet = brief({
  name: "Rillet",
  site: "https://www.rillet.com/",
  loopZh: "每一筆交易進來就先分類。人只核對那些對不上的交易，點頭之後才入帳。帳每天都在收，不用等到月底才一次趕完。",
  loopEn: "Each transaction is categorized as it arrives. A person reviews only the ones that do not match, and it posts after they approve. The books close a little every day.",
  screensZh: "- 交易清單\n- 建議的分類\n- 人點頭之後入帳\n- 這個月還沒收完的項目",
  screensEn: "- Transaction list\n- Suggested category\n- Post after approval\n- What is still open this month",
  avoidZh: "第一天不要說要換掉整套會計系統。先把一種每個月都要重做的帳，做成一份人可以核對的草稿。",
  avoidEn: "Do not open by replacing the whole accounting system. Turn one monthly entry into a draft a person can approve.",
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
  "raven-geospy": { difficulty: 4, clonePromptZh: raven.zh, clonePromptEn: raven.en },
  "thetawave-ai": { difficulty: 3, clonePromptZh: thetawave.zh, clonePromptEn: thetawave.en },
  "wok-hei": { difficulty: 2, clonePromptZh: wokHei.zh, clonePromptEn: wokHei.en },
  "hide-or-die": { difficulty: 3, clonePromptZh: hideOrDie.zh, clonePromptEn: hideOrDie.en },
  "nas-com": { difficulty: 4, clonePromptZh: nasCom.zh, clonePromptEn: nasCom.en },
  "wayback-machine": { difficulty: 2, clonePromptZh: wayback.zh, clonePromptEn: wayback.en },
  "today-ai": { difficulty: 3, clonePromptZh: today.zh, clonePromptEn: today.en },
  plaid: { difficulty: 4, clonePromptZh: plaid.zh, clonePromptEn: plaid.en },
  "slingshot-ai": { difficulty: 4, clonePromptZh: ash.zh, clonePromptEn: ash.en },
  astrotalk: { difficulty: 3, clonePromptZh: astrotalk.zh, clonePromptEn: astrotalk.en },
  "river-ai": { difficulty: 5, clonePromptZh: river.zh, clonePromptEn: river.en },
  "fish-audio": { difficulty: 3, clonePromptZh: fish.zh, clonePromptEn: fish.en },
  "tripo-ai": { difficulty: 4, clonePromptZh: tripo.zh, clonePromptEn: tripo.en },
  "peec-ai": { difficulty: 3, clonePromptZh: peec.zh, clonePromptEn: peec.en },
  grasp: { difficulty: 3, clonePromptZh: grasp.zh, clonePromptEn: grasp.en },
  "puppy-sphere": { difficulty: 2, clonePromptZh: puppy.zh, clonePromptEn: puppy.en },
  rillet: { difficulty: 4, clonePromptZh: rillet.zh, clonePromptEn: rillet.en },
};
