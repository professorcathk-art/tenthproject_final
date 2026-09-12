import { CASE_SEED_MARKER } from "@/lib/inspiration/constants";
import type { CaseHighlight, CaseStudyCategory } from "@/types/platform";

export type SeedCase = {
  id: string;
  title: string;
  slug: string;
  category: CaseStudyCategory;
  categories: CaseStudyCategory[];
  website: string;
  highlights: CaseHighlight[];
  summaryZh: string;
  summaryEn: string;
  bodyZh: string;
  bodyEn: string;
};

export const BATCH2_CASES: SeedCase[] = [
  {
    id: "44444444-4444-4444-4444-444444444411",
    title: "Happy Toy Scout",
    slug: "happy-toy-scout",
    category: "tooling",
    categories: ["tooling", "platform"],
    website: "https://happytoyscout.com/",
    highlights: [
      { zh: "10 天造訪用戶", en: "Users in 10 days", value: "127,000+" },
      { zh: "累計社群回報", en: "Community reports", value: "57,000+" },
      { zh: "估算節省金額", en: "Est. money saved", value: "$16.5M–$32.9M" },
      { zh: "外部融資", en: "Outside funding", value: "$0" },
    ],
    summaryZh:
      "白天工程師、晚上記玩具：父親為幫女兒搜集盲盒，寫出這張「麥當勞玩具地圖」。10 天湧入 12.7 萬用戶，幫全美玩家省下逾 1,600 萬美金與 60 萬小時。",
    summaryEn:
      "A software engineer spent nights mapping Happy Meal toys for his daughters. In 10 days the free map pulled in 127,000 users and, by the founder’s model, saved U.S. collectors more than $16M and 600,000 hours.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Happy Toy Scout](https://happytoyscout.com/) 是 2026 年 8 月上線的免費獨立地圖。創辦人 Brian 白天是正職軟體工程師，晚上則是為了幫兩個女兒蒐集美國麥當勞熱門聯名「Hello Kitty & Friends × Godzilla」Happy Meal 玩具的父親。他發現官方 App 完全不提供各分店具體的玩具款式庫存，資訊極度碎片化，散落在 Reddit、Facebook 與聊天群組裡。

Brian 用 3 天寫出 MVP：讓全美玩家用郵遞區號與地圖，即時查看並回報近 14,000 家麥當勞門市的玩具出沒、缺貨與換購政策。這不是麥當勞官方 API，而是純靠 crowdsourcing（社群去中心化回報）驅動的動態地圖。

## 痛點

盲盒與限量玩具集郵的痛，卡在「最後一哩路」的資訊黑洞：麥當勞官方只告訴你這家有賣 Happy Meal，卻不說今天給的是 8 款裡的哪一款。玩家與家長為了凑齊整套，往往要盲買十幾份餐、或開車跑半個城市，燒掉汽油、時間，還被迫吃下幾十份無效套餐。

對獨立開發者來說，傳統思維很容易掉進「沒有官方 API 就做不成即時庫存」的陷阱。Happy Toy Scout 證明：只要痛點夠尖、情緒價值夠高，使用者很願意自己當數據來源，用社群回報取代企業級串接。

## 方案

產品流程極短：輸入 ZIP Code 或指定玩具角色 → 地圖上看到周邊門市與最新時間戳 → 到店消費後「一鍵回報」庫存與政策（能不能單買玩具、能不能指定款）→ 再自發分享到社群。

為了扛流量，Brian 在上線前 10 天做了 122 次部署。他重構架構：把全美近 14,000 間門市經緯度快取起來、導入動態視口渲染（Dynamic Viewport Rendering），並優化目標玩具的篩選查詢，讓萬人同時在線時地圖仍然低延遲。商業模式不上鎖、不硬推訂閱，靠 Buy Me a Coffee / Venmo 的微額贊助補伺服器成本。

## 成功故事與成功之道

公開時間線（綜合 Brian 在官網發布的《10-Day Review》、《About the Data》，以及 Reddit／各地社群討論）：

- **2026 年 8 月中旬：** 配合全美麥當勞「Hello Kitty × Godzilla」開跑上線 MVP，前 3 天完成 80% 核心功能。
- **上線 10 天內（2026 年 9 月 5 日）：** 獨立用戶突破 127,000、頁面瀏覽 678,000 次、站內互動逾 200 萬次，收集超過 40,000 筆實地回報，平均停留 5 分 04 秒。
- **上線 3 週內：** 累計社群回報突破 57,000 筆，涵蓋全美 41 州、超過 1,500 間門市。
- **影響力模型：** 依 Brian 計算，該站幫玩家省下約 63 萬至 137 萬小時的無謂車程與排隊，避免 190 萬至 344 萬份重複餐點，估計為消費者省下 1,650 萬至 3,290 萬美元。

成功之道是三個增長引擎疊在一起：

1. **搭上超級文化熱點。** Sanrio 與哥吉拉聯名有極強社交屬性與稀缺性，產品卡在需求最高峰切入，天然會爆。
2. **Reddit 與垂直社群的病毒散播。** 沒花一毛廣告費，直接在 r/Hawaii、r/kidsmeal、r/GODZILLA、r/HelloKitty 以及各大城市版貼地圖連結，解決版裡反覆出現的「哪裡還有 #6 Cinnamoroll」，很快變成收藏者的預設工具。
3. **把數據寫成新聞。** Brian 主動發表「前 72 小時社群數據報告」（例如 My Melody 佔回報 23.3%，頭號角色 Hello Kitty 反而只有 9.0% 掉落率），把去中心化回報變成論壇會轉發的研究短報。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| 10 天造訪用戶 | 127,000 人 | 官方《10-Day Review》（GA4） |
| 10 天頁面瀏覽 | 678,000 PV | 官方《10-Day Review》 |
| 10 天站內互動 | 2,000,000+ 次 | 官方《10-Day Review》 |
| 累積社群回報 | 57,000+ 筆（1,500+ 門市、41 州） | 官網即時快照 |
| 平均停留時間 | 5 分 04 秒 | 官方《10-Day Review》 |
| 估算節省時間 | 630,000–1,376,000 小時 | 官方影響力模型 |
| 估算節省金額 | $1,650 萬–$3,290 萬 | 官方影響力模型 |
| 系統部署次數 | 10 天內 122 次 | 創辦人開發紀錄 |
| 外部融資 | $0（自籌／側邊專案） | 官方公開頁 |

數字是 2026 年 8–9 月活動期間，創辦人公開的 GA4 與社群統計快照。

## 普通人如何複製

本質不是再抄一張「麥當勞地圖」，而是複製「熱點快閃型 crowdsourcing」：

- **找高焦慮、高頻率、官方不給細節的短期熱點。** 例如寶可夢卡牌開賣庫存、演唱會周邊排隊、限量球鞋首發、災後缺貨地圖。
- **不要等 API，讓使用者成為數據庫。** 資訊嚴重不對稱時，介面夠順，大家很樂意「順手回報」換整體透明度。
- **MVP 必須在 3 天內上線。** 文化熱點的生命以「週」計算，80% 功能成立就該發布，剩下 20% 在飛機飛行途中換引擎。
- **深嵌已有社群。** 去痛點最集中的 Subreddit／社團／Discord，而不是自己再蓋一個社群。
- **把去中心化數據寫成新聞。** 收集到的數字本身就是最好的 PR。

## 創業者與矽谷視角

Paul Graham 常提醒要 *do things that don't scale*，以及先解決一個極度具體的個人痛苦。Happy Toy Scout 是經典的「工程師父親為了家務痛點做出爆款」。機構投資人通常會因為快閃專案生命週期短、缺少長期訂閱 LTV 而略過；對獨立開發者，這展極致的產品敏捷與流量捕捉。

真正的護城河不是技術壁壘，而是**上市速度與極低獲客成本（CAC = $0）**。Brian 這套「門市地圖 + 動態視口快取 + 社群回報 + 數據報告」，可以套到下一次寶可夢、BT21 或 Squishmallows 全美熱潮。把快閃地圖模組化，隨時準備接下一次大眾消費狂熱，正是 solo founder 在大公司看不上的夾縫裡，做出社會影響力與個人成就感的方法。
`,
    bodyEn: `
## What the company does

[Happy Toy Scout](https://happytoyscout.com/) is a free map that launched in August 2026. Founder Brian is a full-time software engineer by day and, at night, a dad hunting the U.S. McDonald’s Hello Kitty & Friends × Godzilla Happy Meal toys for his two daughters. The official app never says which of the eight toys a store is handing out. That information lived in Reddit, Facebook, and group chats.

He built the MVP in three days: look up ~14,000 restaurants by ZIP and map, then report sightings, sell-outs, and whether the store will sell a toy without a meal. There is no official McDonald’s API. The database is the crowd.

## Pain

Collectors hit an last-mile information black hole. Headquarters will tell you a store sells Happy Meals, not which character is in the bag. Parents drive across town or buy a dozen meals to finish a set.

The builder trap is “no official API, so no real-time inventory tool.” This product shows the opposite: if the pain is sharp, people will become the sensors.

## Approach

Type a ZIP or pick a character → see nearby stores and timestamps → one-tap report after a visit → share into the groups that were already asking. Brian shipped 122 deploys in the first ten days, cached store coordinates, and added dynamic viewport rendering so the map stayed fast with thousands of people on it. No paywall. Server costs are covered by Buy Me a Coffee / Venmo.

## Story and why it worked

- Mid-August 2026: MVP lands with the national promo; 80% of the core in three days.
- By 5 September (day 10): 127,000 users, 678,000 pageviews, 2M+ interactions, 40,000+ field reports, 5:04 average session.
- By week three: 57,000+ reports across 41 states and 1,500+ stores.
- Founder impact model: 630k–1.38M hours and $16.5M–$32.9M not wasted on extra meals and driving.

Three engines stacked: cultural hype, posting the map into the Subreddits already asking “where is #6 Cinnamoroll,” and publishing drop-rate reports that people forwarded as news.

## Results

| Metric | Public / estimated | Source |
| --- | --- | --- |
| Users in 10 days | 127,000 | Founder *10-Day Review* (GA4) |
| Pageviews in 10 days | 678,000 | Same |
| Reports | 57,000+ | Site snapshot |
| Est. money saved | $16.5M–$32.9M | Founder model |
| Outside funding | $0 | Public pages |

## How an ordinary builder copies this

Copy pop-up crowdsourcing, not a McDonald’s clone. Find a short, high-anxiety spike where official data is coarse. Ship in days. Make reporting shorter than a Reddit post. Publish the numbers as a story.

## Founder / Silicon Valley read

VCs often skip pop-up tools for short LTV. Indie hackers should see time-to-market and $0 CAC. The reusable asset is the module — store points, viewport map, report, short data story — ready for the next Sanrio or Pokémon drop.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444412",
    title: "Clad Labs / Chad IDE",
    slug: "clad-labs",
    category: "tooling",
    categories: ["tooling", "saas"],
    website: "https://www.cladlabs.ai/",
    highlights: [
      { zh: "外部融資", en: "Funding", value: "$500K (YC)" },
      { zh: "團隊規模", en: "Team", value: "2 人（舊金山）" },
      { zh: "定價", en: "Pricing", value: "$0 / $15 / $40" },
      { zh: "節省切換時間", en: "Switching saved", value: "~15 分鐘／小時" },
    ],
    summaryZh:
      "首創「Brainrot 爛網頁」AI 寫程式編輯器：舊金山兩人團隊解決等 AI 時的微破裂注意力，拿下 YC 50 萬美元，幫工程師每小時省下約 15 分鐘的切換消耗。",
    summaryEn:
      "A two-person San Francisco team built Chad, the “brainrot IDE”: keep short video inside the editor during the 1–5 minutes an agent is thinking, then snap you back. YC put in $500K; early testers said they saved about 15 minutes an hour.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Clad Labs](https://www.cladlabs.ai/)（cladlabs.ai / useclad.ai）由 Richard Wang（Caltech 電腦科學、前 AI 研究員）與 Kevin Le（UIUC、前 Meta 工程師）於 2025 年在舊金山創立，入選 Y Combinator F25，拿到 50 萬美元種子輪。

核心產品叫 **Chad IDE**，團隊戲稱「首款 Brainrot IDE」。這是一台專為 AI 輔助寫程式設計的 macOS 開發環境，整合 Claude Code、Cursor CLI 與 OpenAI Codex。亮點在於：工程師送出 Prompt、等 AI 跑 1 到 5 分鐘時，側邊欄直接嵌入抖音／TikTok、X 動態、Tinder 與小遊戲；程式一生成完，系統立刻收掉娛樂視窗，把人拉回鍵盤。

## 痛點

Vibe Coding 時代出現一種新的微破裂注意力：指令下去之後，AI 要想 1 到 5 分鐘。這段時間長到不能乾等，又短到不夠展開另一項深度工作。

多數人會拿起手機刷 TikTok、開瀏覽器或打遊戲。一離開 IDE，上下文切換的代價就來了：刷到忘記時間，或要花好幾分鐘才把思緒拉回剛寫到一半的邏輯，注意力與腦力都被抽乾。

## 方案

Chad IDE 把「工作」和「等 AI 時的無聊分心」封在同一個視窗裡：

1. **內建娛樂側邊欄。** AI 推理時，右側給短影音、社群 Feed 或微型遊戲。
2. **主動監控、自動收回。** 背景 Agent 一寫完，立刻鎖住並收掉娛樂視窗，強制回到 coding。
3. **多模型與 Agent 協同。** 原生接多家 AI Provider，支援背景平行處理重型任務。
4. **Freemium 變現。** Free、Pro（$15／月）、Pro Max（$40／月），按 AI 使用量與平行 Agent 能力收費。

## 成功故事與成功之道

公開時間線（綜合 YC Launch、PitchBook 與開發者社群）：

- **2025 年：** Richard 與 Kevin 在舊金山成立 Clad Labs。
- **2025 年底：** 錄取 YC Fall 2025，拿到 50 萬美元 Seed，合夥人 Nicolas Dessaigne 指導。
- **2025 年 10 月：** YC Launch 發布 Chad IDE 測試版，在 Hacker News、X 與開發者圈炸開話題。
- **早期 Beta：** 依團隊問卷與現場觀察，工程師換成 Chad 之後，平均每小時 vibe coding 可省下約 15 分鐘被干擾流失的時間。

成功之道是三個打破常規的產品決定：

1. **反直覺地擁抱 Brainrot。** 傳統 IDE 講絕對專注；Clad Labs 承認現代工程師等 AI 時本來就會分心。把分心收容在 IDE 裡，反而比禁止分心更容易維持心流。
2. **用自動彈回消掉注意力斷層。** 問題不在看短影片，而在看完忘記回去。娛樂在這裡是計時器，AI 一完工就把人喚回。
3. **站在開源肩膀上。** 團隊公開致謝 Void、Pear AI、Continue Dev，用成熟骨架做極速創新，而不是重寫編輯器。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| 創立時間 | 2025 年 | 官方／PitchBook |
| 融資金額 | $500,000（Seed） | Y Combinator F25 |
| 團隊 | 2 人（Richard Wang、Kevin Le） | YC 官方頁 |
| 產品定價 | $0 / $15 / $40 | 官網 |
| 注意力節省 | 約 15 分鐘／小時 | 初期 Beta 問卷與紀錄 |
| 核心技術 | macOS IDE + 多 Agent + 娛樂側欄 | 官方規格 |

數字是 2025–2026 年初創辦人公開說明與 YC 投資快照。

## 普通人如何複製

不要再做一個「嵌入 TikTok 的編輯器」。要複製的是「處理微等待時間」：

- 找出流程裡的空檔：影片渲染、AI 繪圖、大型編譯、CI/CD 那 2 分鐘。
- 不要阻止用戶分心，要管住分心的邊界。在他們離開 App 之前，先在產品裡給低認知負荷的娛樂或輕任務。
- 做出自動化喚回：等待結束時的畫面與聲音，把人從散漫狀態拉回來。
- 站在開源基礎設施上，只打「等待推理」這一個體驗。

## 創業者與矽谷視角

YC 看中 Clad Labs，是因為它切中 AI 時代的 Developer Experience。在傳統矽谷視角裡，「編輯器裡看 TikTok」像迷因笑話；但開發者已經從「逐行撰寫」變成「監管 Agent」。監管者最大的痛，就是片段式的無所事事。

Cursor 與 Windsurf 比的是生成得更快更準；Clad Labs 比的是：AI 在算這 3 分鐘，開發者的大腦放哪裡。就算以後推理變快，只要平行 Agent 還有空檔，「注意力微調控」就還有位置。
`,
    bodyEn: `
## What the company does

[Clad Labs](https://www.cladlabs.ai/) was founded in San Francisco in 2025 by Richard Wang (Caltech CS, ex-AI researcher) and Kevin Le (UIUC, ex-Meta). They joined YC F25 on a $500K seed.

**Chad IDE** is a macOS environment for agentic coding — Claude Code, Cursor CLI, Codex — with TikTok, X, Tinder, and mini-games in the sidebar while the model thinks. When generation finishes, the fun pane snaps shut.

## Pain

Agent inference lasts 1–5 minutes: too long to sit still, too short for deep work. People leave the IDE and pay a context-switch tax.

## Approach

Keep the vice in the same window. Monitor generation and snap back. Orchestrate several models. Charge Free / Pro $15 / Pro Max $40.

## Story and why it worked

YC Launch in October 2025 made it a meme that was also a real DX bet. Early testers reported about 15 minutes an hour back. The product admits distraction, then automates the return. The team thanked Void, Pear, and Continue instead of rewriting an editor.

## Results

| Metric | Figure | Source |
| --- | --- | --- |
| Funding | $500K seed | YC F25 |
| Team | 2, San Francisco | YC |
| Pricing | $0 / $15 / $40 | Site |
| Time saved | ~15 min / hour | Founder beta notes |

## How an ordinary builder copies this

Copy micro-downtime design: find a 1–5 minute wait, contain the distraction, snap back, stand on an open-source spine.

## Founder / Silicon Valley read

Developers became agent supervisors. Chad competes for those three minutes of attention, not for token quality.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444413",
    title: "Fambot",
    slug: "fambot",
    category: "workflow_agent",
    categories: ["workflow_agent", "saas"],
    website: "https://www.fambot.com/",
    highlights: [
      { zh: "Pre-Seed 融資", en: "Pre-seed", value: "$3.5M" },
      { zh: "早期測試家庭", en: "Beta families", value: "1,000+" },
      { zh: "創辦團隊背景", en: "Founders", value: "Uber / Meta / Google" },
      { zh: "目前定價", en: "Pricing", value: "Beta 免費" },
    ],
    summaryZh:
      "「家庭 AI 幕僚長」：Uber 前高管與 Instagram 工程師打造，Pre-Seed 拿到 350 萬美元，幫忙碌家長自動讀懂學校郵件與社群訊息。",
    summaryEn:
      "An AI chief of staff for families, built by an Uber transit lead and an Instagram engineer. A $3.5M pre-seed funds a product that reads school mail and parent chats, then texts tomorrow’s list.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Fambot](https://www.fambot.com/) 是 2026 年上線的「家庭 AI 幕僚長」。由前 Uber 公眾交通團隊負責人、三個孩子的父親 David Reich（CEO），攜手前 Instagram 工程師 Greg Karlin（CTO），以及來自 Google／LinkedIn 的 Jason Morrow 共同創立。

使用者授權一次，連結 Gmail、Outlook、Google 行事曆與 WhatsApp 家長群，Fambot 就在背景掃描並抽出關鍵活動、繳費與回覆截止日、戶外教學同意書、學校主題日 dress code。每天晚上或清早，系統用簡訊或 App 推播送出一份極簡的「明日家庭行動清單」，雙親不必手動輸入，也能對上同一份行程。

## 痛點

美國約有 4,300 萬個擁有 16 歲以下孩子的家庭。家長忙完一天工作，往往還得花 1 到 2 小時翻幾十封學校 Email、PDF 校刊、運動社團公告，以及洗版的 WhatsApp 家長群，只為確認「明天孩子該穿什麼」、「家長座談會哪天截止」。

Cozi 或共享 Google Calendar 都是被動工具，得靠家長自己輸入。痛點不是缺少日曆介面，而是家長根本沒有心力，從海量碎片裡梳出明天該做的事。

## 方案

Fambot 把自己定位成「主動型家庭幕僚」：

1. **連一次就好。** 開戶時接上信箱與通訊軟體，不必再轉寄、截圖、貼標籤，AI 在背景辨識重要家庭通訊。
2. **跨管道解讀。** 學校週報與社群群組裡的「下週二校外教學要自備午餐」「明天是瘋狂髮型日」，自動變成行事曆事件與待辦。
3. **簡訊互動與每日摘要。** 定時傳「明日家庭計畫」。家長可以直接回簡訊問細節、加交辦或改行程，不必再開一個 App。
4. **雙親同步。** 共用帳號、串兩人信箱，兩人收到同一份摘要，少掉「你沒看學校那封信嗎？」
5. **隱私承諾。** OAuth、唯讀權限，承諾不賣數據、也不拿去給第三方 LLM 訓練。

## 成功故事與成功之道

公開時間線（綜合 Dealroom 2026 年 9 月報導、Konsulteer 與官方資訊）：

- **2025 年初：** David 與 Greg 因為自己扛著家庭行政負擔，開始做原型；後來 Jason 加入。
- **測試期間：** 正式發布前已有超過 1,000 個家庭進 Beta，涵蓋雙薪、單親與多子女家庭。
- **2026 年 9 月：** 公開 iOS／Android／Web，並宣布完成 350 萬美元 Pre-Seed。NextView Ventures 與 Baukunst 領投，Correlation Ventures、Karman Ventures、Founders Network 參投。

成功之道有三個：

1. **切入被矽谷忽視的家庭行政。** 多數 AI Agent 都在搶 B2B 辦公室效率；Fambot 選高頻、高焦慮的家庭資訊過載。
2. **把 AI 隱形。** 競品常要使用者主動對話或上傳；Fambot 主打「連一次，背景自動搞定」。
3. **簡訊優先。** 不強迫家長改習慣，重點直接送到手機，回一句就能互動。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| Pre-Seed 融資 | $3.5M | Dealroom（2026/09） |
| 領投機構 | NextView Ventures、Baukunst | 同上 |
| 早期測試家庭 | 1,000+ 戶 | 官方／Dealroom |
| 創辦團隊 | David Reich（Uber）、Greg Karlin（Meta）、Jason Morrow（Google） | 官方／媒體 |
| 整合支援 | Gmail、Outlook、Google Calendar、WhatsApp | App Store／Play 頁 |
| 目前定價 | Beta 免費（未來預計接近 Netflix 月費） | 官方說明 |

數字是 2026 年 9 月融資發布與公開報導快照。

## 普通人如何複製

核心不是再做一個家庭日曆，而是找「資訊高度碎片、使用者無力手動整理」的場景：

- 高認知負擔的非工作溝通黑洞：管委會通知、寵物醫療日程、長輩跨科別門診。
- 做背景提取器，不要做聊天機器人。別逼使用者每天登入問 AI，讓它默默解析，只在關鍵時刻吐清單。
- 把互動嵌進 SMS、LINE 或 WhatsApp，降低開啟成本。
- 讓兩個人共用同一份 AI 日曆——留存與切換成本會一起上升。

## 創業者與矽谷視角

傳統 VC 常覺得消費級 AI 的 LTV 低、容易流失。Fambot 這輪 350 萬美元證明：當產品打中「家庭心理負擔」這塊剛需，機構願意在 Pre-Seed 就重押。

護城河不在呼叫哪一家 LLM，而在**高信任的隱私防線，以及雙親一起用之後的網絡效應**。家庭通訊裡是孩子與私人日程；一旦建立權威、進入雙親協同，後進者很難再搶心智。
`,
    bodyEn: `
## What the company does

[Fambot](https://www.fambot.com/) is an AI chief of staff for families, founded by David Reich (ex-Uber Transit, dad of three), Greg Karlin (ex-Instagram), and Jason Morrow (Google / LinkedIn). Connect Gmail, Outlook, Calendar, and WhatsApp parent chats once. It texts both parents the same daily plan.

## Pain

About 43 million U.S. families have kids under 16. Calendar apps already exist. What parents lack is the mental bandwidth to mine school PDFs and group chats for tomorrow’s three actions.

## Approach

Connect once. Parse across channels. Deliver on SMS. Share one plan. Promise read-only OAuth and no training on family data.

## Story and why it worked

Prototype in 2025 from the founders’ own admin burden. 1,000+ beta families. Public launch and a $3.5M pre-seed co-led by NextView and Baukunst in September 2026, timed to back-to-school.

## Results

| Metric | Figure | Source |
| --- | --- | --- |
| Pre-seed | $3.5M | Dealroom, Sep 2026 |
| Beta families | 1,000+ | Company / Dealroom |
| Pricing | Free in beta | Company |

## How an ordinary builder copies this

Build a background extractor for a messy non-work inbox, deliver one list into a chat people already open, and make two adults share it.

## Founder / Silicon Valley read

The round is a bet on household mental load plus dual-parent lock-in. The moat is trust, not the model logo.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444414",
    title: "Series",
    slug: "series-so",
    category: "platform",
    categories: ["platform", "saas"],
    website: "https://series.so/",
    highlights: [
      { zh: "總融資額", en: "Funding", value: "$5.1M–$8.2M" },
      { zh: "訊息對話量", en: "Messages", value: "1,000,000+" },
      { zh: "每日活躍", en: "DAU", value: "10,000+" },
      { zh: "創辦團隊", en: "Founders", value: "耶魯大學" },
    ],
    summaryZh:
      "「去動態牆」的 iMessage AI 社交網路：兩個耶魯學生創辦，兩週拿到 310 萬美元，用藍色簡訊框幫 Gen Z 做一個沒有表演焦慮的私密人脈圈。",
    summaryEn:
      "Two Yale students put a social network inside iMessage: no feed, no follower counts, warm intros only after both sides say yes. They raised $3.1M in two weeks; later coverage puts total funding between $5.1M and $8.2M.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Series](https://series.so/) 由耶魯學生 Nathaneo Johnson（CEO）與 Sean Hargrow 於 2024–2025 年創立。它完全甩掉「再下載一個 App、再刷一堵動態牆」的社交邏輯，把整套網路做進 Apple 內建的 iMessage。

使用者不用裝新 App。只要在 iMessage 裡傳訊給自己的「AI Friend」，說說背景、興趣、想認識什麼人。AI 在背景媒合志同道合或互補的人，雙方都同意之後，直接在藍色對話框做一場溫暖介紹。

## 痛點

Gen Z 與青年創業者正面對嚴重的社交媒體表演疲勞。Instagram 的精緻人設、LinkedIn 的職涯展演、TikTok 的追蹤數字，公共動態牆讓人發文都累，越來越少人願意在公開網路上做自己。

冷不防私訊成功率極低，付費人脈社群又貴又高門檻。痛點不是「缺社交 App」，而是缺少一個**零表演壓力、又有信任基礎的私密媒合管道**。

## 方案

Series 用「無 App 介面 + iMessage 原生體驗」：

1. **藍色簡訊就是介面。** 跟自己的 AI Agent 對話，不必開瀏覽器、也不必下載。
2. **雙向同意才介紹。** Agent 先私下問雙方願不願意認識，兩邊點頭才開聊，沒有冷不防打擾。
3. **去掉粉專與計數器。** 沒有追蹤人數、按讚、公共動態牆或公開檔案，只有真實的一對一或微型群組。
4. **AI 當私密人脈幕僚。** 它記得你的近況與需求，像一個公關專員，主動在校園、創業、職涯或同好圈找連結。

## 成功故事與成功之道

公開時間線（綜合 Tech-ish、Silicon Snark、Tracxn 等）：

- **2024 年底：** 兩人從校園 Podcast 與 Hackathon 做出早期 AI 媒合 Bot。
- **2025 年 4 月：** LinkedIn 上一則 Demo 傳開，只花 14 天，就由 a16z 前投資人 Anne Lee Skates（Parable）領投，完成 310 萬美元 Pre-Seed。Pear VC、Draper 基金、Reddit CEO Steve Huffman、GPTZero 創辦人 Edward Tian 參投。
- **2025 年底至 2026 年：** 累計交換訊息突破 100 萬、每日活躍超過 10,000；總融資額後續擴到 510 萬，部分報導寫到 820 萬（含後續 Seed 擴充）。

成功之道：

1. **寄生在高信任通道。** 美國年輕人對藍色簡訊的開啟率與心理信任都高。Series 避開獨立 App 下載率極低的困境，直接活在每天最常用的溝通工具裡。
2. **反 vanity metrics。** 別人都在用短影音搶注意力；Series 主張沒有動態牆、沒有追蹤者，正好打中對演算法與表演文化厭倦的人。
3. **先做垂直高密度場景。** 初期深耕耶魯、普林斯頓、東北大學等校園的創業與職涯圈，口碑做起來再複製到金融、設計與科技。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| 外部融資 | $5.1M–$8.2M（Pre-Seed／Seed） | Tech-ish／Silicon Snark／Tracxn（2025–2026） |
| 主要投資人 | Parable、Pear VC、Tim Draper、Reddit CEO | 官方／融資報導 |
| 交換訊息 | 1,000,000+ 筆 | 官方里程碑（2025/12） |
| 每日活躍 | 10,000+ | 官方營運數據 |
| 創辦團隊 | Nathaneo Johnson、Sean Hargrow（Yale） | 公開檔案／Forbes |
| 核心平台 | Apple iMessage | series.so |

數字是 2025–2026 年公開報導、機構披露與創辦人訪談快照。

## 普通人如何複製

不要重做一個「iMessage AI」，要學「無 App 足跡 + 去中心化媒合」：

- 找使用者已經深度依賴的高頻通道：iMessage、WhatsApp、LINE、Telegram，把摩擦力降到零。
- 做微型連結，不要做公共廣場。一對一雙向同意，留存會比較高。
- 讓 AI 收集非結構化需求（「我想找懂 Rust 的開發者」），在背景做語意比對，而不是讓人翻目錄。
- 先在一個資訊流動極快的封閉圈子把熱度做爆，再往外擴。

## 創業者與矽谷視角

創投圈對「新社交 App」高度警惕，因為多數死在高 CAC 與爛留存。Series 卻能在 14 天關下 310 萬、後續走到 500 萬以上，因為它回應的是後社交媒體時代：人們不想再表演。

VC 看重的是：壁壘從「擁有自己的 App」換成「掌握 iMessage 裡的信任關係與 AI 語意經紀權」。整套產品站在 Apple 生態上，平台風險是真的；但它給下一代消費級 AI 社交，留了一個極簡、去表演的範本。
`,
    bodyEn: `
## What the company does

[Series](https://series.so/) was founded by Yale students Nathaneo Johnson and Sean Hargrow. You text an AI Friend in iMessage. It only opens a thread after both people opt in. No public feed, no follower counts.

## Pain

Performance anxiety on Instagram, LinkedIn, and TikTok is real. Cold DMs fail. Paid networks are gated. The missing product is a private, high-trust intro path.

## Approach

Live in the blue bubble. Double opt-in. Kill vanity metrics. Let the agent remember what you need and make warm intros.

## Story and why it worked

A LinkedIn demo in April 2025 led to $3.1M in 14 days, Parable-led, with Pear, Draper, Steve Huffman, and Edward Tian. By late 2025 the company reported 1M+ messages and 10,000+ DAU. Later coverage puts total funding at $5.1M–$8.2M.

## Results

| Metric | Figure | Source |
| --- | --- | --- |
| Funding | $5.1M–$8.2M | 2025–2026 coverage |
| Messages | 1M+ | Company, Dec 2025 |
| DAU | 10,000+ | Company |

## How an ordinary builder copies this

Ship into a chat surface people already open. Optimize for micro-connections. Seed a dense network first.

## Founder / Silicon Valley read

The moat moved from “own the app” to trust and semantic brokerage inside iMessage — with Apple platform risk attached.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444415",
    title: "Poke",
    slug: "poke",
    category: "workflow_agent",
    categories: ["workflow_agent", "platform"],
    website: "https://poke.com/",
    highlights: [
      { zh: "累計訊息對話", en: "Messages", value: "100M+" },
      { zh: "外部融資", en: "Funding", value: "$25M（估值 $300M）" },
      { zh: "官方獨家認證", en: "Apple", value: "Messages 首家" },
      { zh: "創辦團隊", en: "Founders", value: "TUM / Tesla / MIT" },
    ],
    summaryZh:
      "「不用下載 App 的 iMessage AI 助理」：慕尼黑工大團隊創辦，拿到 2,500 萬美元，成為首個登陸 Apple Messages 的 AI Agent；3 個月爆發 1 億筆對話，隨後被 Cognition 收購。",
    summaryEn:
      "TUM alumni put a personal agent in iMessage and SMS — no new app. They raised $25M at a $300M valuation, became the first third-party agent on Apple Messages, crossed 100M messages in three months, and were acquired by Cognition.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

Poke（[poke.com](https://poke.com/)，由 The Interaction Company 開發）是慕尼黑工業大學校友 Marvin von Hagen（CEO，曾任職 Tesla 與 MIT 數據研究）與 Felix Schlegel（CTO）在 Palo Alto 創立的 AI 個人助理。

它完全丟掉獨立 App 的思路，把 Agent 嵌進手機內建簡訊：Apple iMessage、SMS、WhatsApp 與 Telegram。使用者在官網留電話，授權 Google Calendar、Gmail、Outlook、Oura 或 Notion，就可以像跟朋友傳訊一樣，用文字或語音請 AI 清信箱、排行程、追帳單、自動化瑣事。

## 痛點

使用者同時碰上「App 疲勞」與「懶得主動開啟」。市面上效率 AI 成千上萬，多數人根本不想再下載，也常忘記打開 ChatGPT 或 Claude。

傳統聊天機器人永遠在等你先開口。日常生活裡的痛——沒回的信、快到期的發票、明天航班改期——往往在你忘記問的時候就發生了。

## 方案

Poke 做的是「主動推播 + 零摩擦簡訊介面」：

1. **簡訊即介面。** 不用裝新 App，也不用學新的 dashboard。在 iMessage 或 WhatsApp 裡傳訊，就像跟助理聊天。
2. **主動關懷。** AI 會掃行事曆與信箱，自己傳一句：「你明早 9 點有跨國會議，要不要我把昨天那客戶的 3 封信做成摘要？」
3. **自動化配方。** 用自然語言設「每週五下午彙整一週報告」或「發票超過 100 美金就傳訊」，把跨系統 API 收成對話。
4. **多模型路由與高規格隱私。** 底層接 OpenAI、Anthropic、Mistral，依任務配模型；並提供 Maximum Privacy 模式，拿過 SOC 2 Type II 與 Apple 企業級隱私認證。

## 成功故事與成功之道

公開時間線（綜合 Dealroom、Observer、Carly AI 及 2026 年收購公告）：

- **2025 年底：** 矽谷封閉測試，吸納超過 6,000 名來自 OpenAI、Google、Stripe、Anthropic 的早期使用者，每月互動逾 20 萬則。
- **2026 年 3 月：** 正式對外開放；其後 Spark Capital 與 General Catalyst 領投 2,500 萬美元（1,500 萬 Seed + 1,000 萬擴充），投後估值 3 億，投資人包括 Stripe 創辦人 Collison 兄弟。
- **2026 年 6 月：** 獲 Apple 批准，成為首個直接整合進 Apple Messages for Business 的第三方 AI Agent。
- **2026 年 7 月：** 公測約 3 個月，訊息交換突破 1 億則。同月，做 Devin 的 **Cognition** 宣布收購 Poke（The Interaction Company），作為消費級通用 Agent 的核心陣地。

成功之道：

1. **搶到最頂級的分發。** 成為 Apple Messages 生態裡幾乎唯一的 AI 助理，直接對準全球幾億 iPhone 的預設簡訊框。
2. **極致的人性與情緒價值。** 早期測試就發現，用戶不只拿它辦事，也會問感情與生活。Poke 被調成幽默、體貼的朋友，而不是冷冰冰的軟體。
3. **多模型靈活架構。** 不綁死一家模型，依寫信、做表、查機票自動選最快、最便宜的那一個。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| 總融資額 | $25M（估值 $300M） | Spark Capital／General Catalyst |
| 累計對話 | 100,000,000+（發布約 3 個月） | Cognition 併購聲明（2026/07） |
| 重大收購 | 2026 年 7 月由 Cognition（Devin）全資收購 | Cognition／Dealroom |
| 官方認證 | Apple Messages for Business 首家第三方 AI | Apple／WWDC 2026 相關發布 |
| 支援平台 | iMessage、SMS、WhatsApp、Telegram | poke.com |
| 商業定價 | 免費／Pro $19／月／Ultra $199／月 | 官網（2026） |

數字是 2026 年 7–9 月官方併購公告、Dealroom 與科技媒體快照。

## 普通人如何複製

關鍵是「把產品嵌進使用者已經在看的地方」：

- 核心若是文字或資訊處理，先問能不能活在 LINE、WhatsApp、Telegram 或 Email 回覆裡，而不是先畫一個新 App。
- 從被動問答改成主動推播。監測公開數據或 API 變動，在對的時間 nudge 一下，黏著度會差好幾倍。
- 用 Recipes 把龐大 API 收成幾句人話，讓非技術用戶也能自動化。
- 一碰到簡訊與私密信箱，SOC 2 這類認證就是取信用戶、也取信 Apple／Google 的入場券。

## 創業者與矽谷視角

Cognition 買 Poke，是 2026 年 Agent 領域最有代表性的併購之一。傳統觀點覺得消費級 AI 留存差、護城河薄；Poke 卻用不到 15 個月走完「上線 → 3 億估值 → 被買走」。

Cognition CEO Scott Wu 的框架是：Devin 是企業端、專業領域的重型助理，Poke 是日常生活裡的輕量、主動助理。兩者都是常駐雲端的全天候 Agent。故事證明：模型能力越平民，**誰掌握最貼近使用者的輸入框，以及主動觸達權，誰就拿走這輪分發紅利**。
`,
    bodyEn: `
## What the company does

Poke ([poke.com](https://poke.com/)) is built by The Interaction Company in Palo Alto. Cofounders Marvin von Hagen and Felix Schlegel met at TUM. You text the agent in iMessage, SMS, WhatsApp, or Telegram after connecting calendar and mail. It cleans the inbox, plans the day, and runs natural-language recipes.

## Pain

People will not download the Nth AI app, and a bot that only answers when asked misses the invoice that landed at midnight.

## Approach

Message-native UI. Proactive nudges. Recipes over dashboards. Multi-model routing plus a public privacy story (SOC 2, Apple).

## Story and why it worked

Closed beta with 6,000+ operators from OpenAI, Google, Stripe, and Anthropic. Public in March 2026; $25M disclosed at a $300M post-money, Spark and General Catalyst led. June: first third-party agent on Apple Messages for Business. July: 100M+ messages and a Cognition acquisition.

## Results

| Metric | Figure | Source |
| --- | --- | --- |
| Funding | $25M at $300M | 2026 coverage |
| Messages | 100M+ in ~3 months | Acquisition notes |
| Exit | Cognition, July 2026 | TechCrunch / Dealroom |

## How an ordinary builder copies this

Ship in a chat surface. Trigger nudges. Treat compliance as the ticket onto iMessage and WhatsApp.

## Founder / Silicon Valley read

Cognition did not buy a model. It bought a personality and a distribution slot. Always-on agents win on the inbox people already open.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444416",
    title: "Gojiberry AI",
    slug: "gojiberry-ai",
    category: "saas",
    categories: ["saas", "workflow_agent"],
    website: "https://gojiberry.ai/",
    highlights: [
      { zh: "月經常性收入", en: "MRR", value: "$112,000+" },
      { zh: "年化營收", en: "ARR", value: "$2.5M" },
      { zh: "付費 B2B 客戶", en: "Customers", value: "2,000+" },
      { zh: "外部融資", en: "Funding", value: "$500K (YC)" },
    ],
    summaryZh:
      "「B2B 銷售的 AI GTM 幕僚腦」：三個法國連續創業者，9 個月把 MRR 從 0 做到 11.2 萬美元，入選 Y Combinator，用意圖訊號取代海量冷郵件。",
    summaryEn:
      "Three French repeat founders built an intent-first GTM agent. They went from $0 to $112K MRR in nine months, joined YC, and now state $2.5M ARR and 2,000+ paying teams.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Gojiberry AI](https://gojiberry.ai/) 由三位都有成功 Exit 的法國連續創業家 Pierre-Eliott Lallemant（CEO）、Romàn Czerny（CMO）與 Dylan Teixeira（CTO）於 2025 年創立，並入選 Y Combinator Spring 2026。

它把自己定位成 B2B 團隊的「全自動 GTM 意圖大腦」。傳統 SDR 手動找名單、亂發冷郵件；Gojiberry 改成 24/7 監測 LinkedIn 與公開網上 30 多種購買意圖訊號——高管換位、公司新一輪融資、在競品粉專留言按讚、發布特定關鍵字。抓到高意圖對象後，自動用 15 家以上數據源補全 Email、打 ICP 分數，再發個人化 LinkedIn 私訊與郵件，幫業務把 Demo 約上日曆。

## 痛點

傳統 B2B outbound 同時被「低回覆率」與「工具碎片」折磨。業務得在 Sales Navigator、Apollo、CRM、群發工具之間跳來跳去，對完全沒有購買時機的冷名單發沒針對性的訊息，平均回覆率長期停在 2–3%。

小型團隊或獨立創辦人買到的，往往只是「被動執行命令的腳本」，沒人告訴你哪種 ICP、哪個時間點、哪句開場真正能成交。請一名全職 SDR 一年 6 到 8 萬美元，多數時間卻在整理名單與發信。

## 方案

一條迴路：意圖捕捉 → 打分 → 觸達 → 約成會議。

1. **即時意圖訊號。** 對手粉專互動、行業 KOL 留言、高管異動、融資發布，共 30 多種高意圖事件。
2. **瀑布補全與 ICP 打分。** 對象被抓到後，自動比對理想客戶，並用 15 家以上供應商補公司郵箱。
3. **依訊號寫的私訊。** 例如「看到你們剛完成 A 輪」，再發 LinkedIn 或郵件。
4. **對話管理與自我優化。** 記錄哪種訊號、哪種文案回覆率最高，自動改下一波策略。Pro 方案約 $99／月，把中小企業開發客戶的門檻壓下來。

## 成功故事與成功之道

公開時間線（綜合 YC Launch、Tracxn 與業界評測）：

- **2025 年：** 三人賣掉上一間 SaaS 之後，在舊金山／巴黎創立 Gojiberry AI。
- **上線 9 個月內：** 營收從 $0 長到 $112,000 MRR（約 $1.4M ARR），月成長約 44%，超過 1,000 家付費 B2B 客戶。
- **2026 年春季：** 入選 YC Spring 2026，拿到 50 萬美元種子輪；年化跑率再到 $2.5M ARR，付費客戶突破 2,000 家。

成功之道：

1. **意圖優先，而不是數量優先。** 傳統開發靠 1,000 封冷郵件拼 2% 回覆；Gojiberry 只挑「正在找解法」的 50 個人發訊，客戶實測回覆率常是傳統 outbound 的 2 到 5 倍。
2. **連續創業者的 GTM 執行力。** 三人在 CoCo AI、Edusign 等專案裡練過產品與分發，知道怎麼用最輕的架構驗證 B2B 剛需。
3. **價值很好對帳。** 成果直接是「幫客戶約到幾場 Demo」，比「省時間的工具」更容易讓人付 $99／月。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| 月經常性收入 | $112,000+（上線 9 個月） | YC Launch |
| 年化營收 | $1.4M → $2.5M | YC 頁與創辦人說明 |
| 營收月成長 | 44% MoM | YC |
| 付費客戶 | 1,000+ → 2,000+ 家 | 官方里程碑 |
| 外部融資 | $500,000（Seed） | YC Spring 2026 |
| 回覆率提升 | 傳統 outbound 的 2–5 倍 | 客戶實測平均 |
| 核心創辦人 | Pierre-Eliott、Romàn、Dylan（皆有 Exit） | 公開檔案 |

數字是 2026 年初至年中 YC 官方披露與公開快照。

## 普通人如何複製

把開發邏輯從「海量開單」改成「精準捕捉時機」：

- 先找出賽道裡的高意圖觸發點：離職、融資、換工具、競品粉專互動。
- 把監測、補全、觸達收成一條流水線，消掉四個分頁的切換。
- B2B 最好賣「日曆上多了會議」，不要只賣「省時間」。
- 先在單一高轉換通道（例如 LinkedIn）做到極致，再擴全通路。

## 創業者與矽谷視角

YC 投這家的理由很清楚：傳統 B2B Sales Tech Stack 又重又失效。生成式 AI 爆發前，企業得分開買 Apollo（找名單）、Clay（清洗）、Smartlead（群發）與 Salesforce（CRM）。Gojiberry 證明，在 Agent 時代，這整疊可以被收成一個會自學的 GTM 大腦。

它不是只會叫 LLM 寫信，而是抓住「時機」與「訊號」這兩塊銷售護城河——也才解釋得了，為什麼能在 9 個月裡把年化營收做到百萬美元以上。
`,
    bodyEn: `
## What the company does

[Gojiberry AI](https://gojiberry.ai/) was founded in 2025 by Pierre-Eliott Lallemant, Romàn Czerny, and Dylan Teixeira — French repeat founders, each with a prior exit — and joined YC Spring 2026. The agent watches 30+ buying-intent signals, enriches contacts, and books demos.

## Pain

SMBs juggle Apollo, Clay, a mailer, and a CRM, then email people with no timing. Reply rates sit at 2–3%. A full-time SDR costs $60–80K and spends the year cleaning lists.

## Approach

Detect intent → enrich and score → signal-based outreach → learn from replies. Pro is commonly cited around $99/month.

## Story and why it worked

$0 to $112K MRR in nine months on the YC Launch post, ~44% MoM, then $2.5M ARR and 2,000+ customers by the YC profile. They sell meetings, not another list tool.

## Results

| Metric | Figure | Source |
| --- | --- | --- |
| MRR at 9 months | $112K+ | YC Launch |
| ARR | $2.5M | YC profile |
| Customers | 2,000+ | YC + site |
| Funding | $500K | YC S26 |

## How an ordinary builder copies this

Watch timing signals first. Collapse detect / enrich / reach into one loop. Charge for pipeline, not “time saved.”

## Founder / Silicon Valley read

YC is underwriting the collapse of the four-tool sales stack. The durable piece is timing and signals — everyone already has an LLM that can write email.
`,
  },
];
