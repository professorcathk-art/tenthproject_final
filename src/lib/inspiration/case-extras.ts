export type CaseExtra = {
  difficulty: 1 | 2 | 3 | 4 | 5;
  pitchDeckUrl?: string;
  clonePromptZh: string;
  clonePromptEn: string;
};

function ask(zh: string, en: string) {
  return { zh: zh.trim(), en: en.trim() };
}

const calai = ask(
  `幫我做一個記飲食的網頁。不要用別人的品牌名字。

使用者拍一張食物的照片，或掃條碼，或打一行字。頁面告訴他這餐大概多少熱量，以及今天已經吃了多少、離目標還差多少。免費可以記幾餐，之後要付費才能繼續。不要自己訓練一個看圖的模型，用現成的辨識服務就好。`,
  `Build a meal-log page. Do not use anyone else's brand name.

A person photographs food, scans a barcode, or types one line. The page shows the calories in that meal, how much they have eaten today, and how far they are from the goal. A few meals are free. After that, they pay to keep logging. Use an existing recognition service. Do not train a vision model.`,
);

const stealth = ask(
  `幫我做一個改寫文章的網頁。不要用別人的品牌名字。

使用者貼上一段讀起來很像機器寫的文字，選一個語氣。按下去之後，旁邊出現改過的版本。免費有次數，用完就要付費。不要宣稱改完就一定能躲過所有偵測。`,
  `Build a rewrite page. Do not use anyone else's brand name.

A person pastes a draft that sounds machine-written and picks a tone. The rewritten version appears beside it. Free tries run out, then they pay. Do not claim the rewrite beats every detector.`,
);

const imagePrompt = ask(
  `幫我做一個可以搜尋繪圖提示詞的網站。不要用別人的品牌名字。

每一頁放一張範例圖、一段可以直接複製的提示詞，和一個複製按鈕。使用者用關鍵字找到那一頁。不要自己做繪圖模型。`,
  `Build a site for searching image prompts. Do not use anyone else's brand name.

Each page has one example image, a prompt people can copy, and a copy button. Search leads to that page. Do not build an image model.`,
);

const humanai = ask(
  `幫我做一個任務頁。不要用別人的品牌名字。

使用者交代一個目標，頁面列出要做的步驟。做到需要人決定的地方就停下來，等人點頭才繼續。旁邊留一份做了什麼的紀錄。不要做成完全不用人看的自動員工。`,
  `Build a task page. Do not use anyone else's brand name.

A person states a goal, and the page lists the steps. When a decision needs a person, it stops until they approve. A record of what happened stays beside the task. Do not build an employee that runs with nobody watching.`,
);

const toyScout = ask(
  `幫我做一張地圖網頁。不要用別人的品牌名字。

使用者輸入地區，看到附近的點，以及別人剛剛回報的狀況。他到了現場，按一下就回報還有或沒有，其他人立刻看得到時間。不要接官方庫存，也不要做手機 App。`,
  `Build a map page. Do not use anyone else's brand name.

A person enters an area and sees nearby spots plus the latest report. On site, one tap says it is there or gone, and others see the time. Do not connect an official inventory, and do not build an app.`,
);

const clad = ask(
  `幫我做一個專案工作區。不要用別人的品牌名字。

使用者把一個目標拆成幾件要做的事，在同一個畫面看到改了哪些程式、終端機和預覽。合併之前要人點頭。不要複製一整套程式編輯器。`,
  `Build a project workspace. Do not use anyone else's brand name.

A person splits a goal into a few jobs and sees the code changes, the terminal, and a preview on one screen. A person approves before anything is merged. Do not clone a full code editor.`,
);

const fambot = ask(
  `幫我做一個家庭待辦。不要用別人的品牌名字。

先接一個信箱。系統把活動、作業和預約整理成一張張卡片。家長用一句話批准，才寫進日曆。先做「一封信變成一張卡片，家長點頭才寫進去」，不要一次接很多通訊軟體。`,
  `Build a family to-do page. Do not use anyone else's brand name.

Connect one inbox. Turn events, homework, and appointments into cards. A parent approves in one sentence before anything is written to the calendar. Ship “one email becomes one card, and a parent approves it.” Do not connect every messenger at once.`,
);

const series = ask(
  `幫我做一個介紹人的網頁。不要用別人的品牌名字。

使用者說他想認識什麼樣的人。系統找到一個也願意見面的人，開一段介紹對話。兩邊都點頭，才看得到聯絡方式。不要先接真正的手機簡訊。`,
  `Build an introduction page. Do not use anyone else's brand name.

A person says who they want to meet. The page finds someone who also wants to meet, and opens an intro. Contact details appear only after both agree. Do not start on real SMS.`,
);

const poke = ask(
  `幫我做一個聊天頁。不要用別人的品牌名字。

使用者在同一個對話裡交代事情，系統回一段能用的結果，並且記住他上次的偏好。比較進階的工作才要付費。不要自己訓練模型。`,
  `Build a chat page. Do not use anyone else's brand name.

A person gives the job in one thread. The reply is something they can use, and the page remembers the last preference. Advanced jobs are paid. Do not train a model.`,
);

