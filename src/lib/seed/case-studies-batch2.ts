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
      { zh: "社群回報", en: "Reports", value: "57,146" },
      { zh: "聯名玩具", en: "Toys tracked", value: "8" },
      { zh: "官網快照", en: "Snapshot", value: "2026/09/09" },
      { zh: "已披露融資", en: "Disclosed funding", value: "$0" },
    ],
    summaryZh:
      "麥當勞 Hello Kitty × Godzilla 期間出現的免費社群地圖：官方不告訴你這家店今天是哪一款玩具，玩家自己回報，三週內累積逾 5.7 萬筆目擊。",
    summaryEn:
      "A free community map that appeared during McDonald’s Hello Kitty × Godzilla run: the official app will not say which toy is in the box, so collectors report it themselves — 57,146 sightings in a September 2026 snapshot.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Happy Toy Scout](https://happytoyscout.com/) 是一個**非官方、免費**的社群地圖，專門追蹤美國麥當勞「Hello Kitty & Friends × Godzilla」Happy Meal 八款聯名玩具的目擊回報。官網寫得很清楚：這不是麥當勞即時庫存，門市賣完或補貨後數字會過期，出門前最好再打電話確認。

Godzilla 官網與地方媒體都確認這檔聯名於 **2026 年 8 月 18 日** 在美國參與門市開跑，八款分別是 Hello Kitty × Godzilla、Keroppi × King Ghidorah、My Melody × Mothra、Pompompurin × Gigan、Kuromi × Mechagodzilla、Cinnamoroll × Destoroyah、Badtz-Maru × Rodan、Chococat × SpaceGodzilla。happytoyscout.com 網域於 **2026 年 8 月 22 日** 登記（公開 WHOIS），正好卡在熱潮開始後的幾天。

產品動作極短：看地圖／選角色 → 讀最近回報與時間戳 → 到店後一鍵回報「拿到哪一款／已售罄／可否單買玩具」。沒有公開的官方 API，資料完全靠 crowdsourcing。

創辦人真實姓名與「白天工程師、兩個女兒」等故事，我們**找不到可獨立核對的一手頁面**，因此不寫進成績表。能核對的是產品本身、聯名檔期，以及官網自己公布的回報快照。

## 痛點

麥當勞 App 通常只告訴你「這家有沒有 Happy Meal」，不會告訴你紙袋裡是八款中的哪一款。NorthJersey 等報導也寫到：指定款式、可否不買套餐只買玩具，都取決於加盟店，沒有全國統一政策。玩家要湊套，只能盲買、打電話、或在 Reddit／社團重覆問「哪裡還有 #6 Cinnamoroll」。

對獨立開發者的教訓是：沒有企業 API，不代表不能做「準即時」地圖——只要痛點夠尖、回報成本夠低，使用者會自己當感測器。

## 方案

1. **把碎片目擊變成一張地圖。** ZIP／地區視圖 + 八個角色篩選，比翻十個社團快。
2. **時間戳比「現在有貨」誠實。** 官網反覆強調回報會過期，降低被當官方庫存的法律與信任風險。
3. **政策也當資料。** 社群會標「可否指定」「可否單買玩具」，這正是官方不願標準化的最後一哩。
4. **用公開統計當內容。** 官網「第二份社群報告」把掉落分布做成可轉貼的數字（例如 2026/09/09 快照：Pompompurin 13,491 筆最多，Hello Kitty 6,005 筆最少）。

## 成功故事與成功之道

可核對時間線：

- **2026/08/18：** 聯名開跑（Godzilla.com、地方媒體）。
- **2026/08/22：** 網域登記。
- **2026/09/09 21:58 UTC：** 官網快照寫明本檔活動已有 **57,146** 筆社群回報，並列出八款各自的報告數。

網路上流傳的「10 天 12.7 萬獨立用戶、$1,650 萬節省、122 次部署」**我們找不到可引用的 GA4 原文**，故不採用。57,146 已經夠說明：一個週末地圖，可以在文化熱點裡長成預設工具。

成功之道是三件事疊在一起，不是演算法比較強：

1. **檔期刀口。** 聯名生命週期以週計，晚兩週就沒人回報。
2. **去痛點最密的社群，而不是自建社群。** Reddit、家長群、城市版已經在問同一句話。
3. **把去中心化回報編成一則「新聞」。** 掉落率差異本身就能被轉發。

## 成績

