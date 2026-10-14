export type CaseExtra = {
  difficulty: 1 | 2 | 3 | 4 | 5;
  pitchDeckUrl?: string;
  clonePromptZh: string;
  clonePromptEn: string;
};

const ZH_OPEN = `請把這則訊息貼到 Cursor，當作第一句。先進入規劃模式，列出要做的頁面和資料表。我說可以做了，再開始寫程式。如果我已經叫你直接做，就照下面的規格把網站做出來。

請用 Next.js（App Router）在目前這個資料夾裡做一個可以打開的網站。畫面文字用繁體中文。資料存在本機的 SQLite 或一個 JSON 檔，重新整理之後還在。不要先申請一堆雲端帳號才能跑。不要出現任何現成公司的名字、商標或 logo，也不要照抄別人的畫面。

第一版只要一個人能從頭用到尾。做完請在回覆裡寫三件事：本機網址、第一個畫面要點哪裡、怎樣算走完一次。`;

const EN_OPEN = `Paste this into Cursor as the first message. Start in planning mode and list the pages and the data you will save. Write code after I say to build. If I already told you to build, follow the spec below.

Build a site that opens in this folder with Next.js (App Router). Save data locally in SQLite or one JSON file so a refresh does not wipe it. Do not require a pile of cloud accounts before it runs. Do not use any existing company's name, trademark, or logo, and do not copy someone else's screens.

The first version is done when one person can finish the whole path. In your reply, give the local URL, where to click first, and what counts as one complete run.`;

function ask(zh: string, en: string) {
  return { zh: `${ZH_OPEN}\n\n${zh.trim()}`, en: `${EN_OPEN}\n\n${en.trim()}` };
}

const calai = ask(
  `## 要做的東西
一個記飲食的網頁。使用者拍一張食物照片，或掃一個條碼，或打一行字，頁面就告訴他這餐大概多少熱量、蛋白質、碳水和脂肪，以及今天已經吃了多少、離今天的目標還差多少。

不要自己訓練看圖的模型。照片辨識做成一個可以換掉的函式：沒有金鑰時，用一句話說明「這是示範結果」，並讓使用者手改數字；有金鑰時才呼叫現成的辨識服務。

## 頁面
1. 今天：大按鈕「拍一張」「掃條碼」「打一行字」，下面是今天已經記的每一餐，最上面是今天的熱量進度。
2. 記一餐：上傳或輸入之後，先顯示估出來的數字，使用者可以改，按「存進今天」才寫入。
3. 目標：設定每天的熱量目標。預設 2000，可以改。
4. 次數：沒登入也能用。免費每天記 3 餐，第 4 餐出現「今天的免費次數用完了」，並有一個付款按鈕。沒有真實金鑰時，這個按鈕只把狀態改成「已解鎖今天」，並在畫面上寫這是模擬付款。

## 走一次
打開今天 → 打「一碗白飯」→ 看到熱量和三大營養素 → 改一下份量 → 存進今天 → 進度條增加 → 再記三餐直到出現付費提示 → 按模擬付款 → 還能再記一餐。重新整理，今天的紀錄還在。

## 要存的資料
一筆餐點：時間、輸入方式（照片、條碼或文字）、原始文字、熱量、蛋白質、碳水、脂肪、是不是示範數字。另外存每天的目標，以及今天有沒有解鎖。

## 做完的樣子
- 三種輸入都能走到「存進今天」。
- 進度用今天已吃的熱量除以目標。
- 免費次數用完會停，模擬付款之後可以繼續。
- 畫面上沒有任何現成熱量 App 的名字。

## 先不要做
帳號系統、社群、食物資料庫爬蟲、自己的影像模型、真實扣款。`,
  `## What to build
A meal log. The person photographs food, scans a barcode, or types one line. The page shows estimated calories, protein, carbs, and fat, plus how much of today's goal is left.

Do not train a vision model. Put recognition behind a function. With no API key, label the numbers as a demo and let the person edit them. With a key, call an existing recognition service.

## Pages
1. Today: three actions (photo, barcode, one line), the meals already logged, and a calorie progress bar.
2. Log one meal: show the estimate, let them edit, and save only after they confirm.
3. Goal: a daily calorie target, default 2000.
4. Limit: three free meals a day. The fourth shows that the free tries are used up, with a pay button. Without a real key, the button only marks today as unlocked and says the payment is simulated.

## One complete run
Open Today, type "a bowl of rice", see the numbers, edit the portion, save, watch the bar move, hit the limit, simulate payment, and log one more meal. Refresh. The meals are still there.

## Data
Each meal stores time, input type, raw text, calories, protein, carbs, fat, and whether the numbers are a demo. Also store the daily goal and whether today is unlocked.

## Done when
All three inputs can be saved, progress is calories eaten divided by the goal, the free limit stops the fourth meal, simulated payment unlocks more, and no existing calorie app is named.

## Leave out
Accounts, a social feed, a scraped food database, a custom vision model, and real charges.`,
);

const stealth = ask(
  `## 要做的東西
一個改寫自己草稿的網頁。使用者貼上一段讀起來很像機器寫的文字，選一個語氣（白話、正式、短一點），按下去之後，左邊是原文，右邊是改過的版本。底下給一個「讀起來有多像機器」的分數，並用兩三句話指出哪裡太順、太空或太像清單。

這個分數是給作者自己看的，不是用來躲過學校或客戶的檢查。畫面要寫清楚：請只用在你自己的草稿，不要拿去交作業充當自己寫的。

沒有模型金鑰時，用規則做一版能看的改寫（拆開很長的句子、拿掉空話），並標成示範。有金鑰時才呼叫模型。

## 頁面
1. 改寫頁：一個大文字框、語氣三選一、按鈕「改一版」。
2. 結果：左右對照，下面是分數和三個可以再按的調整：「再短一點」「更口語」「保留專有名詞」。
3. 次數：每天免費 3 次。用完顯示付費提示。沒有金鑰就做模擬解鎖，寫明這不是真實扣款。
4. 歷史：這一台瀏覽器最近 10 次改寫，可再打開。

## 走一次
貼上一段很長、很空的說明 → 選「白話」→ 看到左右對照和分數 → 按「再短一點」→ 右邊變短 → 第 4 次出現次數用完 → 模擬解鎖 → 還能再改一次。重新整理，歷史還在。

## 要存的資料
每次改寫：時間、原文、語氣、改寫結果、分數、是不是示範、用了哪一個調整。

## 做完的樣子
- 左右對照一定同時出現。
- 分數有一句人話解釋，不是只有一個數字。
- 免費次數會停。
- 畫面上有「不要用來冒充自己寫的作業」這句話。
- 沒有任何現成改寫網站的名字。

## 先不要做
偵測器排行榜、宣稱能躲過檢查、帳號、多人協作。`,
  `## What to build
A page that rewrites the person's own draft. They paste text that sounds machine-written, pick a tone (plain, formal, shorter), and see the original on the left and the rewrite on the right. Under that, show a "how machine-like this reads" score and two or three sentences on what is too smooth, too empty, or too much like a list.

The score is for the author. It is not a way past a school or client check. The screen says to use it only on their own draft, not to submit it as their own schoolwork.

With no model key, rewrite with simple rules (shorter sentences, drop empty phrases) and label it a demo. With a key, call a model.

## Pages
1. Rewrite: a large box, three tones, and a "rewrite" button.
2. Result: side by side, the score, and three follow-ups: shorter, more spoken, keep proper nouns.
3. Limit: 3 free runs a day, then a pay prompt. Without a key, unlock is simulated and labeled as not a real charge.
4. History: the last 10 rewrites in this browser.

## One complete run
Paste a long empty paragraph, pick plain tone, see both columns and the score, press shorter, hit the limit, simulate unlock, rewrite once more. Refresh. History remains.

## Data
Each run stores time, original, tone, rewrite, score, whether it was a demo, and which follow-up was used.

## Done when
Both columns appear together, the score has a sentence of explanation, the free limit stops, the schoolwork warning is visible, and no existing rewriter is named.

## Leave out
A detector leaderboard, any claim that this beats a check, accounts, and collaboration.`,
);

const imagePrompt = ask(
  `## 要做的東西
一個可以搜尋繪圖提示詞的網站。每一頁是一張範例圖、一段可以直接複製的提示詞、一個複製按鈕，以及這張圖用的風格（例如海報、產品、人像）。使用者用關鍵字找到那一頁，改兩個詞，再複製走。

不要自己做繪圖模型。範例圖用你放在專案裡的幾張圖，或用色塊加標題當佔位，畫面上寫這是示意圖。

## 頁面
1. 首頁：搜尋框，下面是標籤（海報、產品、食物、空間）和最新的 12 張卡。
2. 搜尋結果：關鍵字對得到標題、提示詞或標籤就出現。沒有結果時，給一個「用這句話新開一頁」的按鈕。
3. 單頁：大圖、提示詞、複製按鈕、兩個可改的空格（主體、光線）。改了之後，複製出去的是改過的那一版。
4. 新增：表單有標題、提示詞、標籤、圖片上傳。存進本機，馬上出現在首頁。

先內建 8 筆你自己寫的範例，涵蓋四種標籤。提示詞用中文說明加上一段英文畫面描述，因為很多繪圖工具吃英文。

## 走一次
搜尋「海報」→ 打開一頁 → 把主體改成「紅色跑鞋」→ 按複製 → 看到「已複製」→ 回首頁新增一筆 → 用新標題搜得到。重新整理還在。

## 要存的資料
每一筆：標題、標籤、原始提示詞、圖片路徑、建立時間。使用者改過的主體和光線不用寫回資料庫，只影響這一次複製的文字。

## 做完的樣子
- 搜尋、打開、改詞、複製，四步都通。
- 複製的文字包含改過的主體和光線。
- 自己新增的一筆能被搜到。
- 沒有任何繪圖網站的名字。

## 先不要做
真正出圖、帳號、按讚、付費點數。`,
  `## What to build
A site for searching image prompts. Each page has one example image, a prompt with a copy button, and a style tag such as poster, product, or portrait. Search leads to that page. The person changes two words and copies the result.

Do not build an image model. Use a few images in the project, or a colored block with a title, and label it as a stand-in.

## Pages
1. Home: a search box, tags, and 12 cards.
2. Results: match title, prompt, or tag. If nothing matches, offer a button to start a new page from that phrase.
3. Detail: image, prompt, copy button, and two fields (subject, light). The copied text includes the edits.
4. Add: title, prompt, tag, image upload. It shows on the home page immediately.

Seed 8 examples you write yourself, across four tags. Each prompt has a Chinese note plus an English scene description.

## One complete run
Search "poster", open a page, change the subject to "red running shoe", copy, see "copied", add a new entry, and find it by title. Refresh. It is still there.

## Data
Each entry stores title, tag, original prompt, image path, and time. Edits to subject and light affect only the copied text.

## Done when
Search, open, edit, and copy all work. The copied text includes the edits. A new entry is searchable. No image site is named.

## Leave out
Actual image generation, accounts, likes, and paid credits.`,
);

