import { executeMcpTool, MCP_TOOLS } from "@/lib/mcp/tools";

const SERVER_INFO = { name: "tenthproject", version: "1.0.0" };

class MethodNotFound extends Error {
  code = -32601;
}

class InvalidParams extends Error {
  code = -32602;
}

function rpcResult(id: unknown, result: unknown) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function rpcError(id: unknown, code: number, message: string) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function hasId(message: Record<string, unknown>) {
  return Object.prototype.hasOwnProperty.call(message, "id");
}

function negotiateProtocol(requested: unknown) {
  return typeof requested === "string" && /^\d{4}-\d{2}-\d{2}$/.test(requested) ? requested : "2025-03-26";
}

function toolArgs(params: unknown) {
  const record = params && typeof params === "object" ? (params as { name?: unknown; arguments?: unknown }) : {};
  const name = typeof record.name === "string" ? record.name : "";
  let args: Record<string, unknown> = {};
  if (typeof record.arguments === "string") {
    try {
      const parsed = JSON.parse(record.arguments) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) args = parsed as Record<string, unknown>;
    } catch {
      args = {};
    }
  } else if (record.arguments && typeof record.arguments === "object" && !Array.isArray(record.arguments)) {
    args = record.arguments as Record<string, unknown>;
  }
  return { name, args };
}

async function callTool(name: string, args: Record<string, unknown>, projectId: string, userId: string) {
  if (!name) throw new InvalidParams("Tool name required");
  try {
    const result = await executeMcpTool(name, args, projectId, userId);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], isError: false };
  } catch (error) {
    const text = error instanceof Error ? error.message : "MCP error";
    return { content: [{ type: "text", text }], isError: true };
  }
}

async function rpcResultFor(method: string, params: unknown, projectId: string, userId: string) {
  if (method === "initialize") {
    const requested = params && typeof params === "object" ? (params as { protocolVersion?: unknown }).protocolVersion : undefined;
    return {
      protocolVersion: negotiateProtocol(requested),
      capabilities: { tools: { listChanged: false } },
      serverInfo: SERVER_INFO,
      instructions: "這把連線只對應 Tenth Project 裡的一個專案。用工具讀取路線圖，並回報測試與建置結果。",
    };
  }
  if (method === "ping" || method === "logging/setLevel") return {};
  if (method === "tools/list") return { tools: MCP_TOOLS };
  if (method === "tools/call") {
    const { name, args } = toolArgs(params);
    return callTool(name, args, projectId, userId);
  }
  if (method === "resources/list") return { resources: [] };
  if (method === "resources/templates/list") return { resourceTemplates: [] };
  if (method === "prompts/list") return { prompts: [] };
  if (method.startsWith("notifications/")) return undefined;
  throw new MethodNotFound(`Unknown method: ${method}`);
}

export async function handleMcpMessage(
  message: unknown,
  ctx: { projectId: string; userId: string },
): Promise<{ kind: "ack" } | { kind: "json"; status: number; body: unknown }> {
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    return { kind: "json", status: 400, body: rpcError(null, -32600, "Invalid request") };
  }
  const record = message as Record<string, unknown>;

  if (typeof record.tool === "string" && record.method == null) {
    try {
      const args = record.args && typeof record.args === "object" && !Array.isArray(record.args) ? (record.args as Record<string, unknown>) : {};
      const result = await executeMcpTool(record.tool, args, ctx.projectId, ctx.userId);
      return { kind: "json", status: 200, body: { result } };
    } catch (error) {
      return { kind: "json", status: 500, body: { error: error instanceof Error ? error.message : "MCP error" } };
    }
  }

  const method = typeof record.method === "string" ? record.method : "";
  const jsonrpc = record.jsonrpc === "2.0" || method === "initialize" || method.startsWith("notifications/");
  if (!method) {
    return {
      kind: "json",
      status: jsonrpc ? 200 : 400,
      body: jsonrpc ? rpcError(record.id ?? null, -32600, "Invalid request") : { error: "Unknown method" },
    };
  }

  if (!jsonrpc && (method === "tools/list" || method === "tools/call")) {
    if (method === "tools/list") return { kind: "json", status: 200, body: { tools: MCP_TOOLS } };
    const { name, args } = toolArgs(record.params);
    if (!name) return { kind: "json", status: 400, body: { error: "Tool name required" } };
    const result = await callTool(name, args, ctx.projectId, ctx.userId);
    return { kind: "json", status: 200, body: result };
  }

  if (!hasId(record)) return { kind: "ack" };

  try {
    const result = await rpcResultFor(method, record.params, ctx.projectId, ctx.userId);
    if (result === undefined) return { kind: "ack" };
    return { kind: "json", status: 200, body: rpcResult(record.id ?? null, result) };
  } catch (error) {
    const code = error instanceof MethodNotFound || error instanceof InvalidParams ? error.code : -32603;
    const text = error instanceof Error ? error.message : "MCP error";
    return { kind: "json", status: 200, body: rpcError(record.id ?? null, code, text) };
  }
}
