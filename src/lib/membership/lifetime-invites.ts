import { v4 as uuidv4 } from "uuid";
import { getMemberByEmail, upsertMember } from "@/lib/db/platform-store";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isPaidPlan } from "@/types/platform";

export async function applyPrepaidLifetime(email: string, name?: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !isSupabaseConfigured()) return false;

  const supabase = createServiceClient();
  const { data: invite, error } = await supabase
    .from("lifetime_invites")
    .select("email")
    .eq("email", normalized)
    .maybeSingle();
  if (error || !invite) return false;

  const existing = await getMemberByEmail(normalized);
  const alreadyPaid = Boolean(existing && existing.status === "active" && isPaidPlan(existing.plan));
  if (!alreadyPaid) {
    const notes = existing?.notes?.includes("預先開通終身會員")
      ? existing.notes
      : existing?.notes
        ? `${existing.notes} · 預先開通終身會員`
        : "預先開通終身會員";
    await upsertMember({
      id: existing?.id ?? uuidv4(),
      email: normalized,
      name: name?.trim() || existing?.name || "Member",
      plan: existing?.plan === "enterprise" ? "enterprise" : "academy",
      status: "active",
      notes,
      created_at: existing?.created_at ?? new Date().toISOString(),
    });
  }

  const { data: profile } = await supabase.from("profiles").select("id").eq("email", normalized).maybeSingle();
  if (profile?.id) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ is_lifetime_member: true })
      .eq("id", profile.id);
    if (profileError) console.error("prepaid lifetime profile:", profileError.message);
  }

  await supabase.from("lifetime_invites").update({ redeemed_at: new Date().toISOString() }).eq("email", normalized);
  return true;
}
