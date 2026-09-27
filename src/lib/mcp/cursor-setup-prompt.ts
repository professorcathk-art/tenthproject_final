import { SHIPPING_RULES } from "@/lib/mcp/shipping";

export function generateCursorSetupPrompt(
  apiKey: string,
  options: { mcpUrl: string; projectName: string; tool?: string },
) {
  const projectName = options.projectName.replace(/[`\r\n]/g, " ").trim() || "這個專案";
  const config = JSON.stringify(
    {
      mcpServers: {
        tenthproject: {
          url: options.mcpUrl,
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      },
    },
    null,
    2,
  );
  const cursor = options.tool === "cursor";
  const steps = cursor
    ? `1. 在目前這個資料夾的根目錄建立 \`.cursor/mcp.json\`。內容必須正好是下面這段 JSON，不要改網址，也不要把網址包成連結。
2. 檢查 \`.gitignore\`。若沒有 \`.cursor/mcp.json\` 這一行，請加上，避免金鑰被推上 GitHub。已經有這一行就不要重複加。`
    : `1. 用你這個 AI 工具自己的 MCP 或自訂連線設定，填入下面 JSON 裡的網址和 Authorization 標頭。不要改網址，也不要把網址包成連結。
2. 若這份設定會寫進專案檔案，請把那個檔案加進 \`.gitignore\`，避免金鑰被推上 GitHub。`;
  const remind = cursor
    ? `檔案寫好之後，用白話提醒我還要自己做完這些事，不要替我按：
- 完全關閉並重新打開 Cursor。
- 打開 Cursor 的 Settings，進到 MCP，找到 tenthproject，把開關打開一次。貼上檔案不會自動打開這個開關。
- 若開關下面出現連線錯誤，按 Reload。開關維持打開即可，不用反覆關掉又打開。`
    : `檔案寫好之後，用白話提醒我還要自己做完這些事：完全關閉並重新打開這個 AI 工具，然後在它的 MCP 或外掛設定裡啟用 tenthproject。貼上設定不會自動啟用。`;

  return `請幫我把 Tenth Project 的 MCP 接到目前這個資料夾。這把金鑰連接的專案是「${projectName}」。請只設定這個資料夾。

${steps}

\`\`\`json
${config}
\`\`\`

3. ${remind}

4. 我回覆已經打開之後，先問我：「要現在開始自動出貨嗎？」我同意之前，不要改這個產品的程式。

5. 我同意之後，請照下面的規則出貨。每一輪做完都要再問我要不要繼續，不要自己一直做下去。

${SHIPPING_RULES}`;
}
