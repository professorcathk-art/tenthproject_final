import { CASE_SEED_MARKER } from "@/lib/inspiration/constants";
import type { SeedCase } from "@/lib/seed/case-studies-batch2";

export const BATCH4_CASES: SeedCase[] = [
  {
    id: "44444444-4444-4444-4444-444444444426",
    title: "Wayback Machine",
    slug: "wayback-machine",
    category: "platform",
    categories: ["platform", "tooling"],
    website: "https://web.archive.org/",
    highlights: [
      { zh: "存檔網頁", en: "Pages archived", value: "1 兆+" },
      { zh: "資料量", en: "Data", value: "99 PB+" },
      { zh: "對外開放", en: "Public launch", value: "2001" },
      { zh: "外部融資", en: "Venture funding", value: "$0" },
    ],
    summaryZh:
      "網頁會改、會消失。Internet Archive 從 1996 年開始把公開網頁存下來。2025 年 10 月，Wayback Machine 宣布存檔超過一兆個網頁。",
    summaryEn:
      "Pages change and disappear. The Internet Archive has been saving public web pages since 1996. In October 2025 the Wayback Machine said it had passed one trillion archived pages.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

你今天看到的網頁，明天可能改掉或整個不見。Wayback Machine 是 Internet Archive 的時光機：輸入網址，調出這個網站以前長什麼樣子。2025 年 10 月，他們宣布存檔超過一兆個網頁。這不是創投公司，是非營利圖書館。

## 這間公司做什麼

[Wayback Machine](https://web.archive.org/) 是舊金山非營利組織 [Internet Archive](https://archive.org/) 的旗艦服務。創辦人 Brewster Kahle 與 Bruce Gilliat 從 1996 年開始抓公開網頁；2001 年 10 月才把查詢介面開放給一般人。維基百科寫：最早的存檔至少回溯到 1995 年。

用法很直白。把網址貼進去，就能看不同日期的快照：舊版首頁、下架的文章、改過的價格或條款。它同時也收書、影片、聲音和政府文件，不只是網頁。

## 痛點

搜尋引擎給你的是「現在這一版」。記者要核對政治人物改過的說法、律師要找已經下架的頁面、研究者要看一個產品以前怎麼寫，最新搜尋結果幫不上忙。網頁一改版、公司一倒、作者一手刪，連結就斷了。這個現象通常叫 link rot。

## 方案

1. **爬蟲一直在抓。** 公開網頁的 HTML、樣式和圖片會被存成不同時間點的版本。
2. **誰都可以存一頁。** Save Page Now 讓人貼上網址，當場做一份公開備份，不必等爬蟲自己來到。
3. **死連結有地方去。** 它跟維基百科等合作，失效引用可以導向存過的版本，而不是只剩 404。
4. **研究者可以程式查。** CDX API 讓人用程式調存檔，不必一頁一頁用手動點。

## 成功故事與成功之道

公開時間線（Internet Archive 官方部落格、維基百科）：

- 1996：Kahle 成立 Internet Archive，開始備份早期網頁。
- 2001 年 10 月：Wayback Machine 在舊金山對公眾開放。
- 2024：維基百科年表寫當年大約 8,660 億頁。2025 年 10 月突破一兆頁之後，要以新數字為準。
- 2025 年 10 月：官方宣布突破 **一兆個網頁**。維基百科同期寫資料量遠超過 99 petabytes。

它能活這麼久，靠的是捐款和補助，不靠廣告，也不賣使用者資料。2025 年突破一兆頁的時候，館方說有很多人捐了錢。Kahle 接受《舊金山觀察家報》訪問時提到，AI 公司會來抓這些舊網頁，館方也會把開放館藏整理成比較好拿的包裹。歷史網頁已經變成訓練模型的原料。Common Crawl 是另一個計畫，跟這座檔案館不是同一套東西。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| 存檔網頁 | 超過 1 兆 | [Internet Archive，2025 年 10 月](https://blog.archive.org/2025/10/31/one-trillion-web-pages-archived-internet-archive-celebrates-a-civilization-scale-milestone/) |
| 資料量 | 遠超過 99 PB | 維基百科引 2025 年 10 月資料 |
| 性質 | 501(c)(3) 非營利 | 官方 |
| 創投融資 | 沒有。靠捐款與補助 | 官方 |

## 普通人如何複製

不要重做一座國家圖書館。要學的是「東西會變，把變化存下來」：

- 只盯一個窄頁面：SaaS 定價頁、招聘頁、競品文案。有人改了就通知。
- 讓使用者一鍵存，比你自己爬全世界便宜。
- 別人已經斷掉的連結，就是你的入口。

## 創業者與矽谷視角

Kahle 證明了一件創投圈不愛聽的事：有些基礎設施不必做成要退出的公司。它不發股利，但記者、法庭和模型公司都還是得回來查。護城河是幾十年的存檔，不是下一輪估值。
`,
    bodyEn: `
## In short

Pages change and vanish. The Wayback Machine lets you look up how a URL used to look. In October 2025 the Internet Archive said it had passed one trillion archived pages. It is a nonprofit library, not a venture-backed startup.

## What it does

[Wayback Machine](https://web.archive.org/) is the flagship of the [Internet Archive](https://archive.org/). Brewster Kahle and Bruce Gilliat began capturing public pages in 1996 and opened the public interface in October 2001.

## Why it exists

Search engines show the current version. Reporters, lawyers, and researchers often need the previous one. That gap is usually called link rot.

## How it works

Crawlers store snapshots. Save Page Now lets anyone archive a URL immediately. Broken citations, including on Wikipedia, can be pointed at a saved copy. The CDX API is for programmatic lookup.

## What is public

The Archive’s October 2025 post marks one trillion pages. Wikipedia puts the collection at well over 99 petabytes around the same date. The often-quoted “860 billion” figure matches the 2024 row in Wikipedia’s table, not the later milestone. Kahle has said AI labs pull data from the Archive; that is not the same project as Common Crawl.

## What to copy

Archive one narrow kind of page, let users save a URL in one click, and treat broken links as the product.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444427",
    title: "Today",
    slug: "today-ai",
    category: "saas",
    categories: ["saas", "workflow_agent"],
    website: "https://today.ai/",
    highlights: [
      { zh: "方案", en: "Plans", value: "Free / Pro / Ultra" },
      { zh: "試用", en: "Trial", value: "Pro 7 天" },
      { zh: "公開營收", en: "Published revenue", value: "沒有" },
      { zh: "公開融資", en: "Published round", value: "沒有" },
    ],
    summaryZh:
      "Today 把日曆、信箱和筆記接在一起，你用一句話交代今天要做的事。Mac 和 iPhone 都能下載。營收和融資都還沒有公開。",
    summaryEn:
      "Today connects calendar, mail, and notes so you can hand it the day in plain language. The site describes the product. It does not publish revenue or a funding round, so this page sticks to what is on the record.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

Today 想當你的日程助理。日曆、信箱、筆記、檔案和訊息接上去之後，你用一句話交代，它幫你找時間、盯後續。方案有免費、Pro、Ultra。Pro 和 Ultra 按月收費，符合資格的帳號可以先試 Pro 七天。營收和融資，公司都還沒有公布。

## 這間公司做什麼

[today.ai](https://today.ai/) 連的是你已經在用的日曆、郵件、筆記、檔案、訊息和專案工具。Mac（Apple 晶片和 Intel，macOS 15 以後）和 iPhone 都能下載。條款裡寫，實際看得到的功能會依方案、地區和版本不同。

到 2026 年 9 月，Assistant Benchmark 仍把他們的融資標成未披露。外面還沒有獨立報導寫出用戶數或營收。

## 痛點

日曆和待辦要自己顧。臨時插進一場會，下午的安排就散了。很多人不是不會排，是不想每天重排一次。Today 有沒有把人留住，外面還沒有數字。

## 方案

官網上能確認的做法是這三件：

1. 接上你已經在用的日曆、信箱和筆記，不必再養一個新清單。
2. 用說話交代事情，不必每個任務都自己拉時間塊。
3. 分成 Free、Pro、Ultra。價錢在結帳前才顯示，會因地區和通路改變。Ultra 目前不能免費試。條款裡沒有寫月費，也沒有公布有多少人從免費轉成付費。

## 成功故事與成功之道

目前還沒有獨立報導寫出時間線、用戶數或營收。能看見的是：產品已經上線，電腦和手機都能下載，怎麼收費寫在條款裡。

如果它以後真的把人留住，值得學的是把「重新排一天」收成一句話，而不是再丟給人二十個選單。這件事現在還是產品方向，還沒有成績單。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| 方案 | Free、Pro、Ultra；Pro／Ultra 月費 | [條款](https://today.ai/terms) |
| Pro 試用 | 符合資格可試 7 天 | 同上 |
| 客戶端 | Mac、iOS | [下載頁](https://today.ai/downloads) |
| 營收／融資 | 未公開 | Assistant Benchmark，2026 年 9 月 |

## 普通人如何複製

找一件人想做、但不想天天維護的小事：健身、讀書、出差。讓人只要點確認或拒絕。計畫被打亂時，給一條重新開始的路，不要用罪惡感把人留下。先把這個動作做出來。還沒有營收，登陸頁就先別寫營收。

## 創業者與矽谷視角

個人生產力正在從「再給你一個清單」走到「幫你把今天排完」。Motion、Reclaim 已經站在這個位子上。Today 的產品看得到，成績單還沒有。
`,
    bodyEn: `
## In short

Today connects the calendar, mail, and notes you already use and takes instructions in plain language. Free, Pro, and Ultra plans exist. There is no published revenue or funding round.

## What is on the record

The [terms](https://today.ai/terms) say Pro and Ultra are monthly subscriptions, prices are shown before purchase and vary by region, eligible accounts may get a 7-day Pro trial, and Ultra has no free trial. Downloads cover Mac (macOS 15+) and iOS. Assistant Benchmark listed funding as “not disclosed” in September 2026.

## What not to claim

Dollar prices, a one-click replan conversion rate, and a viral Product Hunt timeline do not show up in those sources. Treat them as unverified.

## What to copy

Pick a plan people want but will not maintain. Let them confirm or reject. Do not print an ARR you cannot show.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444428",
    title: "Plaid",
    slug: "plaid",
    category: "platform",
    categories: ["platform", "saas"],
    website: "https://plaid.com/",
    highlights: [
      { zh: "2026 年售股估值", en: "2026 tender", value: "$8B" },
      { zh: "2021 年高點", en: "2021 peak", value: "$13.4B" },
      { zh: "金融機構", en: "Institutions", value: "12,000+" },
      { zh: "創立", en: "Founded", value: "2012" },
    ],
    summaryZh:
      "很多 App 連銀行帳戶時，跳出的那一頁是 Plaid。2021 年估值到過 134 億美元，2026 年 2 月員工售股是 80 億。2026 年 5 月，ChatGPT 開始用它讀美國用戶自己的帳戶。",
    summaryEn:
      "When an app connects a bank account, the screen is often Plaid. The company peaked at a $13.4 billion valuation in 2021. An employee share sale in February 2026 priced it at $8 billion. In May 2026 ChatGPT began using Plaid so U.S. users could connect their own accounts.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

Plaid 不做給一般人用的記帳 App。它做水管：別的 App 要讀銀行餘額、驗證帳戶，就接它。Zach Perret 和 William Hockey 2012 年在舊金山創立。2026 年 2 月，公司確認員工可以按 80 億美元估值賣一部分股票。這比 2025 年 4 月的 61 億高，仍低於 2021 年的 134 億。

## 這間公司做什麼

[plaid.com](https://plaid.com/) 讓開發者用一套 API 連上很多銀行。使用者在 Venmo、券商或新銀行 App 裡點「連接帳戶」，看到的常是 Plaid Link：選銀行、登入網銀，帳戶就接上了。Plaid 自己的部落格寫，它連接超過 12,000 家金融機構，帳戶種類從支票、儲蓄到投資和加密貨幣。

## 痛點

美國有上萬家銀行和信用合作社，每家資料格式都不一樣。2012 年以前，每做一個金融 App 就要自己接一遍，不然就叫用戶手填。很多人在這一步離開。小團隊也沒有能力自己保管別人的網銀密碼。

## 方案

1. **一套 API 對很多銀行。** 開發者不用每家銀行各寫一支爬蟲。
2. **Link 把登入收成一個畫面。** 使用者選銀行、登入，不用理解背後是哪一家的介面。
3. **從「讀資料」往外長。** 後來加上轉帳、身份驗證等，不再只是把交易明細拉出來。
4. **2026 年接到 ChatGPT。** Plaid 部落格寫，美國的 ChatGPT Pro 用戶可以把自己的帳戶接上，回答會根據餘額和交易，而不只是泛泛的理財建議。Bloomberg 在 2026 年 5 月報過這次合作。

## 成功故事與成功之道

- 創辦人一開始想做消費者記帳。連銀行這一步太痛，他們把這一步做成產品。這段轉折是 Plaid 自己和後來報導反覆講的起源。
- 2020 年 Visa 宣布擬以約 53 億美元收購。美國司法部提反壟斷訴訟，Visa 在 2021 年放棄。
- 2021 年 Series D 估值到 **134 億美元**。
- 2025 年 4 月：約 **5.75 億美元**，估值 **61 億美元**，Franklin Templeton 領投，一部分用來讓員工賣股、付限制性股票稅金。TechCrunch 如此報導。
- 2026 年 2 月 26 日：員工售股估值 **80 億美元**。TechCrunch 寫，這比一年前高約 31%，仍比 2021 年高點低約四成。Crunchbase 引公司的話：2025 年新客戶裡有 20% 是 AI 公司。

網路效應很具體。App 因為它連得多而接它；銀行因為熱門 App 都在用，也願意跟它談介面。合規是後來者的門檻，不是口號。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| 2026 年 2 月估值 | 80 億美元（員工售股） | TechCrunch、Crunchbase |
| 2025 年 4 月 | 5.75 億美元、估值 61 億 | TechCrunch |
| 2021 年高點 | 134 億美元 | 同上 |
| 金融機構 | 12,000+ | Plaid 官方部落格 |
| ChatGPT | 2026 年 5 月，美國 Pro 用戶可連接帳戶 | Plaid 部落格、Bloomberg |

上表是這幾篇報導對得上的數字。各資料庫的累計融資總額彼此不一樣，這裡不另開一行。

## 普通人如何複製

你自己的產品如果卡在「每家系統都不一樣」，那個卡點可能比原產品更大。把碎片接口收成一支 API，文件和沙盒比廣告有用。醫療病歷、物流、房東系統都是同一類形狀。不要一開始就碰銀行級合規，除非你真的打算花幾年只做這件事。

## 創業者與矽谷視角

Visa 想買它，是怕它變成支付的旁路。沒買成，它還在。2026 年的新用途是：程式要替人看帳戶、做決定，就得有人握著讀真實帳戶的許可。Plaid 賣的是這個許可。
`,
    bodyEn: `
## In short

Plaid is the pipe other apps use to connect bank accounts. Zach Perret and William Hockey started it in 2012. An employee tender in February 2026 valued it at $8 billion, up from $6.1 billion in April 2025 and still below the $13.4 billion peak in 2021.

## What changed in 2026

Plaid’s blog says ChatGPT Pro users in the U.S. can connect accounts and get answers based on balances and transactions. Bloomberg reported the partnership in May 2026. The company says it links more than 12,000 institutions.

## Timeline worth keeping

The founders started with a consumer budgeting app and switched to the connection layer. Visa’s roughly $5.3 billion deal was abandoned in 2021 after a Justice Department suit. TechCrunch reported the April 2025 round of $575 million at $6.1 billion, partly so employees could sell shares.

## What to copy

If every integration is a one-off, sell the integration. Do not cite a cumulative funding total this page could not re-check.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444429",
    title: "Slingshot AI (Ash)",
    slug: "slingshot-ai",
    category: "saas",
    categories: ["saas", "workflow_agent"],
    website: "https://www.slingshot.xyz/",
    highlights: [
      { zh: "累計融資", en: "Capital raised", value: "$93M" },
      { zh: "封測用戶", en: "Beta users", value: "50,000" },
      { zh: "產品", en: "Product", value: "Ash" },
      { zh: "a16z 進場", en: "a16z round", value: "2025.01" },
    ],
    summaryZh:
      "Casper 的聯合創辦人 Neil Parikh，和做心理健康 AI 的 Daniel Cahn，做了一個專門談心理的 App，叫 Ash。公司說累計融資 9,300 萬美元。它自己也寫明：這不能取代臨床治療。",
    summaryEn:
      "Casper cofounder Neil Parikh and ML engineer Daniel Cahn built Ash, an app meant for therapy-style conversations. The company says it has raised $93 million. Ash’s own listing says it is not a substitute for clinical care.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

一般聊天模型很會給建議。諮商不太一樣，好的諮商師常常先問，不急著給答案。Slingshot 說自己為這件事另練了一個模型，產品叫 Ash，iPhone 和 Android 都能下載，公開時免費。2025 年 7 月的新聞稿寫，累計融資 **9,300 萬美元**。

## 這間公司做什麼

[Slingshot](https://www.slingshot.xyz/) 由 Daniel Cahn（共同創辦人兼 CEO）和 Neil Parikh（共同創辦人兼總裁）帶領。a16z 在 2025 年 1 月寫：Parikh 從醫學院休學，共同創立 Casper，並把營收做到 5 億美元以上、2020 年上市；Cahn 是機器學習工程師，帝國理工把他在心理健康 AI 上的研究列為傑出項目。臨床負責人 Derrick Hull 之前在 Noom 和 Talkspace。

Ash 用文字和語音談。公司說它按 CBT、DBT、ACT 這類方法來對話，並且記得較早提過的人或壓力。Google Play 頁寫得很直：它不是臨床治療的替代品。有焦慮、憂鬱或其他診斷的人，應該跟治療並行使用，不能拿它當危機專線。

## 痛點

想找人談的人很多，諮商師不夠，一小時往往很貴。把 ChatGPT 直接拿來當治療師有另一個問題：通用模型習慣給答案、給清單。諮商要的常常是把問題問回去。未經專門約束的模型，也可能說出傷人的話。

## 方案

Business Wire（2025 年 7 月 22 日）和 a16z 的說法：

1. 他們說這是給心理學用的模型，不是在通用模型上貼一層提示詞。封測做了 18 個月。
2. 先給 5 萬名封測用戶用，再公開到 iPhone 和 Android。
3. 安全邊界寫在商店頁的第一眼：不能取代治療，也不能當危機專線。

公司還說自己握有很大的行為健康資料。這句是他們的說法，外面沒有人幫他們審計過。

## 成功故事與成功之道

- 2025 年 1 月 14 日：a16z 宣布領投 Series A，當時累計融資 **4,000 萬美元**。
- 2025 年 7 月 22 日：Radical Ventures 與 Forerunner 共同領投延伸輪，加上原本的 a16z、Felicis、Menlo，累計 **9,300 萬美元**。同一天公開 Ash。

值得看的是這組人：一個把消費品牌做大過的人，一個做過心理健康模型的人，再加上臨床負責人。新聞稿裡的「第一個」，是發布用語，不是已經被外界證明的結論。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| 累計融資 | 9,300 萬美元 | Business Wire，2025-07-22 |
| 2025 年 1 月 | 累計 4,000 萬美元 | a16z |
| 封測 | 18 個月、5 萬人 | 同上新聞稿 |
| 形態 | 免費 iOS／Android App | 新聞稿、Google Play |

## 普通人如何複製

高敏感場景不要直接套通用模型的口吻。教育、法律、陪伴，有時「先問一句」比「給三步驟」有用。安全邊界要寫在第一屏，不要藏在條款第十條。沒有臨床伙伴之前，不要自稱治療。

## 創業者與矽谷視角

a16z 的 Vijay Pande 寫過：通用模型急著給確定答案，心理學要的是另一套互動。這是投資人的判斷。Ash 目前公開的是融資，以及它不能取代治療。營收還沒有公布。
`,
    bodyEn: `
## In short

Ash is Slingshot’s therapy-style app. Daniel Cahn is CEO. Neil Parikh, who cofounded Casper, is president. A July 22, 2025 Business Wire release says total capital reached $93 million after an extension co-led by Radical Ventures and Forerunner. a16z’s January 2025 note had put the total at $40 million. The older “$83 million” figure does not match that release.

## Limits they publish

Google Play says Ash is not a substitute for clinical treatment and is not for crisis use. The company says it trained for 18 months with 50,000 beta users before the public iOS and Android launch.

## What to copy

In sensitive domains, ask before you answer, and put the safety limit on the first screen. Do not call it therapy if you have not staffed the clinical side.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444430",
    title: "Astrotalk",
    slug: "astrotalk",
    category: "platform",
    categories: ["platform", "saas"],
    website: "https://astrotalk.com/",
    highlights: [
      { zh: "FY25 營收", en: "FY25 revenue", value: "₹1,176 cr" },
      { zh: "公司稱年化", en: "Claimed run-rate", value: "₹2,500 cr+" },
      { zh: "2026 年估值", en: "2026 valuation", value: "$1B" },
      { zh: "已知機構融資", en: "Known institutional", value: "$34M" },
    ],
    summaryZh:
      "Astrotalk 把印度的占星做成按分鐘付費的平台。FY25 營收 1,176 crore 盧比，公司說目前年化已超過 2,500 crore。2026 年 8 月用獲利做員工回購，估值 10 億美元。",
    summaryEn:
      "Astrotalk turned Indian astrology into a pay-per-minute marketplace. FY25 revenue was ₹1,176 crore. The company says the run-rate has since passed ₹2,500 crore. An August 2026 ESOP buyback valued it at $1 billion. That is not ₹250 billion.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

印度很多人在升學、求職、結婚、買房之前會看星盤。街上的師傅品質差很多，價格也不透明。Puneet Gupta 和 Anmol Jain 2017 年在 Noida 做了 [Astrotalk](https://astrotalk.com/)：打開 App，選審過的占星師或塔羅師，按分鐘文字、語音或視訊。後來又賣開運商品。

印度報導用的單位是 **crore**，1 crore 等於 1,000 萬盧比。FY25 營收 ₹1,176 crore。公司說目前年化已經超過 ₹2,500 crore，大約是 3 億美元這個等級。

## 這間公司做什麼

平台從諮詢裡抽成，使用者按分鐘付。Inc42、India Today、《經濟時報》都寫：核心是占星，後來加上靈性電商。《經濟時報》寫，電商推出後一年內，2025 年做出超過 ₹140 crore。

占星師有多少人、市佔多少、電商賣了幾張單，這幾篇財經報導都沒寫。看得到的是營收、利潤和融資。

## 痛點

需求是日常的，供給是散的。年輕人想問，但不想跑廟或跟陌生人面對面。按分鐘、可以匿名，把「先試一分鐘」變得比較不尷尬。

## 方案

1. 雙邊市場：使用者挑人，平台抽成。
2. 按分鐘計費，而不是一次收一大筆。
3. 諮詢之外賣實體：寶石和宗教周邊，讓同一個人再買一次。

占星師怎麼審、通過率多少，財報新聞沒提，得到產品頁上看。

## 成功故事與成功之道

- 2017 年創立。
- 2024 年 2 月：紐約 Left Lane Capital 投 2,000 萬美元。2024 年 6 月再投 1,400 萬美元。《經濟時報》寫，2024 年 6 月那輪投前估值約 ₹2,400 crore。Elev8 也是投資人。
- FY25（到 2025 年 3 月）：營業收入 **₹1,176 crore**，比前一年 ₹651 crore 增加約 81%。稅前利潤 **₹285 crore**，這是《經濟時報》的數字。Inc42 另寫淨利約 ₹250 crore。一個是稅前，一個是稅後。
- 2026 年 8 月：員工持股回購，估值 **10 億美元**（約 ₹9,500 crore）。Inc42 和 India Today 寫，錢來自公司獲利，不是新一輪外部融資。超過 100 名員工賣掉部分持股。公司沒有公布回購總額。India Today 引公司的話：當時收入 run-rate 超過 ₹2,500 crore。

已知的機構資金大約 3,400 萬美元。2026 年員工回購把估值做到 10 億美元，錢來自獲利，不是新一輪外部融資。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| FY25 營收 | ₹1,176 crore | 《經濟時報》 |
| FY25 稅前利潤 | ₹285 crore | 《經濟時報》 |
| 公司稱 run-rate | 超過 ₹2,500 crore | India Today／Inc42 引公司 |
| 2026 年 8 月估值 | 10 億美元 | ESOP 回購，Inc42 |
| 已知機構融資 | Left Lane 2,000 萬 + 1,400 萬美元 | 《經濟時報》、NDTV Profit |

## 普通人如何複製

找一個線下很散、人們又願意為焦慮付錢的服務。用評價、按分鐘和匿名把信任做出來。諮詢後面如果有會用完的東西，再賣一次。先有獲利，再談估值。crore 先換算成盧比，再寫進文章。

## 創業者與矽谷視角

這不是一家模型公司。它把印度人本來就在做的事，收成一個平台。大約 3,400 萬美元的機構資金，做出 FY25 超過一千 crore 的營收，而且有獲利。10 億美元是員工回購時的估值，不是新一輪投資人開出的價格。
`,
    bodyEn: `
## In short

Astrotalk is a pay-per-minute astrology marketplace founded in 2017 by Puneet Gupta and Anmol Jain. FY25 operating revenue was ₹1,176 crore. The company says the run-rate later passed ₹2,500 crore. An August 2026 ESOP buyback, funded from profits, valued it at $1 billion. A crore is 10 million rupees. ₹2,500 crore is not “250 billion rupees.”

## Money that is sourced

The Economic Times reported FY25 revenue of ₹1,176 crore, up about 81% from ₹651 crore, and profit before tax of ₹285 crore. Left Lane Capital put in $20 million in February 2024 and $14 million in June 2024. Inc42 and India Today reported the unicorn valuation. Headcount of astrologers, an 80% market share, and 1.6 million store orders were not in those pieces, so they are left out.

## What to copy

Standardize a fragmented, anxiety-driven offline service. Add a second purchase only after the consult works. Check units before you publish.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444431",
    title: "River",
    slug: "river-ai",
    category: "tooling",
    categories: ["tooling", "platform"],
    website: "https://river.ai/",
    highlights: [
      { zh: "種子 + A 輪", en: "Seed + Series A", value: "$1.1B" },
      { zh: "成立到宣布", en: "Age at announce", value: "約 2 個月" },
      { zh: "估值", en: "Valuation", value: "未公開" },
      { zh: "領投", en: "Lead", value: "GC、AMP" },
    ],
    summaryZh:
      "xAI 共同創辦人 Igor Babuschkin 做了一家微調開源模型的公司。2026 年 8 月宣布種子輪加 A 輪共 11 億美元。成立大約兩個月。估值沒有公布。",
    summaryEn:
      "xAI cofounder Igor Babuschkin started a company that fine-tunes open-weight models. In August 2026 River announced $1.1 billion across a seed and Series A. The company was about two months old. It declined to disclose a valuation.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

很多公司想用自己的資料把模型調順，但不想從零訓練，也不想把調好的模型留在別人那裡。River 賣的就是這件事：從開源模型出發，用 LoRA 和強化學習做微調，按用量計費，調完的權重歸客戶。2026 年 8 月 11 日，路透社和 TechCrunch 都報了種子輪加 A 輪一共 **11 億美元**。估值沒有公布。

## 這間公司做什麼

[river.ai](https://river.ai/) 的創辦人兼 CEO 是 Igor Babuschkin。他是 xAI 的共同創辦人，之前在 DeepMind 和 OpenAI 待過。TechCrunch 寫，公司在加州帕羅奧圖，宣布這輪的時候成立大約兩個月，6 月才從隱身狀態走出來。

他們的做法是：你透過 API 做微調和強化學習，調好就能上線，權重留在自己手上。NVIDIA 和 AMD Ventures 是策略投資人。領投的是 General Catalyst 和 AMP PBC，Y Combinator、淡馬錫也在名單裡。路透社和 TechCrunch 都是這樣報的。

## 痛點

通用模型懂很多，但不懂你的客服用語、合約格式或內部知識。自己搭 GPU 叢集，對大多數團隊太貴。把資料送去閉源 API 微調，又有人擔心權重和資料不在自己手上。

## 方案

新聞稿和報導裡寫的做法是：

1. 從開源模型出發，用 LoRA 和強化學習調成自己的版本。
2. 按用量計費，不必先買一櫃機器。
3. 調完的權重歸客戶，不留在供應商那裡。

新聞裡的說法是：調好就能上線。

## 成功故事與成功之道

這輪錢很大，產品成績單還很小。TechCrunch 盯的是人：Babuschkin 離開 xAI 之後，市場願意在公司幾乎剛成立時給他 11 億美元。路透社引他的話：開源模型已經夠好用，接下來是讓每家公司調出自己的版本。營收、客戶數、毛利，目前都還沒有公開。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| 融資 | 種子 + A 輪共 11 億美元 | 路透、TechCrunch，2026-08-11 |
| 領投 | General Catalyst、AMP PBC | 同上 |
| 策略投資 | NVIDIA、AMD Ventures | 同上 |
| 估值 | 未公布 | 路透社 |
| 公司年齡 | 宣布時約兩個月 | TechCrunch |

## 普通人如何複製

先問清楚客戶要的是哪一件。如果他們要的是模型看得懂自己的文件，用現成的 API 就能試。等真的有人下單，再決定要不要自己做訓練。11 億美元是 Babuschkin 募到的，跟你的第一個客戶沒有關係。

## 創業者與矽谷視角

11 億美元買的是人和算力。對一般創辦人，這則新聞的用處是看清市場在賭什麼：開源模型，加上每家公司自己的微調。
`,
    bodyEn: `
## In short

River fine-tunes open-weight models with LoRA and reinforcement learning and says customers keep the weights. On August 11, 2026, Reuters and TechCrunch reported a $1.1 billion seed-plus-Series A led by General Catalyst and AMP PBC, with NVIDIA and AMD Ventures participating. Igor Babuschkin, an xAI cofounder, is CEO. Reuters said the company declined to disclose valuation. TechCrunch said it was about two months old.

## What not to claim

A $5 billion valuation and a 15-to-20-minute SLA are not in those reports. The public word for deploy speed is “instant.”

## What to copy

Prove that a customer will pay for a model that knows their documents before you raise money to own the training stack.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444432",
    title: "Fish Audio",
    slug: "fish-audio",
    category: "saas",
    categories: ["saas", "tooling"],
    website: "https://fish.audio/",
    highlights: [
      { zh: "種子輪", en: "Seed", value: "$52M" },
      { zh: "公司稱 ARR", en: "Stated ARR", value: "$21M" },
      { zh: "用戶", en: "Users", value: "800 萬+" },
      { zh: "GitHub stars", en: "GitHub stars", value: "31,000+" },
    ],
    summaryZh:
      "前 Nvidia 研究員用一張 RTX 4090 做出開源語音模型。一年後，公司說 ARR 2,100 萬美元、用戶超過 800 萬，並在 2026 年 7 月融了 5,200 萬美元種子輪。",
    summaryEn:
      "A former NVIDIA researcher trained an open-source voice model on a single RTX 4090. A year later the company said it had $21 million ARR and more than 8 million users, and raised a $52 million seed in July 2026.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

[Fish Audio](https://fish.audio/) 做即時語音：上傳一小段聲音，就能讓模型用那個聲音說話，也可以用自然語言改情緒和口音。法律上的公司名是 Hanabi AI Inc.。2026 年 7 月 28 日，TechCrunch 和公司新聞稿都報了 **5,200 萬美元種子輪**。公司自己說，成立一週年時 ARR **2,100 萬美元**、用戶超過 **800 萬**。

## 這間公司做什麼

共同創辦人 Shijia Liao 之前在 Nvidia 做影像研究。他先用一張 RTX 4090 訓練開源的 Fish Speech，GitHub 星星超過 31,000。CEO 是共同創辦人 Rissa Cao。產品在網頁和 API 上賣：文字轉語音、聲音克隆、用句子控制語氣。公司寫支援 83 種以上語言、超過 15,000 個自然語言控制。

TechCrunch 引 Cao 的話，客戶裡有 HeyGen 和 LiveKit。新聞稿也提到遊戲和語音助理。這是公司自己點的名。

## 痛點

配音和真人錄音貴，改一句就要重錄。通用語音模型聽得懂字，但不一定聽得懂「這句要輕一點、帶一點笑」。創作者和客服機器人需要的是可控的聲音，而且延遲要低到能對話。

## 方案

1. 開源模型先讓人下載、改、討論，星星數變成信任。
2. 雲端 API 賣給不想自己管 GPU 的人。
3. 用一句話控制語氣，而不是一排滑桿。公司說，在他們自己的盲測裡，66% 的聽眾更喜歡 S2.1 Pro。SiliconANGLE 寫成 67%。以公司自己的 66% 為準，這是他們測的。

## 成功故事與成功之道

- 模型先開源，公司後成立。Cao 的公開介紹把公司成立時間放在 2025 年 7 月前後。
- 團隊從 3 人到 22 人，這是公司部落格的說法。
- 2026 年 7 月 28 日：Coreline Ventures 與 Capital Today 領投種子輪。跟投包括 359 Capital、Parable、Play Time、Alphalist、Bayhouse、Carya、HF0、645。

先把模型開放出去，開發者用得順，願意付費的人再走 API。2,100 萬美元的年經常性收入，是公司在融資新聞裡自己說的。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| 種子輪 | 5,200 萬美元 | TechCrunch、公司新聞稿，2026-07-28 |
| ARR | 2,100 萬美元 | 公司在該輪公布 |
| 用戶 | 800 萬以上 | 同上 |
| Fish Speech | GitHub 31,000+ stars | 公司／TechCrunch |
| 盲測 | 66% 聽眾偏好 S2.1 Pro | 公司；標明為自測 |

## 普通人如何複製

先把模型或工具放到別人能改的地方，再用 API 收費。控制項用一句人話，不必先做一排設定。66% 可以講，記得說這是他們自己測的。

## 創業者與矽谷視角

語音正在從「把稿子念出來」變成「一個能對話的角色」。Fish 的順序很清楚：一張消費級顯卡、先開源、做了一年、公司說年經常性收入到 2,100 萬美元，然後才是 5,200 萬美元的種子輪。值得看的是這個順序。
`,
    bodyEn: `
## In short

Fish Audio (Hanabi AI Inc.) sells realtime voice cloning and natural-language control of tone. On July 28, 2026, TechCrunch and the company announced a $52 million seed led by Coreline Ventures and Capital Today. The company said it had reached $21 million ARR and 8 million users in its first year. Shijia Liao, formerly at NVIDIA, trained the open-source Fish Speech model on one RTX 4090. It has more than 31,000 GitHub stars. CEO Rissa Cao named HeyGen and LiveKit as customers.

## How to read the 66%

The company’s own blind test said 66% of listeners preferred S2.1 Pro. That is a company test, not an independent benchmark.

## What to copy

Open-source the model, charge for the API, and describe control in a sentence.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444433",
    title: "Tripo AI",
    slug: "tripo-ai",
    category: "tooling",
    categories: ["tooling", "saas"],
    website: "https://www.tripo3d.ai/",
    highlights: [
      { zh: "2026 年 3 月", en: "March 2026", value: "$50M" },
      { zh: "2026 年 9 月 B/B+", en: "Sept 2026", value: "約 ¥30 億" },
      { zh: "用戶", en: "Users", value: "數千萬" },
      { zh: "創立", en: "Founded", value: "2023" },
    ],
    summaryZh:
      "Tripo 用文字或照片生成 3D 模型。創辦人宋亞宸 1997 年出生。2026 年 3 月拿了 5,000 萬美元，阿里和百度風投在裡面。9 月的 B／B+ 輪，報導寫約 30 億人民幣。",
    summaryEn:
      "Tripo turns text or photos into 3D models. Founder Simon Song was born in 1997. A March 2026 round of $50 million included Alibaba and Baidu Ventures. Reports put the September 2026 Series B/B+ at about RMB 3 billion.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

做遊戲、電商或空間運算的人，一個 3D 模型常常要美術畫很多天。Tripo 讓人打一句話，或丟一張圖，先得到一版能改的模型。公司叫 VAST。CEO 宋亞宸 1997 年出生，約翰霍普金斯畢業，之前在 MiniMax 和商湯。2026 年的融資要一輪一輪看，下面分開寫。

## 這間公司做什麼

[tripo3d.ai](https://www.tripo3d.ai/) 把生成結果做成遊戲和設計軟體能接的格式。36kr 寫，合作方包括網易、騰訊、字節跳動和微軟。

團隊裡，首席科學家曹炎培之前在騰訊做生成式 3D，CTO 丁亮是清華博士，之前在商湯。公開報導反覆出現的是宋亞宸、曹炎培、丁亮這三位。

## 痛點

3D 不是「再生成一張圖」。遊戲要的是拓撲乾淨、能綁骨架的模型。生成得快但網格不能用，美術還是得重做。Tripo 後來強調四邊面，就是在回這個抱怨。

## 方案

1. 文字或圖片先進，幾秒出一版，讓美術從修改開始，而不是從空白開始。
2. 往可編輯的網格走。36kr 寫 Tripo P2.0 Preview 可以在幾秒內生成四邊面。
3. 賣給已經有產線的公司，而不只是給個人玩。

## 成功故事與成功之道

2026 年這幾輪要分開看：

- 2023 年創立。
- 2026 年 3 月：**5,000 萬美元**，投資人包括阿里巴巴和百度風投。
- DealStreetAsia 寫，6 月有一輪接近 2 億美元的延伸 A 輪，估值超過 10 億美元；7 月 A3 超過 10 億人民幣（約 1.49 億美元），吉利資本在裡面。
- 2026 年 9 月 1 日：B／B+ 約 **30 億人民幣**（約 4.46 億美元），經緯領投。跟投包括完美世界、藍色光標、中科創達、三七互娛，以及 CDH、中金、CMC、洪泰、春華、INCE 等。
- 公司對 36kr 說，不到半年籌了約 50 億人民幣。這是公司自己的說法。
- 用戶數，公司說是數千萬。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| 2026 年 3 月 | 5,000 萬美元 | 多家報導，阿里、百度風投 |
| 2026 年 9 月 | B／B+ 約 30 億人民幣 | DealStreetAsia、PR Newswire |
| 半年籌資 | 公司稱約 50 億人民幣 | 36kr 引公司 |
| 用戶 | 公司稱數千萬 | 36kr |

## 普通人如何複製

先服務已經在付美術費的人：獨立遊戲、電商主圖、建築方案。輸出要能進他們的軟體，不只是一張好看的預覽。速度快是入場券，網格能不能改才是留下的原因。

## 創業者與矽谷視角

2026 年，中國生成式 3D 的融資非常密。值得看的是錢從哪裡來：遊戲、行銷、汽車。他們買的是做模型的產線。
`,
    bodyEn: `
## In short

Tripo, by VAST, generates 3D models from text or images. Simon Song (born 1997), formerly of MiniMax and SenseTime, is CEO. March 2026: $50 million including Alibaba and Baidu Ventures. DealStreetAsia reported a September 1, 2026 Series B/B+ of about RMB 3 billion led by Matrix Partners China. The company told 36kr it had raised about RMB 5 billion in under six months — cite that as the company’s claim. Users are “tens of millions” in the same reporting. Do not collapse the rounds into one unverified “$500 million+” total.

## What to copy

Sell into teams that already pay for 3D labor, and export a mesh their tools can edit.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444434",
    title: "Peec AI",
    slug: "peec-ai",
    category: "saas",
    categories: ["saas", "workflow_agent"],
    website: "https://peec.ai/",
    highlights: [
      { zh: "公司稱 ARR", en: "Stated ARR", value: "$10M" },
      { zh: "客戶", en: "Customers", value: "2,500+" },
      { zh: "累計融資", en: "Funding", value: "$29M" },
      { zh: "上線", en: "Launched", value: "2025.02" },
    ],
    summaryZh:
      "Peec 看品牌有沒有出現在 ChatGPT、Perplexity 這類答案裡。2025 年 2 月上線，16 個月後公司說 ARR 超過 1,000 萬美元、客戶超過 2,500 家。",
    summaryEn:
      "Peec tracks whether a brand shows up in answers from ChatGPT, Perplexity, and similar products. It launched in February 2025. Sixteen months later the company said ARR had passed $10 million, with more than 2,500 customers.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

以前做 SEO，是看 Google 搜尋結果第幾名。現在有人改問 ChatGPT。Peec 賣的是後面這件事的儀表板：你的品牌在答案裡有沒有被提到、排第幾、語氣正不正、引用了哪個網頁。GlobeNewswire 2026 年 5 月 28 日寫：上線 16 個月，ARR **超過 1,000 萬美元**，客戶 **2,500 家以上**。

## 這間公司做什麼

[peec.ai](https://peec.ai/) 2025 年 1 月在柏林成立，三個創辦人是 Marius Meiners（CEO）、Daniel Drabo、Tobias Siwonia，從 Antler 2024 冬季班出來。產品 2025 年 2 月上線。它看的是 ChatGPT、Perplexity、Gemini 等生成式答案，不是傳統關鍵字排名。這類工作常被叫做 GEO，generative engine optimization。

新聞稿點名的客戶包括 Attio、Squarespace、TUI、Hugo Boss。紐約有辦公室。

## 痛點

行銷團隊每周會問：我們在 ChatGPT 裡嗎？對手呢？手查十個問題、截圖、貼進簡報，做不到規模，也無法告訴客戶「這週變好了還是變差了」。代理商需要一份能拿去續約的報告。

## 方案

1. 品牌和代理商分開賣。代理商要的是多品牌、白牌報告。
2. 追提及、順位、情緒和引用，而不是只給一個分數。
3. 用訂閱收費。價錢會改，以 [peec.ai/pricing](https://peec.ai/pricing) 為準。2026 年中有人寫過，品牌入門大約一個月 95 美元，那是當時看到的價格。

他們自己的說明頁後來寫過「10 個月、400 萬美元年經常性收入、3,000 個團隊」。2026 年 5 月的新聞稿則是「16 個月、1,000 萬美元、2,500 個客戶」。兩個數字相差半年，要分開看。

## 成功故事與成功之道

- €700 萬種子輪，20VC 領投。公司說這是該基金史上最快的一筆種子。
- 2025 年 11 月：Series A **2,100 萬美元**，Singular 領投。累計融資 **2,900 萬美元**。
- 2026 年 5 月：ARR 跨過 1,000 萬美元。從 2 月上線算是 16 個月。

他們抓住的是搜尋習慣正在搬家的那幾個月。客戶裡有新創，也有已經養了品牌團隊的公司。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| ARR | 超過 1,000 萬美元 | GlobeNewswire，2026-05-28 |
| 客戶 | 2,500+ | 同上 |
| 累計融資 | 2,900 萬美元 | 公司；A 輪 2,100 萬 |
| 上線 | 2025 年 2 月 | 公司 |

## 普通人如何複製

新渠道出現時，先做測量，再做優化。代理商方案往往比只賣給品牌更容易擴。報告要能按週比較，不然只是另一個截圖工具。

## 創業者與矽谷視角

SEO 工具用了二十年才長成現在的樣子。看生成式答案裡有沒有提到你，這件事還很早。Peec 在 16 個月裡，把年經常性收入做到公司所說的 1,000 萬美元，融資 2,900 萬。他們賣的是你看不看得見，不是保證你會被排到前面。
`,
    bodyEn: `
## In short

Peec monitors brand mentions, position, sentiment, and citations inside answers from ChatGPT, Perplexity, Gemini, and similar products. Marius Meiners, Daniel Drabo, and Tobias Siwonia started it in Berlin in January 2025 after Antler’s winter 2024 cohort. The product launched in February 2025. A May 28, 2026 GlobeNewswire release said ARR had passed $10 million with 2,500+ customers, including Attio, Squarespace, TUI, and Hugo Boss. Total funding is $29 million, including a $21 million Series A led by Singular in November 2025.

## Pricing

Plans differ for brands and agencies. Do not freeze a dollar price in this writeup. Use peec.ai/pricing.

## What to copy

When a new channel appears, sell measurement before you sell optimization. Date every company-claimed ARR so later pages do not get mixed together.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444435",
    title: "Grasp",
    slug: "grasp",
    category: "saas",
    categories: ["saas", "workflow_agent"],
    website: "https://www.grasp-ai.com/",
    highlights: [
      { zh: "A 輪", en: "Series A", value: "$7M" },
      { zh: "累計", en: "Total raised", value: "$9M" },
      { zh: "ARR 增速", en: "ARR growth", value: "3.5×" },
      { zh: "客戶", en: "Customers", value: "近 200" },
    ],
    summaryZh:
      "麥肯錫出來的 Richard Karlsson 在斯德哥爾摩做 Grasp，幫顧問和投行把試算表和簡報做出來。2025 年 10 月 A 輪 700 萬美元，累計 900 萬。過去一年，年經常性收入變成原來的 3.5 倍。",
    summaryEn:
      "Former McKinsey consultant Richard Karlsson built Grasp in Stockholm. Its agents draft the spreadsheets and slide decks that bankers and consultants used to build by hand. The October 2025 Series A was $7 million, $9 million in total. ARR rose 3.5× over the prior year.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

投行和顧問很多晚上不是花在判斷，是花在把數字貼進 Excel，再貼進 PowerPoint。Grasp 用好幾個小助手把這段雜活做完，最後交出試算表和簡報。創辦人 Richard Karlsson 說，他在麥肯錫的時候，超過九成時間都在做這些手動的事。2025 年 10 月 28 日，公司宣布 A 輪 **700 萬美元**，前後一共 **900 萬美元**。

## 這間公司做什麼

網站是 [grasp-ai.com](https://www.grasp-ai.com/)。2020 年在斯德哥爾摩成立。Karlsson 當 CEO。一起做的還有 Johan Devér，以及前愛立信工程師 Simon Hällqvist。你交出去的是研究題目，拿回來的是客戶已經在用的 Excel 和簡報。

Tech.eu、FinSMEs、Finextra 都報了這輪：Octopus Ventures 領投，Yanno Capital 跟投。過去 12 個月，年經常性收入變成原來的 **3.5 倍**。客戶近 **200 家、30 個國家**，四大裡的大多數都在用。團隊大約 25 人，倫敦有辦公室。

## 痛點

一份可比公司表，初級分析師常常要做一整天。Karlsson 把這塊市場估成大約 1.4 兆美元。他說，金融裡還有很大一塊工作，到現在仍然靠人搬。客戶真正在意的很單純：交出去的得是他們已經在用的檔案。

## 方案

1. 幾個助手分工，最後交出試算表和簡報。
2. 先賣給已經雇了分析師的公司。
3. 團隊大約 25 人。這輪融資在 2025 年的 AI 公司裡不算大。他們拿出來的增長是：過去一年，年經常性收入變成原來的 3.5 倍。起點金額沒有公布。

## 成功故事與成功之道

Karlsson 講自己在麥肯錫的日子：一天裡超過九成時間，不是在想案子，是在搬數字。Grasp 就從這裡做起。客戶是四大和投行，這些地方本來就在給分析師發薪水，他們要少做的是那份表。過去一年，年經常性收入變成原來的 3.5 倍。公司沒有說起點是多少。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| 2025 年 10 月 A 輪 | 700 萬美元 | Tech.eu、FinSMEs、Finextra |
| 累計融資 | 900 萬美元 | 同上 |
| ARR | 過去 12 個月變成 3.5 倍 | 同上，起點金額未公布 |
| 客戶 | 近 200 家、30 國 | 同上 |
| 團隊 | 約 25 人 | 同上 |

## 普通人如何複製

挑一份你以前每周都在做的東西：一張表、一份備忘、一套簡報。讓工具直接交出那個檔案。先去找已經在為這份人工付錢的團隊。

## 創業者與矽谷視角

這輪只有 700 萬美元。同一年，很多模型公司一開口就是幾億。Grasp 走的是窄行業、小團隊，客戶口袋裡本來就有這筆預算。1.4 兆美元是 Karlsson 自己拿來形容市場的數字。
`,
    bodyEn: `
## In short

Grasp is a Stockholm company, founded in 2020, whose agents produce the spreadsheets and PowerPoint decks used in finance and consulting. CEO Richard Karlsson is ex-McKinsey. Cofounders include Johan Devér and Simon Hällqvist, formerly of Ericsson. On October 28, 2025, Tech.eu, FinSMEs, and Finextra reported a $7 million Series A led by Octopus Ventures, $9 million raised in total. ARR was 3.5× over the prior 12 months. Nearly 200 customers in 30 countries, including most of the Big Four. About 25 people, with a London office.

## What to copy

Ship the file the client already pays a junior to make. Quote the multiple, not a revenue number the company did not publish.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444436",
    title: "Puppy Sphere",
    slug: "puppy-sphere",
    category: "platform",
    categories: ["platform", "content"],
    website: "https://thepuppysphere.com/",
    highlights: [
      { zh: "累計營收", en: "Cumulative revenue", value: "$14M+" },
      { zh: "門店", en: "Studios", value: "13" },
      { zh: "顧客", en: "Customers", value: "45 萬+" },
      { zh: "外部資金", en: "Outside capital", value: "首輪在後" },
    ],
    summaryZh:
      "Puppy Sphere 做小狗瑜伽：在固定場地跟小狗一起上課。創辦人 Francesca Albo 說，大約四年半、13 間店、45 萬名顧客，累計營收超過 1,400 萬美元，而且這之前沒有拿外部資金。",
    summaryEn:
      "Puppy Sphere runs puppy yoga studios. Founder Francesca Albo says that in about four and a half years the company reached 13 studios, 450,000 customers, and more than $14 million in cumulative revenue before taking outside capital.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

小狗瑜伽不是 App。你預約一個時段，到店裡跟小狗一起做瑜伽，結束前可以拍照。Francesca Albo 和 Lea Burbidge Izquierdo 一起做。Albo 在 2026 年 8 月到 9 月的公開說明寫：累計營收超過 **1,400 萬美元**、**13 間店**、顧客 **45 萬以上**，大約四年半沒有外部資金，然後才拿第一筆外部錢。

## 這間公司做什麼

[thepuppysphere.com](https://thepuppysphere.com/) 賣的是到店體驗。收入來自一堂課，不是一個帳號的月費。店多半開在美國城市。Albo 公開講過的合作名字裡，有 Google、Amazon、Netflix、TikTok、NBA，還有一些藝人。

## 痛點

城市裡想摸狗、想發限動、想跟朋友約一件「好看的事」的人很多。收容所的開放日時間固定、體驗不穩定。一般瑜伽工作室又沒有這個記憶點。Puppy Sphere 把三件事排進同一個小時：運動、動物、照片。

## 方案

1. 自己開店，課程、動線和拍照點都自己控。
2. 一間店跑通再複製。13 間店、累計營收和顧客數，都是 Albo 在 2026 年公開講的。
3. 外面的錢放在已經有營收之後。她提到的天使包括 School of Hard Knocks、Tobi Oluwole、Jake Fleshner、Torch Collective，以及 Massage Envy 前 CEO David Humphrey。估值沒有公布。

## 成功故事與成功之道

Albo 公開講過的經營數字是：四年半、13 間店、45 萬名顧客、累計營收超過 1,400 萬美元。第一筆外面的錢，是這些數字做出來之後才進來的。

這種店要操心的事很具體：小狗好不好、場地夠不夠、每個城市的規定不一樣，以及新鮮感過了以後，客人還來不來。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| 累計營收 | 超過 1,400 萬美元 | 創辦人 Francesca Albo 公開說明，2026 年 8–9 月 |
| 門店 | 13 | 同上 |
| 顧客 | 45 萬以上 | 同上 |
| 外部資金 | 約 4.5 年後的第一筆 | 同上 |
| 估值 | 未公開 | 沒有獨立報導 |

## 普通人如何複製

找一件人願意為了照片和朋友出門的事，先做一間店，把動線和安全做完，再複製。課表還沒穩定，先別做 App。上面那些數字，是 Albo 自己講的。

## 創業者與矽谷視角

有些生意跟模型無關。Puppy Sphere 靠的是一間間店，和已經進來的營收。做軟體的人可以學它的順序：先有人重複付錢，再拿外面的錢。
`,
    bodyEn: `
## In short

Puppy Sphere sells in-studio puppy yoga. Francesca Albo’s public posts in August and September 2026 say the company passed $14 million in cumulative revenue, with 13 studios and more than 450,000 customers, after about four and a half bootstrapped years. Lea Burbidge Izquierdo is cofounder. Named partners and angels in those posts should be read as the founder’s account. A valuation cap does not appear in a source this page could verify, so it is omitted. An earlier margin claim is omitted for the same reason.

## What to copy

Make one location repeatable before you add software or outside money. Label founder-reported numbers as founder-reported.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444437",
    title: "Rillet",
    slug: "rillet",
    category: "saas",
    categories: ["saas", "workflow_agent"],
    website: "https://www.rillet.com/",
    highlights: [
      { zh: "2026 年 C 輪", en: "Series C", value: "$100M" },
      { zh: "估值", en: "Valuation", value: "$1B" },
      { zh: "累計融資", en: "Total funding", value: "$200M+" },
      { zh: "客戶", en: "Customers", value: "600+" },
    ],
    summaryZh:
      "Rillet 做 AI 原生的總帳和結帳，想換掉 NetSuite 這類老 ERP。2026 年 8 月 C 輪 1 億美元、估值 10 億，累計融資超過 2 億。公司說客戶超過 600 家。A 輪是 2,500 萬美元，Sequoia 領投。",
    summaryEn:
      "Rillet builds an AI-native general ledger and close, aimed at replacing suites like NetSuite. In August 2026 it raised a $100 million Series C at a $1 billion valuation. Total funding is above $200 million. The company says it has more than 600 customers. The Series A was $25 million, not $2.5 million.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

公司一大，帳就不能放在試算表裡。傳統做法是上 NetSuite、SAP 或 Oracle，導入要幾個月，每月結帳還是得人熬夜。Rillet 說它從第一天就用 AI 做總帳：交易進來就分類，異常才要人看，帳是持續在關，而不是每月趕一次。2024 年從隱身狀態出來。2026 年 8 月 19 日，TechCrunch 報導 C 輪 **1 億美元**、估值 **10 億美元**。

## 這間公司做什麼

[rillet.com](https://www.rillet.com/) 賣給已經在用企業級會計系統的公司，尤其是成長很快、帳務變複雜的團隊。BusinessWire 寫，客戶超過 **600 家**，裡面有上市公司，也有成長很快的 AI 公司，並且從科技業擴到生技、醫療、金融、物流和專業服務。他們點名要替換的系統包括 Oracle Fusion、SAP、Workday、Microsoft GP 和 NetSuite。

創辦人裡，公開報導反覆寫到的是前 N26 美國 CEO Nicolas Kopp。

## 痛點

結帳是每月固定的痛。收入確認、多實體、多幣別，新創一旦有了合約和子公司，試算表先崩。老 ERP 能記帳，但實施費和顧問費常常比軟體本身醒目。財務團隊要的不是再一個問答機器人，是分錄少一點、關帳快一點。

## 方案

1. 總帳本身是新的，不是在 NetSuite 旁邊掛一個聊天窗。
2. 例行分錄盡量自動，人處理異常。
3. 把「每月關帳」說成持續進行。這是產品定位。

他們對外講的是：帳一直在關，人只看異常。自動做到幾成、能不能當天關完，這幾篇報導都還沒寫。

## 成功故事與成功之道

- 2024 年結束隱身。
- Series A：**2,500 萬美元**，Sequoia 領投。
- Series B：**7,000 萬美元**，ICONIQ 與 a16z 領投。
- 2026 年 8 月 Series C：**1 億美元**，估值 **10 億美元**，ICONIQ 領投，Sequoia 和 a16z 跟上。大約 14 個月裡的第三輪。累計融資超過 **2 億美元**。

三輪都很快。投資人買的是「用 AI 重做 ERP」這件事。600 家客戶，是公司在融資稿裡自己說的。營收還沒有公布。

## 成績

| 指標 | 公開數字 | 來源 |
| --- | --- | --- |
| Series C | 1 億美元、估值 10 億 | TechCrunch，2026-08-19 |
| 累計融資 | 超過 2 億美元 | 同上 |
| Series A／B | 2,500 萬、7,000 萬美元 | 公司／TechCrunch |
| 客戶 | 600+ | BusinessWire 引公司 |
| 自動分錄比例 | 未公開 | TechCrunch、BusinessWire 未給數字 |

## 普通人如何複製

挑一個每月都要重做、而且已經有軟體預算的財務動作。先讓人少做一類分錄，再談換掉整套 ERP。換核心系統的銷售很長，沒有實施伙伴和審計口徑，演示贏不了財務長。

## 創業者與矽谷視角

ERP 是出了名的難換。Rillet 在 14 個月裡拿了三輪、估值到 10 億，說明這個位子在 2026 年很擠、也很貴。對小團隊，更可學的是「從異常入手」，而不是「第一天就替換 SAP」。
`,
    bodyEn: `
## In short

Rillet is an AI-native general ledger and close, sold as a replacement for Oracle Fusion, SAP, Workday, Microsoft GP, and NetSuite. It came out of stealth in 2024. TechCrunch reported on August 19, 2026 that ICONIQ led a $100 million Series C at a $1 billion valuation, with Sequoia and a16z participating. It was the third round in about 14 months. Total funding is above $200 million. The Series A was $25 million led by Sequoia, and the Series B was $70 million. The company says it has 600+ customers, including public companies, and that it has expanded beyond tech into biotech, healthcare, fintech, logistics, and professional services. Nicolas Kopp, former U.S. CEO of N26, is the founder named in that coverage.

## What not to claim

Do not print a 99.7% automation rate or a zero-day close unless you are quoting a measurement these announcements did not include. Do not back into ARR from the valuation.

## What to copy

Start with the journal entries humans still touch. Replacing the whole ledger is a different, much longer sale.
`,
  },
];
