export function generateCursorSetupPrompt(
  apiKey: string,
  options: { mcpUrl: string; projectName: string; keyName: string; testPrompt: string },
) {
  const projectName = options.projectName.replace(/[`\r\n]/g, " ").trim() || "這個專案";
  const keyName = options.keyName.replace(/[`\r\n]/g, " ").trim() || projectName;
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

  return `請幫我在目前專案的根目錄下自動建立 Tenth Project 的 MCP 設定。這把金鑰的名字是「${keyName}」，只連接專案「${projectName}」。請在這個資料夾裡做。

1. 建立 \`.cursor/mcp.json\` 檔案。內容必須正好是下面這段 JSON，不要改網址，也不要把網址包成連結：

\`\`\`json
${config}
\`\`\`

2. 檢查專案根目錄下的 \`.gitignore\`。若沒有 \`.cursor/mcp.json\` 這一行，請自動加上，確保金鑰不會被推上 GitHub。已經有這一行就不要重複加。

3. 建立完成後請提示我「完全關閉並重新打開 Cursor」。`;
}