const raven = ask(
  `幫我做一個上傳照片的網頁。不要用別人的品牌名字。

照片沒有定位。系統看建築、植物和路牌，回幾個可能的地點，並寫出它有多確定。免費可以試幾次。不要做人臉辨識。先做到一張圖對到一個城市。`,
  `Build a photo upload page. Do not use anyone else's brand name.

The photo has no GPS. The page reads buildings, plants, and signs, returns a few possible places, and says how sure it is. A few tries are free. Do not identify faces. Start with one photo and one city.`,
);

const thetawave = ask(
  `幫我做一個讀書頁。不要用別人的品牌名字。

使用者上傳一份講義。頁面抽出幾個重點，做成字卡，再出一組小測驗。答錯的留在錯題本，下次再看。不要做整間學校的系統。先打通一份文件變成十張字卡。`,
  `Build a study page. Do not use anyone else's brand name.

A person uploads notes. The page pulls out a few points, turns them into cards, and gives a short quiz. Missed questions stay for the next visit. Do not build a school system. Start with one document and ten cards.`,
);

const wokHei = ask(
  `幫我做一個家庭菜單。不要用別人的品牌名字。

僱主用中文點一道家常菜。步驟會變成外傭看得懂的語言，並標出不能吃的東西。一週的菜單可以傳出去。先做五十道最常煮的菜，不要做外送。`,
  `Build a home-menu page. Do not use anyone else's brand name.

An employer picks a home dish in Chinese. The steps appear in the helper’s language, with foods to avoid marked. A week of menus can be sent out. Start with the fifty most-cooked dishes. Do not build delivery.`,
);

const hideOrDie = ask(
  `幫我做一局躲貓貓的配對頁。不要用別人的品牌名字。

進去之後隨機當躲的人或抓的人，玩五到八分鐘，結束可以再來一局。不要自己做全球伺服器。先把這一局的規則做清楚。`,
  `Build a hide-and-seek match page. Do not use anyone else's brand name.

A person is randomly the hider or the seeker, plays for five to eight minutes, and can queue again. Do not build global servers. Make the rules of one round clear.`,
);

const nasCom = ask(
  `幫我做一個開店頁。不要用別人的品牌名字。

使用者拍一張產品照片。頁面生成一段介紹，底下有一個可以收款的連結。不要一次做全球物流。先做到一張照片變成一頁能收錢的頁面。`,
  `Build a store page. Do not use anyone else's brand name.

A person photographs a product. The page writes a short description and puts a payment link under it. Do not build global logistics. Start with one photo and one page that can take money.`,
);

const gojiberry = ask(
  `幫我做一個找客戶的頁面。不要用別人的品牌名字。

使用者貼上自己的網站，說明想找什麼樣的人。頁面列出大約二十個最近有動作的人，並寫好第一封簡訊。發送前要人自己按下去。不要自動亂發。`,
  `Build a prospecting page. Do not use anyone else's brand name.

A person pastes their site and says who they want. The page lists about twenty people who did something recently, and drafts the first note. A person presses send. Do not send automatically.`,
);

const wayback = ask(
  `幫我做一個看舊網頁的工具。不要用別人的品牌名字。

使用者貼上一個網址，就能看到這個頁面以前長什麼樣子。他可以盯住對手的定價頁，對方一改，就收到通知。不要試圖把整個網路都存下來。`,
  `Build a page for old versions of a website. Do not use anyone else's brand name.

A person pastes a URL and sees how that page used to look. They can watch a competitor’s pricing page and get a notice when it changes. Do not try to store the whole web.`,
);

const today = ask(
  `幫我做一個今天的清單。不要用別人的品牌名字。

使用者用一句話交代今天要做的事。行程被打亂時，他只要確認或拒絕，剩下的事就移到明天早上。先只做一件他自己每天會做的事，例如健身或讀書。不要做成什麼都能排的助理。`,
  `Build a today list. Do not use anyone else's brand name.

A person states today’s plan in one sentence. When the day breaks, they confirm or reject, and the rest moves to tomorrow morning. Start with one daily habit, such as workouts or reading. Do not build an assistant that plans everything.`,
);

const plaid = ask(
  `幫我做一個「連接帳戶」的示範頁。不要用別人的品牌名字。

使用者點一下，選一家機構，登入，然後看到接上之後的結果。給做 App 的人一組假資料，讓他先試通。不要連接真正的銀行，也不要保存別人的網銀密碼。先做一種大家都在抱怨的接法，例如租約或貨況。`,
  `Build a connect-account demo. Do not use anyone else's brand name.

A person taps once, picks an institution, signs in, and sees the result. Give the app builder fake data so they can test the connection. Do not connect real banks or store banking passwords. Start with one messy handoff, such as a lease or a shipment.`,
);

