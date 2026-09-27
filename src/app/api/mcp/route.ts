import { NextRequest, NextResponse } from "next/server";
import { isPaidUserId } from "@/lib/auth/membership";
import { validateMcpApiKey } from "@/lib/db/platform-store";
import { MCP_TOOLS } from "@/lib/mcp/tools";
import { handleMcpMessage } from "@/lib/mcp/protocol";
import { openMcpSession, publishMcpSession } from "@/lib/mcp/sse-hub";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function apiKeyFrom(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return authHeader?.replace(/^Bearer\s+/i, "") || request.headers.get("x-api-key") || "";
}

async function authorize(request: NextRequest) {
  const apiKey = apiKeyFrom(request);
  if (!apiKey) return { error: NextResponse.json({ error: "Missing API key" }, { status: 401 }) };
  const keyRecord = await validateMcpApiKey(apiKey);
  if (!keyRecord) return { error: NextResponse.json({ error: "Invalid API key" }, { status: 401 }) };
  if (!(await isPaidUserId(keyRecord.user_id))) return { error: NextResponse.json({ error: "PAID_REQUIRED" }, { status: 403 }) };
  return { keyRecord };
}

function endpointFor(request: NextRequest, sessionId: string) {
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || request.nextUrl.protocol.replace(":", "");
  const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || request.headers.get("host") || request.nextUrl.host;
  const endpoint = new URL(request.nextUrl.pathname, `${proto}://${host}`);
  endpoint.searchParams.set("sessionId", sessionId);
  return endpoint.toString();
}

export async function GET(request: NextRequest) {
  const wantsStream = (request.headers.get("accept") ?? "").includes("text/event-stream");
  if (!wantsStream) {
    return NextResponse.json({
      name: "tenthproject",
      version: "1.0.0",
      protocol: "2025-03-26",
      tools: MCP_TOOLS.map((tool) => tool.name),
      docs: "POST JSON-RPC with Authorization: Bearer tp_xxx. Methods include initialize, tools/list, and tools/call.",
    });
  }

  const auth = await authorize(request);
  if ("error" in auth && auth.error) return auth.error;

  const sessionId = crypto.randomUUID();
  const encoder = new TextEncoder();
  let cleanup = () => {};
  let closed = false;
  const stream = new ReadableStream({
    async start(controller) {
      const send = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closed = true;
        }
      };
      const closeSession = await openMcpSession(sessionId, send);
      const timer = setInterval(() => send(`: ping\n\n`), 15000);
      cleanup = () => {
        clearInterval(timer);
        closeSession();
      };
      if (closed) {
        cleanup();
        return;
      }
      send(`event: endpoint\ndata: ${endpointFor(request, sessionId)}\n\n`);
    },
    cancel() {
      closed = true;
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if ("error" in auth && auth.error) return auth.error;
  if (!("keyRecord" in auth) || !auth.keyRecord) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400 });
  }

  const messages = Array.isArray(raw) ? raw : [raw];
  const responses: unknown[] = [];
  let httpStatus = 200;
  let jsonRpc = false;
  for (const message of messages) {
    const outcome = await handleMcpMessage(message, { projectId: auth.keyRecord.project_id, userId: auth.keyRecord.user_id });
    if (outcome.kind === "ack") continue;
    httpStatus = outcome.status;
    jsonRpc = Boolean(outcome.body && typeof outcome.body === "object" && "jsonrpc" in (outcome.body as object));
    responses.push(outcome.body);
  }

  if (responses.length === 0) return new NextResponse(null, { status: 202 });

  const body = Array.isArray(raw) ? responses : responses[0];
  const sessionId = request.nextUrl.searchParams.get("sessionId");
  if (sessionId && jsonRpc) {
    const payloads = Array.isArray(body) ? body : [body];
    let delivered = true;
    for (const payload of payloads) delivered = (await publishMcpSession(sessionId, payload)) && delivered;
    if (delivered) return new NextResponse(null, { status: 202 });
  }

  return NextResponse.json(body, { status: Array.isArray(raw) ? 200 : httpStatus });
}
