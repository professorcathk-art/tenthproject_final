export function generateCursorSetupPrompt(
  apiKey: string,
  options: { mcpUrl: string; projectName: string; testPrompt: string },
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

  return `請在我目前打開的這個產品專案根目錄，幫我接上 Tenth Project。這把金鑰只連接專案「${projectName}」。請在這個資料夾裡做，不要改到別的專案。

1. 建立檔案 \`.cursor/mcp.json\`。檔案內容必須正好是下面這段 JSON，不要改網址，也不要把網址包成連結：

\`\`\`json
${config}
\`\`\`

2. 檢查專案根目錄的 \`.gitignore\`。如果還沒有 \`.cursor/mcp.json\` 這一行，就加在最後一行。如果還沒有 \`.gitignore\`，就新建一個，裡面只寫 \`.cursor/mcp.json\`。這一行是為了避免 API 金鑰被推上 GitHub。已經有這一行就不要重複加。

3. 做完之後，請提醒我完全關閉並重新打開 Cursor。重新打開之後，在對話裡貼上這句來確認：「${options.testPrompt}」`;
}
