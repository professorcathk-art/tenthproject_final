import { CASE_SEED_MARKER } from "@/lib/inspiration/constants";
import type { SeedCase } from "@/lib/seed/case-studies-batch2";

export const BATCH3_CASES: SeedCase[] = [
  {
    id: "44444444-4444-4444-4444-444444444421",
    title: "Raven (Graylark / GeoSpy)",
    slug: "raven-geospy",
    category: "tooling",
    categories: ["tooling", "saas"],
    website: "https://www.withraven.ai/",
    highlights: [
      { zh: "官方網站", en: "Site", value: "withraven.ai" },
      { zh: "前身產品", en: "Predecessor", value: "GeoSpy" },
      { zh: "種子輪", en: "Seed", value: "$10.7M" },
      { zh: "母公司", en: "Company", value: "Graylark" },
    ],
    summaryZh:
      "丟一張沒有定位的照片，AI 看建築、植物、路牌，估這張照片在哪裡拍。GeoSpy 團隊把它做成 Raven，從網頁試用做到給調查單位用。",
    summaryEn:
      "Upload a photo with no GPS and the model infers a location from buildings, vegetation, and street clues. The GeoSpy team rebranded the stack as Raven, spanning a light web trial and agency-grade investigations.",
    bodyZh: `${CASE_SEED_MARKER}
## 先講人話

照片被清掉定位之後，通常很難知道在哪裡拍。Raven 看的是畫面本身：房子、路牌、植物、路面。GeoSpy 團隊把它升級並改名，從網頁試用做到給執法與企業調查用。

## 這間公司做什麼

[Raven](https://www.withraven.ai/) 是波士頓 AI 公司 [Graylark Technologies](https://graylark.com/) 的視覺情報產品。團隊最早以 [GeoSpy](https://geospy.ai/) 打出名號：使用者把一張沒有 EXIF／GPS 的照片丟進去，模型只靠畫面裡的建築、路牌、植被、地貌與道路標線，在數秒內估出城市、地區與國家，並給出信心分數。2026 年 4–5 月，Graylark 公開把 GeoSpy **升級並更名為 Raven**，官網改走 [withraven.ai](https://www.withraven.ai/)（舊稱 withraven.net 已不再是主站）。

今天的產品線其實是一條漏斗：網頁／試用讓普通人體驗「這張圖大概在哪」，同源技術再賣給新聞查核、保險理賠與執法單位，見 [Graylark 的 Raven 介紹](https://graylark.com/raven) 與 [GeoSpy 遷移說明](https://graylark.com/geospy)。創辦人 Daniel Heinen 在 2026 年 5 月的[新聞稿](https://www.prnewswire.com/news-releases/graylark-technologies-launches-raven-the-next-evolution-of-geospy-302768464.html)裡說：GeoSpy 只負責找地點，Raven 還要讀懂車輛、判真假圖、把低畫質截圖變成可行動線索。

## 痛點

Instagram、X、Facebook 上傳時會抹掉 EXIF／GPS。記者要核實一則突發影像、OSINT 社群要追一張風景照、旅人想知道「這到底在哪一國」，傳統以圖搜圖只能比對「網路上已經出現過的同一張圖」。自己剛拍、從未發佈的原創照片，搜尋引擎幫不上忙。

過去要靠視覺線索估地點，幾乎等於當 GeoGuessr 職業選手：記路牌字型、記樹種、記電線桿。普通人缺的不是再一個聊天視窗，而是一個「只做這一件事」的地理幕僚。

## 方案

Raven／GeoSpy 把專業地理推理收成一條短迴路：

1. **不依賴 EXIF。** 沒有 GPS 也分析門面、屋頂、植被帶與地表。
2. **網頁先試、隱私說清楚。** [服務條款](https://www.withraven.ai/tos/)寫明可經網頁、App 或 API 使用，試用須審核，正式使用要付費。官方針對調查場景強調：重點是地點與景物，不是拿來做人臉追蹤。
3. **同一套模型，兩邊變現。** 輕量 Web／App 體驗吸地理迷與查核者；[企業與執法版本](https://graylark.com/raven)賣街景級定位、車款辨識與影像真偽。

## 成功故事與成功之道

公開時間線（綜合 Graylark 官網、PR Newswire 與 PitchBook／創辦團隊公開資訊）：

- 2022–2023：Daniel Heinen 與團隊在波士頓做視覺與安全工具，做出 GeoSpy 核心演算法。
- 2024–2025：GeoSpy 在 OSINT、GeoGuessr 玩家與短影音社群傳開，成為「沒有 GPS 也能估地點」的代名詞；Graylark 官網寫明種子輪約 **$10.7M**，投資人公開名單包括 General Catalyst、Hatch 等早期機構。
- 2026 年 4–5 月：產品線更名 Raven，官網改為 [withraven.ai](https://www.withraven.ai/)，並把能力從「找地點」擴成視覺情報平台。

成功之道可以收成三句：

1. **把情報級能力做成 10 秒玩具。** 「丟張圖看 AI 猜不猜得中」天然會被轉發。
2. **免費／試用漏斗養 B2B。** 大眾端驚艷一次，再導向 App 或機構授權。
3. **先畫紅線。** 公開講只做景物與地點、避開人臉追蹤，才過得了新聞與政府採購的門檻。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| 消費端網站 | [withraven.ai](https://www.withraven.ai/) | 官方 |
| 前身／品牌 | GeoSpy → Raven（2026.04） | [Graylark](https://graylark.com/geospy) |
| 種子輪 | 約 $10.7M | Graylark 官網 |
| 核心能力 | 無 GPS 地理推算、街景定位、車款、真偽 | [Raven 產品頁](https://graylark.com/raven) |
| 主要場景 | 旅遊辨位、事實查核、OSINT、執法 | 官方說明 |

數字會變，以上是 2026 年公開快照，不是審計財報。

## 普通人如何複製

不要重做一個「全球情報平台」。要複製的是封裝方式：

- 找有社交貨幣的「判讀」場景：拍植物看病蟲害、拍老照片估年份、拍店招猜城市。
- 讓第一秒結果值得拿去挑戰朋友。
- 用網頁當免費漏斗，不要一進來就逼下載 App、綁卡。

## 創業者與矽谷視角

ChatGPT 也能看圖，但 Raven 證明**垂直空間 AI** 仍有位置：專門微調過的地貌與路牌模型，比通用聊天窗更穩、更能標信心。Graylark 走的是「大眾端玩具 → 機構端訂閱」雙軌。風險也很清楚：地理定位一旦被濫用，就是隱私與出口管制問題；護城河不在「會看圖」，而在資料、審核流程與誰敢把案件交給你。
`,
    bodyEn: `
## What the company does

[Raven](https://www.withraven.ai/) is Graylark Technologies’ visual-intelligence product. The same Boston team first shipped [GeoSpy](https://geospy.ai/): drop in a photo with no EXIF/GPS, and the model infers a city or country from buildings, signs, plants, and road markings. In April–May 2026 Graylark [rebranded GeoSpy as Raven](https://graylark.com/geospy). The consumer site is [withraven.ai](https://www.withraven.ai/), not withraven.net.

The funnel is deliberate: a light web/app trial for “where was this taken?”, then the same stack sold to newsrooms, insurers, and agencies. See [Raven’s product page](https://graylark.com/raven) and the May 2026 [launch note](https://www.prnewswire.com/news-releases/graylark-technologies-launches-raven-the-next-evolution-of-geospy-302768464.html). Founder Daniel Heinen’s line: GeoSpy found places; Raven also reads vehicles, flags fakes, and turns a blurry screenshot into a lead.

## Pain

Social apps strip GPS. Reverse image search only matches photos that already live on the web. A reporter, an OSINT volunteer, or a traveller with an original shot needs someone who can *read the scene*.

## Approach

No EXIF required. A short web trial with a privacy line: analyse place and scenery, not faces. Same models, two prices — curiosity on the web, casework for agencies ([terms](https://www.withraven.ai/tos/)).

## How it worked

2022–23: core GeoSpy models. 2024–25: OSINT and GeoGuessr word of mouth; Graylark cites a **$10.7M** seed. 2026: Raven name, [withraven.ai](https://www.withraven.ai/), and a wider visual-intel surface.

## Results

| Metric | Public snapshot | Source |
| --- | --- | --- |
| Site | [withraven.ai](https://www.withraven.ai/) | Official |
| Brand | GeoSpy → Raven, Apr 2026 | Graylark |
| Seed | ~$10.7M | Company site |
| Jobs | Geolocation, street targeting, vehicles, authenticity | Product page |

## What to copy

Ship one “can the AI guess this?” moment. Use the web as the free funnel. Draw a red line (no face-tracking) before you sell to institutions.

## Founder read

Vertical spatial models still beat a general chat box on street furniture and micro-terrain. The hard part is misuse and procurement, not another wrapper demo.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444422",
    title: "ThetaWave AI",
    slug: "thetawave-ai",
    category: "saas",
    categories: ["saas", "content"],
    website: "https://thetawave.ai/",
    highlights: [
      { zh: "官方網站", en: "Site", value: "thetawave.ai" },
      { zh: "公開融資", en: "Funding", value: "$7M+" },
      { zh: "榮譽", en: "Honour", value: "Forbes 30U30 Asia" },
      { zh: "共同創辦", en: "Founders", value: "李文軒 / Elena" },
    ],
    summaryZh:
      "把上課的講義、錄音、影片，整理成筆記、字卡和測驗。兩位高中同學創辦，入選 Forbes 2026 亞洲 30 歲以下，公開融資超過 700 萬美元。",
    summaryEn:
      "Two high-school classmates turn lectures, PDFs, and videos into notes, flashcards, and quizzes. Forbes 30 Under 30 Asia 2026; more than $7M disclosed funding. They call it a personal knowledge filter.",
    bodyZh: `${CASE_SEED_MARKER}
## 先講人話

上課錄音、講義、影片堆一堆，事後整理很累。ThetaWave 幫你變成筆記、字卡和測驗。兩位高中同學創辦，入選 Forbes 2026 亞洲 30 歲以下，公開融資超過 700 萬美元。

## 這間公司做什麼

[ThetaWave AI](https://thetawave.ai/)（亦寫 Thetawave）讓學生把課堂錄音、PDF、講義或影片丟進去，系統整理成結構化筆記、Flashcards、測驗與心智圖。官網一句話是：Drop in any lecture, file, or video。創辦人是[李文軒（Wenxuan "Peter" Li）](https://thetawave.ai/blog/author/wenxuan-peter-li)與 Elena Zhong——Forbes 寫明兩人是高中同學，2023 年一起做這件事。

產品不把自己講成「另一個 ChatGPT」，而是「個人化 AI 學習過濾器」：同一份教材，依你已懂與未懂的部分，決定筆記長什麼樣子、下一題考什麼。李文軒在 LinkedIn 亦自稱 Berkeley 輟學、擔任 CEO。

## 痛點

講堂仍是一刀切：幾百人聽同一份簡報，卻有完全不同的底子與學習習慣。學生把晚上花在抄筆記、劃重點，還是找不到自己的盲點。通用聊天機器人可以摘要，卻很少記得「你上一題錯在哪」，也很難把一份三小時錄音收成明天能複習的字卡。

## 方案

1. **素材一鍵進系統。** 錄音、PDF、影片，先抽知識點再長筆記。
2. **依個人過濾，不是同一份摘要。** 把抽象公式改成你較吃得下的例子或圖解。
3. **閉環測驗。** 自動出 Flashcards 與練習題，盯錯題，再補同一條觀念。見[產品頁](https://thetawave.ai/)。

## 成功故事與成功之道

- 2023：李文軒與 Elena Zhong 在北京起步（[Forbes 公司檔](https://www.forbes.com/profile/thetawave-ai/)）。
- 其後產品在歐美校園傳開；創辦人公開口徑提過數萬至更多學生使用，LinkedIn 簡介曾寫「逾 5 萬名來自 Stanford、MIT 等校的學生」。
- 2026 年 5 月：登上 [Forbes 30 Under 30 Asia](https://www.forbes.com/sites/ywang/2026/05/27/30-under-30-asia-2026-meet-the-entrepreneurs-building-ai-for-individuals-and-enterprises/)。同一篇寫明累計融資 **逾 $7M**，投資方包括 BAI Capital（原 Bertelsmann Asia Investments）、Hillhouse Ventures、the MBA Fund、MiraclePlus。

成功之道：

1. 先做教學法，再堆模型。重點是盲點與複習路徑，不是更長的摘要。
2. 對準學生每天已經在用的 PDF 與錄音，考試前省下最多時間。
3. 創辦團隊自己就是 Gen Z 應考的人，介面不跟教務處系統長一樣。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| 網站 | [thetawave.ai](https://thetawave.ai/) | 官方 |
| 創辦人 | 李文軒、Elena Zhong | [Forbes](https://www.forbes.com/profile/thetawave-ai/) |
| 榮譽 | 2026 Forbes 30 Under 30 Asia | Forbes |
| 融資 | 逾 $7M | Forbes 2026/05 |
| 投資人 | BAI Capital、Hillhouse、MBA Fund、MiraclePlus | Forbes |
| 使用規模 | 創辦人提過 5 萬+；社群亦有「數十萬」說法 | LinkedIn／媒體，非審計 |

## 普通人如何複製

- 切高焦慮、有截止日期的場景：期末、證照、語言檢定。
- 把非結構化教材自動變成可點的複習工具。
- 記下錯題，不要給所有人同一份講義。

## 創業者與矽谷視角

純 AI 題庫護城河很薄。ThetaWave 賭的是：**學習軌跡愈多，路徑愈準，離開成本愈高**。這才是消費教育產品在生成式 AI 時代還能留下的東西。風險是學校採購週期、版權教材、以及每一家筆記 App 都在做同一句 slogan。
`,
    bodyEn: `
## What the company does

[ThetaWave](https://thetawave.ai/) turns lectures, PDFs, and videos into notes, flashcards, quizzes, and mind maps. Cofounders [Wenxuan “Peter” Li](https://thetawave.ai/blog/author/wenxuan-peter-li) and Elena Zhong were high-school classmates; Forbes says they started in 2023.

## Pain

Lecture halls are one-size-fits-all. Chatbots summarise; they rarely remember last night’s wrong answer.

## Approach

Ingest the file, filter it for *this* student, then close the loop with flashcards and quizzes. Site: [thetawave.ai](https://thetawave.ai/).

## How it worked

Forbes’ [company card](https://www.forbes.com/profile/thetawave-ai/) and the [30 Under 30 Asia 2026](https://www.forbes.com/sites/ywang/2026/05/27/30-under-30-asia-2026-meet-the-entrepreneurs-building-ai-for-individuals-and-enterprises/) piece list **$7M+** from BAI Capital, Hillhouse, the MBA Fund, and MiraclePlus.

## Results

| Metric | Snapshot | Source |
| --- | --- | --- |
| Site | thetawave.ai | Official |
| Honour | Forbes 30U30 Asia 2026 | Forbes |
| Funding | $7M+ | Forbes, May 2026 |

## What to copy

Deadline-heavy study. Unstructured files → interactive review. Track blind spots.

## Founder read

The moat is the path, not the summary. Switching cost rises only after the app has your mistakes.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444423",
    title: "鑊氣 (Wok Hei)",
    slug: "wok-hei",
    category: "saas",
    categories: ["saas", "workflow_agent"],
    website: "https://apps.apple.com/hk/app/%E9%91%8A%E6%B0%A3/id6766081667",
    highlights: [
      { zh: "短時間下載", en: "Downloads", value: "30,000+" },
      { zh: "榜單", en: "Chart", value: "美食 Top 10" },
      { zh: "食譜", en: "Recipes", value: "100+" },
      { zh: "融資", en: "Funding", value: "$0" },
    ],
    summaryZh:
      "香港爸爸傳「Cook rice」，外傭真的只煮了白飯。他把這個笑話做成廣東話／英文煮餸 App，Threads 傳開後衝上 App Store 美食榜。",
    summaryEn:
      "A Hong Kong dad texted “cook rice” and came home to plain rice. He turned the mishap into a bilingual recipe app; a Threads story pushed it up the App Store food chart.",
    bodyZh: `${CASE_SEED_MARKER}
## 先講人話

僱主用英文說 cook rice，外傭按字面只煮了白飯。一位香港爸爸把這個笑話做成 App：你用中文或英文點菜，外傭看到自己懂的語言步驟。Threads 傳開後，它衝上過 App Store 美食榜。

## 這間公司做什麼

[鑊氣](https://apps.apple.com/hk/app/%E9%91%8A%E6%B0%A3/id6766081667)（Wok Hei）是香港獨立開發者做的家常菜與一週菜單工具，專為請了印傭、菲傭的雙職家庭而寫。僱主用中文或英文點蒸水蛋、豉汁蒸魚、番茄炒蛋，App 即時換成印尼文或菲律賓文步驟，調味料用雙方都看得懂的寫法，再經 WhatsApp 把連結或一週菜單傳給外傭。

打開 App 先選「我是僱主」或「我是家務助理」，兩邊看到的是同一道菜、兩套語言。

## 痛點

香港有三十多萬個外傭家庭。多數外傭並不熟港式火候，也分不清老抽、生抽、腐乳、南乳。僱主下班已經累，還要用半桶英文解釋「今晚煮餸」。印傭多守清真，菜式裡有豬肉或酒，隨便交代就可能踩禁忌。

那個引爆點很具體：創辦人帶 BB 去打針，途中 WhatsApp 一句 “Cook rice”，以為回家有熱飯熱餸，結果真的只有一鍋白飯。

## 方案

1. **僱傭雙向切語言。** 中／英對印尼文、菲律賓文。
2. **飲食過濾。** 酒、豬肉、牛肉、腐乳有標籤，並標清真可用。
3. **一週排程 + WhatsApp。** 像排更表一樣排早午晚，一鍵分享。
4. **主畫面 Widget。** 提醒外傭何時備料。

App Store 頁面寫明有免費基礎功能，以及「鑊氣家庭版」訂閱（公開頁面約 **HK$18／月**）。

## 成功故事與成功之道

創辦人把「Cook rice 變白飯」連同 MVP 發到 Threads，港媽與雙職父母大量轉發。上線後短時間下載破 **3 萬**，並一度進入香港區美食佳飲類 **Top 10**。食譜庫公開口徑是 100+ 道家常菜，持續加。融資 **$0**。

三個引擎：

1. **故事即獲客。** 一句笑話比功能列表更便宜。
2. **真的在解每天發生的溝通，不是再做一個食譜書櫃。**
3. **兩邊都感到被照顧：** 僱主省口舌，外傭有母語與清真提示。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| 下載 | 30,000+（爆發期） | Threads／媒體轉述 |
| 榜單 | 香港美食佳飲 Top 10 | App Store |
| 語言 | 中、英、印尼文、菲律賓文 | [產品頁](https://apps.apple.com/hk/app/%E9%91%8A%E6%B0%A3/id6766081667) |
| 食譜 | 100+ | 產品說明 |
| 融資 | $0 | 開發者 |
| 訂閱 | 家庭版約 HK$18／月 | App Store |

## 普通人如何複製

找「兩種角色每天要對話、但沒有共同語言」的場景：看護與長者、裝修師傅與業主、跨國外包。用自己踩過的坑當發布文案。第一版只做 50–100 個最高頻情境。

## 創業者與矽谷視角

賽道看起來窄——「香港外傭煮港菜」——但頻率極高、痛感極具體。一人、自籌、靠 Threads 飛輪做到數萬下載再收訂閱，是超在地化工具的教科書，不是全球 TAM 簡報。
`,
    bodyEn: `
## What the product does

[Wok Hei / 鑊氣](https://apps.apple.com/hk/app/%E9%91%8A%E6%B0%A3/id6766081667) is a Hong Kong recipe-and-roster app for families who employ Indonesian or Filipino domestic workers. The employer picks a Cantonese home dish; the helper sees steps in Bahasa or Tagalog, then gets the week’s menu on WhatsApp.

## Pain

“Cook rice” meant “make dinner.” The helper cooked rice. Halal rules and sauce names (light vs dark soy, fermented tofu) make kitchen talk a daily tax for 300,000+ households.

## Approach

Two roles, two languages. Diet tags. A weekly schedule. A home-screen widget. A cheap family subscription (~HK$18/month on the App Store).

## How it worked

The founder posted the rice story plus the MVP on Threads. Downloads passed 30,000 in the first burst and the app hit Hong Kong Food & Drink Top 10. Bootstrapped.

## What to copy

A two-sided communication gap. Launch with the story, not the feature list. Fifty painful situations beat a thousand recipes.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444424",
    title: "Hide or Die!",
    slug: "hide-or-die",
    category: "platform",
    categories: ["platform", "content"],
    website: "https://www.roblox.com/games/18799085098",
    highlights: [
      { zh: "累計造訪", en: "Visits", value: "7.7億+" },
      { zh: "歷史峰值 CCU", en: "Peak CCU", value: "14,500+" },
      { zh: "上線", en: "Launch", value: "2024-08" },
      { zh: "融資", en: "Funding", value: "$0" },
    ],
    summaryZh:
      "獨立團隊把「黎明死線」收成 8 分鐘捉迷藏。Roblox 上線兩年，第三方統計造訪超過七億，最多同時上萬人在玩。",
    summaryEn:
      "Indie studio 0 CCU Games boiled Dead by Daylight down to an 8-minute hide-and-seek. Two years on Roblox, third-party trackers count 770M+ visits and a 14k+ CCU peak.",
    bodyZh: `${CASE_SEED_MARKER}
## 先講人話

規則很短：一方躲、一方抓，八分鐘一局。獨立團隊 0 CCU Games 把它做成 Roblox 遊戲。上線兩年，第三方統計造訪超過七億，最多同時上萬人在玩。

## 這間公司／專案做什麼

[Hide or Die!](https://www.roblox.com/games/18799085098) 是獨立團隊 **0 CCU Games** 在 2024 年 8 月 4 日於 Roblox 發行的非對稱生存遊戲。規則只有兩句：你是躲藏者就活到時間結束，你是追捕者就在時限內抓光所有人。靈感來自鬼捉人與 *Dead by Daylight*，但拿掉修電機、血網與天賦盤。

地圖走暗光、障礙與心跳音。玩家可用 Robux 買外觀、擊殺動畫與短暫技能（隱身、聲波偵測）。官方遊戲頁： [roblox.com/games/18799085098](https://www.roblox.com/games/18799085098)（Place ID 18799085098，Universe ID 6369934270）。

## 痛點

硬核非對稱遊戲學習曲線陡，手機與平板上的 Gen Z／Gen Alpha 進不去。Roblox 傳統道具捉迷藏又太悶，缺少「差一點就被抓到」的短影片時刻。獨立開發者若走 Steam／主機，發行與伺服器成本會先把人磨死。

## 方案

1. **一局 5–8 分鐘，零教學。**
2. **張力靠燈光與音效，不靠 3A 面數。**
3. **外觀與技能變現**，勝負可以拿來炫耀。
4. **天然短影音：** 絕地逃生、神藏點，TikTok／Shorts 會自己長。

## 成功故事與成功之道

上線數月，早期公開口徑已是數千萬造訪、常態過萬 CCU。到 2026 年中後期，第三方統計（[GGAID](https://www.ggaid.com/roblox/games/hide-or-die-6369934270)、[RobloxGames.org](https://www.robloxgames.org/stats/hide-or-die)）把累計造訪寫到約 **7.7–7.9 億**，歷史峰值 CCU 約 **1.45 萬**（2026 年 6 月快照），收藏與評分亦到數百萬級。融資 **$0**，吃 Roblox 分潤。

成功之道：把重型品類「民主化」到手機；把單局壓進碎片時間；用完局率餵平台推薦演算法。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| 遊戲頁 | [Roblox](https://www.roblox.com/games/18799085098) | 官方 |
| 上線 | 2024-08-04 | 平台 |
| 累計造訪 | 約 7.7–7.9 億（2026 年快照） | 第三方追蹤；早期媒體曾寫 5,000 萬+ |
| 峰值 CCU | 約 14,500 | 第三方 |
| 團隊 | 0 CCU Games | 官方 |
| 變現 | Robux 外觀／Pass | 遊戲內 |
| 融資 | $0 | 獨立 |

## 普通人如何複製

去 Steam 找一個重型玩法，刪到 10 分鐘內能講完。做出「會被剪進 Shorts 的 3 秒」。讓好友拉人成為預設社交動作。

## 創業者與矽谷視角

Roblox／UEFN 把伺服器、跨平台與支付先包好，CAC 接近零。機制簡化往往比畫質堆疊更爆。風險是平台抽成、演算法翻臉、以及玩法被一週內複製。
`,
    bodyEn: `
## What it is

[Hide or Die!](https://www.roblox.com/games/18799085098) (0 CCU Games, 4 Aug 2024) is an 8-minute hide-and-seek shooter on Roblox. Two roles, no perk trees.

## Pain

*Dead by Daylight* is too heavy for phones. Classic Roblox prop hunt is too dull to clip.

## Approach

Instant rules, cheap tension, skins for Robux, clip-ready near-misses.

## Results

Early write-ups cited 50M+ visits. Mid-2026 trackers show **~770–790M** visits and a **~14.5k** CCU peak. Bootstrapped on Roblox’s cut.

## What to copy

Shrink a hardcore genre. Cap a match at ten minutes. Design the screenshot people post.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444425",
    title: "Nas.com",
    slug: "nas-com",
    category: "platform",
    categories: ["platform", "saas"],
    website: "https://nas.com/",
    highlights: [
      { zh: "2026 A 輪", en: "2026 Series A", value: "$27M" },
      { zh: "平台成員", en: "Members", value: "350萬+" },
      { zh: "領投", en: "Lead", value: "Khosla" },
      { zh: "月費", en: "Price", value: "$29" },
    ],
    summaryZh:
      "Nas Daily 團隊：拍一張產品照，就能開店、寫文案、做廣告、向社群收費。2026 年 Khosla 領投 2,700 萬美元；官網寫有 350 萬名成員、月費 29 美元。",
    summaryEn:
      "Nas Daily’s team turns one product photo into a store, copy, ads, and community checkout. Khosla led a $27M Series A in 2026; the site cites 3.5M members at $29 a month.",
    bodyZh: `${CASE_SEED_MARKER}
## 先講人話

有產品、有粉絲，但不懂架網站、寫文案、跑廣告。Nas.com 的說法是：拍一張產品照，後面開店、文案、廣告、向社群收費都能接上。2026 年 Khosla 領投 2,700 萬美元；官網寫有 350 萬名成員、月費 29 美元。

## 這間公司做什麼

[Nas.com](https://nas.com/)（前身社群產品線見 [nas.io](https://nas.io/)）由短影音創作者 **Nas Daily（Nuseir Yassin）** 創辦。他是哈佛經濟與電腦科學畢業、前 Venmo 工程師，全球帳號累計數十億次觀看。

使用者上傳一張產品或服務照片（或用一句話描述），系統協助：落地頁與結帳、行銷文案與短片、在 Meta／Instagram 投放（Magic Ads）、以及 WhatsApp／Telegram／Discord／Email 社群收款。2026 年 4 月[官方新聞稿](https://www.prnewswire.com/news-releases/nascom-raises-27m-series-a-led-by-khosla-ventures-as-ai-unleashes-the-biggest-wave-of-new-business-creation-in-history-302745035.html)把它寫成「給一人公司的 AI 後台」：數位／實體商品、會員、廣告、全球收款與物流。

## 痛點

想賣課程、諮詢或手作，傳統路徑是 Shopify + Canva + Stripe + Ads Manager + CRM。懂手藝的人跨不過這三座山：架站、獲客、收款。

## 方案

1. **一張相片開店。**
2. **Magic Ads：** 不懂廣告後台也能產出素材並投放。
3. **寄生在 WhatsApp／Telegram。** 粉絲不用再下載一個陌生 App。
4. **低起步價。** 新聞稿寫月費 **$29**；平台靠訂閱與廣告／交易抽成，而不是先收一筆建站費。

## 成功故事與成功之道

- 2021–2022：Nas Academy／Nas.io 時期，Tracxn 等資料庫累計約 **$23M**（含 Lightspeed 領投的課程平台輪）。
- 2026 年 4 月：品牌聚焦 [Nas.com](https://nas.com/)，**$27M Series A**，Khosla Ventures（Vinod Khosla、Nicole Fraenkel）領投，500 Global 跟投，天使包括 Deel 共同創辦人 Shuo Wang、DoorDash 共同創辦人 Stanley Tang、Tim Ferriss 等。見 [Business Insider](https://www.businessinsider.com/nas-daily-founder-ai-storefront-startup-funding-read-pitch-deck-2026-4)。
- 同一則新聞稿： **350 萬名成員、150+ 國家、月費 $29**。

成功之道：創辦人自己就是流量機器，把「什麼文案會爆」寫進產品；不強迫遷站；賣的是客人，不只是網站。

## 成績

| 指標 | 公開／估計數字 | 來源口徑 |
| --- | --- | --- |
| 網站 | [nas.com](https://nas.com/)／[nas.io](https://nas.io/) | 官方 |
| 2026 A 輪 | $27M，Khosla 領投 | [PR Newswire](https://www.prnewswire.com/news-releases/nascom-raises-27m-series-a-led-by-khosla-ventures-as-ai-unleashes-the-biggest-wave-of-new-business-creation-in-history-302745035.html) |
| 較早輪次 | Nas.io／Academy 約 $23M | Tracxn 等 |
| 成員 | 350 萬（2026/04） | 官方新聞稿 |
| 訂閱 | $29／月 | 官方新聞稿 |
| 創辦人 | Nuseir Yassin（Harvard、前 Venmo） | 公開履歷 |

早期簡報曾提「四位百萬美元創作者」；以 2026 年官方稿的成員與訂閱數字為準。

## 普通人如何複製

把要開四個分頁才能做完的流程收成一句話或一張相片。優先幫客戶**帶來客人**，不要只幫他建一個沒人看的站。把你自己領域會爆的套路做成預設模板。

## 創業者與矽谷視角

Khosla 押的是「一人公司」規模化：AI 讓個人不必先雇工程師與投放團隊。誰把創業摩擦降到接近零，誰就卡住下一代 Solo Business 的支付與分發。風險是平台一體化之後，商家會不會長出自己的站、以及廣告效果能不能持續正 ROI。
`,
    bodyEn: `
## What the company does

[Nas.com](https://nas.com/) (see also [nas.io](https://nas.io/)) is Nuseir Yassin’s AI back office for one-person businesses: photo → storefront, copy, ads, WhatsApp/Telegram community, payments. April 2026 [press release](https://www.prnewswire.com/news-releases/nascom-raises-27m-series-a-led-by-khosla-ventures-as-ai-unleashes-the-biggest-wave-of-new-business-creation-in-history-302745035.html): **$27M Series A** led by Khosla, **3.5M members**, **$29/month**.

## Pain

Shopify + Canva + Ads Manager is still a wall for people who actually know a craft.

## Approach

One photo. Magic Ads. Stay inside WhatsApp. Charge a low monthly, take a cut of ads/commerce.

## Results

Earlier Nas Academy / Nas.io rounds totalled ~$23M (Lightspeed et al.). The 2026 chapter is Nas.com and Khosla’s $27M. [Business Insider](https://www.businessinsider.com/nas-daily-founder-ai-storefront-startup-funding-read-pitch-deck-2026-4) published the deck narrative.

## What to copy

Collapse a four-tool workflow. Sell acquisition, not just a pretty page.
`,
  },
];
