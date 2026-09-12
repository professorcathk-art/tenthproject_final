import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{token.slice(2, -2)}</strong>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        nodes.push(
          <a
            key={`${keyPrefix}-a${i}`}
            href={link[2]}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
          >
            {link[1]}
          </a>,
        );
      }
    }
    last = match.index + token.length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function splitRow(line: string): string[] {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function CaseArticle({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let table: string[][] | null = null;

  function flushList() {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={`list-${blocks.length}`} className="my-3 space-y-1.5 pl-5 text-slate-600 marker:text-slate-400">
        {list.items.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {inline(item, `li-${blocks.length}-${i}`)}
          </li>
        ))}
      </Tag>,
    );
    list = null;
  }

  function flushTable() {
    if (!table?.length) {
      table = null;
      return;
    }
    const [header, ...rows] = table.filter((row, i) => i === 0 || !row.every((cell) => /^:?-+:?$/.test(cell)));
    blocks.push(
      <div key={`table-${blocks.length}`} className="my-5 overflow-x-auto rounded-2xl border border-slate-200/80">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {header.map((cell) => (
                <th key={cell} className="px-3 py-2 font-medium">
                  {inline(cell, `th-${cell}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-slate-100">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 align-top text-slate-600">
                    {inline(cell, `td-${i}-${j}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    table = null;
  }

  lines.forEach((line, index) => {
    if (line.startsWith("|")) {
      flushList();
      table = table ?? [];
      table.push(splitRow(line));
      return;
    }
    flushTable();

    const ordered = line.match(/^\d+\.\s+(.+)/);
    const bullet = line.match(/^[-*]\s+(.+)/);
    if (ordered || bullet) {
      const orderedList = Boolean(ordered);
      if (!list || list.ordered !== orderedList) {
        flushList();
        list = { ordered: orderedList, items: [] };
      }
      list.items.push((ordered?.[1] ?? bullet?.[1] ?? "").trim());
      return;
    }
    flushList();

    if (line.startsWith("```")) return;
    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={index} className="mt-8 mb-2 text-base font-semibold tracking-tight text-slate-900">
          {line.slice(4)}
        </h3>,
      );
      return;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={index} className="mt-10 mb-3 text-xl font-semibold tracking-tight text-slate-950">
          {line.slice(3)}
        </h2>,
      );
      return;
    }
    if (line.startsWith("# ")) return;
    if (!line.trim()) return;
    blocks.push(
      <p key={index} className="mb-3 leading-7 text-slate-600">
        {inline(line, `p-${index}`)}
      </p>,
    );
  });

  flushList();
  flushTable();
  return <div className="max-w-none">{blocks}</div>;
}
