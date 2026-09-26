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
      "網頁會改掉，也會消失。Wayback Machine 讓你輸入網址，就能看到這個網站以前長什麼樣子。它是一座非營利的網路圖書館，2025 年 10 月已經存下超過一兆個網頁。",
    summaryEn:
      "Pages change and disappear. The Internet Archive has been saving public web pages since 1996. In October 2025 the Wayback Machine said it had passed one trillion archived pages.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

你今天看過的網頁，明天可能改掉，也可能整個不見。Wayback Machine 是一座公開的時光機。你把網址貼進去，它會列出這個網站在不同日期的樣子。2025 年 10 月，存檔超過一兆個網頁。它不靠廣告，也不拿創投的錢，靠的是捐款。

## 這個產品在做什麼

你打開 [Wayback Machine](https://web.archive.org/)，貼上一個網址，就能翻到舊版首頁、已經下架的文章、改過的價格或條款。它屬於舊金山的非營利組織 [Internet Archive](https://archive.org/)。Brewster Kahle 和 Bruce Gilliat 從 1996 年開始抓公開網頁，2001 年 10 月才把查詢畫面開放給所有人。除了網頁，這座圖書館也收書、影片、聲音和政府文件。

## 人們為什麼需要它

搜尋引擎給你的是現在這一版。記者要核對某人改過的說法，律師要找已經下架的頁面，做產品的人要看對手以前怎麼寫定價。網頁一改版、公司一倒閉、作者一手刪掉，連結就斷了。這種斷掉的連結，通常叫 link rot。

## 它實際怎麼運作

1. 爬蟲一直在抓公開網頁，把 HTML、樣式和圖片存成不同時間點的版本。
2. 你也可以自己存。Save Page Now 讓你貼上網址，當場做一份公開備份，不必等爬蟲自己來。
3. 別人文章裡的連結如果已經失效，可以改指到存過的那一版，讀者就不會只看到 404。維基百科也這樣用。
4. 如果你會寫程式，CDX API 可以讓你用程式查存檔，不必一頁一頁用手點。

## 做到哪裡了

| 你會看到的結果 | 數字 |
| --- | --- |
| 存下來的網頁 | 超過 1 兆個（2025 年 10 月） |
| 資料量 | 遠超過 99 PB |
| 對外開放 | 2001 年 10 月 |
| 怎麼活下來 | 非營利，靠捐款和補助，沒有創投 |

它能撐幾十年，是因為不賣使用者的資料。歷史網頁後來也變成訓練 AI 的原料，所以這座圖書館現在不只服務記者和研究者。捐款的人多，它才有辦法繼續抓下去。

## 小團隊可以怎麼複製

你不用重做一座國家圖書館。你可以只盯一種會改的頁面。

1. 先選一個窄範圍，例如對手的定價頁、招聘頁，或你自己產品的文案。有人改了就通知你。
2. 讓使用者按一下就能存下這一頁。這比你自己去爬全世界便宜很多。
3. 把已經失效的連結當成入口。別人點進去是 404，你給他舊版，他就知道為什麼要留下你。

## 投資人會怎麼看

創投通常要的是能退出的公司。Kahle 走的是另一條路：幾十年的存檔本身就是護城河。記者、法庭和做模型的公司都還是得回來查。如果你做的是這種基礎設施，投資人會問你能不能靠訂閱活下去。如果你只是小團隊，更該學的是只存一種頁面，而不是去募一座圖書館的錢。
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
      { zh: "怎麼交代", en: "How you ask", value: "一句話" },
      { zh: "哪裡能用", en: "Apps", value: "Mac、iPhone" },
    ],
    summaryZh:
      "Today 把你已經在用的日曆、信箱和筆記接在一起。你用一句話交代今天要做的事，它幫你找時間、盯後續。Mac 和 iPhone 都能用，方案分成免費、Pro 和 Ultra。",
    summaryEn:
      "Today connects calendar, mail, and notes so you can hand it the day in plain language. The site describes the product. It does not publish revenue or a funding round, so this page sticks to what is on the record.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

Today 想當你的日程助理。日曆、信箱、筆記、檔案和訊息接上去之後，你用一句話交代今天要做什麼，它幫你找空檔、改行程、盯還沒回的事。電腦和手機都能下載。收費分成免費、Pro 和 Ultra。

## 這個產品在做什麼