const humanai = ask(
  `## 要做的東西
一個會把目標拆成步驟的任務頁。使用者交代一個目標，例如「把這週的客戶來信整理成一頁摘要」。頁面列出要做的步驟。做到需要人決定的那一步就停下來，等人點頭才繼續。旁邊一直留著「做了什麼」的紀錄。

不要做成完全不用人看的自動員工。法律、付錢、寄出信件這三類步驟一定要停下來。

沒有模型金鑰時，用你寫死的兩種任務範本把步驟列出來，並標成示範。有金鑰時，才讓模型依目標產生步驟，但該停的地方還是要停。

## 頁面
1. 新任務：一個輸入框和兩個範例按鈕（整理信件、草擬一週摘要）。
2. 任務明細：左邊是步驟，每步有狀態（還沒做、等你點頭、做完）。右邊是紀錄：時間、這一步做了什麼、有沒有等人。
3. 點頭：停下來的那一步有「同意，繼續」和「退回，我來改」。退回時出現一個文字框，把人改的話寫進紀錄。
4. 清單：所有任務，能看出卡在哪一步。

內建這條規則：步驟名稱裡如果有「寄出」「付款」「刪除」，狀態只能先變成「等你點頭」，不能直接做完。

## 走一次
選「整理信件」→ 看到至少 4 個步驟 → 第一步可以按完成 → 走到「寄出前請你看過」就停住 → 按退回並寫一句話 → 紀錄裡看得到這句話 → 再按同意 → 任務變成做完。重新整理，紀錄還在。

## 要存的資料
任務：目標、建立時間、整張狀態。步驟：順序、名稱、狀態、是不是必須等人。紀錄：時間、步驟、動作（完成、同意、退回）、人寫的話。

## 做完的樣子
- 沒有人點頭之前，寄出、付款、刪除不會變成做完。
- 右邊的紀錄跟左邊的步驟對得起來。
- 兩種範例都能走完。
- 畫面上沒有任何助理產品的名字。

## 先不要做
真的寄信、真的扣款、接上一堆公司系統、多個助手互相對話。`,
  `## What to build
A task page that splits a goal into steps. Example goal: "turn this week's client mail into a one-page summary." When a step needs a person, it stops until they approve. A record of what happened stays beside the task.

Do not build an employee that runs with nobody watching. Steps about sending, paying, or deleting always stop.

With no model key, use two task templates you write and label them as demos. With a key, a model may draft the steps, but the same stops still apply.

## Pages
1. New task: one input and two example buttons.
2. Detail: steps on the left with status (not started, waiting for you, done). A log on the right.
3. Approval: "continue" and "send it back". Send-back has a text box whose words are stored in the log.
4. List: every task, showing where it is stuck.

Rule: if a step name contains send, pay, or delete, it can only become "waiting for you", never done on its own.

## One complete run
Pick the mail example, see at least 4 steps, complete the first, stop on the "look before sending" step, send it back with a sentence, see that sentence in the log, then approve, and the task is done. Refresh. The log remains.

## Data
A task stores the goal, time, and status. A step stores order, name, status, and whether a person must approve. A log row stores time, step, action, and the person's note.

## Done when
Send, pay, and delete cannot finish without approval. The log matches the steps. Both examples can be finished. No assistant product is named.

## Leave out
Real email, real charges, a pile of company integrations, and agents talking to each other.`,
);

const toyScout = ask(
  `## 要做的東西
一張大家一起回報的地圖網頁。使用者輸入一個地區或在地圖上點一下，看到附近的點，以及別人剛剛回報的狀況（還有、沒有、不確定）。他到了現場，按一下就回報，其他人立刻看得到時間。

不要接任何官方庫存，也不要做成手機 App。地圖用可以免費顯示的圖磚。點的位置先用你內建的 20 個示範點，使用者也能自己加一個點。

## 頁面
1. 地圖：搜尋地區、三種篩選（還有、沒有、一小時內有人報過）。
2. 點的明細：名稱、最後一次回報、時間、誰報的暱稱。三個按鈕：還有、沒有、不確定。
3. 新增點：名稱、一句說明、在地圖上點選位置。
4. 列表：不用地圖也能看最近 30 筆回報。

## 走一次
打開地圖 → 看到示範點 → 點進一個點 → 按「沒有」→ 時間變成剛剛、狀態變成沒有 → 打開另一個分頁，同一個點也是沒有 → 自己加一個新點 → 對新點按「還有」。重新整理還在。

## 要存的資料
點：名稱、說明、緯度、經度。回報：點的 id、狀態、時間、暱稱。暱稱存在這台瀏覽器，預設「路人」，可以改。

## 做完的樣子
- 回報後 1 秒內，地圖和列表都更新。
- 篩選「一小時內」不會出現舊資料。
- 沒有官方庫存介面，畫面上寫資料是大家回報的。
- 沒有任何連鎖店或玩具品牌的名字。

## 先不要做
登入、推播、路線規劃、爬官方網站。`,
  `## What to build
A map people update together. The person enters an area or taps the map and sees nearby spots plus the latest report: in stock, gone, or unsure. On site, one tap updates the time for everyone else.

Do not connect an official inventory and do not build a mobile app. Use a free map tile. Seed 20 demo spots, and let people add a spot.

## Pages
1. Map: area search and filters for in stock, gone, and reported in the last hour.
2. Spot: name, last report, time, nickname, and three buttons.
3. Add a spot: name, one sentence, click the map to set the location.
4. List: the latest 30 reports without the map.

## One complete run
Open the map, open a spot, mark it gone, see the time change, open a second tab and see the same status, add a new spot, and mark that one in stock. Refresh. It remains.

## Data
A spot stores name, note, latitude, and longitude. A report stores the spot id, status, time, and nickname. The nickname lives in the browser, default "passerby".

## Done when
The map and the list update within a second. The one-hour filter hides old reports. The page says the data is crowd-reported. No chain or toy brand is named.

## Leave out
Login, push notifications, routing, and scraping an official site.`,
);

const clad = ask(
  `## 要做的東西
一個專案工作區網頁，不是一整套程式編輯器。使用者把一個目標拆成幾件要做的事。同一個畫面看得到：這件事的說明、改了哪些檔案的前後對照、一段假的執行紀錄、一個預覽區塊。合併之前要人按「可以合併」。

等待的時候，右側可以放一個「先看這個」的小卡片，內容是你寫死的三則短筆記，不是外嵌短片網站。紀錄跑完，這張卡片收起來，畫面回到對照。

## 頁面
1. 目標清單：每個目標有幾件未完成的事。
2. 工作區：左欄是步驟，中間是檔案前後對照（用你準備的兩段文字），下面是執行紀錄，右邊是等待時才出現的筆記卡。
3. 合併：按鈕在紀錄結束前是灰的。按下去之後，這件事變成「已合併」，清單上打勾。

內建一個示範目標，三件事，其中一件的紀錄會在按下「開始」後逐行出現，大約十秒跑完。用計時器模擬，不要真的去改使用者電腦上的檔案。

## 走一次
打開示範目標 → 按開始 → 看到紀錄一行一行出來，右邊出現筆記卡 → 跑完後卡片收起 → 「可以合併」變亮 → 按下去 → 清單打勾。重新整理，勾還在。

## 要存的資料
目標、事情（標題、狀態、對照的舊文字和新文字、紀錄行、有沒有合併）。

## 做完的樣子
- 沒跑完不能合併。
- 等待時看得到筆記，結束就收起來。
- 沒有真的修改專案檔案。
- 畫面上沒有任何編輯器產品的名字。

## 先不要做
內建瀏覽器影片、終端機真的執行命令、Git 推送、帳號。`,
  `## What to build
A project workspace page, not a full code editor. The person splits a goal into jobs. One screen shows the job, a before-and-after of a file, a fake run log, and a preview. Nothing is marked merged until they press "ok to merge".

While it waits, the right side shows a small "read this" card with three short notes you write. Do not embed a video site. When the log finishes, the card closes and the diff is the focus again.

## Pages
1. Goals: each goal shows how many jobs are open.
2. Workspace: steps on the left, the diff in the middle, the log underneath, the note card only while waiting.
3. Merge: the button stays disabled until the log ends. After the click, the job is merged and checked off.

Seed one goal with three jobs. One job's log appears line by line for about ten seconds after Start. Use a timer. Do not edit files on the person's computer.

## One complete run
Open the sample goal, press start, watch the log and the note card, see the card close, see merge become clickable, merge it, and see the check. Refresh. The check remains.

## Data
Goals and jobs. A job stores title, status, old text, new text, log lines, and whether it was merged.

## Done when
Merge is impossible before the log ends. The note shows only while waiting. No project file is modified. No editor product is named.

## Leave out
Embedded video, a real terminal, git push, and accounts.`,
);

