import { createClient } from "@supabase/supabase-js";
import { getSeedCaseStudies } from "../src/lib/seed/case-studies";
import type { CaseStudy } from "../src/types/platform";

const SLUGS = new Set([
  "happy-toy-scout",
  "clad-labs",
  "fambot",
  "series-so",
  "poke",
  "gojiberry-ai",
]);

function persist(cs: CaseStudy) {
  const { categories: extraCategories, website_url, highlights, ...rest } = cs;
  const cleanStack = rest.tech_stack.filter(
    (t) => !t.startsWith("cat:") && !t.startsWith("site:") && !t.startsWith("hl:"),
  );
  const cats = extraCategories?.length ? extraCategories : [cs.category];
  const allowed = cats.includes("workflow_agent") ? "ai_agent" : "vibe_coding";
  const encodedHighlights = (highlights ?? []).map((h) => `hl:${h.zh}|${h.en}|${h.value}`);
  return {
    ...rest,
    category: allowed,
    tech_stack: [
      ...cats.map((c) => `cat:${c}`),
      ...(website_url ? [`site:${website_url}`] : []),
      ...encodedHighlights,
      ...cleanStack,
    ],
  };
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const seeds = getSeedCaseStudies().filter((c) => SLUGS.has(c.slug));
  if (seeds.length !== SLUGS.size) throw new Error(`Expected ${SLUGS.size} seeds, got ${seeds.length}`);

  for (const seed of seeds) {
    const { data: existing, error: readError } = await supabase
      .from("case_studies")
      .select("created_at")
      .eq("slug", seed.slug)
      .maybeSingle();
    if (readError) throw readError;
    const row = persist({ ...seed, created_at: existing?.created_at ?? seed.created_at });
    const { error } = await supabase.from("case_studies").upsert(row);
    if (error) throw error;
    console.log("upserted", seed.slug);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
