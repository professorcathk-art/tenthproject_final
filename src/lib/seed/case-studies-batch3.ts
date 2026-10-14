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
## 簡單總結

照片被清掉定位之後，通常很難知道在哪裡拍。Raven 看的是畫面本身：房子、路牌、植物、路面。GeoSpy 團隊把它升級並改名，從網頁試用做到給執法與企業調查用。

## 這個產品在做什麼

[Raven](https://www.withraven.ai/) 是波士頓 [Graylark Technologies](https://graylark.com/) 的看圖產品。團隊最早以 [GeoSpy](https://geospy.ai/) 出名。你丟進一張沒有定位資料的照片，模型只看畫面裡的建築、路牌、植物、地形和道路標線，幾秒內估出城市、地區和國家，並給一個有多有把握的分數。2026 年 4 月到 5 月，Graylark 把 GeoSpy 升級並改名為 Raven。現在的官網是 [withraven.ai](https://www.withraven.ai/)。舊的 withraven.net 已經不是主站。

一般人先在網頁上試「這張圖大概在哪」。同一套技術再賣給新聞查核、保險理賠和執法單位。可以看 [Graylark 的 Raven 介紹](https://graylark.com/raven) 和 [GeoSpy 的遷移說明](https://graylark.com/geospy)。創辦人 Daniel Heinen 在 2026 年 5 月的[新聞稿](https://www.prnewswire.com/news-releases/graylark-technologies-launches-raven-the-next-evolution-of-geospy-302768464.html)裡說：GeoSpy 只負責找地點。Raven 還要讀懂車輛、判斷圖是不是假的，並把畫質很差的截圖變成可以往下查的線索。

## 以前這件事有多麻煩

Instagram、X 和 Facebook 上傳時會把照片裡的定位清掉。記者要核實一則突發影像，做公開資訊調查的人要追一張風景照，旅人想知道這到底在哪一國。用圖片搜尋，只能找到網路上已經出現過的同一張圖。自己剛拍、從來沒發過的照片，搜尋引擎幫不上忙。

以前要靠畫面猜地點，幾乎得像 GeoGuessr 的職業選手：記路牌字型、記樹種、記電線桿。普通人缺的不是再一個聊天窗，是一個只做這一件事的地理助手。

## 他們怎麼把這件事做出來

1. 不靠照片裡的定位資料。沒有 GPS，也看門面、屋頂、植物帶和地面。
2. 先讓人在網頁上試，隱私寫清楚。[服務條款](https://www.withraven.ai/tos/)寫明可以用網頁、App 或 API。試用要審核，正式用要付費。官方對調查場景強調：看的是地點和景物，不是拿來做人臉追蹤。
3. 同一套模型，兩種收費。輕的網頁和 App 給喜歡地理的人和查核的人。[企業和執法版本](https://graylark.com/raven)賣街景等級的定位、車款辨識和影像真偽。

## 做到哪裡了

時間來自 Graylark 官網、PR Newswire，以及 PitchBook 和創辦團隊的公開資訊。

- 2022 到 2023 年，Daniel Heinen 和團隊在波士頓做視覺和安全工具，做出 GeoSpy 的核心算法。
- 2024 到 2025 年，GeoSpy 在公開資訊調查、GeoGuessr 玩家和短片社群裡傳開，變成「沒有 GPS 也能估地點」的代名詞。Graylark 官網寫種子輪大約 1,070 萬美元。公開的投資人包括 General Catalyst、Hatch 等早期機構。
- 2026 年 4 月到 5 月改名 Raven，官網換成 withraven.ai，能力從找地點擴成看圖情報。

三句可以記住：

1. 把很專業的能力做成 10 秒的小遊戲。「丟一張圖，看 AI 猜不猜得中」天然會被轉發。
2. 一般人先驚艷一次，再導向 App 或機構授權。
3. 先畫紅線。公開講只做景物和地點、不做人臉追蹤，新聞和政府採購才過得了門。

| 你會看到的結果 | 數字 |
| --- | --- |
| 給一般人的網站 | [withraven.ai](https://www.withraven.ai/) |
| 品牌 | GeoSpy 在 2026 年 4 月改名 Raven（[Graylark](https://graylark.com/geospy)） |
| 種子輪 | 大約 1,070 萬美元（Graylark 官網） |
| 能做的事 | 沒有 GPS 也能估地點、街景定位、車款、真偽（[產品頁](https://graylark.com/raven)） |
| 誰在用 | 旅遊辨位、事實查核、公開資訊調查、執法 |

這是 2026 年的公開快照，不是審計過的財報。

## 你要做一個小版本，可以從這裡開始

不要重做一個全球情報平台。學的是怎麼包成一件小事。

- 找一件「拍一張照就能判讀」、而且結果值得拿去給朋友看的事。例如拍植物看病蟲害、拍老照片估年份、拍店招猜城市。
- 第一秒的結果要值得拿去挑戰朋友。
- 用網頁讓人免費試。不要一進來就逼下載 App、綁卡。

## 投資人為什麼肯付錢

ChatGPT 也能看圖。Raven 說明，專門看地貌和路牌的模型仍然有位置。它比通用聊天窗更穩，也敢標自己有多有把握。Graylark 走的是先給一般人玩，再賣給機構。風險也很清楚。地理定位一旦被濫用，就是隱私和出口管制的問題。別人抄不走的不是「會看圖」，是資料、審核流程，以及誰敢把案件交給你。
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
## 簡單總結

上課錄音、講義、影片堆一堆，事後整理很累。ThetaWave 幫你變成筆記、字卡和測驗。兩位高中同學創辦，入選 Forbes 2026 亞洲 30 歲以下，公開融資超過 700 萬美元。

## 這個產品在做什麼

[ThetaWave AI](https://thetawave.ai/) 讓學生把課堂錄音、PDF、講義或影片丟進去，整理成筆記、字卡、測驗和心智圖。官網的說法是：任何一堂課、一份檔案或一支影片都可以丟進來。創辦人是[李文軒](https://thetawave.ai/blog/author/wenxuan-peter-li)和 Elena Zhong。Forbes 寫明兩人是高中同學，2023 年一起做這件事。

它不把自己講成另一個 ChatGPT。同一份教材，會依你已經懂和還沒懂的部分，決定筆記長什麼樣子、下一題考什麼。李文軒在 LinkedIn 上自稱從 Berkeley 輟學，擔任執行長。

## 以前這件事有多麻煩

講堂還是一刀切。幾百人聽同一份簡報，底子和習慣卻完全不同。學生晚上花在抄筆記、劃重點，還是找不到自己的盲點。通用聊天機器人可以做摘要，卻很少記得你上一題錯在哪，也很難把三小時的錄音收成明天能複習的字卡。

## 他們怎麼把這件事做出來

1. 錄音、PDF 和影片丟進去，先抽出知識點，再長成筆記。
2. 不是每個人同一份摘要。抽象的公式會改成你比較吃得下的例子或圖。
3. 自動出字卡和練習題，盯住錯題，再補同一條觀念。產品頁在 [thetawave.ai](https://thetawave.ai/)。

## 做到哪裡了

- 2023 年，李文軒和 Elena Zhong 在北京起步（[Forbes 公司檔](https://www.forbes.com/profile/thetawave-ai/)）。
- 後來產品在歐美校園傳開。創辦人公開提過數萬名、甚至更多學生在用。LinkedIn 簡介曾寫超過 5 萬名來自 Stanford、MIT 等校的學生。社群裡也有「數十萬」的說法。這些都不是審計過的數字。
- 2026 年 5 月登上 [Forbes 亞洲 30 歲以下](https://www.forbes.com/sites/ywang/2026/05/27/30-under-30-asia-2026-meet-the-entrepreneurs-building-ai-for-individuals-and-enterprises/)。同一篇寫累計融資超過 700 萬美元。投資方包括 BAI Capital（原 Bertelsmann Asia Investments）、Hillhouse Ventures、the MBA Fund 和 MiraclePlus。

三件事：

1. 先想怎麼教，再堆模型。重點是盲點和複習路徑，不是把摘要寫得更長。
2. 對準學生每天已經在用的 PDF 和錄音，考試前省下最多時間。
3. 創辦人自己就是在應考的那一代，介面不像教務處系統。

| 你會看到的結果 | 數字 |
| --- | --- |
| 網站 | [thetawave.ai](https://thetawave.ai/) |
| 創辦人 | 李文軒、Elena Zhong（[Forbes](https://www.forbes.com/profile/thetawave-ai/)） |
| 榮譽 | 2026 年 Forbes 亞洲 30 歲以下 |
| 融資 | 超過 700 萬美元（Forbes，2026 年 5 月） |
| 投資人 | BAI Capital、Hillhouse、MBA Fund、MiraclePlus |
| 使用規模 | 創辦人提過 5 萬人以上。不是審計數字 |

## 你要做一個小版本，可以從這裡開始

- 選有截止日期、人又很焦慮的場景：期末、證照、語言檢定。
- 把散亂的教材自動變成可以點的複習工具。
- 記下錯題。不要給所有人同一份講義。

## 投資人為什麼肯付錢

純 AI 題庫很容易被抄。ThetaWave 賭的是：它越記得你錯在哪，下一條路就越準，人就越不容易離開。這是教育產品在生成式 AI 之後還留得住的東西。風險是學校採購很慢、教材有版權，以及每一家筆記 App 都在講同一句話。
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
## 簡單總結

僱主用英文說 cook rice，外傭按字面只煮了白飯。一位香港爸爸把這個笑話做成 App：你用中文或英文點菜，外傭看到自己懂的語言步驟。Threads 傳開後，它衝上過 App Store 美食榜。

## 這個產品在做什麼

[鑊氣](https://apps.apple.com/hk/app/%E9%91%8A%E6%B0%A3/id6766081667) 是香港獨立開發者做的家常菜和一週菜單。對象是請了印傭或菲傭的雙職家庭。僱主用中文或英文點蒸水蛋、豉汁蒸魚、番茄炒蛋，App 立刻換成印尼文或菲律賓文的步驟。調味料用雙方都看得懂的寫法，再經 WhatsApp 把連結或一週菜單傳給外傭。

打開 App 先選「我是僱主」或「我是家務助理」。兩邊看到的是同一道菜、兩套語言。

## 以前這件事有多麻煩

香港有三十多萬個外傭家庭。多數外傭不熟港式火候，也分不清老抽、生抽、腐乳、南乳。僱主下班已經累，還要用半桶英文解釋今晚煮什麼。印傭多守清真，菜裡有豬肉或酒，隨便交代就可能踩到禁忌。

引爆點很具體。創辦人帶小孩去打針，途中在 WhatsApp 寫了一句 Cook rice，以為回家有熱飯熱餸，結果真的只有一鍋白飯。

## 他們怎麼把這件事做出來

1. 僱主和外傭各看各的語言。中文和英文對上印尼文、菲律賓文。
2. 酒、豬肉、牛肉、腐乳有標籤，也標清真能不能用。
3. 一週的早午晚可以排好，再分享到 WhatsApp。
4. 主畫面的小工具提醒外傭什麼時候備料。

App Store 寫明有免費的基本功能，以及「鑊氣家庭版」訂閱。公開頁面大約一個月 18 港元。

## 做到哪裡了

創辦人把「Cook rice 變成白飯」這個故事和第一版一起發到 Threads。香港的媽媽和雙職父母大量轉發。上線後短時間下載超過 3 萬，並一度進入香港區美食佳飲類前十名。食譜公開說有 100 道以上的家常菜，還在加。沒有外面的投資。

三件事：

1. 一句笑話比功能列表便宜，也比較會被轉發。
2. 它解的是每天都在發生的溝通，不是再做一個食譜書櫃。
3. 兩邊都感到被照顧。僱主少解釋，外傭有母語和清真提示。

| 你會看到的結果 | 數字 |
| --- | --- |
| 下載 | 超過 3 萬（爆發那陣子，Threads 和媒體轉述） |
| 榜單 | 香港美食佳飲前十名 |
| 語言 | 中文、英文、印尼文、菲律賓文 |
| 食譜 | 100 道以上 |
| 外面的投資 | 沒有 |
| 訂閱 | 家庭版大約一個月 18 港元 |

## 你要做一個小版本，可以從這裡開始

找兩種角色每天都要對話、卻沒有共同語言的場景。例如看護和長者、裝修師傅和業主、跨國外包。用自己踩過的坑當發文。第一版只做 50 到 100 個最常發生的情況。

## 投資人為什麼肯付錢

「香港外傭煮港菜」看起來很窄，可是每天都發生，而且痛得很具體。一個人、自己出錢、靠 Threads 轉發做到數萬下載，再收訂閱。這是很在地的工具，不是一份全球市場簡報。
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
## 簡單總結

規則很短：一方躲、一方抓，八分鐘一局。獨立團隊 0 CCU Games 把它做成 Roblox 遊戲。上線兩年，第三方統計造訪超過七億，最多同時上萬人在玩。

## 這個產品在做什麼

[Hide or Die!](https://www.roblox.com/games/18799085098) 是獨立團隊 0 CCU Games 在 2024 年 8 月 4 日放上 Roblox 的遊戲。規則只有兩句。你是躲藏者，就活到時間結束。你是追捕者，就在時限內把人抓光。靈感來自鬼捉人和《黎明死線》，但拿掉修電機、血網和天賦盤。

地圖靠暗光、障礙和心跳聲。玩家可以用 Robux 買外觀、擊殺動畫和短暫技能，例如隱身、聲波偵測。遊戲頁是 [roblox.com/games/18799085098](https://www.roblox.com/games/18799085098)。Place ID 是 18799085098，Universe ID 是 6369934270。

## 以前這件事有多麻煩

硬核的捉迷藏學習曲線很陡，手機和平板上的年輕人進不去。Roblox 上傳統的道具捉迷藏又太悶，缺少「差一點就被抓到」這種適合剪成短片的時刻。獨立團隊如果走 Steam 或主機，發行和伺服器的成本會先把人磨死。

## 他們怎麼把這件事做出來

1. 一局 5 到 8 分鐘，幾乎不用教學。
2. 緊張感靠燈光和音效，不靠電影級的畫面。
3. 外觀和技能可以拿來炫耀，也是收費的地方。
4. 絕地逃生和神藏點天然適合 TikTok 和 Shorts，不用另外拍廣告。

## 做到哪裡了

上線幾個月，早期公開說法已經是數千萬次造訪，平常同時上線可以過萬人。到 2026 年中後期，第三方統計（[GGAID](https://www.ggaid.com/roblox/games/hide-or-die-6369934270)、[RobloxGames.org](https://www.robloxgames.org/stats/hide-or-die)）把累計造訪寫到大約 7.7 億到 7.9 億。同時在線的歷史高點大約 1.45 萬人，是 2026 年 6 月的快照。收藏和評分也到數百萬這個等級。沒有外面的投資，收入來自 Roblox 的分成。

他們把很重的遊戲放到手機上。一局很短，打完就讓平台繼續推薦下一局。

| 你會看到的結果 | 數字 |
| --- | --- |
| 遊戲頁 | [Roblox](https://www.roblox.com/games/18799085098) |
| 上線 | 2024 年 8 月 4 日 |
| 累計造訪 | 大約 7.7 億到 7.9 億（2026 年快照）。早期媒體曾寫超過 5,000 萬 |
| 同時在線高點 | 大約 14,500 人（第三方） |
| 團隊 | 0 CCU Games |
| 怎麼收費 | Robux 外觀和通行證 |
| 外面的投資 | 沒有 |

## 你要做一個小版本，可以從這裡開始

去 Steam 找一個很重的玩法，刪到 10 分鐘內能講完。做出「會被剪進短片的 3 秒」。讓好友拉人進來，變成預設的玩法，而不是額外的功能。

## 投資人為什麼肯付錢

Roblox 和 UEFN 把伺服器、跨平台和付款先包好，找玩家的成本接近零。把規則變簡單，往往比把畫面堆漂亮更容易傳開。風險是平台要抽成、推薦演算法會翻臉，以及玩法可能一個星期內就被人複製。
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
## 簡單總結

有產品、有粉絲，但不懂架網站、寫文案、跑廣告。Nas.com 的說法是：拍一張產品照，後面開店、文案、廣告、向社群收費都能接上。2026 年 Khosla 領投 2,700 萬美元；官網寫有 350 萬名成員、月費 29 美元。

## 這個產品在做什麼

[Nas.com](https://nas.com/) 的前身社群產品可以看 [nas.io](https://nas.io/)。創辦人是短片創作者 Nas Daily，本名 Nuseir Yassin。他是哈佛經濟和電腦科學畢業，之前在 Venmo 做工程師，全球帳號累計數十億次觀看。

你上傳一張產品或服務的照片，或用一句話描述。系統接著幫你做：落地頁和結帳、行銷文案和短片、在 Meta 和 Instagram 投放（他們叫 Magic Ads），以及在 WhatsApp、Telegram、Discord 和郵件裡向社群收費。2026 年 4 月的[官方新聞稿](https://www.prnewswire.com/news-releases/nascom-raises-27m-series-a-led-by-khosla-ventures-as-ai-unleashes-the-biggest-wave-of-new-business-creation-in-history-302745035.html)把它寫成給一人公司的 AI 後台：數位和實體商品、會員、廣告、全球收款和物流。

## 以前這件事有多麻煩

想賣課程、諮詢或手作，傳統路徑是 Shopify、Canva、Stripe、廣告後台，再加上一套客戶資料。懂手藝的人過不了三關：把網站架起來、找到客人、把錢收進來。

## 他們怎麼把這件事做出來

1. 一張照片就能開店。
2. Magic Ads：不懂廣告後台，也能產出素材並投放。
3. 粉絲留在 WhatsApp 和 Telegram 裡，不用再下載一個陌生 App。
4. 起步價低。新聞稿寫一個月 29 美元。平台靠訂閱，以及廣告和交易的抽成，不是先收一筆建站費。

## 做到哪裡了

- 2021 到 2022 年，Nas Academy 和 Nas.io 時期，Tracxn 等資料庫累計大約 2,300 萬美元，裡面包括 Lightspeed 領投的課程平台那一輪。
- 2026 年 4 月，品牌聚焦 Nas.com，A 輪 2,700 萬美元。Khosla Ventures 的 Vinod Khosla 和 Nicole Fraenkel 領投，500 Global 跟著投。天使包括 Deel 共同創辦人 Shuo Wang、DoorDash 共同創辦人 Stanley Tang、Tim Ferriss 等。簡報可以看 [Business Insider](https://www.businessinsider.com/nas-daily-founder-ai-storefront-startup-funding-read-pitch-deck-2026-4)。
- 同一則新聞稿：350 萬名成員、150 個以上的國家、一個月 29 美元。

創辦人自己就會帶來客人。他把「什麼文案會被轉發」做進產品裡。他不強迫人搬家。收費的理由是幫你找到客人，不只是幫你做一個網站。

| 你會看到的結果 | 數字 |
| --- | --- |
| 網站 | [nas.com](https://nas.com/) 和 [nas.io](https://nas.io/) |
| 2026 年 A 輪 | 2,700 萬美元，Khosla 領投 |
| 較早的輪次 | Nas.io 和 Academy 大約 2,300 萬美元（Tracxn 等） |
| 成員 | 350 萬（2026 年 4 月官方新聞稿） |
| 訂閱 | 一個月 29 美元 |
| 創辦人 | Nuseir Yassin，哈佛、前 Venmo |

早期簡報曾提「四位百萬美元創作者」。這頁以 2026 年官方稿的成員和訂閱數字為準。

## 你要做一個小版本，可以從這裡開始

把要開四個分頁才能做完的流程，收成一句話或一張照片。優先幫客戶帶來客人，不要只幫他建一個沒人看的站。把你自己領域裡會被轉發的做法，做成預設模板。

## 投資人為什麼肯付錢

Khosla 押的是一人公司可以變大。AI 讓個人不必先雇工程師和投放團隊。誰把開店的麻煩降到接近零，誰就卡住下一波個人生意的收款和分發。風險是平台什麼都包之後，商家會不會自己長出網站，以及廣告能不能持續賺得比花出去的多。
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