const fambot = ask(
  `## 要做的東西
一個家庭待辦。家長貼上一封學校或社團的信。系統把裡面的活動、作業、繳費和截止日整理成一張張卡片。家長用一句話批准，或按「寫進家庭日曆」，這張卡才出現在日曆上。沒點頭的卡留在「待確認」。

先只做貼上信件。不要接 Gmail、WhatsApp 或其他信箱。

沒有模型金鑰時，用規則抓日期和「請」「截止」「繳費」這類句子，標成示範，並讓家長改卡片上的字。

## 頁面
1. 貼上信件：一個大文字框，按鈕「整理成卡片」。
2. 待確認：每張卡有標題、日期、要做的事、原文裡的那一句。按鈕是「寫進日曆」和「不用了」。
3. 家庭日曆：按日期排好已批准的卡。可以改時間。
4. 兩個大人：畫面上有「爸爸」「媽媽」切換，兩人看到同一份日曆。用本機狀態模擬，不要做真的帳號。

## 走一次
貼上一封含有「下週三校外教學，請帶午餐，星期五前回覆」的信 → 出現至少兩張卡 → 改其中一張的標題 → 只把校外教學寫進日曆 → 切到另一個大人，日曆上有這一張，待確認裡還有另一張。重新整理還在。

## 要存的資料
信件原文、卡片（標題、日期、事項、原文摘句、狀態）、日曆項目（卡片 id、日期、時間、誰批准的）。

## 做完的樣子
- 沒按批准的卡片不會出現在日曆。
- 兩個大人看同一份資料。
- 抓錯的字可以手改。
- 沒有任何家庭 App 的名字。

## 先不要做
真的讀信箱、簡訊、推播、多個小孩的權限。`,
  `## What to build
A family to-do. A parent pastes one school or club email. The page turns events, homework, payments, and deadlines into cards. A card lands on the family calendar only after the parent approves it. Everything else stays under "please check".

Only pasted email. Do not connect Gmail, WhatsApp, or any inbox.

With no model key, pull dates and sentences that contain words like please, deadline, or fee. Label them as a demo and let the parent edit the card.

## Pages
1. Paste: a large box and "turn into cards".
2. Please check: each card has a title, date, action, and the source sentence. Buttons: add to calendar, dismiss.
3. Family calendar: approved cards by date. Time can be edited.
4. Two adults: a switch between two names. Both see the same calendar. Use local state, not real accounts.

## One complete run
Paste a note about a Wednesday trip, packed lunch, and a Friday reply. See at least two cards, edit one title, add only the trip to the calendar, switch adult, and see the trip on the calendar and the other card still waiting. Refresh. It remains.

## Data
The raw email, cards (title, date, action, quote, status), and calendar items (card id, date, time, who approved).

## Done when
Unapproved cards stay off the calendar. Both adults share one set of data. Wrong text can be edited. No family app is named.

## Leave out
A real inbox, SMS, push, and per-child permissions.`,
);

const series = ask(
  `## 要做的東西
一個介紹人認識的網頁。使用者用幾句話寫自己是誰、想認識什麼樣的人。系統從已經加入的人裡找一個也想認識他的人，開一段介紹。兩邊都按「願意認識」之後，才看得到對方留的聯絡方式。任何一邊按「先不要」，聯絡方式都不出現。

不要接真正的手機簡訊。聯絡方式就是使用者自己填的一行字，例如一個電郵。

## 頁面
1. 我的卡片：自我介紹、想認識的人、聯絡方式。聯絡方式預設隱藏。
2. 找一個人：按下去之後出現一位候選人，以及為什麼建議認識（用雙方文字裡重合的詞，沒有就寫「興趣相近」）。
3. 介紹頁：左右是兩個人的公開介紹。兩個按鈕只影響自己這一方。
4. 已認識：只有雙方都願意的才列在這裡，並顯示聯絡方式。

先做 6 個你寫的示範人物，加上使用者自己這一張卡。配對就在這 7 個人裡面找，不要呼叫外部社群。

## 走一次
填好自己的卡 → 找到一個人 → 只按自己願意 → 對方的聯絡方式仍隱藏 → 用畫面上的「模擬對方也願意」按下去 → 聯絡方式出現。重新整理還在。

## 要存的資料
人物：名字、介紹、想認識誰、聯絡方式。介紹：兩個人的 id、各自的決定（未回、願意、先不要）、建立時間。

## 做完的樣子
- 單方願意看不到聯絡方式。
- 雙方願意才出現。
- 先不要之後，這對不會再被配到。
- 沒有任何社交 App 的名字。

## 先不要做
真實簡訊、動態牆、粉絲數、外部登入。`,
  `## What to build
An introduction page. The person writes who they are and who they want to meet. The site picks someone from people already on the site and opens an intro. Contact details appear only after both press "willing to meet". If either presses "not now", the contact stays hidden.

Do not connect real SMS. The contact is one line the person typed, such as an email.

## Pages
1. My card: intro, who they want, contact line. The contact is hidden by default.
2. Find someone: one candidate and a reason, using overlapping words, or "similar interests" if none overlap.
3. Intro: both public intros. Each person only sets their own decision.
4. Met: only mutual yes, with the contact line visible.

Seed 6 people you write, plus the user's card. Match inside those 7. Do not call an outside network.

## One complete run
Fill in the card, find someone, press yes on one side only, confirm the contact is hidden, use "simulate the other person said yes", and see the contact. Refresh. It remains.

## Data
A person stores name, intro, who they want, and contact. An intro stores both ids, each decision (waiting, yes, not now), and time.

## Done when
One yes does not reveal contact. Mutual yes does. "Not now" keeps that pair from matching again. No social app is named.

## Leave out
Real SMS, a feed, follower counts, and outside login.`,
);

const poke = ask(
  `## 要做的東西
一個記在同一條對話裡的助理網頁。使用者用文字交代事情，系統回一段可以直接用的結果，並且記住他上次說過的偏好。例如他說過「回信要短」，下一封草稿就短。

比較進階的工作（一次整理超過三封信、或產生一份下載檔）要先解鎖。沒有金鑰時，進階工作用模擬解鎖，並寫這不是真實扣款。

不要自己訓練模型。沒有金鑰時，用範本回覆，並在回覆開頭寫「這是示範」。

另外做一種主動提醒：如果今天的對話裡有「明天」或一個日期，頁面頂部出現一張卡，「要不要我現在先做成摘要？」使用者可以關掉。

## 頁面
1. 對話：氣泡、輸入框、送出。
2. 偏好：從對話裡抽出的短句，可以刪掉一條。
3. 結果卡：如果回覆是一份草稿或清單，用一張卡裝起來，旁邊有複製按鈕。
4. 解鎖：進階工作被擋住時，說明差在哪裡。

## 走一次
先說「以後回信都要短」→ 偏好裡出現這句 → 再說「幫我草擬一封跟客戶說下週見面的信」→ 草稿很短，而且可以複製 → 再貼三封假信件叫它整理 → 出現解鎖 → 模擬解鎖後看到摘要。重新整理，對話和偏好還在。

## 要存的資料
訊息（角色、內容、時間）、偏好短句、有沒有解鎖進階。

## 做完的樣子
- 第二封草稿看得到上一句偏好。
- 進階工作在解鎖前做不完。
- 日期會觸發那張可關掉的提醒卡。
- 沒有任何聊天產品的名字。

## 先不要做
真的寄信、簡訊、語音、自己的模型。`,
  `## What to build
An assistant in one thread. The person states the job in text. The reply is something they can use, and the page remembers the last preference. If they said "keep replies short", the next draft is short.

Heavier jobs (summarizing more than three notes, or a downloadable file) stay locked. With no key, unlocking is simulated and labeled as not a real charge.

Do not train a model. With no key, reply from templates and start with "this is a demo".

Also show one nudge: if the thread mentions "tomorrow" or a date, a card at the top asks whether to make the summary now. It can be dismissed.

## Pages
1. Thread: bubbles, input, send.
2. Preferences: short lines pulled from the thread, each can be deleted.
3. Result card: drafts and lists get a copy button.
4. Unlock: when a heavy job is blocked, say why.

## One complete run
Say replies should be short, see that preference, ask for a client meeting draft, copy a short draft, paste three fake emails, hit the lock, simulate unlock, and see the summary. Refresh. The thread and the preference remain.

## Data
Messages (role, text, time), preference lines, and whether heavy jobs are unlocked.

## Done when
The second draft follows the saved preference. A heavy job cannot finish before unlock. A date shows a dismissible card. No chat product is named.

## Leave out
Real email, SMS, voice, and a custom model.`,
);