const ash = ask(
  `幫我做一個可以談心情的網頁。不要用別人的品牌名字。

打開第一頁就寫清楚：這不是醫生，也不能在對方很危險的時候代替打電話求救。他說完之後，先回問一句，不要立刻丟三個步驟。如果他說到想傷害自己，就停下來，請他去找真人。介紹頁只寫「這是一個可以說話的伴」，不要寫治療。`,
  `Build a page where someone can talk about how they feel. Do not use anyone else's brand name.

The first screen says, in plain language, that this is not a doctor and cannot call for help when someone is in danger. After they speak, ask one question. Do not hand them three steps. If they talk about hurting themselves, stop and tell them to reach a person. The store page says it is a companion you can talk to. Do not call it therapy.`,
);

const astrotalk = ask(
  `幫我做一個預約諮詢的頁面。不要用別人的品牌名字。

使用者先看一份有評價的名單，選一個人，付一分鐘的錢，再用文字問一個問題。問完之後，頁面上出現一件跟剛才有關、可以再買的東西。不要先做占星。找一種線下很分散、人們願意為了擔心而付錢的服務，把第一次開口變得不難。`,
  `Build a booking page for a short consult. Do not use anyone else's brand name.

A person sees a list with reviews, picks someone, pays for one minute, and asks in text. Afterward, one related item appears that they can buy. Do not start with astrology. Pick a scattered offline service people already pay for when they are worried, and make the first question easy.`,
);

const river = ask(
  `幫我做一個上傳文件的頁面。不要用別人的品牌名字。

使用者交一份自己的合約。同一個問題問兩次，第二次的回答要比第一次準，而且兩次都顯示在畫面上。調好的那一份留在他手上。不要自己買機器訓練模型，用現成的服務就好。`,
  `Build a document upload page. Do not use anyone else's brand name.

A person submits one of their own contracts. The same question is asked twice, the second answer is better, and both answers stay on screen. The tuned copy stays with them. Do not buy machines to train a model. Use an existing service.`,
);

const fish = ask(
  `幫我做一個聲音頁。不要用別人的品牌名字。

使用者上傳一小段自己的聲音，打一段字，再說「這句輕一點」。頁面就用那個聲音念出來。不要做一排專業滑桿。語氣用一句人話控制。`,
  `Build a voice page. Do not use anyone else's brand name.

A person uploads a short clip of their own voice, types a line, and says “softer.” The page speaks in that voice. Do not build a row of expert sliders. Control the tone with one sentence.`,
);

const tripo = ask(
  `幫我做一個立體模型頁。不要用別人的品牌名字。

使用者打一句話，或上傳一張照片。頁面上出現一個可以轉的模型，並且能下載。下載的檔案要能放進一般的設計軟體裡打開。先只做一種東西，例如一雙鞋或一個角色，而且要改得動，不用整份重畫。`,
  `Build a 3D model page. Do not use anyone else's brand name.

A person types a sentence or uploads a photo. A model they can turn appears, and they can download it. The file must open in ordinary design software. Start with one object, such as a shoe or a character, and make sure it can be edited without redrawing the whole thing.`,
);

const peec = ask(
  `幫我做一份每週報告。不要用別人的品牌名字。

使用者輸入自己的品牌。頁面列出十個常見問題，寫出這個品牌這週有沒有被提到、排在第幾，並跟上週比較。不要保證排名會上升。先把「這週有沒有出現」量出來。`,
  `Build a weekly report. Do not use anyone else's brand name.

A person enters their brand. The page lists ten common questions, says whether the brand was mentioned this week, where it ranked, and how that compares with last week. Do not promise a better rank. First measure whether it appeared.`,
);

const grasp = ask(
  `幫我做一個研究頁。不要用別人的品牌名字。

使用者輸入一個題目，按下去就下載一份試算表和一份簡報，不用再複製貼上。不要做一個聊天窗。先把一種表做準，直接交出那個檔案。`,
  `Build a research page. Do not use anyone else's brand name.

A person enters a question and downloads a spreadsheet and a slide deck, without copying and pasting. Do not build a chat window. Make one spreadsheet accurate and hand over that file.`,
);

const puppy = ask(
  `幫我做一個預約頁。不要用別人的品牌名字。

客人選一個時段，付這一堂課的錢。頁面寫清楚到店要做什麼。先不要做 App。把第一間店的時間和安全寫清楚，等有人會再付一次，再做別的。`,
  `Build a booking page. Do not use anyone else's brand name.

A guest picks a time and pays for that class. The page says what happens when they arrive. Do not build an app yet. Write down the hours and the safety of the first location. Add more after someone pays a second time.`,
);

const rillet = ask(
  `幫我做一個對帳頁。不要用別人的品牌名字。

每一筆交易進來，先建議一個分類。人只看那些對不上的，點頭之後才入帳。頁面列出這個月還沒收完的項目。不要一開始就說要換掉整套會計系統。先把一種每個月都要重做的帳，做成一份人可以核對的草稿。`,
  `Build a bookkeeping page. Do not use anyone else's brand name.

Each transaction arrives with a suggested category. A person reviews only the ones that do not match, and it posts after they approve. The page lists what is still open this month. Do not open by replacing the whole accounting system. Turn one monthly entry into a draft a person can check.`,
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
