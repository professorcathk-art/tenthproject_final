import { createClient } from "@supabase/supabase-js";
import { getSeedCaseStudies } from "../src/lib/seed/case-studies";
import { applyCaseFieldEncoding } from "../src/lib/inspiration/case-fields";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const seeds = getSeedCaseStudies();

  for (const seed of seeds) {
    const { data: existing, error: readError } = await supabase
      .from("case_studies")
      .select("created_at")
      .eq("slug", seed.slug)
      .maybeSingle();
    if (readError) throw readError;
    const row = applyCaseFieldEncoding({ ...seed, created_at: existing?.created_at ?? seed.created_at });
    const { error } = await supabase.from("case_studies").upsert(row);
    if (error) throw error;
    console.log("upserted", seed.slug, "diff", seed.difficulty, seed.pitch_deck_url ? "deck" : "no-deck");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