const raven = ask(
  `## 要做的東西
一個「這張照片大概在哪個城市」的網頁，給旅行和猜圖用。使用者上傳一張沒有定位的照片。頁面回三個可能的城市，每個城市寫一句理由（例如路牌文字、植物、建築），並寫有多確定。使用者可以點「猜對了」或「不是」。

不要做人臉，不要辨識人是誰，也不要追蹤某個人。如果照片裡看得到人，畫面只說「這張圖不分析人」。

沒有辨識金鑰時，讓使用者改從三張你準備的示範圖裡選一張，結果用你寫好的理由。不要假裝已經看懂一張任意照片。

## 頁面
1. 上傳：拖放照片，或改選示範圖。
2. 結果：三個城市、理由、確定程度。按鈕是猜對了、不是。
3. 紀錄：過去的猜測對不對，用在頁面底部的「最近十次對了幾次」。

## 走一次
選一張示範圖 → 看到三個城市和理由 → 按猜對了 → 底部次數加一 → 再上傳一張自己的照片 → 如果沒有金鑰，看到說明並回到示範圖，而不是亂猜一個城市。

## 要存的資料
一次猜測：時間、用的是示範圖還是自己的照片、三個城市、使用者的回饋。不要存人臉特徵。

## 做完的樣子
- 沒有金鑰時不會對任意照片亂給城市。
- 畫面上寫不做臉、不追人。
- 對錯次數重新整理還在。
- 沒有任何地理情報產品的名字。

## 先不要做
人臉、即時定位別人、地圖追蹤、執法或調查功能。`,
  `## What to build
A page that guesses which city a photo might be from, for travel and a guessing game. The person uploads a photo with no GPS. The page returns three possible cities, one reason each (a sign, plants, or a building), and how sure it is. They can mark it right or wrong.

Do not detect faces, identify people, or track a person. If people are visible, say the photo will not be read for people.

With no recognition key, the person picks one of three sample photos you include, and the reasons are ones you wrote. Do not pretend to understand an arbitrary photo.

## Pages
1. Upload: drop a photo, or pick a sample.
2. Result: three cities, reasons, confidence, and right or wrong.
3. Record: "how many of the last ten were marked right".

## One complete run
Pick a sample, see three cities and reasons, mark it right, see the count increase, then upload a personal photo. With no key, the page explains and returns to the samples instead of inventing a city.

## Data
Each guess stores time, whether it was a sample, the three cities, and the person's feedback. Do not store face data.

## Done when
An arbitrary photo is not given a made-up city without a key. The page says it does not read faces or track people. The score survives refresh. No geolocation product is named.

## Leave out
Faces, live tracking, map trails, and anything for investigations.`,
);

const thetawave = ask(
  `## 要做的東西
一個讀書頁。使用者上傳一份講義（純文字或 PDF 的文字），頁面抽出幾個重點，做成字卡，再出一組小測驗。答錯的留在錯題本，下次打開先看到錯的那些。

不要做整間學校的系統。先打通一份文件變成十張字卡、五題測驗。

沒有模型金鑰時，用段落的前幾句當重點，題目用「這句在講什麼」加上你從句子裡挖空的一個詞，並標成示範。

## 頁面
1. 上傳：貼上文字或上傳檔案，按鈕「做成字卡」。
2. 字卡：一張一張翻，正面是問題，背面是重點。可以標「我懂了」或「還不熟」。
3. 測驗：五題，選完才顯示對錯。
4. 錯題本：只列上次答錯或標成還不熟的卡，有一個「再考這些」的按鈕。

## 走一次
貼上大約 400 字的說明 → 得到 10 張卡 → 把 3 張標成還不熟 → 做完五題並故意答錯一題 → 錯題本裡看得到那題和那 3 張卡 → 按再考這些，只出現這些。重新整理還在。

## 要存的資料
文件、字卡（正面、背面、熟不熟）、作答（題目、選擇、對錯、時間）。

## 做完的樣子
- 一份文件會產生字卡和測驗，不是只做摘要。
- 錯題和下次出現的題是同一批。
- 沒有任何教育 App 的名字。

## 先不要做
班級、老師後台、影片課、排行榜。`,
  `## What to build
A study page. The person uploads notes as text or the text of a PDF. The page pulls out points, turns them into cards, and gives a short quiz. Missed questions stay in a review pile and show up first next time.

Do not build a school system. One document becomes ten cards and five questions.

With no model key, use the first sentences of paragraphs as points, and make a fill-in-the-blank from a word in the sentence. Label it a demo.

## Pages
1. Upload: paste or upload, then "make cards".
2. Cards: question on the front, point on the back. Mark "I know it" or "still rusty".
3. Quiz: five questions. Right or wrong shows after they answer.
4. Review: only missed or rusty cards, with "quiz these again".

## One complete run
Paste about 400 words, get 10 cards, mark 3 as rusty, miss one quiz question on purpose, see that question and those cards in review, and start a quiz that contains only those. Refresh. It remains.

## Data
A document, cards (front, back, mastery), and answers (question, choice, correct or not, time).

## Done when
One document produces cards and a quiz, not only a summary. The next quiz matches the review pile. No study app is named.

## Leave out
Classes, a teacher console, video lessons, and a leaderboard.`,
);

const wokHei = ask(
  `## 要做的東西
一個家庭菜單網頁。僱主用中文點一道家常菜。步驟會換成另一種語言（先做英文），並標出不能吃的東西（豬肉、酒、牛肉、辣）。一週的菜單可以複製成一段文字，貼到訊息裡傳出去。

先做 20 道家常菜，每道都有中文步驟和英文步驟。不要做外送，也不要做真的翻譯介面以外的語言，除非你把那 20 道的譯文一起寫好。

## 頁面
1. 點菜：搜尋菜名，篩選「不要豬肉」「不要酒」「不要辣」。
2. 一道菜：左邊是僱主看的中文，右邊是幫忙的人看的英文。禁忌用醒目的字標在最上面。
3. 這一週：早、午、晚可以各放一道菜。按鈕「複製這週的菜單」。
4. 角色：切換「我是僱主」和「我是幫忙的人」。同一個菜單，看到的語言不同。

## 走一次
篩掉豬肉 → 點一道菜 → 看到雙語步驟和禁忌 → 放進星期三晚餐 → 複製文字 → 貼到記事本看得到菜名和禁忌 → 切換角色，步驟語言換邊。重新整理，這週的菜單還在。

## 要存的資料
菜：中文名、英文名、中文步驟、英文步驟、禁忌標籤。一週菜單：星期、哪一餐、菜的 id。

## 做完的樣子
- 篩選之後不會出現含有那個禁忌的菜。
- 複製出去的文字含菜名、餐次和禁忌。
- 兩種角色看到的語言不同。
- 沒有任何現成食譜 App 的名字。

## 先不要做
外送、付款、帳號、自動翻譯沒有人對過的菜。`,
  `## What to build
A home-menu page. An employer picks a home dish in Chinese. The steps appear in a second language (English for the first version), with foods to avoid marked (pork, alcohol, beef, chili). A week of menus can be copied as text and sent in a message.

Write 20 dishes yourself, each with Chinese steps and English steps. Do not build delivery. Do not add another language unless you also write those 20 translations.

## Pages
1. Pick a dish: search, and filters for no pork, no alcohol, no chili.
2. One dish: Chinese on one side, English on the other. Restrictions sit at the top.
3. This week: breakfast, lunch, and dinner. A button copies the week as text.
4. Role: switch between employer and helper. Same menu, different language.

## One complete run
Filter out pork, open a dish, see both languages and the warning, place it on Wednesday dinner, copy the text, and see the dish, the meal, and the warning. Switch role and the languages swap. Refresh. The week remains.

## Data
A dish stores both names, both step lists, and restriction tags. A slot stores weekday, meal, and dish id.

## Done when
A filter hides dishes with that restriction. The copied text includes the dish, the meal, and the warning. The two roles see different languages. No recipe app is named.

## Leave out
Delivery, payments, accounts, and machine translations nobody has checked.`,
);

const hideOrDie = ask(
  `## 要做的東西
一局在瀏覽器裡玩的躲貓貓。進來之後隨機當躲的人或抓的人。一局 90 秒，先做單人對電腦，不要做連線。地圖是一個畫面，裡面有幾面牆。躲的人按方向鍵移動，可以靜止。抓的人速度比較快，視野是一個圓，圓外是暗的。

時間到，躲的人還沒被碰到就算躲的人贏。被碰到就算抓的人贏。結束可以再來一局。畫布要能在手機上玩：點螢幕左側是左移，右側是右移，中間是停。電腦用方向鍵。

## 頁面
1. 開始：說明兩句規則，按鈕「開始這一局」。
2. 對局：上方是角色、剩餘秒數。畫布裡是人和牆。
3. 結束：誰贏、用了幾秒、按鈕「再來一局」。

電腦對手寫簡單的就好。抓的人往躲的人的方向走，碰到牆就轉彎。躲的人如果是玩家，就用鍵盤。玩家如果抽到抓的人，電腦就負責躲，而且會偶爾停住。

## 走一次
開始 → 看到自己的角色和 90 秒 → 移動並碰到對方，或等到時間結束 → 看到勝敗 → 再來一局，角色有機會換成另一種。

## 要存的資料
最近 10 局：角色、勝敗、秒數。存在本機。

## 做完的樣子
- 規則不用另開說明頁也能看懂。
- 時間到和被碰到都會結束，不會卡住。
- 再來一局不會殘留上一局的位置。
- 畫面上沒有任何遊戲平台的名字。

## 先不要做
連線對戰、商城、帳號、立體畫面。`,
  `## What to build
A hide-and-seek round in the browser. The person is randomly the hider or the seeker. One round is 90 seconds, single player against the computer. No networking. The map is one screen with a few walls. The hider moves with the arrow keys and can stand still. The seeker is faster and sees only a circle of light.

If time runs out before a touch, the hider wins. A touch means the seeker wins. They can play again. On a phone, the left side of the canvas moves left, the right side moves right, and the middle stops. On a computer, use the arrow keys.

## Pages
1. Start: two sentences of rules and a start button.
2. Match: role, seconds left, and a canvas with people and walls.
3. End: who won, how many seconds, and play again.

Keep the computer simple. A seeker walks toward the hider and turns at a wall. If the person is the seeker, the computer hides and sometimes stops.

## One complete run
Start, see the role and 90 seconds, either touch the other player or let time run out, see the result, and play again. The role can change.

## Data
The last 10 rounds: role, result, seconds. Store them locally.

## Done when
The rules fit on the start screen. Both a timeout and a touch end the round. A new round does not keep the old positions. No game platform is named.

## Leave out
Online matches, a shop, accounts, and 3D.`,
);