[today.ai](https://today.ai/) 不叫你再養一個新的待辦清單。它連的是你已經在用的日曆、郵件、筆記、檔案、訊息和專案工具。Mac 要 macOS 15 以後，Apple 晶片和 Intel 都可以。iPhone 也能下載。你看得到的功能，會依方案、地區和版本不同。

## 人們為什麼需要它

日曆和待辦都要自己顧。臨時插進一場會議，下午原本的安排就散了。很多人不是不會排時間，而是不想每天重新排一次。他們要的是說一句話，這一天就重排好。

## 它實際怎麼運作

1. 先接上你已經在用的日曆、信箱和筆記，事情還留在原來的地方。
2. 你用說話交代，不必每個任務都自己拉時間塊。
3. 方案分成 Free、Pro、Ultra。Pro 和 Ultra 按月收費，價錢在結帳前才顯示，會因地區和通路改變。符合資格的帳號可以先試 Pro 七天。Ultra 目前不能免費試。

## 做到哪裡了

| 你會看到的結果 | 現況 |
| --- | --- |
| 方案 | 免費、Pro、Ultra，後兩者按月收費 |
| Pro 試用 | 符合資格可以試 7 天 |
| 哪裡能用 | Mac、iPhone |
| 你要做的事 | 用一句話交代，它幫你改這一天 |

產品已經上線。改一天的行程，目標是說一句話，不用再點二十個選單。

## 小團隊可以怎麼複製

不要一開始就做「人生全部的助理」。

1. 先找一件人想做、但不想天天維護的小事，例如健身、讀書或出差。
2. 讓他只要點確認或拒絕，不必自己重排二十個選項。
3. 行程被打亂的時候，給他一條可以重新開始的路，例如把剩下的事移到明天早上。
4. 先在一個你自己每天會用的場景做通，再談接全部信箱。

## 投資人會怎麼看

個人生產力正在從「再給你一個清單」走到「幫你把今天排完」。Motion、Reclaim 已經站在這個位子上。投資人會看三件事：有沒有人每天打開、免費用戶有沒有轉成月費、接上日曆之後會不會因為做錯一場會議而流失。你如果是小團隊，先證明一件小事有人願意每週付錢，比先做一個什麼都能排的助理更有說服力。
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
      "很多 App 要連銀行帳戶時，跳出的那一頁就是 Plaid。它把上萬家銀行收成同一套接法。2026 年 2 月，員工售股的估值是 80 億美元。2026 年 5 月，美國的 ChatGPT 用戶也可以用它讀自己的帳戶。",
    summaryEn:
      "When an app connects a bank account, the screen is often Plaid. The company peaked at a $13.4 billion valuation in 2021. An employee share sale in February 2026 priced it at $8 billion. In May 2026 ChatGPT began using Plaid so U.S. users could connect their own accounts.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

Plaid 不做給一般人用的記帳 App。別的 App 要讀銀行餘額、驗證帳戶，就接它。你在 Venmo 或券商裡點「連接帳戶」，跳出的那一頁常常就是它。Zach Perret 和 William Hockey 2012 年在舊金山創立。2026 年 2 月，員工可以按 80 億美元的估值賣掉一部分股票。2021 年的高點是 134 億美元。

## 這個產品在做什麼

[plaid.com](https://plaid.com/) 給開發者一支 API，就能連上很多銀行。使用者選銀行、登入網銀，帳戶就接上了。這個畫面叫 Plaid Link。它連的金融機構超過 12,000 家，從支票、儲蓄到投資和加密貨幣都有。2026 年 5 月起，美國的 ChatGPT Pro 用戶也可以把自己的帳戶接上去。回答會根據餘額和交易，而不只是泛泛的理財建議。

## 人們為什麼需要它

美國有上萬家銀行和信用合作社，每家的資料格式都不一樣。2012 年以前，每做一個金融 App 就要自己接一遍，不然就叫用戶手填。很多人在這一步離開。小團隊也沒有能力自己保管別人的網銀密碼。

## 它實際怎麼運作

1. 開發者只要接一支 API，不必為每家銀行各寫一支爬蟲。
2. Link 把登入收成同一個畫面。使用者選好銀行再登入，不必搞懂背後是哪一家的介面。
3. 後來不只讀交易明細，也做轉帳和身份驗證。
4. 程式要替人看帳戶、做決定的時候，也是走這條已經被允許的管子。

## 做到哪裡了

創辦人一開始想做消費者記帳。連銀行這一步太痛，他們乾脆把這一步做成產品。

- 2020 年，Visa 宣布打算用大約 53 億美元買下它。美國司法部提了反壟斷訴訟，Visa 在 2021 年放棄。
- 2021 年的 D 輪，估值到 134 億美元。
- 2025 年 4 月，Franklin Templeton 領投約 5.75 億美元，估值 61 億美元。這筆錢有一部分是讓員工賣股、付限制性股票的稅。
- 2026 年 2 月 26 日，員工售股的估值是 80 億美元。這比一年前高大約 31%，仍比 2021 年的高點低大約四成。2025 年的新客戶裡，有 20% 是 AI 公司。

| 你會看到的結果 | 數字 |
| --- | --- |
| 2026 年 2 月員工售股 | 估值 80 億美元 |
| 2025 年 4 月 | 融資 5.75 億美元，估值 61 億美元 |
| 2021 年高點 | 估值 134 億美元 |
| 接上的金融機構 | 超過 12,000 家 |
| 接到 ChatGPT | 2026 年 5 月，美國 Pro 用戶可連接自己的帳戶 |

App 因為它連得多而接它。銀行因為熱門 App 都在用，也願意跟它談介面。後來者要過的是合規，不是再做一個登入畫面。

## 小團隊可以怎麼複製

如果你的產品卡在「每家系統都不一樣」，那個卡點可能比原本的產品更大。

1. 找出大家都要接、卻每家格式都不同的那一步。
2. 把它收成一支 API，先把文件和測試環境做好。開發者能先試通，比你買廣告有用。
3. 醫療病歷、物流、房東系統，也是每家格式都不一樣，同樣可以收成一支接法。
4. 銀行這種要過合規的行業，沒有準備花好幾年，就先不要碰。

## 投資人會怎麼看

Visa 想買它，是怕它變成支付旁邊的另一條路。沒買成，它還在。2026 年的新用途是：AI 要替人看真實帳戶，就得有人握著讀帳戶的許可。Plaid 賣的就是這個許可。投資人會看接上的機構數、開發者會不會離開，以及合規出事時誰負責。估值從 134 億掉到 61 億、再回到 80 億，也說明這種基礎設施會隨著市場冷熱重估。
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
      "Casper 的聯合創辦人 Neil Parikh，和做心理健康 AI 的 Daniel Cahn，做了一個專門談心理的 App，叫 Ash。累計融資 9,300 萬美元。打開就能看到它寫明：這不能取代臨床治療。",
    summaryEn:
      "Casper cofounder Neil Parikh and ML engineer Daniel Cahn built Ash, an app meant for therapy-style conversations. The company says it has raised $93 million. Ash’s own listing says it is not a substitute for clinical care.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

一般聊天機器人很會給建議。諮商不太一樣，好的諮商師常常先問，不急著給答案。Slingshot 為這件事做了一個 App，叫 Ash。iPhone 和 Android 都能下載，公開時免費。到 2025 年 7 月，累計融資 9,300 萬美元。它也寫明，這不能取代臨床治療。

## 這個產品在做什麼

[Slingshot](https://www.slingshot.xyz/) 由 Daniel Cahn 擔任共同創辦人兼 CEO，Neil Parikh 擔任共同創辦人兼總裁。Parikh 從醫學院休學，共同創立床墊品牌 Casper，把營收做到 5 億美元以上，並在 2020 年上市。Cahn 是機器學習工程師，做過心理健康的 AI 研究。臨床負責人 Derrick Hull 之前在 Noom 和 Talkspace。

Ash 用文字和語音跟你談。它按 CBT、DBT、ACT 這些諮商方法來對話，也會記得你較早提過的人或壓力。商店頁寫得很直：它不是臨床治療的替代品。已經有焦慮、憂鬱或其他診斷的人，應該跟治療一起用，不能拿它當危機專線。

## 人們為什麼需要它

想找人談的人很多，諮商師不夠，一小時往往很貴。把一般聊天機器人直接拿來當治療師，又有另一個問題：它習慣給答案、給清單。諮商要的常常是把問題問回去。沒有專門約束的模型，也可能說出傷人的話。

## 它實際怎麼運作

1. 他們練的是給心理學用的模型，不是在通用模型上貼一層提示詞。封測做了 18 個月。
2. 先給 5 萬人用，再公開到 iPhone 和 Android。
3. 安全邊界寫在商店的第一眼：不能取代治療，也不能當危機專線。
4. 對話會記住較早出現的人和壓力，所以不是每次都從零開始。

## 做到哪裡了

- 2025 年 1 月 14 日，a16z 領投 A 輪，當時累計融資 4,000 萬美元。
- 2025 年 7 月 22 日，Radical Ventures 與 Forerunner 共同領投延伸輪。加上原本的 a16z、Felicis、Menlo，累計 9,300 萬美元。同一天，Ash 對公眾開放。

| 你會看到的結果 | 數字 |
| --- | --- |
| 累計融資 | 9,300 萬美元（2025 年 7 月） |
| 2025 年 1 月時 | 累計 4,000 萬美元 |
| 封測 | 18 個月、5 萬人 |
| 怎麼用 | 免費的 iPhone 和 Android App |

## 小團隊可以怎麼複製

高敏感的場景，不要直接套用聊天機器人的口吻。

1. 教育、法律、陪伴這些事，有時候先問一句，比一次給出三個步驟更有用。
2. 安全邊界寫在第一個畫面，不要藏到條款的第十條。
3. 在找到臨床伙伴之前，不要自稱這是治療。
4. 先把「什麼情況必須把人轉給真人」寫成規則，再讓模型開口。

## 投資人會怎麼看

a16z 看上的是互動方式。通用模型急著給確定答案，心理學要的是另一套對話。這組人一個做過大消費品牌，一個做過心理健康模型，再加上臨床負責人。投資人買的是「這個位子需要專門的模型和信任」，同時也要看它會不會被當成醫療產品來管。你如果是小團隊，不要用融資額當目標。先證明有人願意每週回來談，並且知道什麼時候該停下來、把人交給專業的人。
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
      { zh: "年化收入", en: "Run-rate", value: "₹2,500 cr+" },
      { zh: "2026 年估值", en: "2026 valuation", value: "$1B" },
      { zh: "已知機構融資", en: "Known institutional", value: "$34M" },
    ],
    summaryZh:
      "Astrotalk 把印度的占星做成按分鐘付費的 App。你可以選一位審過的師傅，用文字、語音或視訊提問，也可以匿名。2025 會計年度營收 1,176 crore 盧比，而且有獲利。2026 年 8 月，公司用獲利做員工回購，估值 10 億美元。",
    summaryEn:
      "Astrotalk turned Indian astrology into a pay-per-minute marketplace. FY25 revenue was ₹1,176 crore. The company says the run-rate has since passed ₹2,500 crore. An August 2026 ESOP buyback valued it at $1 billion. That is not ₹250 billion.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

在印度，升學、求職、結婚、買房之前，很多人會看星盤。街上的師傅品質差很多，價格也不透明。Puneet Gupta 和 Anmol Jain 2017 年在 Noida 做了 [Astrotalk](https://astrotalk.com/)。你打開 App，選一位審過的占星師或塔羅師，按分鐘用文字、語音或視訊提問。問完還能買開運商品。

印度常用的單位是 crore，1 crore 等於 1,000 萬盧比。2025 會計年度的營收是 1,176 crore 盧比。後來的年化超過 2,500 crore，大約是 3 億美元這個等級。

## 這個產品在做什麼

使用者按分鐘付費，平台從裡面抽成。一開始賣的是占星諮詢，後來加上寶石和開運商品。電商推出後的一年裡，2025 年做出超過 140 crore 盧比。

## 人們為什麼需要它

在印度，看星盤是很平常的事，但要找到一位師傅卻很麻煩。年輕人想問問題，卻不想跑去廟裡，也不想跟陌生人面對面坐著。這個產品讓人按分鐘付費，也可以選擇匿名提問。先付一分鐘試試看，就不會那麼尷尬。

## 它實際怎麼運作

1. 使用者自己挑占星師，看評價，再決定要問誰。
2. 費用按分鐘跳，不用一次付一大筆錢。平台從諮詢費裡抽成。
3. 問完還能在同一個地方買寶石和開運周邊，所以同一個人可以再買一次。
4. 師傅要先通過審核，使用者才願意把私人問題交出去。

## 做到哪裡了

- 2017 年創立。
- 2024 年 2 月，紐約的 Left Lane Capital 投了 2,000 萬美元。同年 6 月再投 1,400 萬美元，投前估值大約 2,400 crore 盧比。Elev8 也是投資人。
- 2025 會計年度，算到 2025 年 3 月：營業收入 1,176 crore 盧比，前一年是 651 crore，增加大約 81%。稅前利潤 285 crore 盧比。
- 2026 年 8 月，員工持股回購，估值 10 億美元，大約 9,500 crore 盧比。這筆錢來自公司獲利，不是新一輪外部融資。超過 100 名員工賣掉一部分持股。當時的收入年化超過 2,500 crore 盧比。

已知的機構資金大約 3,400 萬美元。估值到 10 億美元，靠的是獲利，不是再向投資人要一輪。

| 你會看到的結果 | 數字 |
| --- | --- |
| 2025 會計年度營收 | 1,176 crore 盧比 |
| 稅前利潤 | 285 crore 盧比 |
| 後來的年化收入 | 超過 2,500 crore 盧比 |
| 2026 年 8 月估值 | 10 億美元（員工回購） |
| 機構資金 | Left Lane 先後 2,000 萬和 1,400 萬美元 |

## 小團隊可以怎麼複製

1. 先找一種線下很分散、人們又願意為焦慮付錢的服務。占星只是印度的例子。別的地方可能是升學顧問、看房，或本地的手藝人。
2. 用評價、按分鐘計費和匿名，讓第一次開口沒那麼難。
3. 諮詢做順之後，再賣會用完、會再買的商品。
4. 先把一筆諮詢做成有賺頭，再談估值。

## 投資人會怎麼看

這不是一家模型公司。它把印度人本來就在做的事，收成一個平台。大約 3,400 萬美元的機構資金，做出超過一千 crore 的年營收，而且有獲利。10 億美元是員工回購時的估值，不是新一輪投資人開出的價格。投資人會看抽成能不能保住、師傅會不會被別的平台挖走，以及開運商品是不是真的讓同一個人再買一次。
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
      { zh: "收費", en: "Pricing", value: "按用量" },
      { zh: "領投", en: "Lead", value: "GC、AMP" },
    ],
    summaryZh:
      "xAI 共同創辦人 Igor Babuschkin 做了 River。公司幫你把開源模型調成自己的版本，調好的權重留在你手上，費用按用量算。2026 年 8 月，種子輪加 A 輪一共 11 億美元。公司當時成立大約兩個月。",
    summaryEn:
      "xAI cofounder Igor Babuschkin started a company that fine-tunes open-weight models. In August 2026 River announced $1.1 billion across a seed and Series A. The company was about two months old. It declined to disclose a valuation.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

很多公司想用自己的資料把模型調順，但不想從零訓練，也不想把調好的模型留在別人那裡。River 賣的就是這件事。你從開源模型出發，用 LoRA 和強化學習做微調，按用量計費，調完的權重歸你。2026 年 8 月 11 日，種子輪加 A 輪一共 11 億美元。

## 這個產品在做什麼

[river.ai](https://river.ai/) 的創辦人兼 CEO 是 Igor Babuschkin。他是 xAI 的共同創辦人，之前在 DeepMind 和 OpenAI 待過。公司在加州帕羅奧圖。宣布這輪的時候，公司成立大約兩個月，6 月才從隱身狀態走出來。

你透過 API 做微調和強化學習。模型調好之後就可以上線，權重留在自己手上。領投的是 General Catalyst 和 AMP PBC。NVIDIA 和 AMD Ventures 一起進場。Y Combinator 和淡馬錫也在名單裡。

## 人們為什麼需要它

通用模型懂很多，但不懂你的客服用語、合約格式或內部知識。自己買一整櫃顯示卡，對大多數團隊太貴。把資料送去別人的 API 微調，又有人擔心權重和資料不在自己手上。

## 它實際怎麼運作

1. 從已經夠好用的開源模型出發，不必從零訓練一個新模型。
2. 用 LoRA 這種比較省算力的方式，加上強化學習，把模型調成你的版本。LoRA 的意思是只改模型裡的一小部分，不必把整個模型重練一遍。
3. 費用按用量計算，客戶不必先買機器。
4. 調完的權重歸客戶。模型調好之後，就可以直接上線。

## 做到哪裡了

| 你會看到的結果 | 數字 |
| --- | --- |
| 融資 | 種子輪加 A 輪共 11 億美元 |
| 領投 | General Catalyst、AMP PBC |
| 一起進場的 | NVIDIA、AMD Ventures、Y Combinator、淡馬錫 |
| 公司當時的年紀 | 大約兩個月 |

Babuschkin 的判斷是：開源模型已經夠好用，接下來是讓每家公司調出自己的版本。這輪買的是這個人，以及他拿得到的算力。

## 小團隊可以怎麼複製

11 億美元跟你的第一個客戶沒有關係。

1. 先問清楚客戶要的是哪一件。如果他們只要模型看得懂自己的文件，用現成的 API 就能試。
2. 用一份真實文件做示範，讓對方看到回答變準了。
3. 等真的有人下單，再決定要不要自己做訓練、自己留權重。
4. 不要先租一整櫃機器，再去找第一個客戶。

## 投資人會怎麼看

這輪錢很大，產品還很早。市場在賭的是：開源模型會贏，而且每家公司都會想要自己的版本。投資人願意在公司幾乎剛成立時給出 11 億美元，是因為創辦人做過 xAI。你如果沒有這張名片，投資人會先要一個願意付錢的客戶，而不是一輪種子。
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
      { zh: "年經常性收入", en: "ARR", value: "$21M" },
      { zh: "用戶", en: "Users", value: "800 萬+" },
      { zh: "GitHub stars", en: "GitHub stars", value: "31,000+" },
    ],
    summaryZh:
      "Fish Audio 讓你上傳一小段聲音，模型就能用那個聲音說話，還可以用一句話改情緒和口音。創辦人以前在 Nvidia，用一張 RTX 4090 做出開源模型。一年後，年經常性收入 2,100 萬美元，用戶超過 800 萬。2026 年 7 月，種子輪 5,200 萬美元。",
    summaryEn:
      "A former NVIDIA researcher trained an open-source voice model on a single RTX 4090. A year later the company said it had $21 million ARR and more than 8 million users, and raised a $52 million seed in July 2026.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

[Fish Audio](https://fish.audio/) 做即時語音。你上傳一小段聲音，模型就能用那個聲音說話，也可以用一句話改情緒和口音。法律上的公司名是 Hanabi AI。2026 年 7 月 28 日，種子輪 5,200 萬美元。成立一週年時，年經常性收入 2,100 萬美元，用戶超過 800 萬。

## 這個產品在做什麼

共同創辦人 Shijia Liao 之前在 Nvidia 做影像研究。他先用一張 RTX 4090 訓練開源的 Fish Speech，GitHub 上的星星超過 31,000。CEO 是共同創辦人 Rissa Cao。產品在網頁和 API 上賣：文字轉語音、聲音克隆、用句子控制語氣。它支援 83 種以上的語言，也有超過 15,000 種用一句話就能控制的語氣。客戶裡有 HeyGen 和 LiveKit，也用在遊戲和語音助理。

## 人們為什麼需要它

配音和真人錄音很貴，改一句就要重錄。通用語音聽得懂字，但不一定聽得懂「這句要輕一點、帶一點笑」。創作者和客服機器人需要的是可控的聲音，而且延遲要低到可以對話。

## 它實際怎麼運作

1. 先把開源模型放出來，讓人下載、修改、討論。GitHub 上的星星，就變成一種信任。
2. 不想自己管顯示卡的人，改走雲端 API，按使用付費。
3. 語氣用一句人話控制，不用去拖一排滑桿。他們自己做的聆聽測試裡，66% 的聽眾更喜歡較新的 S2.1 Pro。

## 做到哪裡了

- 模型先開源，公司後成立。公司成立在 2025 年 7 月前後。
- 團隊從 3 人長到 22 人。
- 2026 年 7 月 28 日，Coreline Ventures 與 Capital Today 領投種子輪。跟投的有 359 Capital、Parable、Play Time、Alphalist、Bayhouse、Carya、HF0、645。

| 你會看到的結果 | 數字 |
| --- | --- |
| 種子輪 | 5,200 萬美元 |
| 成立一週年的年經常性收入 | 2,100 萬美元 |
| 用戶 | 超過 800 萬 |
| 開源模型的星星 | 超過 31,000 |
| 聽眾偏好 | 66% 更喜歡 S2.1 Pro |

先把模型開放出去，開發者用得順，願意付費的人再走 API。

## 小團隊可以怎麼複製

1. 如果你有一個別人用得上的模型或工具，先放到別人能改的地方。
2. 自己管機器的人用開源版，不想管機器的人走 API。
3. 控制方式用一句人話，不要先做一排專業滑桿。
4. 拿得出聽眾比較時，直接把兩種聲音放給人聽。讓人知道這是你自己測的，數字才站得住。

## 投資人會怎麼看

語音正在從「把稿子念出來」變成「一個能對話的角色」。Fish 的順序很清楚：一張消費級顯示卡、先開源、做了一年、年經常性收入到 2,100 萬美元，然後才是 5,200 萬美元的種子輪。投資人買的是已經有人用、而且有人付錢的語音基礎設施，不是一份只會念稿的示範。
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
      "Tripo 讓你打一句話，或丟一張照片，就先得到一版能改的 3D 模型。做遊戲和電商的人，不必每次都從白紙請美術畫很多天。創辦人宋亞宸 1997 年出生。2026 年 3 月拿到 5,000 萬美元，9 月又拿到大約 30 億人民幣。",
    summaryEn:
      "Tripo turns text or photos into 3D models. Founder Simon Song was born in 1997. A March 2026 round of $50 million included Alibaba and Baidu Ventures. Reports put the September 2026 Series B/B+ at about RMB 3 billion.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

做遊戲、做電商的人，一個 3D 模型常常要美術畫很多天。Tripo 讓你打一句話，或丟一張圖，先得到一版能改的模型。公司叫 VAST。CEO 宋亞宸 1997 年出生，約翰霍普金斯畢業，之前在 MiniMax 和商湯。

## 這個產品在做什麼

[tripo3d.ai](https://www.tripo3d.ai/) 把生成結果做成遊戲和設計軟體能接的格式。合作方包括網易、騰訊、字節跳動和微軟。首席科學家曹炎培之前在騰訊做生成式 3D。CTO 丁亮是清華博士，之前在商湯。

## 人們為什麼需要它

遊戲裡的模型不能只是一張好看的圖。角色要能動，網格就得乾淨，骨架才綁得上去。生得再快，美術改不了，還是得重畫。Tripo 後來主打四邊面，就是在處理這件事。四邊面的意思是：模型的表面用四邊形拼起來，遊戲軟體比較好改，也好綁動作。

## 它實際怎麼運作

1. 你先打一句話，或上傳一張圖，幾秒鐘就會出一版模型。美術從修改這一版開始，不用從白紙畫起。
2. 做出來的模型要能進遊戲軟體裡改。Tripo P2.0 的預覽版，幾秒就能生出四邊面。
3. 產品賣給本來就在做遊戲和電商的公司，因為他們每個月都在付美術費。

## 做到哪裡了

- 2023 年創立。
- 2026 年 3 月，5,000 萬美元，投資人包括阿里巴巴和百度風投。
- 6 月有一輪接近 2 億美元的延伸 A 輪，估值超過 10 億美元。7 月的 A3 超過 10 億人民幣，大約 1.49 億美元，吉利資本在裡面。
- 2026 年 9 月 1 日，B 輪和 B+ 輪大約 30 億人民幣，大約 4.46 億美元，經緯領投。跟投的有完美世界、藍色光標、中科創達、三七互娛，以及 CDH、中金、CMC、洪泰、春華、INCE。
- 不到半年，籌了大約 50 億人民幣。用戶是數千萬。

| 你會看到的結果 | 數字 |
| --- | --- |
| 2026 年 3 月 | 5,000 萬美元 |
| 2026 年 9 月 | 大約 30 億人民幣 |
| 半年籌資 | 大約 50 億人民幣 |
| 用戶 | 數千萬 |

## 小團隊可以怎麼複製

1. 先服務已經在付美術費的人，例如獨立遊戲、電商主圖、建築方案。
2. 輸出要能進他們的軟體，不只是一張好看的預覽。
3. 速度快只是入場券。對方留下你，是因為美術真的改得動。
4. 先做一種模型做得很順，例如產品圖或一個角色，不要第一天就說什麼都能生成。

## 投資人會怎麼看

2026 年，中國做生成式 3D 的公司融了很多錢。錢是遊戲、行銷、汽車這些行業出的。他們要的是一條能做模型的產線，不是一個示範影片。投資人會看生成出來的東西能不能進現有工具、大客戶會不會續約，以及你是不是只是套了一層別人的模型。
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
      { zh: "年經常性收入", en: "ARR", value: "$10M" },
      { zh: "客戶", en: "Customers", value: "2,500+" },
      { zh: "累計融資", en: "Funding", value: "$29M" },
      { zh: "上線", en: "Launched", value: "2025.02" },
    ],
    summaryZh:
      "以前做 SEO，是看 Google 第幾名。現在有人改問 ChatGPT。Peec 做的是這件事的儀表板：你的品牌有沒有被提到、排第幾、語氣正不正。2025 年 2 月上線，16 個月後年經常性收入超過 1,000 萬美元，客戶超過 2,500 家。",
    summaryEn:
      "Peec tracks whether a brand shows up in answers from ChatGPT, Perplexity, and similar products. It launched in February 2025. Sixteen months later the company said ARR had passed $10 million, with more than 2,500 customers.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

以前做 SEO，是看 Google 搜尋結果第幾名。現在有人改問 ChatGPT。Peec 賣的是後面這件事的儀表板：你的品牌在答案裡有沒有被提到、排第幾、語氣正不正、引用了哪個網頁。2025 年 2 月上線，16 個月後，年經常性收入超過 1,000 萬美元，客戶超過 2,500 家。

## 這個產品在做什麼

[peec.ai](https://peec.ai/) 2025 年 1 月在柏林成立。三個創辦人是 Marius Meiners、Daniel Drabo、Tobias Siwonia，從 Antler 2024 冬季班出來。Meiners 是 CEO。產品 2025 年 2 月上線。它看的是 ChatGPT、Perplexity、Gemini 這類生成式答案，不是傳統的關鍵字排名。這類工作常被叫做 GEO，也就是 generative engine optimization，意思是讓生成式答案裡看得到你。

客戶包括 Attio、Squarespace、TUI、Hugo Boss。紐約有辦公室。

## 人們為什麼需要它

行銷團隊每個星期都會問：我們在 ChatGPT 裡嗎？對手呢？用手查十個問題、截圖、貼進簡報，做不到規模，也無法告訴客戶這週是變好還是變差。代理商需要一份能拿去續約的報告。

## 它實際怎麼運作

1. 品牌和代理商分開賣。代理商要的是一次看很多品牌，還要能把報告換成自己的牌子。
2. 它追的是有沒有被提到、排第幾、語氣正不正、引用了哪個網頁，而不是只給一個分數。
3. 用月費訂閱。品牌和代理商的價錢不一樣，最新價格以 [peec.ai/pricing](https://peec.ai/pricing) 為準。

## 做到哪裡了

- 種子輪 700 萬歐元，20VC 領投。這是該基金當時最快的一筆種子。
- 2025 年 11 月，A 輪 2,100 萬美元，Singular 領投。累計融資 2,900 萬美元。
- 2026 年 5 月，年經常性收入跨過 1,000 萬美元。從 2 月上線算起是 16 個月。

| 你會看到的結果 | 數字 |
| --- | --- |
| 年經常性收入 | 超過 1,000 萬美元 |
| 客戶 | 超過 2,500 家 |
| 累計融資 | 2,900 萬美元 |
| 上線 | 2025 年 2 月 |

他們抓住的是搜尋習慣正在搬家的那幾個月。客戶裡有新創，也有已經養了品牌團隊的公司。

## 小團隊可以怎麼複製

1. 新的管道出現時，先把成效量出來，再去做優化。人們會先為「看得到」付錢。
2. 賣給代理商，往往比只賣給一個品牌更容易擴出去，因為一家代理商背後有很多客戶。
3. 報告要能按週比較。不能比較，它就只是另一個截圖工具。
4. 先盯一個問題，例如「我們的品牌這週有沒有出現在十個常見問題裡」，做通再加情緒和引用。

## 投資人會怎麼看

SEO 工具用了二十年才長成現在的樣子。看生成式答案裡有沒有提到你，這件事還很早。Peec 在 16 個月裡把年經常性收入做到 1,000 萬美元，融資 2,900 萬美元。他們賣的是你看不看得見，不是保證你會被排到前面。投資人會擔心模型廠商自己做這個儀表板，或者答案每週都在變，報告就失去意義。所以能按週比較、而且代理商離不開，比再多一個分數重要。
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
      "麥肯錫出來的 Richard Karlsson 在斯德哥爾摩做 Grasp，幫顧問和投行把試算表和簡報做出來。你交出一個研究題目，拿回來的是他們已經在用的 Excel 和投影片。2025 年 10 月 A 輪 700 萬美元。過去一年，年經常性收入變成原來的 3.5 倍。",
    summaryEn:
      "Former McKinsey consultant Richard Karlsson built Grasp in Stockholm. Its agents draft the spreadsheets and slide decks that bankers and consultants used to build by hand. The October 2025 Series A was $7 million, $9 million in total. ARR rose 3.5× over the prior year.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

投行和顧問很多晚上不是花在判斷，是花在把數字貼進 Excel，再貼進 PowerPoint。Grasp 用好幾個小助手把這段雜活做完，最後交出試算表和簡報。創辦人 Richard Karlsson 在麥肯錫的時候，超過九成的時間都在做這些手動的事。2025 年 10 月 28 日，A 輪 700 萬美元，前後一共 900 萬美元。

## 這個產品在做什麼

網站是 [grasp-ai.com](https://www.grasp-ai.com/)。2020 年在斯德哥爾摩成立。Karlsson 當 CEO。一起做的還有 Johan Devér，以及前愛立信工程師 Simon Hällqvist。你交出去的是一個研究題目，拿回來的是客戶已經在用的 Excel 和簡報。

這輪由 Octopus Ventures 領投，Yanno Capital 跟投。過去 12 個月，年經常性收入變成原來的 3.5 倍。客戶近 200 家，分布在 30 個國家，四大裡的大多數都在用。團隊大約 25 人，倫敦有辦公室。

## 人們為什麼需要它

一份可比公司表，初級分析師常常要做一整天。金融裡還有很大一塊工作，到現在仍然靠人搬。Karlsson 把這塊市場看成大約 1.4 兆美元。客戶真正在意的很單純：交出去的得是他們已經在用的檔案，而不是再一個聊天視窗。

## 它實際怎麼運作

1. 幾個助手分工。有的找資料，有的算數字，有的排成簡報，最後交出試算表和投影片。
2. 先賣給那些已經雇了分析師的公司。他們的預算本來就在，少做的是那份表。
3. 團隊大約 25 人。這輪融資在 2025 年的 AI 公司裡不算大。他們拿出來的增長是：過去一年，年經常性收入變成原來的 3.5 倍。

## 做到哪裡了

Karlsson 在麥肯錫的日子，一天裡超過九成的時間不是在想案子，是在搬數字。Grasp 就從這裡做起。

| 你會看到的結果 | 數字 |
| --- | --- |
| 2025 年 10 月 A 輪 | 700 萬美元 |
| 累計融資 | 900 萬美元 |
| 年經常性收入 | 過去 12 個月變成 3.5 倍 |
| 客戶 | 近 200 家、30 個國家 |
| 團隊 | 大約 25 人 |

## 小團隊可以怎麼複製

1. 先挑一份你以前每個星期都在做的東西，可以是一張表、一份備忘，或一套簡報。
2. 讓工具直接交出那個檔案，對方不用再複製貼上。
3. 去找那些已經在為這份人工付錢的團隊。他們知道這份工作值多少錢。
4. 先做一種表做得很準，再加第二種。

## 投資人會怎麼看

這輪只有 700 萬美元。同一年，很多模型公司一開口就是幾億。Grasp 走的是窄行業、小團隊，客戶口袋裡本來就有這筆預算。投資人會看檔案能不能直接用、分析師會不會每週回來，以及做錯一個數字時誰負責。1.4 兆美元是在說市場有多大。小團隊更該拿出的是：有一家公司每週少做一份表，而且願意付錢。
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
      { zh: "外部資金", en: "Outside capital", value: "四年半後" },
    ],
    summaryZh:
      "Puppy Sphere 做的不是 App，是小狗瑜伽店。你預約一個時段，到店裡跟小狗一起上課，結束前可以拍照。大約四年半、13 間店、45 萬名顧客，累計營收超過 1,400 萬美元。這些是在拿外部資金之前做出來的。",
    summaryEn:
      "Puppy Sphere runs puppy yoga studios. Founder Francesca Albo says that in about four and a half years the company reached 13 studios, 450,000 customers, and more than $14 million in cumulative revenue before taking outside capital.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

小狗瑜伽不是 App。你預約一個時段，到店裡跟小狗一起做瑜伽，結束前可以拍照。Francesca Albo 和 Lea Burbidge Izquierdo 一起做。大約四年半裡，累計營收超過 1,400 萬美元，13 間店，顧客超過 45 萬。這段時間沒有拿外部資金。有了這些數字之後，才拿第一筆外面的錢。

## 這個產品在做什麼

[thepuppysphere.com](https://thepuppysphere.com/) 賣的是到店體驗。收入來自一堂課，不是一個帳號的月費。店多半開在美國城市。合作過的名字裡，有 Google、Amazon、Netflix、TikTok、NBA，還有一些藝人。

## 人們為什麼需要它

城市裡想摸狗、想發限動、想跟朋友約一件好看的事的人很多。收容所的開放日時間固定，體驗也不穩定。一般瑜伽工作室又沒有這個記憶點。Puppy Sphere 把三件事排進同一個小時：運動、動物、照片。

## 它實際怎麼運作

1. 自己開店。課程、動線和拍照點都自己控，體驗才不會每間店差很多。
2. 一間店跑通再複製。到 2026 年是 13 間店。
3. 外面的錢放在已經有營收之後。天使投資人包括 School of Hard Knocks、Tobi Oluwole、Jake Fleshner、Torch Collective，以及 Massage Envy 前 CEO David Humphrey。

## 做到哪裡了

| 你會看到的結果 | 數字 |
| --- | --- |
| 累計營收 | 超過 1,400 萬美元 |
| 門店 | 13 間 |
| 顧客 | 超過 45 萬 |
| 外部資金 | 大約四年半之後才拿第一筆 |

這種店要操心的事很具體。小狗好不好、場地夠不夠、每個城市的規定不一樣，以及新鮮感過了以後，客人還來不來。

## 小團隊可以怎麼複製

1. 先找一件人們願意為了拍照和見朋友而出門的事。
2. 先做好一間店，把動線和安全做完，再去複製下一間。
3. 課表還沒有穩定、客人還沒有重複來之前，先不要做 App。
4. 收入先來自這一堂課。有人重複付錢之後，再談加盟或外面的錢。

## 投資人會怎麼看

有些生意跟模型無關。Puppy Sphere 靠的是一間間店，和已經進來的營收。投資人會看同一個人會不會再來、一間店能不能複製到下一個城市，以及小狗和場地的風險能不能管住。做軟體的人可以學它的順序：先有人重複付錢，再拿外面的錢。
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
      "Rillet 用 AI 做公司的總帳和結帳，想換掉 NetSuite 這類老系統。交易進來就分類，異常才要人看。2024 年從隱身狀態出來。2026 年 8 月，C 輪 1 億美元，估值 10 億美元。客戶超過 600 家。",
    summaryEn:
      "Rillet builds an AI-native general ledger and close, aimed at replacing suites like NetSuite. In August 2026 it raised a $100 million Series C at a $1 billion valuation. Total funding is above $200 million. The company says it has more than 600 customers. The Series A was $25 million, not $2.5 million.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

公司一大，帳就不能放在試算表裡。傳統做法是上 NetSuite、SAP 或 Oracle。導入要幾個月，每個月結帳還是得有人熬夜。Rillet 從第一天就用 AI 做總帳：交易進來就分類，異常才要人看。帳是持續在關，而不是每個月趕一次。2024 年從隱身狀態出來。2026 年 8 月 19 日，C 輪 1 億美元，估值 10 億美元。

## 這個產品在做什麼

[rillet.com](https://www.rillet.com/) 賣給已經在用企業級會計系統的公司，尤其是成長很快、帳務變複雜的團隊。客戶超過 600 家，裡面有上市公司，也有成長很快的 AI 公司。行業從科技擴到生技、醫療、金融、物流和專業服務。他們要替換的系統包括 Oracle Fusion、SAP、Workday、Microsoft GP 和 NetSuite。創辦人 Nicolas Kopp 之前是 N26 的美國 CEO。

## 人們為什麼需要它

每個月結一次帳，是財務固定會碰到的痛。收入怎麼認、有幾家公司、有幾種貨幣疊在一起，新創一旦有了合約和子公司，試算表就先撐不住。舊的系統可以記帳，但導入費和顧問費常常比軟體本身還醒目。財務團隊要的不是再一個問答機器人，而是少做一些分錄，並且更快把帳關完。

## 它實際怎麼運作

1. 總帳本身是新的，不是在 NetSuite 旁邊掛一個聊天窗。
2. 例行分錄盡量自動做完，人只處理對不上、看起來異常的那些。
3. 結帳不是等月底才趕一次，而是帳一直在關。

## 做到哪裡了

- 2024 年結束隱身。
- A 輪 2,500 萬美元，Sequoia 領投。
- B 輪 7,000 萬美元，ICONIQ 與 a16z 領投。
- 2026 年 8 月，C 輪 1 億美元，估值 10 億美元，ICONIQ 領投，Sequoia 和 a16z 跟上。這是大約 14 個月裡的第三輪。累計融資超過 2 億美元。

| 你會看到的結果 | 數字 |
| --- | --- |
| C 輪 | 1 億美元，估值 10 億美元 |
| 累計融資 | 超過 2 億美元 |
| A 輪和 B 輪 | 2,500 萬美元、7,000 萬美元 |
| 客戶 | 超過 600 家 |

三輪都很快。投資人買的是用 AI 重做這套帳務系統。

## 小團隊可以怎麼複製

1. 先挑一個財務每個月都要重做、而且公司本來就有軟體預算的動作。
2. 先讓人少做一種分錄，再談換掉整套系統。
3. 換掉核心系統要賣很久。如果沒有人幫忙導入，也說不清楚帳要怎麼查，財務長不會點頭。
4. 你的第一個版本可以是：把一種固定分錄做成可以覆核的草稿，人點頭才入帳。

## 投資人會怎麼看

這類老系統是出了名的難換。Rillet 在 14 個月裡拿了三輪，估值到 10 億美元，說明這個位子在 2026 年很擠，也很貴。投資人買的是公司總有一天要換掉老系統，同時也知道導入要很久。對小團隊，更可學的是從異常入手，而不是第一天就說要替換 SAP。
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
