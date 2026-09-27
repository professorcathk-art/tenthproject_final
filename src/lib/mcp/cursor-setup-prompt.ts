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

  return `請幫我把 Tenth Project 的 MCP 接到目前這個資料夾。這把金鑰連接的專案是「${projectName}」。請只設定這個資料夾。

${steps}

\`\`\`json
${config}
\`\`\`

3. 完成後請提示我「完全關閉並重新打開這個 AI 工具」。`;
}
