export function isHttpUrl(value: string | null | undefined) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

export function isStoragePath(value: string | null | undefined) {
  if (!value) return false;
  if (isHttpUrl(value) || value.startsWith("/")) return false;
  return !value.includes("..");
}

export function classroomFileSrc(path: string | null | undefined, download = false) {
  if (!path) return null;
  if (isHttpUrl(path) || path.startsWith("/")) return path;
  const qs = new URLSearchParams({ path });
  if (download) qs.set("download", "1");
  return `/api/classroom/file?${qs.toString()}`;
}

export function toYoutubeEmbed(url: string) {
  if (url.includes("/embed/")) return url;
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}

export function inferVideoType(url: string | null | undefined, explicit?: string | null) {
  if (explicit === "mp4" || explicit === "youtube") return explicit;
  if (!url) return "youtube" as const;
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube" as const;
  if (url.endsWith(".mp4") || url.startsWith("videos/") || isStoragePath(url)) return "mp4" as const;
  return "youtube" as const;
}

export function sanitizeClassroomHtml(html: string) {
  return html
    .replace(/<\/(?:script|style|object|embed)[^>]*>/gi, "")
    .replace(/<(script|style|object|embed)[\s\S]*?>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi, "$1=$2$2");
}

export function safeClassroomPath(path: string) {
  const clean = path.replace(/^\/+/, "").trim();
  if (!clean || clean.includes("..") || clean.startsWith("http")) return null;
  return clean;
}