const nasCom = ask(
  `## 要做的東西
一個拍照開店的網頁。使用者上傳一張產品照片，寫一句這是什麼。頁面生成一個可以分享的商品頁：標題、三段介紹、價錢、一個收款按鈕。

沒有模型金鑰時，標題和介紹用「一句話加上固定的三段式」做出來，並標成示範，使用者可以每一段都改。

收款：沒有金鑰時，按鈕寫「模擬已付款」，按下去之後訂單變成已付款，畫面上寫這不是真實扣款。不要做全球物流。

## 頁面
1. 新商品：照片、一句話、價錢。按鈕「生成商品頁」。
2. 編輯：三段介紹都可以改，改完按儲存。
3. 對外頁：乾淨的一頁，只有照片、標題、介紹、價錢和付款。網址可以用商品 id。
4. 訂單：這一台瀏覽器裡的已付款和未付款。

## 走一次
上傳一張圖，寫「手工杯子，適合當禮物」→ 看到三段介紹 → 改第二段 → 打開對外頁，第二段是改過的 → 按模擬付款 → 訂單列表出現這一筆。重新整理還在。

## 要存的資料
商品：照片、原句、標題、三段介紹、價錢。訂單：商品 id、時間、狀態。

## 做完的樣子
- 對外頁不出現編輯按鈕。
- 沒付款之前訂單不是已付款。
- 介紹可以手改，分享出去的是改過的版本。
- 沒有任何開店平台的名字。

## 先不要做
物流、廣告投放、會員社群、真實金流。`,
  `## What to build
A page that turns one product photo into a store page. The person uploads a photo and writes one sentence about it. The site makes a shareable page: title, three short paragraphs, a price, and a pay button.

With no model key, build the title and paragraphs from that sentence plus a fixed three-part pattern. Label it a demo. Every paragraph can be edited.

Payment: with no key, the button says "simulate paid". The order becomes paid and the screen says this is not a real charge. Do not build shipping.

## Pages
1. New product: photo, one sentence, price, and generate.
2. Edit: all three paragraphs, then save.
3. Public page: photo, title, copy, price, and pay. No editor on this page. The URL uses the product id.
4. Orders: paid and unpaid in this browser.

## One complete run
Upload a photo, write "handmade cup, good as a gift", see three paragraphs, edit the second, open the public page and see the edit, simulate payment, and see the order. Refresh. It remains.

## Data
A product stores the photo, original sentence, title, three paragraphs, and price. An order stores product id, time, and status.

## Done when
The public page has no edit button. An order is not paid before the click. The shared page shows the edited text. No store platform is named.

## Leave out
Shipping, ads, a community, and real charges.`,
);

const gojiberry = ask(
  `## 要做的東西
一個幫人起草第一封信的頁面，不是自動發信的機器。使用者貼上自己的網站說明，寫他想找什麼樣的人。他再貼上一份名單（每一行一個人：名字、公司、一句最近發生的事）。頁面為每個人寫一封不超過 80 字的第一封信，信裡要用到那句最近發生的事。

發送前必須人自己按「複製這封信」。不要做寄出按鈕，不要連接信箱，不要自己上網抓人。

## 頁面
1. 我是誰：網站說明、想找的人。存起來，下次還在。
2. 名單：一個大文字框，貼上多行。按鈕「寫第一封信」。
3. 草稿：每個人一張卡，左邊是那句近況，右邊是信。可以改。按鈕只有「複製」。
4. 已複製：複製過的卡打一個勾，避免忘記哪幾封看過。

沒有模型金鑰時，用固定句型把名字、近況和「我想找的人」嵌進去，並標成示範。

## 走一次
填好自己的說明 → 貼上 5 行名單 → 看到 5 封信，每封都含那一行的近況 → 改其中一封 → 複製 → 那張卡打勾 → 重新整理，勾還在，而且沒有任何信被寄出。

## 要存的資料
自己的說明、每一行名單、草稿、有沒有複製過。

## 做完的樣子
- 畫面上沒有寄出。
- 信裡看得到那個人的近況，不是同一封群發。
- 沒有任何業務工具的名字。

## 先不要做
自動發信、爬個人頁、購買名單、追蹤開信。`,
  `## What to build
A page that drafts the first note. It does not send anything. The person pastes a description of their site and who they want. They also paste a list, one person per line: name, company, and one recent event. The page writes a note under 80 words for each person, and the note must use that event.

The only action is "copy this note". Do not add a send button, do not connect an inbox, and do not fetch people from the web.

## Pages
1. About me: the site description and who they want. It persists.
2. List: a large box and "write the first notes".
3. Drafts: one card each, the event on the left, the note on the right, editable, with copy only.
4. Copied: a check on cards they copied.

With no model key, use a fixed sentence that includes the name, the event, and who they want. Label it a demo.

## One complete run
Save the description, paste 5 lines, see 5 notes that each mention that line's event, edit one, copy it, see the check, and refresh. The check remains. Nothing was sent.

## Data
The description, each list row, the draft, and whether it was copied.

## Done when
There is no send action. Each note mentions that person's event. No sales tool is named.

## Leave out
Auto-send, scraping profiles, buying lists, and open tracking.`,
);

const wayback = ask(
  `## 要做的東西
一個盯網頁有沒有改過的工具。使用者貼上一個網址，頁面抓一次現在的文字，存下來。之後他再按「再抓一次」，頁面並排顯示上次和這次，並標出多出來或不見的句子。他可以盯住某一個網址，對方的文字一變，清單上就出現「有改動」。

不要試圖把整個網路存下來。每個網址只留最近 5 次。抓取失敗時，寫清楚失敗原因，不要假裝有舊版。

如果瀏覽器直接抓那個網址會被擋住，就做一個「貼上頁面文字」的備援，讓使用者手動貼上這一版，仍然可以跟上一版比較。

## 頁面
1. 新增：網址輸入框，按鈕「存下這一版」。
2. 清單：每個網址的最後檢查時間、有沒有改動。
3. 比較：左舊右新，不同的句子用底色標起來。可以在 5 個版本之間選。

## 走一次
存下一個你抓得到的網址，或貼上一段文字 → 清單出現它 → 再貼上一版少了一句的文字 → 比較頁把那一句標出來 → 清單變成有改動。重新整理還在。

## 要存的資料
網址、每次的文字、時間、是抓來的還是貼上的。

## 做完的樣子
- 兩次文字不同就標有改動，相同就標沒改。
- 抓失敗不會覆蓋上一版。
- 沒有任何存檔網站的名字。

## 先不要做
全網爬蟲、帳號、電子郵件通知。頁面上的「有改動」就夠了。`,
  `## What to build
A page that watches whether a URL's text changed. The person pastes a URL. The site fetches the text once and stores it. When they fetch again, it shows the previous and current text side by side and marks sentences that appeared or disappeared. A watched URL shows "changed" on the list when the text differs.

Do not store the whole web. Keep the latest 5 copies of each URL. If a fetch fails, show the reason and do not pretend an older copy exists.

If the browser cannot fetch that URL, offer "paste the page text" so they can still compare with the previous copy.

## Pages
1. Add: a URL box and "save this version".
2. List: last check time and whether it changed.
3. Compare: old on the left, new on the right, different sentences highlighted. They can pick among the 5 versions.

## One complete run
Save a URL you can fetch, or paste a paragraph. See it on the list. Paste a second version with one sentence removed. The compare page highlights that sentence and the list says changed. Refresh. It remains.

## Data
The URL, each text copy, the time, and whether it was fetched or pasted.

## Done when
Different text is marked changed, identical text is marked unchanged, a failed fetch does not overwrite the last good copy, and no archive site is named.

## Leave out
A whole-web crawler, accounts, and email alerts. The on-page "changed" mark is enough.`,
);

const today = ask(
  `## 要做的東西
一個「今天」的清單。使用者用一句話交代今天要做的事，例如「早上跑步，下午讀書，晚上整理行李」。頁面把這句話拆成幾件有時段的事。行程被打亂時，他只要對每一件按確認或移到明天，不用自己重排一大排選項。

先只做這一種：一句話變成今天的清單，打亂之後把沒做完的移到明天早上。不要做成什麼都能排的助理，也不要接真的日曆或信箱。

沒有模型金鑰時，用逗號、頓號和「早上、下午、晚上」這些詞來拆句，並標成示範。使用者可以改每一件的文字。

## 頁面
1. 今天：最上面是那句話和按鈕「排成今天」。下面是三個時段，每件事有「做完」「移到明天早上」。
2. 被打亂：一個按鈕「今天下午臨時有事」。按下之後，下午和晚上還沒做完的事變成待確認。
3. 待確認：每一件只有「留在今天」或「移到明天早上」。
4. 明天早上：被移走的事集中在這裡，明天可以一鍵變成新的今天。

## 走一次
輸入那句含早上、下午、晚上的話 → 三個時段都有事 → 把跑步按做完 → 按今天下午臨時有事 → 讀書和整理行李進入待確認，跑步不會 → 把讀書移到明天早上 → 明天早上看得到，今天下午沒有它。重新整理還在。

## 要存的資料
一件事：文字、時段、狀態（待做、做完、待確認、在明天）、原來的那句話、日期。

## 做完的樣子
- 一句話至少拆出兩件事。
- 做完的事不會被丟進待確認。
- 移到明天之後，今天的時段裡不再出現。
- 沒有任何日程 App 的名字。

## 先不要做
日曆連線、信箱、語音、多天以後的複雜重複行程。`,
  `## What to build
A today list. The person states the day in one sentence, for example a morning run, afternoon reading, and packing at night. The page splits that sentence into timed items. When the day breaks, they confirm or move each item to tomorrow morning. They do not rebuild the whole plan by hand.

Only this: one sentence becomes today's list, and unfinished items can move to tomorrow morning. Do not build an assistant that plans everything. Do not connect a real calendar or inbox.

With no model key, split on commas and on the words morning, afternoon, and evening. Label it a demo. Each item can be edited.

## Pages
1. Today: the sentence, "plan today", three parts of the day, and done or move-to-tomorrow on each item.
2. Disruption: a button "this afternoon changed". Unfinished afternoon and evening items become "please confirm".
3. Please confirm: each item is only "keep today" or "tomorrow morning".
4. Tomorrow morning: moved items live here and can become the new today.

## One complete run
Enter the sentence, see all three parts of the day, mark the run done, press the disruption button, see reading and packing waiting and the run left alone, move reading to tomorrow morning, and confirm it left today. Refresh. It remains.

## Data
Each item stores text, part of day, status (todo, done, confirm, tomorrow), the original sentence, and the date.

## Done when
One sentence becomes at least two items. Done items are not sent to confirm. A moved item disappears from today. No calendar app is named.

## Leave out
Calendar sync, mail, voice, and complex repeating schedules.`,
);

