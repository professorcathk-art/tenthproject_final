import type { CaseHighlight, CaseStudy, CaseStudyCategory } from "@/types/platform";
import { CASE_SEED_MARKER, CASE_LOCALE_SPLIT } from "@/lib/inspiration/constants";

export { CASE_SEED_MARKER, CASE_LOCALE_SPLIT };

type SeedCase = {
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
      "17 歲創辦人用「拍一張就能記熱量」打進擁擠的飲食追蹤市場，五個月做到首個 $100 萬銷售，七個月逼近 $100 萬月經常性收入。",
    summaryEn:
      "A 17-year-old founder turned “snap a photo, log the meal” into a calorie app that hit $1M in sales in five months and approached $1M MRR by month seven.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[Cal AI](https://www.calai.app/)（亦稱 CalAI）是 2024 年 5 月上線的手機飲食追蹤 App：使用者拍一張餐點、掃條碼或用文字描述，系統即回傳熱量與蛋白質／碳水／脂肪。官方網站是 [calai.app](https://www.calai.app/)，App Store／Google Play 均可下載。共同創辦人為 Zach Yadegari（CEO）、Henry Langmack（CTO）與 Blake Anderson；首行程式碼約在 2024 年 3 月寫下，全程自籌、未對外融資。

它不是自研大模型公司。公開訪談清楚說：視覺辨識走第三方 API，產品勝負在「10 秒內給出一個夠用的答案」，再把這個瞬間變成訂閱。Forbes 2026 年 30 Under 30 把它寫成「拍張照片就能記熱量的 AI 營養 App」。

## 痛點

MyFitnessPal 一類產品要使用者自己搜食物、估份量、對營養資料庫。這個動作每天重複 3–5 次，大多數人在第二週放棄。痛點不是「世界上缺少熱量資料」，而是**記錄本身太痛苦**，以至於連有意減肥的人都做不到連續打卡。

對個人創作者來說，傳統路徑更糟：自訓視覺模型、堆營養資料庫、過審 App Store，動輒數月與高薪團隊。Cal AI 證明切口可以極窄：只賣「拍完就有數字」。

## 方案

產品做成一條不可拆的迴路：相機／條碼／文字 → 視覺模型估食物與份量 → 回傳熱量與巨量營養素 → 對照每日目標 → 訂閱解鎖持續掃描。早期定價刻意偏低以換規模：約 $9.99／月或約 $30／年，後來公開訪談提到年方案約 $29。重點不是免費試用堆下載，而是讓付費用戶盡早出現，好讓 Apple／Google 的延遲分帳趕得上廣告現金。

## 成功故事與成功之道

公開時間線（綜合 GetLatka 對 Yadegari 的 2025 年 5 月訪談、Chris Koerner 對成長路徑的整理，以及 CNBC、Forbes 後續報導）：

- 2024 年 5 月上線；首月營收約 **$28,000**，次月約 **$115,000**。
- 2024 年 9 月 4 日前累計銷售跨過 **$100 萬**（上線約五個月）。
- 約第 7 個月／2024 年 11 月，報導與訪談口徑來到 **約 $100 萬 MRR（約 $1,200 萬 ARR）**，下載破百萬。
- 2025 年 1 月：下載逾 400 萬，MRR 口徑到 **$200 萬+**，付費轉換約 20–25%。
- 2025 年 4–5 月：終身下載約 600 萬；Yadegari 稱當年至今收款逾 **$1,000 萬**，年化 run-rate 逾 **$3,500 萬**，日下載 2–3 萬，轉換可到約 30%。
- 2025 年 9 月 CNBC：約 30 人團隊，經應用商店抽成後月毛利約 **$140 萬**，其中月營運淨利約 **$27.4 萬**；截至當年 7 月下載約 **830 萬**。廣告行銷月支出可達約 **$77 萬**。
- Forbes（2026 年資料）：自籌、年營收軌道逾 **$3,000 萬**，下載約 600 萬量級。

成功之道不是「AI 比較聰明」，而是三件老派的增長工程疊在一起：

1. **一個 3 秒可演示的時刻。** 拍食物 → 出數字。TikTok／Reels 天然適合，無需解說商業模式。
2. **先微網紅，再付費廣告。** 早期用約 $2,000 測社群投放；到 2024 年底約 150 位網紅規律發餐盤影片，2025 年中約 250 位網紅在 retainer，月行銷支出到六位數中段。他們先用 UGC 找出會爆的創意，再把同一套素材倒進 Meta、TikTok 與 Apple Search Ads（包含攔截「MyFitnessPal」品牌詞）。
3. **便宜到讓人願意先付，而不是先白嫖。** 低年費鎖定大量「想變瘦但不想記帳」的人；轉換率公開數字落在 20–30%，遠高於典型消費 App。

## 成績

| 指標 | 公開數字 | 來源口徑 |
| --- | --- | --- |
| 首月／次月營收 | 約 $2.8 萬 → $11.5 萬 | CNBC |
| 累計 $100 萬銷售 | 2024/09，約上線 5 個月 | Latka 訪談 |
| MRR | 約 $100 萬（約第 7 個月）；其後訪談到 $200 萬+ | Latka／成長文 |
| 年化 run-rate | 逾 $3,500 萬（2025/05）；全年軌道約 $3,000 萬+ | Latka、Forbes |
| 月毛利 | 約 $140 萬（2025/09） | CNBC |
| 下載 | 600 萬（Forbes）至約 830 萬（CNBC，2025/07） | 媒體 |
| 日下載 | 2–3 萬（2025/05） | Latka |
| 融資 | $0，自籌 | 多次公開 |

數字會隨時間變動，以上皆為公開報導／創辦人訪談的歷史快照，不是公司審計財報。

## 普通人如何複製

不要複製「另一個熱量 App」。要複製的是方法：

1. 選一個**每天發生、現有產品明顯難用**的動作（記帳、盤點冰箱、檢查作業、整理收據）。
2. 把 AI 只用來消掉那一步的摩擦，而不是做一個什麼都會的助手。
3. 做出 8 秒能看懂的演示，先花小錢測 UGC；創意成立再放大廣告。
4. 訂閱與核心動作綁死：不付費就無法重複獲得那個「魔法瞬間」。
5. 用真實樣本做驗收（真實餐盤、真實光線、真實失敗），不要只拿官網圖演示。

一個人用 Vibe Coding 可以做出 MVP；過了產品／市場契合，增長會變成廣告、客服與合規的公司，不再是「週末專案」。Cal AI 後期幾乎把收入對等花在獲客上——這是消費訂閱的真相，不是失敗。

## 創業者與矽谷視角

Paul Graham 會把這稱為 *schlep blindness*：所有人都知道記熱量很煩，但「正經創業者」覺得品類太土、競爭者太多。17 歲團隊沒有這個包袱，反而看見一個可以用手機鏡頭重做的表單。

a16z 式的消費增長框架在這裡完整出現：可演示的 *aha*、UGC 飛輪、付費投放規模化、品牌攔截。矽谷常嘲笑「AI wrapper」；Cal AI 證明 wrapper 若打在高頻痛點、又掌握分發，可以長成數千萬美元年營收的自籌公司。風險也同樣經典：應用商店抽成、廣告 CAC 上升、競品複製拍照功能、以及「AI 估熱量準不準」的信任與合規。護城河不在模型，而在分發機器與品牌心智。
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
      "2023 年在杜拜起步的 AI 文本 Humanizer：把 ChatGPT／Claude／Gemini 的草稿改寫得像人寫的，並內建檢測。官方未公布 MRR，但第三方流量已到數百萬月訪。",
    summaryEn:
      "A 2023 Dubai-born AI humanizer that rewrites ChatGPT / Claude / Gemini drafts to read human and scores them with a built-in detector. Official MRR is undisclosed; third-party traffic is in the millions of monthly visits.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[StealthWriter](https://stealthwriter.ai/)（stealthwriter.ai）由 Maher Mansour 於 2023 年在杜拜創立，營運主體公開資料寫為 AiVantage LLC，Tracxn／GetLatka 皆標為未融資、自籌。產品極窄：把生成式模型的草稿**改寫成更像人寫的文本**，並用內建 Detector（含 V2、Deep Scan）給出「像不像 AI」的分數。官網定價截至公開頁面為：免費檔每日 10 次改寫／10 次掃描、每次最多 1,000 字；付費從 Starter **$20／月**、Plus **$50**、Pro **$100** 到 Scale **$400／月**（另有年繳）。另有 30% 經常性聯盟分潤，以 USDC（Solana）結算。

這就是典型的 LLM Wrapper：同一套「貼上 → 改寫 → 檢測 → 再改」流水線，用額度與訂閱變現。Tenth Project 學院把它當作「21 天復刻、含支付閉環」的藍本，不是因為它有開源財報，而是因為商業結構可以被拆開重做。

## 痛點

生成模型讓寫作變便宜，也讓學校、媒體與客戶端的 **AI 檢測器**同時變成關卡。使用者要的不是再一個聊天窗，而是一條穩定流水線：生成 → 改寫 → 看分數 → 不夠就再跑。痛點有兩層：輸出語氣機械、以及「過不了檢測就交不了稿」。產品把恐懼與截止日期綁在一起，所以願意付月費。

## 方案

做成工具站而非聊天機器人：帳號、每日額度、字數上限、Humanizer 與 Detector 分模組、免費檔當頂部漏斗。檢測器同時是功能與獲客引擎——搜「humanize AI text」「bypass AI detection」的人，會為了看分數而註冊。聯盟計畫把學生、YouTuber 與工具站站長變成銷售團隊：推薦 $50 方案即可月拿 $15，而且只要對方不停訂就一直抽。

## 成功故事與成功之道

公開公司檔沒有官方 MRR（GetLatka 寫「尚無確認營收」）。能核對的是**流量與變現結構**：

- 網域約 2023 年 3 月註冊，產品隨 AI 檢測器浪潮一起長起來。
- 第三方估計（會互相打架，務必當區間而非財報）：HypeStat／SimilarWeb 口徑約 **350 萬月訪**、日訪約 11.6 萬、頁／訪約 4.4、停留約 4 分；Semrush 對 2026 年 7 月估約 **680 萬次造訪**，品牌詞 “stealth writer” 月搜約 2.2 萬且幾乎包辦自然點擊。
- HypeStat 用「假設只靠廣告」估月入約 $4.8 萬——**這不是 SaaS 營收**。真實訂閱收入只可能更高或更低，取決於付費轉換；公司沒有公開這個數字。
- 學院與業界口碑常把它說成「月入六位數美金」級工具站。合理說法是：數百萬高意圖月訪 × $20–$400 訂閱，**具備**六位數美元 MRR 的數學空間，但在創辦人公開財報之前，不應把口碑當成已審計數字。

成功之道很「矽谷不愛講、獨立開發者很愛做」：

1. **賣焦慮的解藥，而不是賣模型。** 使用者不關心你用哪一版 LLM，只關心分數能不能過。
2. **免費額度是廣告，付費額度是產品。** 每天 10 次足夠上癮，不夠應付交稿日。
3. **檢測與改寫成對出現。** 沒有分數，使用者不知道自己買到什麼；沒有改寫，檢測只是嚇自己。
4. **聯盟把獲客變成變現。** 30% 經常性佣金，用分潤換分發。

## 成績

| 指標 | 公開／估計 | 註 |
| --- | --- | --- |
| 官網 | [stealthwriter.ai](https://stealthwriter.ai/) | 產品與定價 |
| 月訪 | 約 350 萬（SimilarWeb／HypeStat）；2026/07 Semrush 約 680 萬造訪 | 第三方，非公司聲明 |
| 定價 | $0 → $20 / $50 / $100 / $400 | 官網 |
| 聯盟 | 30% 經常性 | 官網 |
| 融資 | 未融資（Tracxn／Latka） | 公開檔 |
| 官方 MRR | 未披露 | 不要把廣告估收當成訂閱 |

## 普通人如何複製

可以複製結構，不要複製「幫人規避學術誠信」的灰色行銷：

1. 找一個**檢測／評分關卡**（履歷 ATS、廣告政策、品牌語氣、程式碼風格、翻譯腔）。
2. 做成「輸入 → 改寫／生成 → 打分 → 再跑」的閉環，分數必須可重複。
3. Prompt 要版本化，Humanizer 與 Detector 分開部署，才能 A/B。
4. 免費檔卡在「剛好不夠用」；Stripe 額度與功能開關同一張表。
5. 流量來自搜尋與聯盟，不來自再融一輪。先佔領 2–3 個精準關鍵詞。

合規底線：Tenth Project 鼓勵學的是 **wrapper + 額度 + 支付 + 觀測**，不是教人作弊交作業。把同一架構用在「品牌語氣改寫」「客服草稿人味」「多語言本地化」上，故事一樣成立，風險小得多。

## 創業者與矽谷視角

Y Combinator 會說這是 *hair on fire*：截止日期明天、檢測器今天擋門。這類產品 LTV 可以很高（每周都要交稿），也很容易變成道德與平台政策的地雷。矽谷機構基金較少公開押注「bypass detector」賽道，但獨立創業者靠 SEO 與聯盟，仍然能做出巨大流量機器。

Naval 的說法在這裡適用：具體知識是「知道哪一句會被 GPTZero 打低分，並把它做成可迴圈的產品」，不是「會呼叫一次 API」。護城河極薄——競品上百——所以 StealthWriter 靠品牌詞、習慣與聯盟鎖定。對會員的真正功課：用 21 天做出**能收款的同構產品**（生成 → 處理 → 檢測 → 付費），然後把場景選在你願意長期站台的那一邊。
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
      "imageprompt.org 不是另一個社群牆，而是吃下「image to prompt」搜尋意圖的工具站：圖轉提示詞、提示詞生成、再送到 Flux／Midjourney／SD。月訪落在約 74 萬至 115 萬。",
    summaryEn:
      "imageprompt.org is not another social wall. It owns the “image to prompt” query: reverse-prompt an image, generate a better prompt, send it to Flux / Midjourney / SD. Third-party traffic sits around 740k–1.15M monthly visits.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

[ImagePrompt.org](https://imageprompt.org/) 公開定位是「把想法變成可用的圖像提示詞」。主功能不是論壇，而是三件工具：

1. **Image to Prompt**：上傳一張圖，產出可再生成的文字提示，並支援 General／Flux／Midjourney／Stable Diffusion 格式。
2. **Image Prompt Generator**：即使用戶英文不穩，也能從一句話擴寫成模型吃得下的長提示。
3. **圖像生成**：提示詞可直接在站內出圖（免費用戶每日約 5 次 Prompt Credit、2 次出圖額度；再以上靠升級或點數包）。

創作者用它做的事很具體：看到一張喜歡的海報 → 反推提示詞 → 改幾個詞 → 用 Midjourney 或 Flux 再跑。網站靠的是**搜尋意圖**，不是邀請制社群。

## 痛點

優質提示詞散落在 Discord 截圖、小紅書與付費 prompt book。不會寫英文長描述的人，明明有畫面，卻吐不出模型要的結構（鏡頭、光線、材料、負面提示）。痛點是「我想復刻／微調這張圖，但沒有可搜、可再生成的中間格式」。傳統社群產品先做動態牆，結果沒有 SEO，也沒有每天回來的理由。

## 方案

先做**高意圖工具**，讓 Google 幫你獲客。免費額度夠用來完成一次「圖 → 詞 → 圖」，不夠用來當工作室作業系統——升級或買點數就發生在高潮之後。模型格式（MJ／Flux／SD）降低遷移成本：使用者不必改信仰，只要把提示詞帶走。

## 成功故事與成功之道

公開團隊與 MRR 幾乎空白，成績要看流量結構：

- AI NavHub 等目錄站引用的近期數字：約 **73.9 萬月訪**、跳出約 52%、頁／訪約 2.24、停留約 2 分 34 秒；全球排名約 9.2 萬。
- 流量來源約 **47% 自然搜尋**、35% 直接、14% 推薦、付費搜尋接近 0。這是 SEO 產品，不是廣告產品。
- 頭部分關鍵詞即產品名：\`image to prompt\`（目錄站估該詞可帶數萬點擊）、\`image to prompt generator\`、\`image prompt\`。Semrush 對 2026 年 7 月估約 **115 萬次造訪**（較 6 月 +17%），會話時長約 9 分，直接流量約 52%、Google 約 33%。
- 國家分佈偏美、俄、印等創作與外包市場，符合「提示詞是英文、使用者不一定是母語者」的設定。

成功之道是獨立開發者最穩的一條：

1. **把功能做成關鍵詞。** 域名與 H1 對齊 \`image prompt\`，工具頁對齊 \`image to prompt\`。
2. **中間層比生成層好防守。** OpenAI／Midjourney 會改模型；「圖轉詞」只要模型還要文字提示，就還有需求。
3. **免費完成一次魔法，付費買量。** 與 StealthWriter 同一套額度心理學，只是場景是圖像。
4. **不必先做社群。** UGC 可以後補；沒有可被索引的工具頁，社群只是空城。

## 成績

| 指標 | 數字 | 口徑 |
| --- | --- | --- |
| 官網 | [imageprompt.org](https://imageprompt.org/) | 產品 |
| 月訪 | 約 74 萬（目錄站）至約 115 萬（Semrush 2026/07） | 第三方 |
| 自然搜尋佔比 | 約 47% | AI NavHub |
| 頭詞 | image to prompt | 搜尋意圖 = 產品 |
| 變現 | 每日免費額度 + 升級／點數包 | 官網 FAQ |
| 官方 MRR | 未披露 | — |

沒有公開的訂閱人數或 ARR。以百萬級附近的工具站、點數包與升級頁來推，這是「搜尋現金流」生意，不是 VC 敘事裡的網路效應平台。

## 普通人如何複製

1. 選一個**帶動詞的搜尋詞**（invoice to excel、meeting to tasks、screenshot to ticket），而不是一個空泛品類。
2. 一週內做出能被 Google 索引的工具頁：輸入、輸出、再做一次的按鈕。
3. 免費額度只夠跑通一次；第二次以後進付費。
4. 為每個主流「下游模型／格式」做一個輸出 preset，降低遷移恐懼。
5. 先寫 FAQ 與對照頁做 SEO，再考慮收藏夾、使用者動態與積分。

這比復刻一個社交網路容易一個數量級，也更接近 Vibe Coding 能在 21 天交卷的範圍。

## 創業者與矽谷視角

矽谷平台投資人要的是 UGC 飛輪與防守性網路效應。ImagePrompt.org 走的是 *indie SEO*：Ben Thompson 會把它看成聚合器反面——它聚合的是**提示詞這種中間產物**，上游是大模型，下游是創作者。風險是模型廠商自己做「圖轉提示」並預設進 App（Midjourney、ChatGPT 都有動機）。護城河是關鍵詞排名、使用習慣與多模型格式，不是資料網路效應。

對會員的啟示：海外工具站不一定要講「社群平台」故事。先佔領一個月搜過萬、CPC 還不高的英文動詞詞，用額度變現，活下來再決定要不要做 UGC。
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
      "對照真實公司 HumanAI（usehumanai.com）：一邊賣「會做事的客製 Agent」，一邊用 Hope 把 AI 記憶與真人教練綁在同一週節奏。這是聊天機器人之後的產品形狀。",
    summaryEn:
      "The live counterpart is HumanAI (usehumanai.com): custom agents that execute work, plus Hope — an AI that remembers you, paired with weekly human coaches. That is the shape after chatbots.",
    bodyZh: `${CASE_SEED_MARKER}
## 這間公司做什麼

靈感庫裡的「HumanAIAgent」對應的是已上線公司 **[HumanAI](https://usehumanai.com/)**（田納西 Knoxville），不是再一個空殼域名。它同時走兩條產品線：

1. **B2B：客製 AI Agent 與編排。** 官網服務頁寫明：做會走完多步驟任務的代理（研究、分流客服、執行流程），接上企業現有系統，設好能做／不能做的護欄，並在需要判斷時升級給人。另有多 Agent 協作（官網舉 Notion、Rakuten、Asana 等已在生產環境跑編排的例子——這是行業現況，不是 HumanAI 自稱收購了這些公司）。交付模型是「嵌入式 AI Architect」，用週而不是季度把 Agent 推上線。
2. **B2C：Hope。** 一半是「記得你人生脈絡的 AI 教練」，一半是真人帶的直播訓練與 office hours。官網原話：別人逼你選 App 或選顧問，Hope 兩樣都要。創辦敘事寫著希望服務第一個 1,000 人，鎖定創始價。

把兩條線合在一起看，公司賣的不是「更會聊天」，而是**擬人 + 可執行工具 + 必要時的人類節點**。這與課程裡用 LangChain／OpenAI Tool Calling／MCP 做的「觀察 → 決策 → 呼叫工具 → 再觀察」是同一條架構。

## 痛點

聊天機器人會回答，不會把跨系統的工作做完；傳統顧問 $500／小時，又無法每周跟著你。企業端的痛是：流程散落在 CRM、表格與 inbox，RPA 太脆，員工把時間耗在複製貼上。個人端的痛是：ChatGPT 關分頁就忘了你是誰。HumanAI 把這兩個痛點收成一句話——需要一個**記得脈絡、會呼叫工具、必要時找人簽字**的代理。

## 方案

技術上不再堆更長人設 Prompt，而是先定義 Tool schema：CRM 查詢、寄信、開票、讀 MCP 資源、升級給人類。MCP 的意義是：Agent 讀到真實專案狀態（路線圖、UAT、檔案），而不是憑空猜。Hope 則用「記憶 + 每周真人」做出消費端的擬人：角色穩定、有節奏、有 escalation。B2B 用專案制／嵌入顧問變現，B2C 用訂閱。這比純 wrapper 難做，也更接近企業願意付的帳單。

## 成功故事與成功之道

HumanAI **沒有公開 MRR、估值或訪次**（服務型＋早期消費訂閱通常也不會先披露）。能確認的是品類已經被市場定價：

- 客製 Agent 專案在市場上常見是數萬至數十萬美元的顧問單，外加月管；HumanAI 用「數週上線、不必自建 DevOps」降低企業買單摩擦。
- Hope 走創始會員／終身鎖價，目標先填 1,000 人——這是消費訂閱冷啟動，不是已經公布的百萬用戶。
- 更大的行業背景：Gartner 與各家顧問行把 Agentic AI 寫進 2025–26 預算；MCP 自 2024 年 11 月由 Anthropic 開源後，已成為 Cursor、Claude 與內部 Agent 接工具的預設協定。HumanAI 站在這條曲線上賣「落地」，而不是賣另一個聊天皮。

成功之道（含你自己做 HumanAIAgent 時應抄的部分）：

1. **人設是皮膚，工具是骨骼。** 沒有 schema 的「溫柔語氣」只是 demo。
2. **升級給人不是失敗，是產品。** 法律、付款、例外——Agent 該停的時候停。
3. **記憶要寫進資料庫。** Hope 強調「過了這週還認得你」；企業 Agent 則要記得 ticket 狀態。
4. **先賣一個工作流。** 不要做萬能員工。先做「每周研究 + 寫 briefs」或「inbox 分類 + 起草」。

## 成績

| 指標 | 狀態 | 說明 |
| --- | --- | --- |
| 官網 | [usehumanai.com](https://usehumanai.com/) | Hope + Agent 服務 |
| 公開 MRR／訪次 | 未披露 | 不要編造 |
| 產品形狀 | Agent 專案 + Hope 訂閱 | 雙向變現 |
| 冷啟動目標 | 官網寫第一個 1,000 位 Hope 用戶 | 行銷目標，非已公布實績 |
| 行業對照 | MCP 成事實標準；多 Agent 已在大型 SaaS 生產環境 | 品類風向 |

若你要看「已公開規模」的同類 consumer agent，可以另參 Lindy、Relevance AI 等；本篇堅持只拆與 HumanAIAgent 對得上的真實公司，不把別人的 ARR 安到這個品牌上。

## 普通人如何複製

1. 選一個你自己每周都做的多步驟工作（客戶研究、對帳、內容日曆、UAT 迴歸）。
2. 先寫 5 個以內的工具：讀資料、寫資料、通知、搜尋、升級給人。Schema 比 Prompt 早。
3. 用 MCP 把本地真實狀態接進去（Tenth Project 的路線圖／UAT 就是教材）。
4. 每一步寫 log：誰呼叫、花了多少 token、失敗在哪。沒有觀測就沒有產品。
5. 收費綁「任務完成數」或「每周回顧」，不要綁「無限聊天」。

一個人用 Cursor + MCP 做內部 Agent，已經夠接第一個顧問單；Hope 那種「AI + 真人直播」要社群運營，可以第二階段再加。

## 創業者與矽谷視角

Andreessen Horowitz 把 2025 以後稱為 *agentic* 年：預算從「買 Copilot 席位」轉到「買一個會跑完流程的員工」。矽谷大佬真正打分的是：任務完成率、人工接管率、以及出事時的審計軌跡——不是擬人程度。Garry Tan／YC 會問：這個 Agent 有沒有一個用戶每周離不開的 job？若沒有，它只是套了皮膚的 ChatGPT。

反向警告也成立：示範會騙人，生產會打臉。Tool 一多，模型選錯工具；MCP 一多，上下文被垃圾 schema 淹沒。普通創業者的優勢是**垂直**——先做一個行業的十個工具，而不是做一個通用員工。HumanAI 的「嵌入式架構師 + Hope」其實承認了同一件事：純軟體還不夠，人還要留在迴路裡。這不是退步，這是能開帳單的形狀。
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
];

export function getSeedCaseStudies(): CaseStudy[] {
  const now = new Date().toISOString();
  return CASES.map((c) => ({
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
    cover_image: null,
    author_id: null,
    is_published: true,
    created_at: now,
  }));
}

export const CANONICAL_CASE_SLUGS = CASES.map((c) => c.slug);
export const LEGACY_CASE_SLUG = "solo-founder-built-a-saas-in-48-hours";
