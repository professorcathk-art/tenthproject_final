import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Listener = (payload: unknown) => void;

const globalListeners = globalThis as typeof globalThis & {
  __tenthMcpListeners?: Map<string, Set<Listener>>;
};

function listeners() {
  if (!globalListeners.__tenthMcpListeners) globalListeners.__tenthMcpListeners = new Map();
  return globalListeners.__tenthMcpListeners;
}

function topic(sessionId: string) {
  return `mcp-${sessionId}`;
}

export async function openMcpSession(sessionId: string, send: (chunk: string) => void) {
  const bucket = listeners().get(sessionId) ?? new Set<Listener>();
  listeners().set(sessionId, bucket);
  const onMessage = (payload: unknown) => {
    send(`event: message\ndata: ${JSON.stringify(payload)}\n\n`);
  };
  bucket.add(onMessage);

  let removeChannel = () => {};
  if (isSupabaseConfigured() && (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").includes("nenefypjdozksveulwpw")) {
    const channel = createServiceClient().channel(topic(sessionId), {
      config: { broadcast: { self: false } },
    });
    channel.on("broadcast", { event: "rpc" }, ({ payload }) => onMessage(payload));
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 3000);
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED" || status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          clearTimeout(timer);
          resolve();
        }
      });
    });
    removeChannel = () => {
      void createServiceClient().removeChannel(channel);
    };
  }

  return () => {
    bucket.delete(onMessage);
    if (bucket.size === 0) listeners().delete(sessionId);
    removeChannel();
  };
}

export async function publishMcpSession(sessionId: string, payload: unknown) {
  const bucket = listeners().get(sessionId);
  if (bucket?.size) {
    for (const listener of bucket) listener(payload);
    return true;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url.includes("nenefypjdozksveulwpw") || !key) return false;

  const response = await fetch(`${url}/realtime/v1/api/broadcast/${topic(sessionId)}/events/rpc`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return response.ok;
}
