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
      "白天當工程師、晚上幫女兒查玩具：一位爸爸做了「麥當勞玩具地圖」。10 天湧入 12.7 萬人，創辦人估算幫美國玩家省下超過 1,600 萬美元和 60 萬小時。",
    summaryEn:
      "A software engineer spent nights mapping Happy Meal toys for his daughters. In 10 days the free map pulled in 127,000 users and, by the founder’s model, saved U.S. collectors more than $16M and 600,000 hours.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

麥當勞出聯名玩具時，官方 App 往往不告訴你「這家店還有沒有這一款」。一位工程師爸爸晚上自己做了地圖，10 天內 12.7 萬人來用。創辦人估算，幫美國收集者省下超過 1,600 萬美元和 60 萬小時。

## 這個產品在做什麼

[Happy Toy Scout](https://happytoyscout.com/) 是 2026 年 8 月上線的免費地圖。創辦人 Brian 白天是正職軟體工程師，晚上要幫兩個女兒蒐集美國麥當勞的聯名玩具「Hello Kitty & Friends × Godzilla」。他發現官方 App 完全不告訴你這家店今天有哪一款。這些消息散在 Reddit、Facebook 和聊天群組裡。

Brian 用 3 天做出第一版。全美的人可以用郵遞區號和地圖，查看並回報近 14,000 家麥當勞的玩具、缺貨，以及能不能單買、能不能指定款。這不是麥當勞的官方介面。資料是大家自己回報的。

## 以前這件事有多麻煩

盲盒和限量玩具最煩的是最後一哩。麥當勞只告訴你這家有賣快樂兒童餐，不說今天給的是 8 款裡的哪一款。家長為了湊齊一套，常常盲買十幾份，或開車跑半個城市，花掉汽油和時間，還吃下幾十份其實不用吃的套餐。

獨立開發者很容易以為：沒有官方介面，就做不成即時庫存。這張地圖說明，只要這件事夠急、人也夠在意，大家願意自己回報，不必先跟企業一家一家接。

## 他們怎麼把這件事做出來

用法很短。輸入郵遞區號，或指定一個角色，地圖上就看到附近門市和最新回報時間。到店之後按一下，回報還有沒有貨、能不能單買玩具、能不能指定款，再分享到本來就在問的群組。

為了撐住流量，Brian 在上線後 10 天部署了 122 次。他把近 14,000 間門市的經緯度先存起來，地圖只畫你正在看的那一塊，篩選也加快，所以上萬人同時看的時候還是順的。他沒有上鎖，也沒有硬推訂閱。伺服器費用靠 Buy Me a Coffee 和 Venmo 的小額贊助。

## 做到哪裡了

數字來自 Brian 在官網發的《10-Day Review》、《About the Data》，以及 Reddit 和各地社群的討論。

- 2026 年 8 月中旬，配合全美「Hello Kitty × Godzilla」開跑，第一版上線。前 3 天做完大約八成主要功能。
- 上線 10 天內，到 2026 年 9 月 5 日：獨立用戶超過 127,000 人，頁面瀏覽 678,000 次，站內互動超過 200 萬次，實地回報超過 40,000 筆，平均停留 5 分 04 秒。
- 上線 3 週內：累計回報超過 57,000 筆，涵蓋全美 41 州、超過 1,500 間門市。
- Brian 自己算的影響：幫玩家省下大約 63 萬到 137 萬小時的空跑和排隊，少買 190 萬到 344 萬份重複餐點，大約省下 1,650 萬到 3,290 萬美元。這是他的模型，不是審計過的帳。

三件事疊在一起：

1. 趕上這波聯名。Sanrio 和哥吉拉又好分享、又缺貨，產品卡在大家最想要的那幾天。
2. 沒花廣告費。他直接把地圖貼到 r/Hawaii、r/kidsmeal、r/GODZILLA、r/HelloKitty 和各大城市版，回答版上一直在問的「哪裡還有 #6 Cinnamoroll」。很快就變成收藏者預設會開的工具。
3. 把數字寫成新聞。他發了前 72 小時的報告，例如 My Melody 占回報 23.3%，大家以為最熱的 Hello Kitty 反而只有 9.0%。論壇會轉發這種短報。

| 你會看到的結果 | 數字 |
| --- | --- |
| 10 天造訪 | 127,000 人（官方《10-Day Review》，GA4） |
| 10 天頁面瀏覽 | 678,000 次 |
| 10 天站內互動 | 超過 200 萬次 |
| 累計回報 | 超過 57,000 筆，1,500 間以上門市、41 州 |
| 平均停留 | 5 分 04 秒 |
| 估算省下的時間 | 63 萬到 137.6 萬小時（創辦人的模型） |
| 估算省下的錢 | 1,650 萬到 3,290 萬美元（創辦人的模型） |
| 部署 | 10 天內 122 次 |
| 外面的投資 | 沒有，自己的副業 |

這些是 2026 年 8 月到 9 月活動期間的快照。

## 你要做一個小版本，可以從這裡開始

不要再做一張麥當勞地圖。學的是：熱點只有幾週，官方又不給細節，就讓大家自己回報。

- 找一件大家很急、官方又只給粗資訊的短期熱點。例如寶可夢卡開賣還有沒有貨、演唱會周邊在排哪、限量球鞋首發、災後哪裡缺貨。
- 不要等官方介面。畫面夠順，大家願意順手回報，換來整張地圖變清楚。
- 三天內要上線。這種熱點以週計算。八成功能能用就發，剩下的邊用邊改。
- 去已經在問的 Reddit、社團和 Discord，不要自己再蓋一個空社群。
- 把收回來的數字寫成一篇短報。數字本身就是最好的宣傳。

## 投資人為什麼肯付錢

Paul Graham 常說，先做那些大公司不屑做的具體小事，先解決自己真的很痛的那一件。Happy Toy Scout 就是一位工程師爸爸，為了幫女兒找玩具做出來的。機構投資人通常會跳過這種快閃專案，因為熱度短，也沒有長期月費。對獨立開發者，這正是速度和流量。

別人抄不走的不是技術，是你上線夠快，而且找客人的成本是零。這套「門市地圖、只畫看得到的範圍、大家回報、再寫一篇數據短報」，可以套到下一次寶可夢、BT21 或 Squishmallows。把地圖做成可以重用的模組，下一次全民在搶的東西出現時就能接上。大公司看不上的夾縫，一個人仍然做得出影響。
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
      "等 AI 寫程式時，人很容易滑走、回來就忘了自己在幹嘛。舊金山兩人團隊把短影片放進編輯器裡，YC 投了 50 萬美元；早期使用者說每小時大約省 15 分鐘。",
    summaryEn:
      "A two-person San Francisco team built Chad, the “brainrot IDE”: keep short video inside the editor during the 1–5 minutes an agent is thinking, then snap you back. YC put in $500K; early testers said they saved about 15 minutes an hour.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

請 AI 寫程式時，常常要空等 1 到 5 分鐘。這段空檔一滑手機，回來就忘了自己在做什麼。Chad 把短影片放進寫程式的畫面裡，AI 想完再把你拉回來。YC 投資 50 萬美元；早期測試者說每小時大約省 15 分鐘。

## 這個產品在做什麼

[Clad Labs](https://www.cladlabs.ai/) 由 Richard Wang 和 Kevin Le 在 2025 年於舊金山創立。Richard 是 Caltech 電腦科學、做過 AI 研究。Kevin 是 UIUC、之前在 Meta。他們入選 Y Combinator 2025 年秋季班，拿到 50 萬美元種子輪。

產品叫 Chad IDE。團隊自己戲稱這是第一個把短片放進編輯器的開發環境。它是給 AI 寫程式用的 Mac 工具，接了 Claude Code、Cursor 的命令列和 OpenAI Codex。工程師送出指令、等 AI 跑 1 到 5 分鐘的時候，側邊欄可以直接看 TikTok、X、Tinder 和小遊戲。程式一寫完，娛樂視窗立刻收起來，把人拉回鍵盤。

## 以前這件事有多麻煩

指令送出去之後，AI 要想 1 到 5 分鐘。這段時間長到不能乾等，又短到不夠你去做另一件需要專心的事。

多數人會拿起手機刷 TikTok、開瀏覽器或打遊戲。一離開編輯器，代價就來了。刷到忘記時間，或要花好幾分鐘才把思緒拉回剛寫到一半的邏輯。

## 他們怎麼把這件事做出來

Chad 把工作和等待時的分心放在同一個視窗裡：

1. AI 在想的時候，右邊給短片、社群動態或小遊戲。
2. 背景的助手一寫完，立刻把娛樂視窗收掉，人回到程式。
3. 可以接好幾家模型，重的工作可以在背景同時跑。
4. 收費是免費、Pro 一個月 15 美元、Pro Max 一個月 40 美元，看你用了多少 AI、能同時跑幾個助手。

## 做到哪裡了

時間來自 YC Launch、PitchBook 和開發者社群。

- 2025 年，Richard 和 Kevin 在舊金山成立 Clad Labs。
- 2025 年底錄取 YC 秋季班，拿到 50 萬美元，合夥人 Nicolas Dessaigne 指導。
- 2025 年 10 月，YC Launch 放出 Chad 的測試版，在 Hacker News、X 和開發者圈裡傳開。
- 早期測試裡，團隊的問卷和觀察說：換成 Chad 之後，平均每小時大約少被打斷 15 分鐘。這是他們自己的早期數字。

三個決定：

1. 傳統編輯器要求你絕對專心。他們承認，等 AI 的時候人本來就會分心。把分心留在編輯器裡，比禁止分心更容易把人留住。
2. 問題不是看短片，是看完忘記回去。娛樂在這裡像計時器。AI 一做完，就把人叫回來。
3. 他們公開感謝 Void、Pear AI 和 Continue。用現成的編輯器骨架，不從零重寫。

| 你會看到的結果 | 數字 |
| --- | --- |
| 成立 | 2025 年（官方／PitchBook） |
| 融資 | 50 萬美元種子輪，Y Combinator 2025 秋季班 |
| 團隊 | 2 人，Richard Wang、Kevin Le |
| 價錢 | 免費、一個月 15 美元、一個月 40 美元 |
| 節省的時間 | 大約每小時 15 分鐘（早期測試的問卷，不是第三方審計） |
| 產品 | Mac 編輯器、多個助手、娛樂側欄 |

## 你要做一個小版本，可以從這裡開始

不要再做一個「把 TikTok 嵌進編輯器」的東西。學的是怎麼處理那幾分鐘的空等。

- 找出流程裡的空檔：影片算圖、AI 繪圖、大型編譯、自動測試那兩分鐘。
- 不要只是叫人不要分心。在他們離開你的產品之前，先在裡面給一件不用動腦的小事。
- 等待結束時，用畫面和聲音把人叫回來。
- 站在現成的開源工具上，只改「等人的那幾分鐘」這一個體驗。

## 投資人為什麼肯付錢

YC 看中他們，是因為寫程式的人已經從自己逐行打字，變成看著 AI 做事。等人的那段空檔最煩。在編輯器裡滑一下短片，聽起來像笑話，其實是在填那段空檔。

Cursor 和 Windsurf 比的是生成得更快、更準。Clad Labs 比的是：AI 在算這 3 分鐘，人的注意力放在哪裡。就算以後算得更快，只要同時跑好幾個助手還有空檔，這件事就還有位置。
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
      "給家庭用的 AI 助手：自動讀學校郵件和家長群組，再告訴你明天要做什麼。創辦人來自 Uber 與 Instagram，Pre-Seed 融資 350 萬美元。",
    summaryEn:
      "An AI chief of staff for families, built by an Uber transit lead and an Instagram engineer. A $3.5M pre-seed funds a product that reads school mail and parent chats, then texts tomorrow’s list.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

學校郵件、家長群組每天一堆，忙起來根本看不完。Fambot 想當家庭的小助手：幫你讀這些訊息，再整理成明天要做的事。創辦人來自 Uber 與 Instagram，Pre-Seed 融資 350 萬美元。

## 這個產品在做什麼

[Fambot](https://www.fambot.com/) 是 2026 年上線的家庭助手。CEO David Reich 之前帶 Uber 的公共交通團隊，自己有三個孩子。技術長 Greg Karlin 之前在 Instagram。Jason Morrow 來自 Google 和 LinkedIn。

你授權一次，接上 Gmail、Outlook、Google 日曆和 WhatsApp 家長群。它在背景讀這些訊息，抽出活動、繳費和回覆的截止日、戶外教學同意書、學校主題日要穿什麼。每天晚上或清晨，用簡訊或 App 送一份很短的「明天家裡要做的事」。兩個家長不用自己輸入，看到的是同一份。

## 以前這件事有多麻煩

美國大約有 4,300 萬個家裡有 16 歲以下孩子的家庭。家長忙完一天，往往還要花 1 到 2 小時翻幾十封學校信、PDF 校刊、運動社團公告，以及洗版的 WhatsApp 家長群，只為確認明天孩子該穿什麼、家長座談會哪天截止。

Cozi 或共用的 Google 日曆都要家長自己鍵入。缺的不是另一本日曆。缺的是家長已經沒有力氣，從一堆碎片裡梳出明天該做的三件事。

## 他們怎麼把這件事做出來

1. 連一次就好。開戶時接上信箱和通訊軟體，不用再轉寄、截圖、貼標籤。
2. 學校週報和群組裡的「下週二校外教學要自備午餐」「明天是瘋狂髮型日」，會變成日曆上的事和待辦。
3. 定時傳「明天家裡的計畫」。家長可以直接回簡訊問細節、加一件事或改行程，不必再開一個 App。
4. 兩個家長共用一個帳號，也把兩個人的信箱接在一起。兩人收到同一份摘要，就少掉「你沒看學校那封信嗎？」
5. 用 OAuth、只讀。他們承諾不賣這些資料，也不拿去給別的模型訓練。

## 做到哪裡了

時間來自 Dealroom 2026 年 9 月的報導、Konsulteer 和官方說明。

- 2025 年初，David 和 Greg 因為自己在扛家裡的行政，先做了原型。後來 Jason 加入。
- 正式公開前，已經有超過 1,000 個家庭在試，包括雙薪、單親和多個孩子的家庭。
- 2026 年 9 月公開 iPhone、Android 和網頁，並宣布 350 萬美元的早期融資。NextView Ventures 和 Baukunst 領投，Correlation Ventures、Karman Ventures、Founders Network 跟著投。

三件事：

1. 多數 AI 助手在搶辦公室效率。他們選的是家裡每天都會發生、又讓人焦慮的資訊。
2. 別的產品常要你主動聊天或上傳。他們要的是連一次，後面自己在背景整理。
3. 重點直接送到手機簡訊。回一句就能互動，不用先養成打開另一個 App 的習慣。

| 你會看到的結果 | 數字 |
| --- | --- |
| 早期融資 | 350 萬美元（Dealroom，2026 年 9 月） |
| 領投 | NextView Ventures、Baukunst |
| 試用家庭 | 超過 1,000 戶 |
| 創辦人 | David Reich（Uber）、Greg Karlin（Meta）、Jason Morrow（Google） |
| 接上的 | Gmail、Outlook、Google 日曆、WhatsApp |
| 現在的價錢 | 測試期免費。官方說以後可能接近 Netflix 的月費 |

## 你要做一個小版本，可以從這裡開始

不要再做一本家庭日曆。找資訊很碎、人又沒力氣自己整理的場景。

- 例如大廈管理處通知、寵物看病、長輩看不同科的門診。
- 讓它在背景把信讀完，再交出一張清單。不要做成要人每天打開來聊天的機器人。只有該做事的時候，才把清單送出去。
- 互動放在簡訊、LINE 或 WhatsApp 裡。
- 讓兩個人看同一份清單。兩個人都依賴它之後，就比較不會換成別家。

## 投資人為什麼肯付錢

很多投資人覺得給一般人用的 AI 很快會不用、一個人付的錢也不多。這輪 350 萬美元說明：產品打中家裡的心理負擔時，機構願意在很早的階段就投。

別人抄不走的不是你呼叫哪一家模型，是家長肯把孩子和私人行程交給你，以及兩個大人一起用之後的習慣。後進者很難再把這份信任搶走。
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
      "做在 iMessage 裡的人脈工具：沒有動態牆、沒有粉絲數，雙方都同意才介紹。兩個耶魯學生兩週內融到 310 萬美元。",
    summaryEn:
      "Two Yale students put a social network inside iMessage: no feed, no follower counts, warm intros only after both sides say yes. They raised $3.1M in two weeks; later coverage puts total funding between $5.1M and $8.2M.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

不想再下載一個社交 App，也不想在動態牆上表演。Series 把人脈放進 iMessage：沒有粉絲數，雙方都點頭才介紹認識。兩個耶魯學生兩週內融到 310 萬美元。

## 這個產品在做什麼

[Series](https://series.so/) 由耶魯學生 Nathaneo Johnson 和 Sean Hargrow 在 2024 到 2025 年創立。它不做「再下載一個 App、再刷一堵動態牆」。整個人脈放進 iPhone 內建的 iMessage。

不用裝新 App。在 iMessage 裡傳訊給自己的 AI 朋友，說說背景、興趣、想認識什麼人。它在背景找志同道合或剛好互補的人。雙方都同意之後，才在藍色對話框裡介紹你們認識。

## 以前這件事有多麻煩

年輕人和剛開始創業的人，已經很累於在社交媒體上表演。Instagram 要經營人設，LinkedIn 要演職涯，TikTok 要追數字。公開動態牆讓人發文都累，越來越少人願意在公開網路上做自己。

突然私訊，成功率很低。付費人脈社群又貴、門檻又高。缺的不是另一個社交 App。缺的是一條不用表演、又有一點信任的私下介紹。

## 他們怎麼把這件事做出來

1. 藍色簡訊就是介面。跟自己的 AI 說話，不用開瀏覽器，也不用下載。
2. 雙方都同意才介紹。它先私下問兩邊願不願意認識，兩邊點頭才開聊，不會突然打擾。
3. 沒有粉絲數、沒有按讚、沒有公開動態牆，也沒有公開檔案。只有一對一，或很小的群組。
4. 它記得你的近況和需求，像一位幫你找人的助理，在校園、創業、工作和同好圈裡找連結。

## 做到哪裡了

時間來自 Tech-ish、Silicon Snark、Tracxn 等報導。

- 2024 年底，兩人從校園 podcast 和黑客松做出早期的媒合機器人。
- 2025 年 4 月，LinkedIn 上一則示範傳開。14 天內，由 a16z 前投資人 Anne Lee Skates 的 Parable 領投，完成 310 萬美元。Pear VC、Draper 基金、Reddit 執行長 Steve Huffman、GPTZero 創辦人 Edward Tian 跟著投。
- 2025 年底到 2026 年：累計訊息超過 100 萬則，每天活躍超過 10,000 人。後來的融資報導寫到 510 萬美元，有的寫到 820 萬美元，含後續種子輪。所以這頁用的區間是 510 萬到 820 萬美元。

三件事：

1. 美國年輕人對藍色簡訊的打開率和信任都比較高。Series 不跟下載率很低的獨立 App 搶，直接活在每天都在用的訊息裡。
2. 別人用短片搶注意力。Series 沒有動態牆、沒有追蹤人數，剛好打中已經厭倦表演的人。
3. 先做耶魯、普林斯頓、東北大學這些校園裡的創業和求職圈。口碑起來之後，再複製到金融、設計和科技。

| 你會看到的結果 | 數字 |
| --- | --- |
| 融資 | 510 萬到 820 萬美元（Tech-ish、Silicon Snark、Tracxn，2025 到 2026） |
| 主要投資人 | Parable、Pear VC、Tim Draper、Reddit 執行長 |
| 交換的訊息 | 超過 100 萬則（官方，2025 年 12 月） |
| 每天活躍 | 超過 10,000 人（官方） |
| 創辦人 | Nathaneo Johnson、Sean Hargrow，耶魯 |
| 在哪裡用 | Apple iMessage |

## 你要做一個小版本，可以從這裡開始

不要重做一個「iMessage 裡的 AI」。學的是：人已經在用的聊天工具裡，做一對一的介紹。

- 選 iMessage、WhatsApp、LINE 或 Telegram。不要先叫人下載新 App。
- 做很小的連結，不要做公共廣場。一對一、雙方都同意，人比較會留下來。
- 讓人用白話說需求，例如「我想找懂 Rust 的人」。在背景比對，不要叫人自己翻目錄。
- 先在一個消息傳得很快的小圈子做熱，再往外擴。

## 投資人為什麼肯付錢

投資人很怕新的社交 App，因為找客人很貴，人也留不住。Series 能在 14 天內拿到 310 萬美元，後來超過 500 萬，是因為它回應的是：人們不想再表演。

他們看重的是 iMessage 裡的信任，以及 AI 幫你找人的那一步，不是你自己擁有一個 App。整套產品站在 Apple 上，平台風險是真的。它留給下一波個人 AI 社交的，是一個很簡單、不用表演的做法。
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
      "不用下載新 App，在 iMessage 或簡訊裡就能用的 AI 助理。團隊拿到 2,500 萬美元，三個月超過 1 億則對話，後來被 Cognition 收購。",
    summaryEn:
      "TUM alumni put a personal agent in iMessage and SMS — no new app. They raised $25M at a $300M valuation, became the first third-party agent on Apple Messages, crossed 100M messages in three months, and were acquired by Cognition.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

不想再裝一個 App？Poke 讓你直接在 iMessage 或簡訊裡跟 AI 助理說話。團隊拿到 2,500 萬美元，公開說法是三個月超過 1 億則對話，後來被 Cognition 收購。

## 這個產品在做什麼

Poke（[poke.com](https://poke.com/)）由 The Interaction Company 開發。CEO Marvin von Hagen 和技術長 Felix Schlegel 是慕尼黑工業大學的校友，在 Palo Alto 創立。Marvin 做過 Tesla，也在 MIT 做過數據研究。

它不做獨立 App。助手放進手機裡本來就有的訊息：iMessage、簡訊、WhatsApp 和 Telegram。你在官網留電話，授權 Google 日曆、Gmail、Outlook、Oura 或 Notion，就可以像跟朋友傳訊一樣，用文字或語音請它清信箱、排行程、追帳單、處理瑣事。

## 以前這件事有多麻煩

效率類的 AI 已經成千上萬。多數人不想再下載，也常常忘記打開 ChatGPT 或 Claude。

傳統聊天機器人永遠在等你先開口。沒回的信、快到期的發票、明天航班改期，往往發生在你忘記問的時候。

## 他們怎麼把這件事做出來

1. 不用裝新 App，也不用學新的後台。在 iMessage 或 WhatsApp 裡傳訊，就像跟助理聊天。
2. 它會自己看日曆和信箱，然後傳一句：「你明早 9 點有跨國會議，要不要我把昨天那位客戶的 3 封信做成摘要？」
3. 你可以用白話設規則，例如「每週五下午彙整一週報告」，或「發票超過 100 美元就傳訊給我」。跨系統的介面被收成對話。
4. 底層接 OpenAI、Anthropic 和 Mistral，依任務選模型。還有一個最高隱私模式，拿過 SOC 2 Type II 和 Apple 的企業級隱私認證。

## 做到哪裡了

時間來自 Dealroom、Observer、Carly AI 和 2026 年的收購公告。

- 2025 年底在矽谷封閉測試，超過 6,000 名早期使用者來自 OpenAI、Google、Stripe 和 Anthropic，每個月互動超過 20 萬則。
- 2026 年 3 月正式開放。其後 Spark Capital 和 General Catalyst 領投 2,500 萬美元，其中 1,500 萬是種子輪、1,000 萬是擴充。投後估值 3 億美元。投資人包括 Stripe 創辦人 Collison 兄弟。
- 2026 年 6 月，Apple 批准它成為第一個直接接進 Apple Messages for Business 的第三方 AI 助手。
- 2026 年 7 月，公開大約 3 個月，訊息超過 1 億則。同月，做 Devin 的 Cognition 宣布收購 Poke，把它當成給一般人用的通用助手。

三件事：

1. 它進到 iPhone 預設的訊息框裡。這個位置很難再有第二家。
2. 早期測試就發現，人不只用它辦事，也會問感情和生活。Poke 被調成幽默、體貼的朋友，不是冷冰冰的軟體。
3. 不綁死一家模型。寫信、做表、查機票，各自選比較快、比較便宜的那一個。

| 你會看到的結果 | 數字 |
| --- | --- |
| 融資 | 2,500 萬美元，估值 3 億美元（Spark、General Catalyst） |
| 累計對話 | 超過 1 億則，公開大約 3 個月（Cognition 收購說明，2026 年 7 月） |
| 收購 | 2026 年 7 月由 Cognition 收購 |
| Apple | Apple Messages for Business 第一家第三方 AI |
| 在哪裡用 | iMessage、簡訊、WhatsApp、Telegram |
| 價錢 | 免費、Pro 一個月 19 美元、Ultra 一個月 199 美元（官網，2026） |

## 你要做一個小版本，可以從這裡開始

把產品放進使用者已經在看的地方。

- 如果核心是文字，先問能不能活在 LINE、WhatsApp、Telegram 或郵件回覆裡，不要先畫一個新 App。
- 不要只等別人來問。資料有變動時，在對的時間主動傳一句。人會比較常回來。
- 把一堆介面收成幾句人話，不懂技術的人也能設自動化。
- 一碰到簡訊和私人信箱，SOC 2 這類認證就是讓用戶放心、也讓 Apple 和 Google 放行的門票。

## 投資人為什麼肯付錢

Cognition 買 Poke，是 2026 年很有代表性的一次收購。很多人覺得給一般人用的 AI 留不住人。Poke 用不到 15 個月走完上線、3 億美元估值、被買走。

Cognition 執行長 Scott Wu 的分法是：Devin 是公司裡的重型助理，Poke 是生活裡比較輕、會主動找你的助理。兩邊都是一直開著的雲端助手。模型越來越便宜之後，誰佔住使用者已經在打字的那個框，誰又能主動傳訊息給他，誰就拿到這輪的分發。
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
      "幫公司業務找「現在真的有興趣」的客戶，而不是狂發陌生郵件。三個法國創辦人 9 個月把月收入從 0 做到 11.2 萬美元，並入選 Y Combinator。",
    summaryEn:
      "Three French repeat founders built an intent-first GTM agent. They went from $0 to $112K MRR in nine months, joined YC, and now state $2.5M ARR and 2,000+ paying teams.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

傳統業務常是狂發陌生郵件，回覆很少。Gojiberry 改成先找出「現在真的有興趣」的公司，再去聯絡。三個法國創辦人 9 個月把月經常收入從 0 做到 11.2 萬美元，並入選 Y Combinator。

## 這個產品在做什麼

[Gojiberry AI](https://gojiberry.ai/) 由三位都賣過上一間公司的法國創辦人在 2025 年創立：Pierre-Eliott Lallemant、Romàn Czerny 和 Dylan Teixeira。他們入選 Y Combinator 2026 年春季班。

傳統業務是手動找名單、亂發沒人要的信。Gojiberry 改成全天候看 LinkedIn 和公開網路上 30 多種「這家公司現在可能想買」的訊號，例如高層換人、公司剛融資、有人在對手的專頁留言或按讚、發出特定關鍵字。抓到之後，用 15 家以上的資料來源補上信箱、跟理想客戶比一比，再發比較像人寫的 LinkedIn 私訊和郵件，幫業務把示範會議約上日曆。

## 以前這件事有多麻煩

業務要在 Sales Navigator、Apollo、客戶資料庫和群發工具之間跳來跳去，對完全沒有購買時機的名單發沒有針對性的信。平均回覆率長期停在 2% 到 3%。

小團隊買到的，常常只是「你叫它發它就發」的腳本。沒有人告訴你哪種客戶、哪個時間點、哪句開場真的約得到會。請一名全職開發業務的人，一年 6 萬到 8 萬美元，多數時間卻在整理名單和發信。

## 他們怎麼把這件事做出來

一條路：先看到訊號，再打分，再聯絡，再約成會議。

1. 即時訊號。對手專頁的互動、行業裡有影響力的人的留言、高層異動、融資消息，一共 30 多種。
2. 人被抓到之後，先跟理想客戶比對，再用 15 家以上的供應商補公司信箱。
3. 信要對得上那個訊號。例如「看到你們剛完成 A 輪」，再發 LinkedIn 或郵件。
4. 記下哪種訊號、哪種文案回覆率最高，下一波就改。Pro 大約一個月 99 美元，中小企業比較進得去。

## 做到哪裡了

時間來自 YC Launch、Tracxn 和業界評測。

- 2025 年，三人賣掉上一間軟體公司之後，在舊金山和巴黎創立 Gojiberry。
- 上線 9 個月內，每月經常性收入從 0 到 11.2 萬美元，一年大約 140 萬美元，每個月大約成長 44%，付費的公司客戶超過 1,000 家。
- 2026 年春季入選 YC，拿到 50 萬美元種子輪。一年的收入規模再到 250 萬美元，付費客戶超過 2,000 家。

三件事：

1. 先看時機，不先拼數量。傳統做法靠 1,000 封冷信換 2% 回覆。Gojiberry 只挑正在找解法的 50 個人。客戶自己測的回覆率，常常是傳統做法的 2 到 5 倍。這是客戶實測的平均，不是第三方審計。
2. 三個人在 CoCo AI、Edusign 這些專案裡練過怎麼把產品送出去，知道怎麼用最輕的做法先驗證公司真的願意付錢。
3. 成果直接是日曆上多了幾場示範會議。這比「幫你省時間」更容易讓人付一個月 99 美元。

| 你會看到的結果 | 數字 |
| --- | --- |
| 每月經常性收入 | 超過 11.2 萬美元，上線 9 個月（YC Launch） |
| 一年的收入規模 | 從大約 140 萬美元到 250 萬美元（YC 頁和創辦人說明） |
| 每月成長 | 大約 44%（YC） |
| 付費客戶 | 從 1,000 家以上到 2,000 家以上 |
| 融資 | 50 萬美元，YC 2026 春季班 |
| 回覆率 | 客戶實測大約是傳統陌生開發的 2 到 5 倍 |
| 創辦人 | Pierre-Eliott、Romàn、Dylan，都賣過上一間公司 |

## 你要做一個小版本，可以從這裡開始

不要先海量發信。先抓住時機。

- 先找出這個行業裡「現在可能想買」的觸發點：有人離職、公司融資、換工具、在對手專頁互動。
- 把監測、補資料、發信收成一條路，不用在四個分頁之間跳。
- 賣給公司的時候，最好賣「日曆上多了會議」，不要只賣「省時間」。
- 先在一個回覆比較高的地方做透，例如 LinkedIn，再擴到別的管道。

## 投資人為什麼肯付錢

YC 投這家，是因為傳統的業務工具又重又不好用。以前公司要分開買 Apollo 找名單、Clay 清洗、Smartlead 群發、Salesforce 記客戶。Gojiberry 把這一疊收成一個會自己改策略的助手。

它不是只叫模型寫信。它抓住的是時機和訊號。這也解釋得了，為什麼 9 個月可以把一年的收入做到一百萬美元以上。
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
