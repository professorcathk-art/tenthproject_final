export function teaserMarkdown(markdown: string) {
  const text = markdown.trim();
  if (text.length < 240) return text;
  const cut = Math.floor(text.length / 2);
  const slice = text.slice(0, cut);
  const breakAt = Math.max(slice.lastIndexOf("\n\n"), slice.lastIndexOf("\n## "));
  return (breakAt > 80 ? slice.slice(0, breakAt) : slice).trim();
}

export function remainderMarkdown(markdown: string) {
  const teaser = teaserMarkdown(markdown);
  if (teaser === markdown.trim()) return "";
  return markdown.trim().slice(teaser.length).trim();
}
