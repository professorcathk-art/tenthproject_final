import type { CaseStudy } from "@/types/platform";
import { CASE_SEED_MARKER, CASE_LOCALE_SPLIT } from "@/lib/inspiration/constants";
import { CASE_EXTRAS } from "@/lib/inspiration/case-extras";
import { BATCH2_CASES, type SeedCase } from "@/lib/seed/case-studies-batch2";
import { BATCH3_CASES } from "@/lib/seed/case-studies-batch3";
import { BATCH4_CASES } from "@/lib/seed/case-studies-batch4";

export { CASE_SEED_MARKER, CASE_LOCALE_SPLIT };

const CASES: SeedCase[] = [
  {
    id: "44444444-4444-4444-4444-444444444401",
    title: "Cal AI",
    slug: "calai",
    category: "saas",
    categories: ["saas", "tooling"],
    website: "https://www.calai.app/",
    highlights: [
      { zh: "年化營收", en: "Run-rate", value: "$35M" },
      { zh: "月毛利", en: "Monthly GP", value: "$1.4M" },
      { zh: "累計下載", en: "Downloads", value: "6–8.3M" },
      { zh: "外部融資", en: "Funding", value: "$0" },
    ],
    summaryZh:
      "17 歲創辦人做了一個「拍張食物照，就告訴你熱量」的 App。沒有對外融資，五個月賣破 100 萬美元，七個月月收入逼近 100 萬美元。",
    summaryEn:
      "A 17-year-old founder turned “snap a photo, log the meal” into a calorie app that hit $1M in sales in five months and approached $1M MRR by month seven.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

拍張食物照片，App 就告訴你這餐大概多少卡路里。17 歲團隊自己賺錢、沒有外面投資；公開數字是五個月賣破 100 萬美元，後來月收入逼近 100 萬美元。下面是公開報導與訪談整理，不是公司審計財報。

## 這個產品在做什麼

[Cal AI](https://www.calai.app/) 是 2024 年 5 月上線的手機 App。你拍一張餐、掃條碼，或打幾個字，它就回你熱量，還有蛋白質、碳水和脂肪。網站是 [calai.app](https://www.calai.app/)，App Store 和 Google Play 都可以下載。一起做的人是 Zach Yadegari、Henry Langmack 和 Blake Anderson。第一行程式大約寫在 2024 年 3 月。全程自己出錢，沒有拿外面的投資。

他們沒有自己訓練一個大模型。訪談裡講得很明白：認食物是呼叫別人的 API。要贏，是十秒內給一個夠用的數字，然後讓人願意每月付費。Forbes 2026 年的 30 Under 30，把它寫成「拍張照片就能記熱量」。

## 以前這件事有多麻煩

MyFitnessPal 那一類 App，要你自己搜食物、估份量、對資料庫。一天要做三四次，很多人第二週就不記了。問題不是世界上沒有熱量資料，是記帳太煩，連想減肥的人都記不下去。

自己做更麻煩：訓練看圖的模型、自己建營養資料庫，還要過 App Store。Cal AI 只賣一件事：拍完就有數字。

## 他們怎麼把這件事做出來

你拍一張照片，或掃一個條碼，也可以打幾個字。App 估出這餐是什麼、份量大概多少，然後告訴你熱量、蛋白質、碳水和脂肪，再跟你今天的目標比一比。想一直這樣記，就要訂閱。早期大約一個月 9.99 美元，或一年大約 30 美元。後來訪談裡提到年費大約 29 美元。他們故意訂得便宜，好讓願意付錢的人早一點出現。App 商店的錢不會馬上到帳，有人付錢，才有錢繼續投廣告。

## 做到哪裡了

這些數字來自公開報導和創辦人訪談，不是公司審計過的財報。來源包括 GetLatka 在 2025 年 5 月對 Yadegari 的訪談、Chris Koerner 整理的成長路徑，以及後來的 CNBC 和 Forbes。

- 2024 年 5 月上線。第一個月大約 2.8 萬美元，第二個月大約 11.5 萬美元。
- 2024 年 9 月 4 日之前，累計銷售超過 100 萬美元，當時上線大約五個月。
- 大約第七個月、2024 年 11 月，每月收入大約 100 萬美元，一年大約 1,200 萬美元，下載超過 100 萬次。
- 2025 年 1 月：下載超過 400 萬次，每月收入到 200 萬美元以上，付費的人大約占 20% 到 25%。
- 2025 年 4 月到 5 月：累計下載大約 600 萬次。Yadegari 說當年到那時已經收到超過 1,000 萬美元，一年的收入規模超過 3,500 萬美元，每天下載 2 萬到 3 萬次，付費比例最高到大約 30%。
- 2025 年 9 月 CNBC：團隊大約 30 人。商店抽成之後，一個月毛利大約 140 萬美元，營運上一個月大約賺 27.4 萬美元。到當年 7 月，下載大約 830 萬次。廣告一個月可以花到大約 77 萬美元。
- Forbes 2026 年的資料：自己出錢，一年營收軌道超過 3,000 萬美元，下載大約 600 萬次這個等級。

他們做成，是因為三件很普通的事疊在一起：

1. 拍一下就有數字。這種畫面很適合短片，不用先解釋商業模式。
2. 先找人拍真實餐盤，再拿同一套影片去投廣告。早期用大約 2,000 美元試社群投放。到 2024 年底，大約 150 位網紅固定在發餐盤影片。2025 年中，大約 250 位網紅有長期合作，一個月的行銷可以花到幾十萬美元。好用的拍法，會再拿到 Meta、TikTok 和 Apple 搜尋廣告裡，連「MyFitnessPal」這個名字也會去投。
3. 價錢低到讓人願意先付，不用先白用。公開數字裡，付費的人占 20% 到 30%，比一般消費 App 高。

| 你會看到的結果 | 數字 |
| --- | --- |
| 第一個月 / 第二個月 | 大約 2.8 萬美元，然後 11.5 萬美元（CNBC） |
| 累計賣到 100 萬美元 | 2024 年 9 月，上線大約五個月 |
| 每月收入 | 第七個月大約 100 萬美元，後來訪談到 200 萬美元以上 |
| 一年的收入規模 | 2025 年 5 月超過 3,500 萬美元；Forbes 寫全年軌道超過 3,000 萬美元 |
| 一個月毛利 | 大約 140 萬美元（2025 年 9 月，CNBC） |
| 下載 | Forbes 寫 600 萬次，CNBC 寫到 2025 年 7 月大約 830 萬次 |
| 外面的投資 | 沒有，自己出錢 |

## 你要做一個小版本，可以從這裡開始

不要再做一個熱量 App。學的是做法。

1. 找一件每天都會做、現有產品又明顯難用的事，例如記帳、看冰箱裡還有什麼、檢查作業、整理收據。
2. AI 只用來拿掉那一步最煩的動作，不要做一個什麼都會的助手。
3. 先拍一支八秒就看懂的短片。用很少的錢試別人拍的真實畫面，拍法有效再加大廣告。
4. 那個「拍一下就有結果」的時刻要跟訂閱綁在一起。不付錢，就不能一直用。
5. 用真實的例子驗收：真實的餐盤、真實的光線、也要看它估錯的時候怎麼辦。

一個人可以先做出能用的第一版。有人願意持續付費之後，後面比的是廣告、客服和合規，不再是週末專案。Cal AI 後期幾乎把賺到的錢對等花在找新用戶上。消費訂閱常常就是這樣。

## 投資人為什麼肯付錢

記熱量這件事，很多人都覺得煩，也覺得太普通。17 歲的團隊沒有這個包袱。他們看見手機鏡頭可以取代那張要人手填的表。

這種產品在矽谷常被笑成只是包一層別人的 AI。Cal AI 說明：每天都會用、又有人幫忙傳出去，一樣可以做到一年幾千萬美元，而且沒有拿投資。風險也很具體。商店要抽成，廣告越來越貴，別人也能做拍照，估出來的熱量還要讓人相信。他們守住的是這套讓人看完就想下載的傳法。
`,
    bodyEn: `
## What the company actually does

[Cal AI](https://www.calai.app/) is a May 2024 calorie-tracking app: photograph a plate, scan a barcode, or describe the meal, and it returns calories plus protein / carbs / fat. The public site is [calai.app](https://www.calai.app/). Cofounders Zach Yadegari (CEO), Henry Langmack (CTO), and Blake Anderson wrote the first line of code around March 2024 and bootstrapped the company — no outside round.

They are not a foundation-model lab. Interviews are explicit: vision runs on third-party APIs. The product wins if it returns a *good enough* answer in about ten seconds, then turns that moment into a subscription. Forbes’ 2026 30 Under 30 described it as an AI nutrition app that lets paying users log calories by photographing a plate.

## Pain

Apps like MyFitnessPal ask people to search foods, guess portions, and wrestle a database — three to five times a day. Most quit in week two. The pain is not “missing nutrition data.” It is that **logging itself is miserable**, so even motivated users cannot stay consistent.

For a solo creator the old path is worse: train vision models, license a food database, survive app review. Cal AI cut the problem to one sentence: sell “photo in, number out.”

## Approach

One loop: camera / barcode / text → vision estimate → macros → daily budget → subscription to keep scanning. Early prices were deliberately cheap to buy scale: about $9.99 / month or ~$30 / year; later interviews cite a ~$29 annual plan. The bet was not “free users forever,” but paid users early enough that delayed app-store payouts could fund ads.

## How it worked

Public timeline (GetLatka’s May 2025 interview with Yadegari, growth write-ups, then CNBC and Forbes):

- Launch May 2024; first month ~**$28k**, second ~**$115k**.
- **$1M** cumulative sales by 4 Sep 2024 (~five months).
- Around month 7 / Nov 2024: about **$1M MRR (~$12M ARR)** and 1M+ downloads.
- Jan 2025: 4M+ downloads, **$2M+ MRR** in interview figures, ~20–25% paid conversion.
- Apr–May 2025: ~6M lifetime downloads; **$10M+** collected year-to-date; **$35M+** run-rate; 20–30k daily downloads; conversion cited up to ~30%.
- CNBC, Sep 2025: ~30 people, ~**$1.4M** monthly gross profit after store fees, ~**$274k** monthly operating income; ~**8.3M** downloads by July. Marketing alone ~**$770k** / month.
- Forbes 2026: bootstrapped, $30M+ revenue track, ~6M downloads.

The lesson is not “smarter AI.” It is three old growth motions stacked:

1. **A three-second demo.** Photo → number. Native to TikTok / Reels.
2. **Creators first, paid ads second.** A $2k social test; ~150 regular food posters by end-2024; ~250 retainers by mid-2025. Winning UGC became Meta / TikTok / Apple Search Ads creative — including bidding on “MyFitnessPal.”
3. **Cheap enough to pay, not free enough to lurk.** Low annual price + 20–30% conversion.

## Results

| Metric | Public figure | Source |
| --- | --- | --- |
| Month 1 / 2 revenue | ~$28k → $115k | CNBC |
| First $1M sales | Sep 2024, ~5 months | Latka |
| MRR | ~$1M by month 7; later $2M+ | Latka / essays |
| Run-rate | $35M+ (May 2025); $30M+ year track | Latka, Forbes |
| Monthly gross profit | ~$1.4M (Sep 2025) | CNBC |
| Downloads | 6M (Forbes) to ~8.3M (CNBC, Jul 2025) | Press |
| Daily downloads | 20–30k (May 2025) | Latka |
| Funding | $0 | Multiple |

These are public snapshots, not audited statements.

## How an ordinary builder copies this

Do not clone another calorie app. Copy the method:

1. Pick a daily action existing products make painful.
2. Use AI only to remove that friction.
3. Film an 8-second demo; test cheap UGC before scaling ads.
4. Gate the magic moment behind subscription.
5. UAT on real plates, lighting, and failures.

One person can vibe-code the MVP. After product-market fit, this becomes an ads, support, and compliance company. Cal AI later spends almost as much on acquisition as it earns — that is consumer subscription physics, not a flaw.

## Founder / Silicon Valley read

Paul Graham would call this *schlep blindness*: everyone hates logging calories; “serious” founders think the category is too boring and too crowded. A teenage team did not. a16z-style consumer growth is all here: demoable aha, UGC flywheel, paid scale, brand interception. Valley Twitter mocks “AI wrappers.” Cal AI shows a wrapper on a high-frequency pain, with distribution, can become a nine-figure-run-rate bootstrapped company. The risks are equally classic: store taxes, rising CAC, copycats, and trust in the estimate. The moat is the distribution machine, not the model.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444402",
    title: "StealthWriter",
    slug: "stealthwriter",
    category: "saas",
    categories: ["saas", "workflow_agent"],
    website: "https://stealthwriter.ai/",
    highlights: [
      { zh: "月訪（SimilarWeb）", en: "Monthly visits (SW)", value: "~3.5M" },
      { zh: "月訪（Semrush）", en: "Monthly visits (SEMrush)", value: "~6.8M" },
      { zh: "訂閱價", en: "Plans", value: "$20–$400" },
      { zh: "公開 MRR", en: "Public MRR", value: "未披露" },
    ],
    summaryZh:
      "把 ChatGPT、Claude、Gemini 寫出來的文章，改得比較像人寫的，還能檢測像不像 AI。公司沒公布月收入；第三方估計網站一個月有數百萬人造訪。",
    summaryEn:
      "A 2023 Dubai-born AI humanizer that rewrites ChatGPT / Claude / Gemini drafts to read human and scores them with a built-in detector. Official MRR is undisclosed; third-party traffic is in the millions of monthly visits.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

很多人用 AI 寫完文章，會被學校、客戶或平台覺得太像機器人。StealthWriter 做的就是把這些草稿改得比較像人寫的，還能打分數告訴你像不像 AI。公司沒有公布每月收入。第三方流量工具顯示，一個月有數百萬人造訪。

## 這個產品在做什麼

[StealthWriter](https://stealthwriter.ai/) 由 Maher Mansour 在 2023 年於杜拜創立。公開資料裡的公司名稱是 AiVantage LLC。Tracxn 和 GetLatka 都把它標成沒有外部融資、自己出錢。

你把 ChatGPT、Claude 或 Gemini 寫的草稿貼進去，它改寫成比較像人寫的句子，再用內建的檢測器打一個「像不像 AI」的分數。檢測器有 V2 和 Deep Scan。官網到目前公開頁面的價錢是：免費方案每天可以改寫 10 次、掃描 10 次，每次最多 1,000 字。付費從 Starter 一個月 20 美元、Plus 50 美元、Pro 100 美元，到 Scale 一個月 400 美元，也可以年繳。另外有 30% 的持續推薦分潤，用 Solana 上的 USDC 結算。

它沒有自己訓練一個大模型。同一套流程是：貼上、改寫、看分數、不夠再改一次。靠次數和訂閱收費。Tenth Project 學院把它當成 21 天可以做出來、而且能收款的例子，是因為這套做法拆得開，不是因為它公開了財報。

## 以前這件事有多麻煩

AI 讓寫作變便宜，學校、媒體和客戶的檢測器也同時變成關卡。寫的人要的不是再一個聊天窗。他們要一條穩定的路：寫完、改一改、看分數、不夠就再跑一次。麻煩有兩層。語氣太機械，以及分數過不了就交不了稿。截止日期壓在前面，所以有人願意付月費。

## 他們怎麼把這件事做出來

它做成工具網站，不是聊天機器人。有帳號、每天的次數、字數上限。改寫和檢測是分開的。免費次數夠你試一次，不夠你在交稿日一直用。搜「humanize AI text」或「bypass AI detection」的人，會為了看分數而註冊。推薦計畫把學生、YouTuber 和工具站站長變成銷售。推薦一個月 50 美元的方案，自己每個月可以拿 15 美元，而且對方不停訂，分潤就一直在。

## 做到哪裡了

公開資料裡沒有官方的每月訂閱收入。GetLatka 寫的是「還沒有確認過的營收」。能核對的是流量和怎麼收費：

- 網域大約在 2023 年 3 月註冊。產品是跟著 AI 檢測器一起長起來的。
- 第三方數字會互相打架，要當成區間，不要當成財報。HypeStat 和 SimilarWeb 大約是一個月 350 萬人造訪、一天大約 11.6 萬、每人大約看 4.4 頁、停留大約 4 分鐘。Semrush 對 2026 年 7 月估大約 680 萬次造訪。品牌詞 “stealth writer” 一個月大約搜 2.2 萬次，自然搜尋的點擊幾乎都是它的。
- HypeStat 用「假設只靠廣告」估一個月大約 4.8 萬美元。這不是訂閱收入。真實的訂閱收入可能更高，也可能更低，要看有多少人付費。公司沒有公開這個數字。
- 學院和業界口碑常把它說成一個月賺六位數美元的工具站。比較穩的說法是：一個月數百萬個很想解決問題的訪客，乘上 20 到 400 美元的訂閱，數學上有空間做到一個月六位數美元。創辦人公開財報之前，不要把口碑當成審計過的數字。

做法很直接：

1. 人付錢，是因為分數能不能過，不是因為你用了哪一版模型。
2. 每天 10 次夠你上癮，不夠你在交稿日用完。免費是試用，付費才是產品。
3. 沒有分數，人不知道自己買到什麼。沒有改寫，檢測只是嚇自己。兩件事要一起出現。
4. 30% 的持續分潤，用分錢換別人幫你帶來客人。

| 你會看到的結果 | 數字 |
| --- | --- |
| 官網 | [stealthwriter.ai](https://stealthwriter.ai/) |
| 一個月造訪 | 大約 350 萬（SimilarWeb／HypeStat）；2026 年 7 月 Semrush 大約 680 萬。第三方估計，不是公司聲明 |
| 價錢 | 免費，然後一個月 20、50、100、400 美元 |
| 推薦分潤 | 30%，對方一直訂就一直有 |
| 外面的投資 | 沒有（Tracxn／Latka） |
| 官方每月收入 | 沒有公布。不要把廣告估算當成訂閱收入 |

## 你要做一個小版本，可以從這裡開始

可以學這套做法，不要學「幫人躲過學校誠信檢查」這種灰色行銷。

1. 找一個會被打分數的關卡，例如履歷篩選、廣告政策、品牌語氣、程式碼風格、翻譯腔。
2. 做成：放進去、改寫或生成、打分、不夠再跑一次。分數要能重複。
3. 改寫和檢測分開做，提示詞要留版本，才知道哪一版比較好。
4. 免費次數剛好不夠用。付費次數和功能開關放在同一張表。
5. 客人來自搜尋和推薦，不是來自再拿一輪投資。先佔住兩三個很精準的搜尋詞。

Tenth Project 要學的是：包一層、算次數、能收款、看得到用了多少。不是教人作弊交作業。同一套做法用在品牌語氣、客服草稿、多語言改寫上，故事一樣成立，風險小很多。

## 投資人為什麼肯付錢

這種產品的期限很近。明天要交稿，今天檢測器擋在門口。人每個星期都要交東西，所以願意一直付。它也很容易踩到學校規定和平台政策。矽谷的基金比較少公開押「躲過檢測器」這條路。獨立做出來的人，靠搜尋和推薦，仍然可以做出很大的流量。

真正難的不是呼叫一次 API，是知道哪一句會被 GPTZero 打低分，而且能讓人反覆改到過關。同類產品上百個，StealthWriter 靠的是品牌搜尋、用習慣和推薦。會員可以在 21 天裡做出一個能收款的同類產品：生成、處理、檢測、付費。場景要選你願意長期公開站在那一邊的。
`,
    bodyEn: `
## What the company actually does

[StealthWriter](https://stealthwriter.ai/) was founded in 2023 in Dubai by Maher Mansour (AiVantage LLC in public records). Tracxn and GetLatka list it as unfunded / bootstrapped. The product is narrow: rewrite generative drafts so they read human, then score them with a built-in detector (V2 / Deep Scan). Public pricing: free tier of 10 humanizations and 10 scans per day (1,000 words); paid Starter **$20**, Plus **$50**, Pro **$100**, Scale **$400** per month, plus annual options. Affiliates earn 30% recurring, paid in USDC on Solana.

It is a classic LLM wrapper: paste → rewrite → detect → retry, metered by quota. Tenth Project uses it as the 21-day “ship a paid tool” blueprint because the *structure* can be rebuilt — not because a 10-K exists.

## Pain

Cheap generation created a second industry: detectors at schools, publishers, and clients. Users do not want another chat box. They want a pipeline: generate → rewrite → see a score → run again. Two pains sit on top of each other: robotic tone, and “I cannot submit this.” Deadlines make monthly pricing feel rational.

## Approach

A tool, not a companion: accounts, daily caps, word limits, separate Humanizer and Detector, free tier as top-of-funnel. The detector is both feature and acquisition — people searching “humanize AI text” register to see a score. The affiliate program turns students, YouTubers, and tool-directory owners into a sales force.

## How it worked

There is **no official MRR**. What we can check is traffic and packaging:

- Domain registered around March 2023, riding the detector wave.
- Third-party ranges (treat as ranges, not finance): HypeStat / SimilarWeb ~**3.5M** monthly visits, ~116k daily, ~4.4 pages / visit; Semrush ~**6.8M** visits in July 2026, with the brand query “stealth writer” (~22k/mo) dominating organic.
- HypeStat’s ~$48k/month figure assumes **ads**, not subscriptions. Real SaaS revenue is undisclosed.
- Industry chatter (and our academy narrative) often calls it a six-figure-USD-per-month tool. Mathematically, millions of high-intent visits × $20–$400 plans *can* support that. Until the founder publishes numbers, treat “$100k+ MRR” as a **replication target**, not an audited fact.

Why it scaled anyway:

1. **Sell the antidote to anxiety, not the model.**
2. **Free quota is the ad; paid quota is the product.**
3. **Score and rewrite must ship as a pair.**
4. **30% recurring affiliates buy distribution.**

## Results

| Metric | Public / estimated | Note |
| --- | --- | --- |
| Site | [stealthwriter.ai](https://stealthwriter.ai/) | Product + pricing |
| Monthly visits | ~3.5M SimilarWeb; ~6.8M Semrush (Jul 2026) | Third party |
| Pricing | $0 → $20 / $50 / $100 / $400 | Official |
| Affiliates | 30% recurring | Official |
| Funding | None listed | Tracxn / Latka |
| Official MRR | Undisclosed | Do not use ad ARPU as SaaS |

## How an ordinary builder copies this

Copy the structure. Do not copy grey “beat your university detector” marketing.

1. Find a scoring gate (ATS, ads policy, brand voice, code review, translationese).
2. Ship input → transform → score → retry. Scores must be repeatable.
3. Version prompts; split humanizer and detector for A/B tests.
4. Put the free tier just below “enough for deadline week.” Metering and feature flags share one table.
5. Win two or three exact keywords and an affiliate loop before you think about brand ads.

The academy lesson is **wrapper + quota + payments + instrumentation**. The same skeleton on brand-voice rewrite, support drafts, or localization is a cleaner business.

## Founder / Silicon Valley read

YC would call this *hair on fire*. LTV can be high (weekly deadlines) and the ethics / platform-policy surface is ugly. Institutions rarely want the “bypass detector” headline; indie founders still built a traffic machine with SEO and affiliates. Naval’s “specific knowledge” here is knowing which sentences tank a detector score and turning that into a loop — not calling an API once. The moat is thin (hundreds of clones), so brand query + habit + affiliates matter. Your job in 21 days: ship a **payable isomorph** (generate → process → measure → charge) in a category you are willing to stand behind.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444403",
    title: "Image Prompt Org",
    slug: "image-prompt-org",
    category: "platform",
    categories: ["platform", "content"],
    website: "https://imageprompt.org/",
    highlights: [
      { zh: "月訪區間", en: "Monthly visits", value: "74萬–115萬" },
      { zh: "自然搜尋", en: "Organic share", value: "~47%" },
      { zh: "核心關鍵詞", en: "Head term", value: "image to prompt" },
      { zh: "變現", en: "Monetization", value: "Freemium" },
    ],
    summaryZh:
      "不會寫 AI 畫圖提示詞也沒關係：把一張圖丟進去，網站會反推提示詞，或幫你寫一則更好的，再送到 Flux、Midjourney。月訪大約 74 萬到 115 萬。",
    summaryEn:
      "imageprompt.org is not another social wall. It owns the “image to prompt” query: reverse-prompt an image, generate a better prompt, send it to Flux / Midjourney / SD. Third-party traffic sits around 740k–1.15M monthly visits.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

想用 AI 畫圖，但不會寫提示詞？這個網站做兩件事。看一張圖，反推出該怎麼寫；或直接幫你把一句話寫成更好的提示詞，再送到 Flux、Midjourney、Stable Diffusion。它不是論壇，是工具站。第三方統計一個月大約 74 萬到 115 萬人造訪。

## 這個產品在做什麼

[ImagePrompt.org](https://imageprompt.org/) 公開的定位是：把想法變成可以用的圖像提示詞。主要不是論壇，是三個工具：

1. 圖轉提示詞。上傳一張圖，它寫出可以再拿去生成的文字，並支援一般格式、Flux、Midjourney 和 Stable Diffusion。
2. 提示詞產生器。英文不穩也沒關係，一句話可以擴成模型吃得下的長提示。
3. 站內出圖。提示詞可以直接在網站上出圖。免費用戶每天大約 5 次提示詞額度、2 次出圖，再用就要升級或買點數包。

創作者實際在做的事很具體。看到一張喜歡的海報，反推提示詞，改幾個詞，再用 Midjourney 或 Flux 跑一次。客人是搜尋來的，不是靠邀請制社群。

## 以前這件事有多麻煩

好的提示詞散落在 Discord 截圖、小紅書和付費的提示詞手冊裡。不會寫英文長描述的人，明明腦子裡有畫面，卻寫不出模型要的結構：鏡頭、光線、材料、不要出現什麼。他們想照著這張圖再改一改，卻沒有一份可以搜、可以再拿去生成的文字。先做動態牆的社群產品，搜尋引擎找不到，人也沒有每天回來的理由。

## 他們怎麼把這件事做出來

先做一個搜尋意圖很明確的工具，讓 Google 幫你帶來客人。免費額度夠你完成一次「圖、詞、再出圖」，不夠你把它當成工作室天天用。人用爽了才升級或買點數。不同模型的格式都給，使用者不必換成另一家，把提示詞帶走就好。

## 做到哪裡了

團隊和每月收入幾乎沒有公開。能看的是流量：

- AI NavHub 等目錄站近期數字：大約一個月 73.9 萬人造訪，跳出大約 52%，每人大約 2.24 頁，停留大約 2 分 34 秒，全球排名大約 9.2 萬。
- 流量大約 47% 來自自然搜尋、35% 直接進來、14% 別人推薦，付費搜尋接近 0。這是靠搜尋的產品，不是靠廣告的產品。
- 最重要的搜尋詞就是產品本身：\`image to prompt\`（目錄站估這個詞可以帶來數萬次點擊）、\`image to prompt generator\`、\`image prompt\`。Semrush 對 2026 年 7 月估大約 115 萬次造訪，比 6 月多 17%，一次造訪大約 9 分鐘，直接流量大約 52%，Google 大約 33%。
- 國家偏美國、俄羅斯、印度這些創作和外包市場。提示詞是英文，使用者不一定是英文母語。

一個人也可以走這條路：

1. 功能名稱就是搜尋詞。網域和標題對齊 image prompt，工具頁對齊 image to prompt。
2. OpenAI 和 Midjourney 會改模型。只要模型還要文字提示，「圖轉成詞」就還有人要。中間這一步比自己再做一個畫圖模型好守。
3. 免費完成一次，付費才給更多次數。跟 StealthWriter 同一套次數心理，只是場景換成圖像。
4. 不必先做社群。使用者自己做的內容可以以後再加。沒有搜尋引擎找得到的工具頁，社群只是一座空城。

| 你會看到的結果 | 數字 |
| --- | --- |
| 官網 | [imageprompt.org](https://imageprompt.org/) |
| 一個月造訪 | 大約 74 萬（目錄站）到大約 115 萬（Semrush，2026 年 7 月）。第三方 |
| 自然搜尋 | 大約 47%（AI NavHub） |
| 主要搜尋詞 | image to prompt |
| 怎麼收費 | 每天免費額度，然後升級或買點數包 |
| 官方每月收入 | 沒有公布 |

沒有公開的訂閱人數，也沒有公布一年的經常性收入。以接近百萬造訪的工具站、點數包和升級頁來看，這是靠搜尋賺錢的生意，不是投資人故事裡那種靠網路效應的平台。

## 你要做一個小版本，可以從這裡開始

1. 選一個帶動詞的搜尋詞，例如 invoice to excel、meeting to tasks、screenshot to ticket，不要選一個空泛的品類。
2. 一週內做出搜尋引擎找得到的工具頁：放進去、拿出來、再做一次。
3. 免費額度只夠跑通一次。第二次以後要付費。
4. 每種下游模型或格式都給一個可以帶走的版本，人就不用害怕換工具。
5. 先寫常見問題和對照頁，讓搜尋找得到，再考慮收藏、動態和積分。

這比複製一個社交網路容易很多，也比較像 21 天內做得出來的範圍。

## 投資人為什麼肯付錢

平台投資人要的是使用者自己生產內容、而且人越多越難離開。ImagePrompt.org 走的是獨立站搜尋。它收的是提示詞這種中間產物。上游是大模型，下游是創作者。風險是模型公司自己做「圖轉提示詞」，並且直接放進 App 裡。Midjourney 和 ChatGPT 都有動機這樣做。它守得住的是搜尋排名、使用習慣，以及一次輸出很多種模型格式。

對會員來說：海外工具站不一定要講社群平台的故事。先佔住一個月搜尋過萬、點擊廣告還不算貴的英文動詞，用次數收費。活下來之後，再決定要不要做社群。
`,
    bodyEn: `
## What the company actually does

[ImagePrompt.org](https://imageprompt.org/) sells usable image prompts, not a social feed. Three tools matter:

1. **Image to Prompt** — upload a picture, get a reusable prompt, with General / Flux / Midjourney / Stable Diffusion flavours.
2. **Prompt generator** — expand a weak English sentence into a model-ready brief.
3. **In-product generation** — run the prompt on-site (about 5 prompt credits and 2 image credits per day on free; then upgrade or credit packs).

The job to be done: see a poster you like → reverse the prompt → tweak → rerun in Midjourney or Flux. Acquisition is **search intent**, not invites.

## Pain

Good prompts live in Discord screenshots and paid prompt books. People who are not fluent in English prompt-speak can *see* the image and still cannot emit camera, lighting, materials, and negatives. The pain is “I want to remix this picture and have no searchable, rerunnable intermediate format.” Social-first products build a feed, skip SEO, and wonder why nobody returns.

## Approach

Ship a high-intent tool and let Google do CAC. Free credits complete one “image → prompt → image” loop and fail as a studio OS — upgrades happen after the magic. Model presets (MJ / Flux / SD) cut switching costs.

## How it worked

Team and MRR are unpublished. Traffic is the scoreboard:

- Directory snapshots: ~**739k** monthly visits, ~52% bounce, ~2.24 pages, ~2m34s, global rank ~92k.
- Mix: ~**47% organic**, ~35% direct, ~14% referral, paid search ≈ 0.
- Head terms *are* the product: \`image to prompt\`, \`image to prompt generator\`, \`image prompt\`.
- Semrush July 2026: ~**1.15M** visits (+17% vs June), ~9m sessions, ~52% direct / ~33% Google.
- Geo skewes to US / Russia / India — creators and outsourcing markets.

Indie playbook:

1. **Turn the feature into the keyword.**
2. **Defend the middle layer.** Models change; “image → text prompt” lives as long as models eat text.
3. **Free magic once; pay for volume.**
4. **Community later.** Without indexable tool pages, a social layer is an empty city.

## Results

| Metric | Figure | Basis |
| --- | --- | --- |
| Site | [imageprompt.org](https://imageprompt.org/) | Product |
| Monthly visits | ~740k (directories) to ~1.15M (Semrush Jul 2026) | Third party |
| Organic share | ~47% | AI NavHub |
| Head term | image to prompt | Intent = product |
| Monetization | Daily free credits + upgrade / packs | FAQ |
| Official MRR | Undisclosed | — |

No public subscriber count. Near-million tool traffic plus credit packs is search cash flow, not a VC network-effect story.

## How an ordinary builder copies this

1. Pick a verb-y query (invoice to excel, meeting to tasks, screenshot to ticket).
2. Ship an indexable tool page in a week: input, output, run-again.
3. Free tier completes one loop; the second is paid.
4. Add an export preset per downstream format.
5. Write FAQ / comparison pages before likes and leaderboards.

That is an order of magnitude easier than cloning a social network — and inside a 21-day vibe-coding scope.

## Founder / Silicon Valley read

Platform investors want UGC flywheels. ImagePrompt.org is *indie SEO*. Ben Thompson would read it as the inverse of an aggregator: it aggregates the **intermediate artifact** (the prompt), with model labs upstream and creators downstream. The risk is the labs shipping reverse-prompt as a default. The moat is rank, habit, and multi-model export — not a data network. Lesson for members: you do not need a “community platform” story. Own an English verb with volume and still-sane CPC, meter it, then decide whether UGC is worth it.
`,
  },
  {
    id: "44444444-4444-4444-4444-444444444404",
    title: "HumanAIAgent",
    slug: "humanaiagent",
    category: "workflow_agent",
    categories: ["workflow_agent", "tooling"],
    website: "https://usehumanai.com/",
    highlights: [
      { zh: "對照產品", en: "Live counterpart", value: "HumanAI" },
      { zh: "形態", en: "Shape", value: "Agent + 真人" },
      { zh: "官網", en: "Site", value: "usehumanai.com" },
      { zh: "公開 MRR", en: "Public MRR", value: "未披露" },
    ],
    summaryZh:
      "對照的是已上線公司 HumanAI：不只聊天，還要幫你把事情做完。一邊是會執行工作的客製 Agent，一邊是每週有真人教練的 Hope。公開收入未披露。",
    summaryEn:
      "The live counterpart is HumanAI (usehumanai.com): custom agents that execute work, plus Hope — an AI that remembers you, paired with weekly human coaches. That is the shape after chatbots.",
    bodyZh: `${CASE_SEED_MARKER}
## 簡單總結

靈感庫這則對照的是田納西已經上線的 HumanAI，不是一個空殼網域。它不只要陪你聊天，還想變成真的會把工作做完的助手。一邊是幫公司做的客製助手，一邊是 Hope：AI 記得你的狀況，每週再配真人教練。公開收入沒有公布。

## 這個產品在做什麼

靈感庫裡的「HumanAIAgent」對應的是已經上線的 [HumanAI](https://usehumanai.com/)，公司在田納西 Knoxville。它同時做兩條線：

1. 給公司的客製助手。官網服務頁寫的是：助手要能走完多步驟的工作，例如研究、把客服分流、把流程跑完。它接上公司已經在用的系統，先說清楚能做什麼、不能做什麼，需要判斷的時候再交給人。官網也提到多個助手一起做。它舉 Notion、Rakuten、Asana 這些已經在正式環境裡跑流程的例子，那是行業現況，不是 HumanAI 說自己收購了這些公司。他們派一位 AI 架構師進團隊，用幾個星期把助手做出來，不是用一季。
2. 給個人的 Hope。一半是記得你人生脈絡的 AI 教練，一半是真人帶的直播課和答疑時間。官網的說法是：別人逼你選 App 或選顧問，Hope 兩樣都要。創辦故事寫著希望先服務第一個 1,000 人，並鎖住創始價。

兩條線放在一起看，公司收的不是「更會聊天」的錢。它做的是一個有點像人、真的會呼叫工具、必要時找人簽字的助手。這跟課程裡用 LangChain、OpenAI 的工具呼叫和 MCP 做的那條路是同一件事：先看情況，再決定，再呼叫工具，再看結果。

## 以前這件事有多麻煩

聊天機器人會回答，不會把跨好幾個系統的工作做完。傳統顧問一個小時 500 美元，又沒辦法每個星期跟著你。公司這邊的麻煩是：流程散落在客戶資料、表格和信箱裡。舊的自動化太脆，員工把時間耗在複製貼上。個人這邊的麻煩是：ChatGPT 一關分頁，就忘了你是誰。HumanAI 把這兩件事收成一句話。你需要一個記得前因後果、會去呼叫工具、必要時找人簽字的助手。

## 他們怎麼把這件事做出來

他們不再把人設提示詞寫得更長，而是先定義工具能做什麼：查客戶資料、寄信、開票、讀 MCP 裡的資料、交給人。MCP 的意義是，助手讀到的是真實的專案狀態，例如路線圖、驗收和檔案，不是憑空猜。Hope 則用記憶加上每週真人，做出給個人用的陪伴：角色穩定、有節奏、該升級的時候會升級。公司這邊用專案和駐點顧問收費，個人這邊用訂閱。這比只包一層聊天難做，也更接近公司願意付的那張帳單。

## 做到哪裡了

HumanAI 沒有公開每月收入、估值或造訪次數。服務型和早期的個人訂閱，通常也不會先公布。能確認的是，這個品類已經有市場價格：

- 客製助手的專案，市場上常見是數萬到數十萬美元的顧問單，外面再加月費。HumanAI 用「幾個星期上線、不用自己先建一套維運」來降低公司下單的門檻。
- Hope 走創始會員和鎖住長期價格，目標先收滿 1,000 人。這是個人訂閱的起步目標，不是已經公布的百萬用戶。
- 更大的行業背景是：Gartner 和各家顧問公司把這種會自己跑流程的 AI 寫進 2025 到 2026 年的預算。MCP 從 2024 年 11 月由 Anthropic 開源之後，已經變成 Cursor、Claude 和公司內部助手接工具時的預設做法。HumanAI 收的是幫你把助手做出來的錢，不是再賣一個聊天外殼。

如果你要做一個類似的東西，可以學這幾件：

1. 語氣只是表面，工具才是骨架。沒有清楚定義工具的「溫柔語氣」，只是示範。
2. 交給人不是失敗，是產品的一部分。碰到法律、付款和例外，助手該停的時候要停。
3. 記憶要寫進資料庫。Hope 強調過了這個星期還認得你。公司的助手則要記得工單現在到哪一步。
4. 先賣一個工作流程。不要做萬能員工。先做「每週研究並寫簡報」，或「把信箱分類並起草回信」。

| 你會看到的結果 | 現況 |
| --- | --- |
| 官網 | [usehumanai.com](https://usehumanai.com/)，Hope 加上助手服務 |
| 公開每月收入和造訪 | 沒有公布，不要編 |
| 產品形態 | 公司專案，加上 Hope 訂閱 |
| 起步目標 | 官網寫第一個 1,000 位 Hope 用戶。這是行銷目標，不是已經公布的成績 |
| 行業對照 | MCP 已經變成常用做法；多個助手已經在大型軟體的正式環境裡跑 |

如果你要看已經公開規模的同類個人助手，可以另外看 Lindy、Relevance AI。這篇只拆跟 HumanAIAgent 對得上的真實公司，不把別人的年收入安到這個品牌上。

## 你要做一個小版本，可以從這裡開始

1. 選一件你自己每個星期都在做、而且有好幾個步驟的工作，例如客戶研究、對帳、內容日曆、驗收回歸。
2. 先寫 5 個以內的工具：讀資料、寫資料、通知、搜尋、交給人。工具的規格要比提示詞先寫好。
3. 用 MCP 把本地的真實狀態接進去。Tenth Project 的路線圖和驗收就是教材。
4. 每一步都留下紀錄：誰呼叫了、花了多少 token、失敗在哪。看不到這些，就還沒有產品。
5. 收費跟「做完幾件任務」或「每週回顧」綁在一起，不要跟「無限聊天」綁在一起。

一個人用 Cursor 加 MCP 做內部助手，已經夠接第一張顧問單。Hope 那種「AI 加真人直播」要經營社群，可以第二階段再加。

## 投資人為什麼肯付錢

Andreessen Horowitz 把 2025 以後稱為會自己跑流程的一年。預算從「買一個 Copilot 座位」轉到「買一個會把流程跑完的員工」。矽谷真正看的是：任務做完的比例、要人接手的比例，以及出事時查不查得到紀錄。像不像人，不是第一個分數。Garry Tan 和 YC 會問：這個助手有沒有一件工作，讓使用者每個星期都離不開？如果沒有，它只是套了一層皮膚的 ChatGPT。

反過來也成立。示範會騙人，正式上線會打臉。工具一多，模型會選錯工具。MCP 一多，上下文會被一堆用不到的規格淹沒。普通創業者的優勢是先做深一個行業：先做這個行業的十個工具，不要先做一個什麼都會的員工。HumanAI 的「駐點架構師加上 Hope」承認了同一件事。純軟體還不夠，人還要留在流程裡。這是開得出帳單的做法。
`,
    bodyEn: `
## What the company actually does

The vault’s “HumanAIAgent” maps to a live company: **[HumanAI](https://usehumanai.com/)** in Knoxville, Tennessee — not an empty domain. Two lines:

1. **B2B: custom agents and orchestration.** Service pages describe agents that finish multi-step work (research, routing, execution), sit on existing systems, respect guardrails, and escalate when judgment is required. Multi-agent write-ups cite production programs at companies such as Notion, Rakuten, and Asana — industry context, not a claim that HumanAI acquired them. Delivery is an embedded “AI Architect,” weeks not quarters.
2. **Consumer: Hope.** Half an AI coach that remembers your life, half live human training and office hours. Their line: everyone else makes you pick an app or a consultant; Hope is both. The founding story aims at a first 1,000 members at a locked founding price.

Together they sell **persona + executable tools + a human node when needed**. That is the same loop the academy builds with LangChain / OpenAI tool calling / MCP: observe → decide → call tools → observe.

## Pain

Chatbots answer and do not finish cross-system work. Consultants at $500/hour do not show up every week. On the enterprise side, workflows are smeared across CRM, sheets, and inbox; RPA is brittle. On the personal side, ChatGPT forgets you when the tab closes. HumanAI’s sentence: you need an agent that **keeps context, calls tools, and can get a human signature**.

## Approach

Stop lengthening the persona prompt. Define the tool schema first: CRM reads, mail, tickets, MCP resources, human escalate. MCP matters because the agent sees real project state (roadmap, UAT, files). Hope’s consumer anthropomorphism is memory + weekly humans: stable role, cadence, escalation. B2B bills as projects / embedded advisory; Hope bills as subscription. Harder than a wrapper — closer to an invoice a company will pay.

## How it worked

HumanAI has **no public MRR, valuation, or traffic**. The category, however, already has prices:

- Custom agent programs commonly land in the tens to hundreds of thousands of dollars, plus a monthly operate fee. “Live in weeks, no DevOps team” is how they reduce enterprise friction.
- Hope is a founding-member cold start (first 1,000), not a disclosed million-user consumer app.
- Backdrop: budgets labeled Agentic AI in 2025–26; MCP, opened by Anthropic in November 2024, is the default way Cursor, Claude, and internal agents attach tools. HumanAI sells *implementation* on that curve.

Copy these, not a fake revenue slide:

1. **Persona is skin; tools are bone.**
2. **Escalation to a human is a feature.**
3. **Memory belongs in a database.**
4. **Sell one workflow first.**

## Results

| Metric | Status | Note |
| --- | --- | --- |
| Site | [usehumanai.com](https://usehumanai.com/) | Hope + agent services |
| Public MRR / visits | Undisclosed | Do not invent |
| Shape | Agent projects + Hope subscription | Two revenue motions |
| Cold start | First 1,000 Hope users on the site | Goal, not a published result |
| Category | MCP as default; multi-agent in large SaaS prod | Wind direction |

For consumer agents *with* published scale, look at names like Lindy or Relevance AI separately. This page will not paste someone else’s ARR onto HumanAI.

## How an ordinary builder copies this

1. Pick a multi-step job you already do weekly.
2. Write at most five tools: read, write, notify, search, escalate. Schema before prompt.
3. Pipe real local state through MCP (our roadmap / UAT is the teaching example).
4. Log every step: who called, tokens, where it failed.
5. Charge for completed jobs or weekly reviews, not unlimited chat.

One person with Cursor + MCP can sell the first advisory seat. Hope-style “AI + live humans” is a community business — add it later.

## Founder / Silicon Valley read

a16z’s 2025+ story is *agentic*: budgets move from Copilot seats to “an employee that finishes the workflow.” What partners actually score is completion rate, human-takeover rate, and the audit trail — not how friendly the avatar sounds. YC will ask: is there a weekly job the user cannot drop? If not, you shipped skinned ChatGPT.

The warning is equal: demos lie, production slaps. Too many tools and the model picks wrong; too many MCP servers and the context window fills with junk schema. A solo founder’s edge is **vertical** — ten tools in one industry, not a general employee. HumanAI’s “embedded architect + Hope” admits the same thing: software alone is not enough; a human stays in the loop. That is not a retreat. That is a billable shape.
`,
  },
  ...BATCH2_CASES,
  ...BATCH3_CASES,
  ...BATCH4_CASES,
];

export function getSeedCaseStudies(): CaseStudy[] {
  const now = new Date().toISOString();
  return CASES.map((c) => {
    const extra = CASE_EXTRAS[c.slug];
    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      categories: c.categories,
      summary: `${c.summaryZh}\n---en---\n${c.summaryEn}`,
      breakdown_md: `${c.bodyZh}\n${CASE_LOCALE_SPLIT}\n${c.bodyEn}`,
      tech_stack: [],
      website_url: c.website,
      highlights: c.highlights,
      difficulty: extra?.difficulty ?? 3,
      pitch_deck_url: extra?.pitchDeckUrl ?? null,
      clone_prompt: extra
        ? `${extra.clonePromptZh}\n${CASE_LOCALE_SPLIT}\n${extra.clonePromptEn}`
        : null,
      cover_image: null,
      author_id: null,
      is_published: true,
      created_at: now,
    };
  });
}

export const CANONICAL_CASE_SLUGS = CASES.map((c) => c.slug);
export const LEGACY_CASE_SLUG = "solo-founder-built-a-saas-in-48-hours";