const plaid = ask(
  `## 要做的東西
一個「連接帳戶」的示範頁，用假資料。使用者在你的示範商店裡按「連接帳戶」，選一家假機構，輸入任意文字當帳號，看到餘額和最近三筆交易。做這個小工具的人還有一個「開發者」頁，可以複製一段假的回傳資料，確認自己的畫面接得通。

不要連接真正的銀行，不要保存真的網銀密碼。輸入框的標籤寫「示範帳號」，送出後只存「已連接這家機構」，不存那串文字。

## 頁面
1. 商店示範：一個餘額位置，開始是「尚未連接」。按鈕「連接帳戶」。
2. 選擇機構：三家你取的假名，例如城市信用、北區儲蓄、港口金庫。不要用真的銀行名字。
3. 登入：一個文字框。按鈕「用示範帳號連接」。
4. 結果：餘額和三筆交易從你寫好的假資料來，每家機構的數字不同。
5. 開發者：顯示剛剛那次回傳的 JSON，有複製按鈕。另有一個「斷開」讓商店回到尚未連接。

## 走一次
在商店按連接 → 選一家 → 輸入任意文字 → 看到該家的餘額 → 打開開發者頁，JSON 裡有機構名稱和三筆交易，沒有剛剛輸入的文字 → 斷開 → 商店回到尚未連接。

## 要存的資料
目前連的是哪一家、連接時間。假交易寫在程式裡，不要當成使用者的秘密存起來。

## 做完的樣子
- 三家機構的數字不一樣。
- 開發者頁的 JSON 對得上畫面上的餘額。
- 輸入的文字不會出現在 JSON 或資料庫。
- 沒有任何支付或銀行產品的名字。

## 先不要做
真的銀行、密碼、轉帳、身分證件。`,
  `## What to build
A connect-account demo with fake data. In a sample shop, the person presses "connect account", picks a fake institution, types anything as the account, and sees a balance and three transactions. A developer page shows the fake payload so a builder can confirm the screen is wired up.

Do not connect a real bank and do not store a banking password. Label the field "demo account". After submit, store only which institution was connected, not the typed text.

## Pages
1. Shop: a balance that starts as "not connected", and a connect button.
2. Picker: three invented names. Do not use real bank names.
3. Sign-in: one text field and "connect with demo account".
4. Result: balance and three transactions from data you wrote. Each institution is different.
5. Developer: the JSON from that connection, a copy button, and disconnect.

## One complete run
Connect from the shop, pick one institution, type anything, see that institution's balance, open the developer page, and confirm the JSON has the institution and three transactions but not the typed text. Disconnect. The shop returns to not connected.

## Data
Which institution is connected, and when. Fake transactions live in code, not as the person's secrets.

## Done when
The three institutions show different numbers. The JSON matches the balance on screen. The typed text is absent from the JSON and the database. No payment or bank product is named.

## Leave out
Real banks, passwords, transfers, and identity documents.`,
);

const ash = ask(
  `## 要做的東西
一個可以談心情的網頁。打開第一頁就用白話寫清楚：這不是醫生，不能代替看診，如果人有危險，請打電話給當地的緊急服務或找身邊的人。

他說完之後，先回問一句，不要立刻丟三個步驟。如果他說到想傷害自己或活不下去，就停下來，不再追問細節，畫面上只留求救說明和一個「我已經去找人」的按鈕。

介紹頁只寫「這是一個可以說話的地方」，不要寫治療、診療或療程。

沒有模型金鑰時，用你寫的問句回應，並標成示範。問句要接得上他上一句的一個詞。

## 頁面
1. 開始之前：那段說明，必須按「我知道了」才進得去。
2. 對話：他一句、你一句問句。不要出現建議清單，除非他按了「我想聽一個很小的下一步」。
3. 停下來：一旦出現那些危險說法，對話輸入框消失，只留求救說明。
4. 紀錄：只存在這台瀏覽器，有一個「清除這些對話」的按鈕。

## 走一次
讀完說明並確認 → 說「今天開會很悶」→ 回覆是一個問題，不是三個步驟 → 再按那個很小的下一步，才出現一句建議 → 另開一次，輸入想傷害自己 → 輸入框消失，看得到求救說明。清除之後，那些話不在了。

## 要存的資料
有沒有按過我知道了、每一句對話、有沒有觸發停下來。

## 做完的樣子
- 沒按我知道了不能聊天。
- 一般對話先問一句。
- 危險說法會停，而且不能再繼續問。
- 沒有任何醫療或心理產品的名字，也沒有治療這兩個字。

## 先不要做
預約醫師、病歷、診斷、把對話送到別處。`,
  `## What to build
A page where someone can talk about how they feel. The first screen says, in plain language, that this is not a doctor, it does not replace a visit, and if someone is in danger they should call local emergency services or reach a person nearby.

After they speak, ask one question. Do not hand them three steps. If they talk about hurting themselves or not wanting to live, stop. Do not ask for details. Leave only the help text and a button "I have gone to find someone".

The intro says "a place you can talk". Do not say therapy, treatment, or clinical care.

With no model key, reply with questions you wrote, labeled as a demo. The question should pick up one word from their last sentence.

## Pages
1. Before: the notice. They must press "I understand" to continue.
2. Talk: one turn each. No advice list unless they press "I want one small next step".
3. Stop: those danger phrases remove the input and leave the help text.
4. Record: stored only in this browser, with "delete these conversations".

## One complete run
Confirm the notice, say the meeting felt heavy, receive a question rather than three steps, press the small-next-step button and only then see one suggestion. In another session, type about hurting themselves and see the input disappear. Delete. The words are gone.

## Data
Whether they confirmed, each turn, and whether a stop was triggered.

## Done when
Chat is blocked before confirmation. Ordinary turns ask one question. Danger words stop the conversation. No medical product is named, and the word therapy does not appear.

## Leave out
Booking a clinician, medical records, a diagnosis, and sending the conversation elsewhere.`,
);

const astrotalk = ask(
  `## 要做的東西
一個預約短諮詢的頁面。不要做占星。找一種你自己定的服務，例如「看房前問 10 分鐘」或「履歷問 10 分鐘」。使用者先看一份有評價的名單，選一個人，付一節很短的錢，再用文字問一個問題。問完之後，頁面上出現一件跟剛才有關、可以再看的資料，例如一份清單，不是強制購買。

沒有金鑰時，付款按鈕是「模擬已付這一節」，並寫明不是真實扣款。

## 頁面
1. 名單：至少 6 位你寫的人。每位有名字、專長、一句介紹、星等、評價則數、這一節的價錢。
2. 一個人：評價三則、按鈕「問一個問題」。
3. 提問：付款（或模擬付款）之後才出現文字框。送出後，對方的回覆用你寫的範本，要提到問題裡的一個詞。
4. 問完：回覆下面有一張相關資料卡，可以打開或關掉。

## 走一次
打開名單 → 用專長篩一次 → 進一個人的頁 → 沒付款前看不到文字框 → 模擬付款 → 問一個含有明確名詞的問題 → 回覆裡有那個詞 → 看得到相關資料卡。重新整理，這次回覆還在。

## 要存的資料
人物和評價寫在程式裡。提問：人物 id、問題、回覆、有沒有付款、時間。

## 做完的樣子
- 沒付款不能送出問題。
- 回覆不是所有人同一段，至少要帶上問題裡的詞。
- 相關資料可以不打開，不影響已經收到的回覆。
- 沒有占星、塔羅或任何現成諮詢品牌的名字。

## 先不要做
視訊、抽成後台、真的收款、匿名以外的個資。`,
  `## What to build
A booking page for a short consult. Do not build astrology. Pick a service you name yourself, such as "10 minutes before a house viewing" or "10 minutes on a resume". The person sees a list with reviews, picks someone, pays for one short session, and asks in text. After the answer, one related item appears, such as a checklist. It is not a forced purchase.

With no key, the button says "simulate payment for this session" and states it is not a real charge.

## Pages
1. List: at least 6 people you write. Each has a name, skill, one-line intro, stars, review count, and price.
2. Profile: three reviews and "ask one question".
3. Ask: the text box appears only after payment. The reply uses a template you wrote and must mention one word from the question.
4. After: a related card under the reply that can be opened or dismissed.

## One complete run
Open the list, filter by skill, open a person, confirm the box is hidden before payment, simulate payment, ask a question that contains a clear noun, see that noun in the reply, and see the related card. Refresh. The reply remains.

## Data
People and reviews live in code. A question stores person id, text, reply, whether it was paid, and time.

## Done when
A question cannot be sent before payment. Replies are not one identical paragraph. The related card can be ignored. No astrology, tarot, or consult brand is named.

## Leave out
Video, a commission console, real charges, and personal data beyond a display name.`,
);

