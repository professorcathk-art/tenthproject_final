import { NextRequest, NextResponse } from "next/server";
import { validateMcpApiKey } from "@/lib/db/platform-store";
import { MCP_TOOLS, executeMcpTool } from "@/lib/mcp/tools";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.replace(/^Bearer\s+/i, "") ?? request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const keyRecord = await validateMcpApiKey(apiKey);
  if (!keyRecord) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { method, params } = body as {
      method: string;
      params?: { name?: string; arguments?: Record<string, unknown> };
    };

    // MCP JSON-RPC style
    if (method === "tools/list") {
      return NextResponse.json({ tools: MCP_TOOLS });
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      const args = params?.arguments ?? {};
      if (!toolName) {
        return NextResponse.json({ error: "Tool name required" }, { status: 400 });
      }
      const result = await executeMcpTool(toolName, args, keyRecord.project_id, keyRecord.user_id);
      return NextResponse.json({ content: [{ type: "text", text: JSON.stringify(result, null, 2) }] });
    }

    // Direct tool call shorthand: { tool: "get_active_roadmap", args: {} }
    if (body.tool) {
      const result = await executeMcpTool(body.tool, body.args ?? {}, keyRecord.project_id, keyRecord.user_id);
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: "Unknown method" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "MCP error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "tenthproject",
    version: "1.0.0",
    tools: MCP_TOOLS.map((t) => t.name),
    docs: "POST with Authorization: Bearer tp_xxx. Methods: tools/list, tools/call, or { tool, args }",
  });
}