| 指標 | 公開數字 | 來源口徑 |
| --- | --- | --- |
| 產品 | 免費獨立地圖 | [happytoyscout.com](https://happytoyscout.com/) |
| 追蹤對象 | 8 款 Hello Kitty × Godzilla 玩具 | 官網／Godzilla.com |
| 社群回報 | 57,146 筆 | 官網 2026/09/09 快照 |
| 回報最多／最少 | Pompompurin 13,491；Hello Kitty 6,005 | 同上 |
| 官方庫存 | 否，非麥當勞 API | 官網 FAQ |
| 已披露融資 | 無公開輪次 | 公開資料未見 |

## 普通人如何複製

不要再做一個麥當勞地圖。要複製的是**快閃 crowdsourcing**：

1. 找「官方只給粗資訊、細節散落在社團」的短熱點：限量卡牌補貨、演唱會周邊排隊、災後缺貨。
2. MVP 必須在熱點還活著時上線；80% 功能夠用就發布。
3. 讓回報比發帖更短（一鍵選店 + 選款）。
4. 把匯總數據寫成一篇短報告，這就是免費 PR。

## 創業者與矽谷視角

Paul Graham 的 *do things that don't scale* 在這裡變成「先讓人手動回報 14,000 家門市」。機構投資人常因生命週期短、沒有訂閱 LTV 而略過這類專案；對獨立開發者，護城河是**上市速度與 $0 CAC**。同一套「門市點 + 視口地圖 + 回報 + 數據短報」可以在下一個 Sanrio／寶可夢檔期再跑一次——前提是你承認這是模組，不是一輩子只做麥當勞的公司。
`,
    bodyEn: `
## What the company actually does

[Happy Toy Scout](https://happytoyscout.com/) is a **free, unofficial** community map of recent sightings for all eight Hello Kitty & Friends × Godzilla Happy Meal toys at participating U.S. McDonald’s restaurants. The site is explicit: this is not official or real-time inventory. Stock turns over; call the store before a special trip.

Toho’s Godzilla site and local press confirm the promotion started **18 August 2026**. The eight pairings are Hello Kitty × Godzilla, Keroppi × King Ghidorah, My Melody × Mothra, Pompompurin × Gigan, Kuromi × Mechagodzilla, Cinnamoroll × Destoroyah, Badtz-Maru × Rodan, and Chococat × SpaceGodzilla. Public WHOIS shows happytoyscout.com was registered **22 August 2026** — days after launch.

The loop is short: scan the map or filter a character → read the latest timestamped report → after a visit, log which toy you got, a sell-out, or whether the store sold toys à la carte. There is no public McDonald’s API. The database *is* the crowd.

We could not independently verify a named founder biography, so we do not print one. The product, the promo window, and the site’s own report snapshot are enough.

## Pain

The McDonald’s app typically answers “does this store have a Happy Meal,” not “which of eight toys is in the bag.” NorthJersey and others reported that requesting a character or buying a toy without a meal is franchise-by-franchise. Completing a set means blind meals, phone trees, or the same Reddit question posted fifty times.

The builder lesson: no enterprise API does not mean you cannot ship a near-real-time map. If the pain is sharp and reporting is one tap, users become the sensors.

## Approach

1. Turn scattered sightings into one map with character filters.
2. Prefer timestamps over fake “in stock now” certainty.
3. Treat store policy (requests, toy-only sales) as data.
4. Publish the drop-rate table as shareable content.

## Story and why it worked

- **18 Aug 2026:** promo starts.
- **22 Aug 2026:** domain registered.
- **9 Sep 2026, 21:58 UTC:** the site’s own snapshot lists **57,146** community reports and per-toy counts (Pompompurin 13,491 most; Hello Kitty 6,005 fewest).

Viral posts citing 127,000 users or $16.5M “saved” are **not used here** — we could not find a citable first-party analytics write-up. 57,146 reports already prove a weekend map can become the default collector tool.

## Results

| Metric | Public figure | Source |
| --- | --- | --- |
| Product | Free independent map | happytoyscout.com |
| Objects tracked | 8 toys | Site / Godzilla.com |
| Reports | 57,146 | Site snapshot 2026-09-09 |
| Official inventory | No | Site FAQ |
| Disclosed funding | None found | Public record |

## How an ordinary builder copies this

Copy **pop-up crowdsourcing**, not a McDonald’s clone: a short cultural spike, official coarse data, details trapped in groups. Ship while the spike is alive. Make reporting shorter than a Reddit post. Publish one stats note for free PR.

## Founder / Silicon Valley read

This is *do things that don't scale* as a feature. VCs often skip pop-up tools for short LTV. Indie hackers should see **time-to-market and $0 CAC**. The reusable asset is the module — store points, viewport map, report, short data story — ready for the next Sanrio or Pokémon drop.
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
      { zh: "YC 梯次", en: "YC batch", value: "F25" },
      { zh: "團隊", en: "Team", value: "2" },
      { zh: "據點", en: "HQ", value: "San Francisco" },
      { zh: "自述節省", en: "Claimed save", value: "~15 min/hr" },
    ],
    summaryZh:
      "YC F25 兩人團隊先做出「Brainrot IDE」Chad：等 Claude／Cursor 生成的 1–5 分鐘，把短影音留在編輯器裡，生成完再把人拉回來。官網其後也轉向客服 Agent。",
    summaryEn:
      "A two-person YC F25 team shipped Chad, the “brainrot IDE”: keep TikTok inside the editor during 1–5 minutes of agent inference, then snap the user back. The public site later also sells an AI support agent.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Clad Labs](https://www.cladlabs.ai/) 由 **Richard Wang**（CEO，Caltech CS）與 **Kevin Le**（CTO，UIUC、前 Meta）於 2025 年在舊金山創立，入選 **Y Combinator Fall 2025**，YC 頁面寫團隊 2 人、合夥人 Nicolas Dessaigne。

他們在 YC Launch 推出的爆款敘事是 **Chad IDE**（「first brainrot IDE」）：macOS 開發環境，把 Claude Code、Cursor、Codex 等 agent 編排，與 X／TikTok／Tinder／小遊戲放在同一個視窗。AI 還在跑時你可以刷；**生成一結束，娛樂視窗被收回**，避免人留在手機上忘了回程式。TechCrunch 2025 年 11 月 12 日專訪 Wang，標題直接寫「很多人以為是假的」。當時產品仍是 closed beta。

必須誠實寫第二條產品線：同一公司的 YC 主頁與 cladlabs.ai **現在主打 Clad 客服 Agent**（把 Slack／Teams／Email 收成調查佇列）。Chad 仍留在 Launch 文與 [cladlabs.ai/blog](https://www.cladlabs.ai/blog/introducing-clad-labs)。靈感庫收的是「他們如何用一個迷因切口拿到分發」，不是假裝公司永遠只做 IDE。

## 痛點

Agentic coding 製造一種新的微等待：推理常要 1–5 分鐘——太長不能乾等，太短不夠開另一項深度工作。工程師滑向手機，再花幾分鐘把上下文撈回來。YC Launch 原文把問題寫成三句：空檔、忘記回來、切換造成疲勞。

## 方案

1. **承認分心，把分心關在 IDE 裡。** 問題不是看短影音，是看完回不來。
2. **Snap-back。** 生成監控一完成就中斷娛樂，這是產品核心，不是貼了 TikTok 的 VS Code。
3. **站在開源肩上。** Launch 文感謝 Void、Pear AI、Continue Dev，而不是重寫編輯器。
4. **用迷因換注意力，再用另一條 B2B 線變現。** 這是後續官網轉向客服 Agent 的合理讀法，不是我們發明的財報。

關於「每小時省 15 分鐘」：這是創辦人在 YC Launch **自己標註**的 beta 問卷／現場觀察，文中寫明 *not a research study*。我們照實引用，不当成實驗室結論。官網部落格另有 43%、2.3 小時等數字，口徑更像行銷文案，**不列入成績表**。

## 成功故事與成功之道

- **2025：** 舊金山成立，進 YC F25。
- **2025/11/12：** TechCrunch 報導 Chad，澄清不是愚人節。
- **之後：** 公開站轉向 support-queue 敘事；Chad 仍是他們被記住的發射故事。

成功之道：

1. 用文化語言（brainrot）講一個真的 DX 問題。
2. 把「喚回」做成功能，而不只是嵌入影片。
3. 兩人團隊、借開源骨架，只打一個體驗切口。

## 成績

| 指標 | 公開數字 | 來源口徑 |
| --- | --- | --- |
| 梯次 | YC Fall 2025 | YC 公司頁 |
| 團隊 | 2 人，舊金山 | YC |
| 創辦人 | Richard Wang、Kevin Le | YC |
| 發射產品 | Chad IDE | YC Launch、TechCrunch |
| 現況官網 | AI 客服／調查 Agent | cladlabs.ai、useclad.ai |
| 15 分鐘／小時 | 創辦人自述 beta 觀察 | YC Launch（非研究） |
| 融資 | YC 標準支票；未見獨立 Series A 稿 | 公開頁面 |

## 普通人如何複製

不要再做一個「內建 TikTok 的編輯器」。要複製的是**微等待管理**：

- 找出 1–5 分鐘空檔（渲染、CI、繪圖、訓練）。
- 在使用者離開 App 前提供低認知娛樂或輕任務。
- 真正的功能是等待結束的強制喚回。
- 用開源骨架，只打一個體驗。

## 創業者與矽谷視角

YC 願意推一個「看起來像笑話」的 IDE，因為開發者角色已從逐行書寫變成**監管 agent**。Cursor 比的是生成品質；Chad 比的是那三分鐘大腦放哪裡。官網後來出現客服 Agent，反而說明：迷因可以當獲客楔子，公司仍要找付費的 B2B 傷口。對 vibe coding 創作者，這比「再做一個包裝過的 VS Code」更值得學。
`,
    bodyEn: `
## What the company actually does

[Clad Labs](https://www.cladlabs.ai/) was founded in San Francisco in 2025 by **Richard Wang** (CEO, Caltech CS) and **Kevin Le** (CTO, UIUC, ex-Meta). Y Combinator lists them as **Fall 2025**, team size 2, partner Nicolas Dessaigne.

The launch that made the press was **Chad IDE**, billed as the first “brainrot IDE”: a macOS environment that orchestrates Claude Code, Cursor, and Codex, and parks X / TikTok / Tinder / minigames in the same window. When generation finishes, the entertainment pane is pulled back so you do not stay on your phone. TechCrunch interviewed Wang on 12 November 2025; people thought it was fake. It was still closed beta.

Be honest about the second line: the same company’s YC profile and cladlabs.ai **now lead with Clad, an AI support agent** (Slack / Teams / email as an investigation queue). Chad remains on the Launch post and the blog. This vault page is about how a meme wedge bought distribution — not a claim that the company only sells an IDE forever.

## Pain

Agent inference often lasts 1–5 minutes: too long to sit still, too short for deep work. People leave the IDE, then pay a context-switch tax. The YC Launch post names the three costs: downtime, forgetting to return, fatigue.

## Approach

1. Keep the vice inside the tool.
2. Snap-back when the agent finishes — that *is* the product.
3. Borrow Void / Pear / Continue instead of rewriting an editor.
4. Use meme attention; later sell a clearer B2B wound (support).

The “~15 minutes saved per hour” line is the founders’ own beta survey / observation on the Launch page, marked *not a research study*. Blog percentages are not in the results table.

## Results

| Metric | Public figure | Source |
| --- | --- | --- |
| Batch | YC F25 | YC |
| Team | 2, San Francisco | YC |
| Launch product | Chad IDE | Launch + TechCrunch |
| Current site | Support investigation agent | cladlabs.ai |
| 15 min / hour | Founder-reported beta | Launch post |

## How an ordinary builder copies this

Copy **micro-downtime design**: find a 1–5 minute wait, contain the distraction, snap back automatically, stand on an open-source spine.

## Founder / Silicon Valley read

YC will platform a joke-shaped IDE because developers became **agent supervisors**. Chad competes for those three minutes of attention. A later support-agent homepage is not a betrayal — it is the paid wound after the meme wedge.
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
      { zh: "Pre-Seed", en: "Pre-seed", value: "$3.5M" },
      { zh: "測試家庭", en: "Beta families", value: "1,000+" },
      { zh: "領投", en: "Leads", value: "NextView / Baukunst" },
      { zh: "公開發布", en: "Public launch", value: "2026/09" },
    ],
    summaryZh:
      "前 Uber／Instagram／Google 團隊做「家庭 AI 幕僚長」：讀學校信與家長群組，用簡訊交出明日清單。2026 年 9 月公開上架，並宣布 $350 萬 Pre-Seed。",
    summaryEn:
      "Uber / Instagram / Google alumni shipping an AI chief of staff for parents: it reads school mail and WhatsApp groups, then texts a daily plan. Public launch and a $3.5M pre-seed landed together in September 2026.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Fambot](https://www.fambot.com/) 自稱「家庭的 AI 幕僚長」。2026 年 9 月 1 日，[TechCrunch](https://techcrunch.com/2026/09/01/fambot-introduces-an-ai-chief-of-staff-for-families/) 與公司新聞稿同步宣布兩件事：iOS／Android 對公眾開放，以及 **$350 萬美元 Pre-Seed**，由 **NextView Ventures 與 Baukunst 共同領投**，Correlation Ventures、Karman Ventures、Founders Network 參投。

創辦人：**David Reich**（CEO，三個孩子的父親；曾任 Uber Transit 產品負責人、UnitedMasters 總裁）、**Greg Karlin**（CTO，前 Instagram 工程師）、**Jason Morrow**（Google／LinkedIn 背景）。使用者授權連結學校相關 Email、行事曆、電子報與 WhatsApp 家長群後，系統在背景抽取活動、截止日、同意書與主題日，再把「明日家庭行動清單」打到簡訊——雙親看到同一份。

NextView 的投資文寫明：超過 **1,000 個家庭**（含合夥人自己的家）用過 private beta。公開資料把產品寫成發布時仍偏免費／beta，**尚未看到 Netflix 級月費的正式價目表**，故不寫死未來定價。

## 痛點

投資人引述「美國約 4,300 萬個有 16 歲以下孩子的家庭」。痛點不是沒有日曆 App（Cozi、共享 Google Calendar 都在），而是家長沒有心力從幾十封校刊 PDF 與洗版群組裡**手工抽出明天該做的三件事**。Reich 對 TechCrunch 的個人版本是：每天約 40 封孩子相關信，還要保有陪小孩的時間。

## 方案

1. **連一次，之後不要再上傳。** 背景擷取，而不是每天「問 AI」。
2. **跨渠道解讀。** 信、行事曆、WhatsApp 打成同一條待辦。
3. **簡訊優先。** 不強迫再開一個家長會在用的 App。
4. **雙親同一真相。** 降低「你沒看那封信嗎？」
5. **隱私承諾要寫進稿。** 消費級家庭資料極敏感；公開溝通強調 OAuth／供應商不得拿來訓練。具體條款以官網與設定頁為準。

## 成功故事與成功之道

- **約 2025：** 原型來自創辦人自己的家庭行政負擔。
- **Beta：** 1,000+ 家庭。
- **2026/09/01：** 公開上架 + $3.5M 一起宣布，卡在美國返校季。

成功之道：

1. 多數 Agent 新創擠 B2B 辦公室；他們選**家庭後勤**這塊被看不上的藍海。
2. AI 隱形化——價值是少開 App，不是多一個聊天窗。
3. 把互動放進 SMS，沿用既有習慣。

## 成績

| 指標 | 公開數字 | 來源口徑 |
| --- | --- | --- |
| Pre-Seed | $3.5M | TechCrunch、PR Newswire、NextView |
| 領投 | NextView、Baukunst | 同上 |
| Beta 家庭 | 1,000+ | 新聞稿／NextView |
| 創辦人 | Reich、Karlin、Morrow | TechCrunch |
| 發布 | 2026/09/01，iOS + Android | 同上 |
| 定價 | 發布時 Beta 免費；官網寫下一批 500 戶有終身折扣 | [fambot.com 公告](https://fambot.com/post/announcing-fambot)；正式 ARPU 未披露 |

## 普通人如何複製

複製「背景提取器」，不是再做一個家庭日曆：

- 找資訊碎片、使用者不願每天整理的場景（管委會、長照、寵物醫療）。
- 輸出一條清單到 SMS／LINE／WhatsApp。
- 讓兩個人共用同一份 AI 日曆，提高轉換成本。

## 創業者與矽谷視角

消費級 AI 常被嫌 LTV 低。Fambot 的 $3.5M 證明：當產品打在**家庭心理負擔（mental load）**且能讓兩個成人同時依賴，機構願意在 Pre-Seed 就下注。護城河比較可能是信任與雙親網絡，而不是換哪一家 LLM。風險同樣清楚：兒童資料、WhatsApp／Gmail 平台政策、以及「摘要錯了會不會誤了家長會」。
`,
    bodyEn: `
## What the company actually does

[Fambot](https://www.fambot.com/) is an “AI chief of staff” for families. On 1 September 2026, [TechCrunch](https://techcrunch.com/2026/09/01/fambot-introduces-an-ai-chief-of-staff-for-families/) and a press release announced a public iOS/Android launch **and** a **$3.5M pre-seed** co-led by **NextView Ventures and Baukunst**, with Correlation Ventures, Karman Ventures, and Founders Network.

Founders: **David Reich** (CEO; dad of three; former Uber Transit product lead and UnitedMasters president), **Greg Karlin** (CTO; ex-Instagram), **Jason Morrow** (Google / LinkedIn). After OAuth into school email, calendars, newsletters, and WhatsApp parent chats, Fambot extracts events and deadlines and texts both parents the same daily plan.

NextView says **1,000+ families** used the private beta. Public materials still describe a free/beta motion; we do not invent a Netflix-like price.

## Pain

Investors cite ~43 million U.S. families with kids under 16. Calendar apps already exist. The missing piece is **mental bandwidth** to mine PDFs and group chats for tomorrow’s three actions.

## Approach

Connect once. Parse across channels. Deliver on SMS. Share one plan between parents. Publish a privacy story — family data is the product risk.

## Results

| Metric | Public figure | Source |
| --- | --- | --- |
| Pre-seed | $3.5M | TechCrunch / PR / NextView |
| Beta families | 1,000+ | Launch materials |
| Launch | 1 Sep 2026 | TechCrunch |
| Pricing | Free in beta; next 500 families get a lifetime discount | Company announcement |

## How an ordinary builder copies this

Build a **background extractor** for a messy non-work inbox, deliver one list into a chat the user already opens, and make two people share it.

## Founder / Silicon Valley read

Consumer AI is usually dismissed on LTV. Fambot’s round is a bet on household mental load plus dual-parent lock-in. The moat is trust, not the model logo. The failure mode is a wrong summary of a permission slip.
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
      { zh: "14 天 Pre-Seed", en: "14-day pre-seed", value: "$3.1M" },
      { zh: "累計融資", en: "Total disclosed", value: "$5.1M" },
      { zh: "訊息量", en: "Messages", value: "1M+" },
      { zh: "DAU", en: "DAU", value: "10,000+" },
    ],
    summaryZh:
      "兩名耶魯學生把社交網路做進 iMessage：沒有動態牆與追蹤數，AI Friend 做雙向同意介紹。14 天拿到 $310 萬，後來公開累計 $510 萬，並宣布 100 萬則訊息。",
    summaryEn:
      "Two Yale students put a social network inside iMessage: no feed, no follower counts, AI Friends that only intro after double opt-in. They closed $3.1M in 14 days, later $5.1M disclosed, and announced 1M messages.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Series](https://series.so/) 由耶魯學生 **Nathaneo Johnson**（CEO）與 **Sean Hargrow** 創辦（兩人當時為大三，班級 ’26）。產品不要你再下載一個會刷的 App：在 iMessage 裡跟自己的「AI Friend」說話，描述背景與想認識的人；Agent 在雙方都同意後，把對話拉進藍色氣泡。沒有公開動態牆、沒有追蹤數。

早期加入曾要求 **.edu 信箱**，先從校園創業圈做密度。Johnson 與 Hargrow 大一在 Yale Entrepreneurial Society 認識，還做過訪談創業者的 Podcast「The Founder Series」。

## 痛點

Gen Z 對 Instagram／LinkedIn／TikTok 的表演疲勞是真的，但「再做一個社交 App」死亡率極高。痛點比較精確的說法是：冷 DM 成功率低，付費人脈社群門檻高，**缺少低表演、高信任的介紹管道**。

## 方案

1. **寄生 iMessage。** 美國年輕族群開訊率高，避開下載牆。
2. **Double opt-in。** 兩邊點頭才開聊。
3. **去掉 vanity metrics。** 沒有可炫耀的計數器。
4. **AI 當私人公關。** 非結構化需求（「想找會 Rust 的人」）由 Agent 去配。

## 成功故事與成功之道

可核對時間線：

- **2025/04：** GlobeNewswire／Yale Daily News：Johnson 一則 LinkedIn demo 傳開，兩人飛矽谷，**14 天結束 $310 萬 Pre-Seed**。**Parable**（Anne Lee Skates，前 a16z）領投，Pear VC、Tim Draper 的 DGB、47th Street、Radicle Impact、Uncommon Projects 等參投；天使包括 Reddit CEO **Steve Huffman**、GPTZero **Edward Tian**。當時公司自己寫的進度是處理逾 **32,000** 則訊息。
- **2025/12/22：** 公司新聞稿（經 GlobeNewswire／Markets Insider 轉發）宣布交換訊息突破 **100 萬**、**DAU 10,000+**。
- **2026/05：** Business Insider 寫後續又關了 **$200 萬**，披露總額來到 **$510 萬**。有媒體把 $8.2M 掛在嘴上，**我們找不到同等級一手稿，故只採用 $5.1M**。

成功之道：高信任通道、反動態牆、先在常春藤密度裡做爆再往外擴。

## 成績

| 指標 | 公開數字 | 來源口徑 |
| --- | --- | --- |
| Pre-Seed | $3.1M，約 14 天 | GlobeNewswire 2025/04、YDN |
| 其後增資 | +$2M，累計 $5.1M | Business Insider 2026/05 |
| 領投／參與 | Parable、Pear、Draper、Huffman、Tian 等 | 官方新聞稿 |
| 訊息 | 32k（2025/04）→ 100 萬+（2025/12） | 公司稿 |
| DAU | 10,000+（2025/12 自述） | 公司稿 |
| 介面 | iMessage | series.so |

## 普通人如何複製

複製 **零 App 足跡 + 雙向同意媒合**，不是再做一個 iMessage bot：

- 把服務放進使用者每天已打開的聊天軟體。
- 做微型連結，不要做公共廣場。
- 先選一個高密度種子池（一所學校、一個職業社群）。

## 創業者與矽谷視角

新社交是墳場，因為 CAC 與留存都醜。Series 能在兩週內關帳，是因為把壁壘從「擁有 App」換成「在簡訊裡的信任與語意經紀」。平台風險同樣真實：整個產品站在 Apple 生態上。那不阻止它成為「後動態牆」消費社交的參考樣本。
`,
    bodyEn: `
## What the company actually does

[Series](https://series.so/) was founded by Yale students **Nathaneo Johnson** (CEO) and **Sean Hargrow** (then juniors, class of 2026). You text an AI Friend in iMessage; it only opens a thread after **double opt-in**. No public feed, no follower counts. Early access leaned on **.edu** emails. The founders met at the Yale Entrepreneurial Society and hosted a podcast, The Founder Series.

## Pain

Performance anxiety on public social is real; another feed app usually dies. The sharper gap is a **low-performance, high-trust intro path** — cold DMs fail, paid networks are gated.

## Approach

Live in iMessage. Double opt-in. Kill vanity metrics. Let the agent parse unstructured “I need a Rust cofounder” requests.

## Story and why it worked

- **Apr 2025:** $3.1M in 14 days, Parable-led (GlobeNewswire, Yale Daily News). Angels include Steve Huffman and Edward Tian. Company-reported volume then: 32,000+ messages.
- **22 Dec 2025:** company wire: 1M+ messages, 10,000+ DAU.
- **May 2026:** Business Insider: another $2M, **$5.1M** disclosed total. We do **not** repeat unverified $8.2M figures.

## Results

| Metric | Public figure | Source |
| --- | --- | --- |
| Pre-seed | $3.1M in ~14 days | GlobeNewswire / YDN |
| Total disclosed | $5.1M | Business Insider May 2026 |
| Messages | 1M+ (Dec 2025) | Company wire |
| DAU | 10,000+ | Same wire |

## How an ordinary builder copies this

Ship into a chat surface people already open. Optimize for micro-connections, not a square. Seed a dense network first.

## Founder / Silicon Valley read

Social is a graveyard on CAC. Series moved the moat to iMessage trust and semantic brokerage — and accepted Apple platform risk in the same move.
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
      { zh: "披露融資", en: "Disclosed funding", value: "$25M" },
      { zh: "2026/04 估值", en: "Apr 2026 valuation", value: "$300M" },
      { zh: "三個月訊息", en: "Messages / 3 mo", value: "100M+" },
      { zh: "收購", en: "Acquired", value: "Cognition" },
    ],
    summaryZh:
      "慕尼黑工大校友把 AI 助理做成 iMessage／SMS：不用下載 App。2026 年 4 月披露累計 $2,500 萬、估值 $3 億；6 月成為 Apple Messages for Business 首個第三方 Agent；7 月被 Cognition 收購。",
    summaryEn:
      "TUM alumni put a personal agent in iMessage and SMS — no new app. By April 2026 they had disclosed $25M at a $300M valuation; in June Apple approved them on Messages for Business; in July Cognition bought the company.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

Poke 由 **The Interaction Company of California** 開發，官網 [poke.com](https://poke.com/)。創辦人 **Marvin von Hagen**（CEO）與 **Felix Schlegel**（CTO）是慕尼黑工業大學（TUM）校友，公司在 Palo Alto。兩人早年因 TUM Boring、Elon Musk 的 Not-a-Boring Competition 為人所知；von Hagen 有 Tesla／MIT 相關經歷。

產品不要你再裝一個效率 App：在官網留電話、授權日曆與信箱等工具後，直接在 **iMessage、SMS、Telegram，以及部分市場的 WhatsApp** 傳訊。Poke 會主動 nudge（明早會議、未回信件），也支援用自然語言設「配方」（每週五彙整、大額發票通知）。2025 年它先以 email assistant 出現，後來擴成通用訊息 Agent。

## 痛點

App 疲勞是真的：多數人不會為第 N 個 AI 再下載一次，也不會每天打開 ChatGPT。傳統聊天機器人還有第二個問題——**永遠在等你先開口**，而帳單、航班改期發生在你沒問的時候。

## 方案

1. **訊息即介面。**
2. **主動推播，不只問答。**
3. **Recipes 把跨 API 工作收成一句話。**
4. **多模型路由 + 企業級隱私敘事**（公開稿提過 SOC 2 等認證；以官網合規頁為準）。

## 成功故事與成功之道

- **2025：** Interaction 披露過 **General Catalyst 領投 $1,500 萬、估值 $1 億** 的種子輪（後續媒體回顧）。
- **2026/03：** 對公眾開放。
- **2026/04：** 媒體引述 TechCrunch：再募 **$1,000 萬**，**post-money 估值 $3 億**，Spark Capital 與 GC 在名單上；累計融資口徑 **$2,500 萬**。天使名單曾出現 Stripe 創辦人、Cognition 的 Scott Wu／Walden Yan。
- **2026/06：** 成為 **Apple Messages for Business 上首個獨立第三方 AI Agent**（多家稿一致，Cognition 收購文亦引用）。
- **2026/07/23：** [Cognition 宣布收購](https://techcrunch.com/2026/07/24/why-cognition-bought-poke-ai-personality-is-becoming-a-competitive-advantage/) Interaction。Wu 與 Yan 本來就是天使。von Hagen 對 TechCrunch 確認交易估值在 **low nine figures**（約數億美元量級，公司未公布精確數字）。稿件同時寫：公開後約三個月，使用者與 Poke 交換逾 **1 億** 則訊息。

成功之道：搶到預設簡訊通道、把個性當護城河、不綁死單一模型。Cognition 要的是「Devin 用起來該像同事」，不是再買一個模型實驗室。

## 成績

| 指標 | 公開數字 | 來源口徑 |
| --- | --- | --- |
| 種子 + 擴充 | $15M + $10M ＝ $25M | 2026/04 融資稿／TechCrunch 引述 |
| 估值 | $300M post-money（2026/04） | 同上 |
| 訊息量 | 100M+（發布約 3 個月） | TechCrunch／收購報導 |
| Apple | Messages for Business 首個第三方 Agent | 2026/06 各家報導 |
| 收購 | 2026/07/23，Cognition；低九位數美元 | TechCrunch 訪 von Hagen |
| 定價 | 公開頁曾列免費／Pro／高階方案 | 以當時官網為準，會改 |

## 普通人如何複製

- 若核心是文字，先問能不能活在 LINE／WhatsApp／Email，而不是先畫 Dashboard。
- 從被動聊天改成監測觸發的 nudge。
- 涉及信箱與簡訊就認真做合規，否則平台不讓你進。

## 創業者與矽谷視角

消費級 Agent 常被判「留存差」。Poke 用不到兩年走完「訊息介面 → 分發護城河 → 被 Devin 母公司買走」。Scott Wu 的框架是：Devin 是 B2B 重型同事，Poke 是 B2C 輕量、主動的同事，兩者都是 always-on cloud agent。誰掌握**使用者已經打開的輸入框**與**主動觸達權**，誰就拿走這輪分發。
`,
    bodyEn: `
## What the company actually does

Poke is built by **The Interaction Company of California** ([poke.com](https://poke.com/)). Cofounders **Marvin von Hagen** and **Felix Schlegel** met via TUM; the company sits in Palo Alto. You text Poke in iMessage, SMS, Telegram, and some WhatsApp markets after connecting calendar / mail. It nudges you — and runs natural-language recipes. It started life as a 2025 email helper and widened into a messaging agent.

## Pain

People will not download the Nth AI app, and a bot that only answers when asked misses the invoice that landed at midnight.

## Approach

Message-native UI. Proactive nudges. Recipes over dashboards. Multi-model routing plus a public privacy story.

## Story and why it worked

- **2025:** $15M seed at $100M, General Catalyst-led (later recaps).
- **Mar 2026:** public launch.
- **Apr 2026:** +$10M, **$300M** post-money, **$25M** disclosed total (TechCrunch-cited).
- **Jun 2026:** first standalone third-party agent on Apple Messages for Business.
- **23 Jul 2026:** Cognition acquires Interaction. Von Hagen told TechCrunch the deal was **low nine figures**. Coverage also cites **100M+** messages in ~three months.

## Results

| Metric | Public figure | Source |
| --- | --- | --- |
| Funding | $25M disclosed | Apr 2026 coverage |
| Valuation | $300M (Apr 2026) | Same |
| Messages | 100M+ | Acquisition coverage |
| Exit | Cognition, Jul 2026 | TechCrunch |

## How an ordinary builder copies this

Ship in a chat surface. Trigger nudges. Treat compliance as the ticket onto iMessage / WhatsApp.

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
      { zh: "9 個月 MRR", en: "MRR at month 9", value: "$112K" },
      { zh: "YC 自述 ARR", en: "YC-stated ARR", value: "$2.5M" },
      { zh: "付費客戶", en: "Customers", value: "2,000+" },
      { zh: "YC", en: "YC", value: "S26" },
    ],
    summaryZh:
      "三名有過 Exit 的法國連續創業者做「意圖優先」的 B2B 開發 Agent：監測訊號、補全聯絡方式、自動約 Demo。YC Launch 自述 9 個月 $11.2 萬 MRR，其後頁面寫 10 個月 $250 萬 ARR。",
    summaryEn:
      "Three French repeat founders (each with a prior exit) built an intent-first B2B outbound agent. Their YC Launch post says $112K MRR in nine months; the YC profile later states $2.5M ARR in ten months and 2,000+ customers.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Gojiberry AI](https://gojiberry.ai/) 由 **Pierre-Eliott Lallemant**（CEO）、**Romàn Czerny**（CMO）與 **Dylan Teixeira**（CTO）創辦，入選 **Y Combinator Spring 2026**。官網一句話：Agent 找出高意圖買家，自動在 Email／社群上接觸並約會議。

三人不是第一次創業。YC／創辦人自述：Pierre-Eliott 與 Romàn 賣過 Shopify 生態的 CoCo AI（自稱約 $50 萬 ARR）；Dylan 賣過出席系統 Edusign。Gojiberry 把他們賣上一家公司時手動在做的事——看訊號、補名單、寫私訊——收成一條 Agent。

## 痛點

中小 B2B 團隊同時買 Apollo（名單）、Clay（清洗）、群發工具與 CRM，卻仍在對「現在沒有購買時機」的人寄信，回覆率停在個位數。請一個全職 SDR 年薪數萬美元，多數時間耗在整理表格。

## 方案

YC Launch 把迴路寫死：

1. **意圖訊號。** 融資、職位異動、競品互動等，而不是買一份死名單狂發。
2. **瀑布補全 + ICP 打分。**
3. **依訊號寫的 LinkedIn／Email。**
4. **用回覆率回灌下一批文案。**

官網寫「Trusted by 2,000+ sales & GTM teams」。公開討論常見 **$99／月** 起步價，價目會改，下單前看官網。

## 成功故事與成功之道

全部是**創辦人／YC 自述**，不是審計財報：

- Launch 文：**$0 → $112K MRR／9 個月**，並寫 **44% MoM**、當時約 **$1.4M ARR**。
- YC 公司頁後續口徑：**10 個月 $2.5M ARR、30% MoM、2,000+ 客戶、已獲利**（他們自己的形容）。
- 第三方 Stripe 同步網站曾在 2026 年 8 月打出更高 MRR，但憑證過期後不再可信，**本頁不採用爬蟲數字當主表**。

成功之道：用「約到 Demo」收費，而不是再賣一個名單工具；連續創業者把手動服務先驗證，再自動化。

## 成績

| 指標 | 公開／自述數字 | 來源口徑 |
| --- | --- | --- |
| 9 個月 MRR | $112K | YC Launch |
| 其後 ARR | $1.4M → $2.5M（10 個月） | Launch／YC 頁 |
| 客戶 | 2,000+ | YC 頁、官網 |
| 梯次 | Spring 2026 | YC |
| 融資 | YC 標準種子支票 | YC（未見超大 A 輪稿） |
| 回覆率 | 「傳統 outbound 的 2–5 倍」 | 創辦人／客戶自述 |

## 普通人如何複製

- 先盯**時機訊號**，再寫信。
- 把監測、補全、觸達做成一條按鈕，而不是四個分頁。
- B2B 最好賣「日曆上多了會議」，不要只賣「省時間」。
- 注意平台政策：自動化 LinkedIn 有被封的真實風險，這是此模式的結構性弱點，不是細枝末節。

## 創業者與矽谷視角

YC 投這家，是因為舊 Sales stack 又重又失效。Gojiberry 的主張是用一個會學習的 GTM 大腦取代四種工具。護城河若成立，會落在**訊號與時機**，而不是「會用 LLM 寫信」（人人都會）。創作者能學的是：先做貴的手動服務證明句子，再寫 Agent。
`,
    bodyEn: `
## What the company actually does

[Gojiberry AI](https://gojiberry.ai/) was founded by **Pierre-Eliott Lallemant**, **Romàn Czerny**, and **Dylan Teixeira**, and joined **YC Spring 2026**. The agent finds buyers showing intent, enriches them, and books meetings. The three are repeat founders (CoCo AI, Edusign — founder-reported exits).

## Pain

SMBs juggle Apollo + Clay + a mailer + CRM, then email people with no timing. A full-time SDR spends the year cleaning lists.

## Approach

Detect intent → enrich and score → signal-based outreach → learn from replies. The site claims 2,000+ GTM teams. Treat $99/month as a commonly cited list price, not a forever number.

## Story and why it worked

Founder / YC claims, not audited statements: **$112K MRR in 9 months** on the Launch post; later YC copy says **$2.5M ARR in 10 months**, 2,000+ customers, profitable. We do not promote expired third-party Stripe scrapes as current MRR.

## Results

| Metric | Stated figure | Source |
| --- | --- | --- |
| MRR at 9 months | $112K | YC Launch |
| ARR | $2.5M at 10 months | YC profile |
| Customers | 2,000+ | YC + site |
| Batch | S26 | YC |

## How an ordinary builder copies this

Sell meetings, not another list tool. Prove the sentence as a manual service, then automate. Budget for LinkedIn ToS risk.

## Founder / Silicon Valley read

YC is underwriting the collapse of the four-tool sales stack. The durable piece is timing and signals — everyone already has an LLM that can write email.
`,
  },
];