const river = ask(
  `## 要做的東西
一個上傳文件、讓第二次回答變準的頁面。使用者貼上一份自己的短合約或說明。他問一個問題。頁面先給一個沒看文件的回答，再給一個有看文件的回答，兩個都留在畫面上。第二次要引用文件裡的一個詞，並標出摘自哪一句。

沒有模型金鑰時，第一次用一句固定的「我還沒看文件」。第二次用文件裡真的有的句子來回答，如果問題裡的詞不在文件裡，就寫「文件裡沒有這件事」，不要編。

使用者可以按「留下這一版」。留下的回答存在他的瀏覽器，畫面上寫這一版留在這台電腦，沒有上傳到別處。

## 頁面
1. 文件：一個大文字框，至少要 200 字才能問。下面顯示字數。
2. 問答：一個問題，按鈕「比較兩次回答」。
3. 結果：上下兩張卡，第一次、第二次。第二次有摘句。
4. 留下的版本：列出這台瀏覽器存過的問題和第二次回答。

## 走一次
貼上一份超過 200 字、裡面有「違約金」的文字 → 問「違約金怎麼算」→ 看到兩張卡，第二張出現違約金和摘句 → 再問一個文件裡沒有的詞 → 第二張寫沒有這件事 → 按下留下這一版 → 重新整理還在。

## 要存的資料
文件文字、問題、第一次回答、第二次回答、摘句、時間。

## 做完的樣子
- 兩次回答同時看得到。
- 文件裡沒有的事不會被編成有。
- 不到 200 字不能問。
- 沒有任何模型公司的名字。

## 先不要做
自己買機器訓練、多檔案知識庫、權限、把文件傳去別的服務。沒有金鑰就全程留在本機。`,
  `## What to build
A page where a person pastes one short contract and asks a question twice. The first answer does not use the document. The second answer does, and both stay on screen. The second answer quotes one word from the document and shows the sentence it came from.

With no model key, the first answer is a fixed "I have not read the document". The second answer uses a sentence that is really in the text. If the question's word is absent, say the document does not mention it. Do not invent it.

They can press "keep this version". It stays in the browser, and the screen says it stays on this computer.

## Pages
1. Document: a large box. Questions unlock at 200 characters, with a counter.
2. Ask: one question and "compare the two answers".
3. Result: two cards. The second has a quote.
4. Kept versions: questions and second answers stored in this browser.

## One complete run
Paste 200+ words that include a late fee, ask how the late fee works, see both cards and a quote, ask about a word that is not in the document, see "not in the document", keep the version, and refresh.

## Data
The document, question, both answers, the quote, and time.

## Done when
Both answers are visible together. Missing facts are not invented. Under 200 characters cannot ask. No model company is named.

## Leave out
Training machines, a multi-file library, permissions, and uploading the document anywhere. With no key, everything stays local.`,
);

const fish = ask(
  `## 要做的東西
一個用自己的聲音念句子的頁面。使用者先勾「這是我自己的聲音，我同意只用在這個示範」。沒勾不能上傳。他上傳一小段錄音，或用瀏覽器錄 5 秒，打一段字，再選一句語氣：「這句輕一點」或「這句慢一點」。頁面播放念出來的聲音。

不要做一排專業滑桿。語氣只有這兩句人話。

瀏覽器如果不能真的模仿聲音，就用系統語音先念出來，並在畫面上寫「現在是系統語音，不是你上傳的聲音」。預留一個函式，之後有語音金鑰才改成用他的聲音。不要把錄音傳到別的地方，除非使用自己填了金鑰。

## 頁面
1. 同意：那個勾選，沒勾之前上傳按鈕是灰的。
2. 聲音：上傳或錄 5 秒，可以重錄。顯示長度。
3. 念出來：文字框、兩種語氣、播放。
4. 剛剛念的：最近 5 次文字和語氣，按下去可再播放。

## 走一次
不勾選時按不到上傳 → 勾選並錄 5 秒 → 輸入一句話 → 選輕一點 → 聽得到聲音，而且畫面上看得到目前是系統語音還是上傳的聲音 → 再選慢一點，速度或語氣有差。重新整理，同意狀態還在，錄音還在這台電腦。

## 要存的資料
有沒有同意、錄音存在瀏覽器本機、每次文字、語氣、時間。

## 做完的樣子
- 沒同意不能錄音。
- 兩種語氣聽得出差別，或畫面上寫明示範語音做不到哪一種。
- 沒有金鑰就不會把聲音傳走。
- 沒有任何語音產品的名字。

## 先不要做
用別人的聲音、聲音市集、即時電話、一排滑桿。`,
  `## What to build
A page that speaks a sentence. The person must check "this is my own voice, and I agree to use it only in this demo" before upload. They upload a short clip or record 5 seconds in the browser, type a line, and pick one spoken direction: "softer" or "slower". The page plays the line.

Do not build a row of expert sliders. Only those two directions.

If the browser cannot mimic a voice, speak with the system voice and say "this is the system voice, not your recording". Leave one function that uses their voice only after they add a voice key. Do not upload the recording unless they added a key.

## Pages
1. Consent: the checkbox. Upload stays disabled until it is checked.
2. Voice: upload or record 5 seconds, with length and a redo.
3. Speak: text, two directions, play.
4. Recent: the last 5 lines and directions, playable again.

## One complete run
Confirm upload is disabled before consent, consent and record 5 seconds, type a line, choose softer, hear audio, and see whether it is the system voice or the recording. Choose slower and hear or read a difference. Refresh. Consent and the recording remain on this computer.

## Data
Consent, the recording in browser storage, each line, direction, and time.

## Done when
Recording is impossible before consent. The two directions differ, or the page says which one the demo voice cannot do. With no key, audio is not uploaded. No voice product is named.

## Leave out
Someone else's voice, a voice marketplace, live calls, and a row of sliders.`,
);

const tripo = ask(
  `## 要做的東西
一個能轉、能下載的立體預覽頁。使用者打一句話，或上傳一張照片。頁面上出現一個可以滑鼠拖著轉的模型，並且能下載。

第一版不要假裝已經從一句話生成真正的模型。請內建兩個簡單模型（一雙鞋的方塊組合、一個角色的方塊組合），依關鍵字決定顯示哪一個。照片上傳後顯示在旁邊，模型仍用這兩個之一，畫面上寫「這是可替換的佔位模型，之後可接上生成服務」。

下載的檔案要是一個真的能用文字打開的 OBJ，裡面有你寫的頂點，不是空檔。

## 頁面
1. 輸入：一句話或一張照片。按鈕「給我一個可以轉的模型」。
2. 預覽：畫布可以拖著轉，下面有重置角度。
3. 下載：下載 OBJ。旁邊寫這個檔案可以放進一般的設計軟體。
4. 最近：這台瀏覽器做過的 5 次，含那句話和用了哪一個模型。

關鍵字：句裡有鞋、靴、鞋字就用鞋子。其他用角色。

## 走一次
輸入「紅色跑鞋」→ 看到鞋子佔位而且轉得動 → 下載 OBJ → 用文字編輯器打開看得到頂點 → 再輸入「一個站著的人」→ 換成角色 → 上傳一張照片，照片出現，模型仍是佔位並有說明。

## 要存的資料
那句話、有沒有照片、用了哪一個模型、時間。

## 做完的樣子
- 模型真的轉得動。
- 下載的 OBJ 不是空的。
- 畫面上沒有假裝這是生成出來的精細模型。
- 沒有任何 3D 產品的名字。

## 先不要做
自己的生成模型、材質商城、帳號、自動上傳到別的服務。`,
  `## What to build
A page with a model the person can turn and download. They type a sentence or upload a photo. A model appears, draggable with the mouse, and they can download it.

Do not pretend the first version generates a real model from a sentence. Include two simple block models, a shoe and a character, and pick from keywords. If they upload a photo, show it beside the model. Keep the block model and say "this is a stand-in you can replace when a generation service is connected".

The download is a real OBJ that opens as text and contains vertices you wrote. Not an empty file.

## Pages
1. Input: a sentence or a photo, and "give me a model I can turn".
2. Preview: a canvas that rotates, plus reset.
3. Download: an OBJ, with a note that it opens in ordinary design software.
4. Recent: the last 5 runs in this browser, with the sentence and which model was used.

Keywords: shoe or boot selects the shoe. Anything else selects the character.

## One complete run
Type "red running shoe", see the shoe stand-in rotate, download the OBJ, open it in a text editor and see vertices, type "a standing person" and see the character, then upload a photo and see the photo plus the stand-in label.

## Data
The sentence, whether there was a photo, which model, and time.

## Done when
The model actually rotates. The OBJ is not empty. The page does not claim it is a finished generated model. No 3D product is named.

## Leave out
A custom generator, a material store, accounts, and uploading to another service.`,
);

const peec = ask(
  `## 要做的東西
一份每週品牌報告。使用者輸入自己的品牌名稱，並貼上十個他在意的問題，例如「哪個工具適合記帳」。每一題他再貼上一段回答文字，或按「用示範回答」。頁面寫出這個品牌這週有沒有被提到、在這段回答裡排第幾，並跟上週比較。

不要保證排名會上升。頁首寫「這是在量有沒有被提到，不是在保證名次」。

計算規則你自己寫死：品牌名稱出現就算提到；名次用它在這段文字裡是第幾個品牌（使用者可以在同一題填對手名稱）。沒有對手就只顯示有或沒有。

## 頁面
1. 設定：品牌名稱、最多三個對手、十個問題。存起來。
2. 這一週：每一題一塊，貼上回答或用示範回答。按鈕「算出這一週」。
3. 報告：十列。每列有問題、有沒有提到、名次、跟上週的差（新出現、消失、名次上升、下降、沒變）。
4. 上週：保留上一份報告，讓比較有東西可看。第一次沒有上週時，寫「還沒有上週」。

## 走一次
設定品牌和兩個對手、十個問題 → 在三題貼上含品牌的文字、兩題只有對手、其餘用示範回答 → 算出報告 → 再改一題把品牌刪掉 → 按「把這一週存成上週」再算一次 → 那一題顯示消失。重新整理還在。

## 要存的資料
設定、每一週的十段回答、算出來的有沒有提到和名次、週次。

## 做完的樣子
- 十題都有結果，缺回答的題顯示「這一題還沒貼」。
- 跟上週的比較用詞是人話，不是只有箭頭。
- 沒有任何監測產品的名字，也沒有「保證排名」的句子。

## 先不要做
真的去查聊天機器人、自動每週寄信、多品牌代操後台。`,
  `## What to build
A weekly brand report. The person enters a brand name and ten questions they care about. For each question they paste an answer, or press "use a sample answer". The page says whether the brand was mentioned this week, where it ranked in that answer, and how that compares with last week.

Do not promise a better rank. The top of the page says this measures whether the brand was mentioned, and does not promise a position.

Rules: the brand counts as mentioned if the name appears. Rank is which brand name appears first among the brand and up to three rivals they typed. With no rivals, only show mentioned or not.

## Pages
1. Setup: brand, up to three rivals, ten questions.
2. This week: one block per question, paste or sample, then "calculate this week".
3. Report: ten rows with the question, mentioned or not, rank, and the change from last week in words (new, gone, up, down, same).
4. Last week: keep the previous report. The first time, say there is no last week yet.

## One complete run
Save a brand, two rivals, and ten questions. Paste the brand into three answers, only a rival into two, and use samples for the rest. Calculate. Remove the brand from one answer, store this week as last week, calculate again, and see that row marked gone. Refresh. It remains.

## Data
The setup, each week's ten answers, the calculated mention and rank, and the week id.

## Done when
All ten rows have a result, empty ones say the answer is missing, the comparison uses words, and no monitoring product or rank promise appears.

## Leave out
Live queries to chat products, automatic weekly email, and a multi-brand agency console.`,
);

const grasp = ask(
  `## 要做的東西
一個研究頁。使用者輸入一個題目，例如「比較三間咖啡店的價位」。按下去就下載兩份檔案：一份試算表、一份可以當簡報用的文件。不要做一個聊天窗。不要叫他把數字複製到別的地方。

試算表用 CSV，打開看得到欄位。簡報用一份列印友善的 HTML，或一份真的能下載的檔，每一頁投影片是一個區塊：標題、三個重點、一張小表。

沒有模型金鑰時，用題目產生固定結構：三列比較、欄位是項目、價錢、一句備註。數字如果題目裡沒有，就留空給他填，不要編造看起來像真的營收。

## 頁面
1. 題目：一個輸入框、一個「比較幾項」的數字（2 到 5）、按鈕「做出檔案」。
2. 預覽：先在網頁上看到表格和三頁投影片，確認之後才下載。
3. 填空：空的數字可以直接在預覽裡改，下載的是改過的版本。
4. 最近的題目：這台瀏覽器的 5 次，可再下載。

## 走一次
輸入題目，項數選 3 → 預覽出現三列，價錢是空的 → 填上三個數字 → 下載 CSV，用試算表打開看得到這三個數字 → 下載簡報，三頁都有標題。重新整理，這次還能再下載。

## 要存的資料
題目、項數、每一列的項目、價錢、備註、時間。

## 做完的樣子
- 沒有聊天框。
- 下載的檔案含他填的數字。
- 沒有在題目之外編造金額。
- 沒有任何顧問或試算表產品的名字。

## 先不要做
登入、協作、自動上網抓財報。`,
  `## What to build
A research page. The person enters a question, such as comparing prices at three coffee shops. They download two files: a spreadsheet and a slide document. Do not build a chat window. Do not make them copy numbers somewhere else.

The spreadsheet is a CSV with visible columns. The slides are a print-friendly page, or a real download, with one block per slide: a title, three points, and a small table.

With no model key, use a fixed shape from the question: rows of item, price, and a note. If the question has no numbers, leave the prices blank. Do not invent figures that look like real revenue.

## Pages
1. Question: one input, a count from 2 to 5, and "make the files".
2. Preview: the table and three slides on the page before download.
3. Fill-in: empty numbers can be typed in the preview. The download uses the edited numbers.
4. Recent: the last 5 questions in this browser, downloadable again.

## One complete run
Enter a question with count 3, see three rows with empty prices, type three numbers, download the CSV and open it with those numbers, and download the slides with three titles. Refresh. That run can be downloaded again.

## Data
The question, the count, each row's item, price, and note, and the time.

## Done when
There is no chat box. The file contains the numbers they typed. No amounts were invented outside the question. No consulting or spreadsheet product is named.

## Leave out
Login, collaboration, and fetching financial reports from the web.`,
);

const puppy = ask(
  `## 要做的東西
一個預約一堂課的網頁。客人選一個時段，付這一堂的錢，頁面寫清楚到店要做什麼。先不要做 App。先把一間店的時間和安全須知寫清楚。

店的資料你寫在程式裡：店名用你取的名字、地址一行、每週哪些時段有課、每堂價錢、最多幾人、安全須知五條（例如要穿什麼、不能做什麼、遲到怎麼辦）。

沒有金鑰時，付款是「模擬已付這一堂」，寫明不是真實扣款。同一個時段額滿就不能再約。

## 頁面
1. 這一週：列出時段、剩下幾個名額、價錢。
2. 預約：名字、電話或電郵、這一堂在做什麼、安全須知必須勾選。
3. 完成：預約編號、時間、到店要做的第一件事。
4. 店家看的名單：同一個瀏覽器裡可以切換「我是客人」和「我是店家」。店家看到每一堂的名單，可以將一人標成已到。

## 走一次
選一個還有名額的時段 → 沒勾安全須知不能送出 → 勾了並模擬付款 → 看到編號和到店的第一件事 → 切到店家，名單裡有這個人 → 再約到滿 → 這個時段不能再選。重新整理，名額還是滿的。

## 要存的資料
時段（時間、人數上限、價錢）、預約（名字、聯絡方式、時段 id、有沒有付款、有沒有到）。

## 做完的樣子
- 沒勾須知、沒付款，都不會占掉名額。
- 額滿的時段不能再約。
- 客人看得到到店要做什麼。
- 沒有任何連鎖店或課程平台的名字。

## 先不要做
多間分店、App、會員點數、真的收款。`,
  `## What to build
A page for booking one class. The guest picks a time, pays for that class, and the page says what to do when they arrive. Do not build an app. Write the hours and the safety notes for one location.

Put the shop in code: a name you invent, one address line, weekly times, price, capacity, and five safety lines (what to wear, what not to do, what happens if they are late).

With no key, payment is "simulate paid for this class" and is labeled as not a real charge. A full time cannot be booked again.

## Pages
1. This week: times, seats left, and price.
2. Book: name, phone or email, what this class is, and a required safety checkbox.
3. Done: a booking number, the time, and the first thing to do on arrival.
4. Shop list: a switch between guest and shop in the same browser. The shop sees each class list and can mark a person arrived.

## One complete run
Pick an open time, confirm submit is blocked before the safety check, check it and simulate payment, see the number and the arrival step, switch to the shop and see the name, then book until full and confirm that time cannot be picked. Refresh. It stays full.

## Data
A slot stores time, capacity, and price. A booking stores name, contact, slot id, paid or not, and arrived or not.

## Done when
Unchecked safety or missing payment does not take a seat. A full slot cannot be booked. The guest sees what to do on arrival. No chain or class platform is named.

## Leave out
Multiple locations, an app, points, and real charges.`,
);

const rillet = ask(
  `## 要做的東西
一個對帳頁。每一筆交易進來，先建議一個分類。人只看那些對不上的，點頭之後才算入帳。頁面列出這個月還沒收完的項目。

不要一開始就做整套會計系統。先做一種每個月都要重做的帳：銀行匯入的支出。使用者貼上 CSV，或用你內建的 15 筆示範交易。欄位至少有日期、說明、金額。

分類規則寫死幾條：說明裡有「房租」就建議租金，有「雲端」或「主機」就建議軟體，其他標成「請你看」。請你看的不能自動入帳。

## 頁面
1. 匯入：貼上 CSV 或載入示範。顯示這一期有幾筆。
2. 待看：只列出「請你看」和金額特別大（你定一個門檻，例如絕對值超過 5000）的筆。每一筆可以改分類，再按「入帳」。
3. 已入帳：這個月已經點頭的。可以退回待看。
4. 這個月：三個數字，已入帳總額、還有幾筆沒收完、每個分類的小計。

## 走一次
載入 15 筆示範，其中至少 4 筆是請你看 → 待看裡沒有那些已經能對上規則的日常小額 → 把一筆請你看改成餐飲並入帳 → 這個月的餐飲小計改變，沒收完的筆數少 1 → 退回一筆，筆數加回來。重新整理還在。

## 要存的資料
交易：日期、說明、金額、建議分類、目前分類、狀態（待看或已入帳）。

## 做完的樣子
- 對得上規則的小額不會擋住人。
- 沒點頭的不會算進已入帳總額。
- 退回之後總額會減掉。
- 沒有任何會計軟體的名字。

## 先不要做
總帳、稅務申報、多公司、銀行連線、自動付款。`,
  `## What to build
A bookkeeping page. Each transaction arrives with a suggested category. The person reviews only the ones that do not match, and it counts only after they approve. The page lists what is still open this month.

Do not build a full accounting system. Do one monthly job: imported expenses. The person pastes a CSV or loads 15 sample transactions you write. Columns are at least date, description, and amount.

Write a few rules. If the description contains rent, suggest rent. If it contains cloud or hosting, suggest software. Everything else is "please look". Those cannot post on their own.

## Pages
1. Import: paste a CSV or load the sample. Show how many rows are in this period.
2. Please look: only unmatched rows and amounts over a threshold you choose, such as 5000 in absolute value. They can change the category and press post.
3. Posted: approved rows for this month, with a way to send one back.
4. This month: posted total, how many are still open, and a subtotal per category.

## One complete run
Load the 15 samples, with at least 4 that need a look. Confirm ordinary small matches are not in the review list. Change one to meals and post it. The meals subtotal changes and the open count drops by one. Send it back and the count returns. Refresh. It remains.

## Data
Each transaction stores date, description, amount, suggested category, current category, and status (review or posted).

## Done when
Small rule-matched rows do not block the person. Unapproved rows are outside the posted total. Sending one back reduces the total. No accounting product is named.

## Leave out
A general ledger, tax filing, multiple companies, a bank connection, and automatic payment.`,
);

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
