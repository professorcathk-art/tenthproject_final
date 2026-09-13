import { v4 as uuidv4 } from "uuid";
import { ensureAuthUser } from "@/lib/auth/identity";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getMemberByEmail, upsertMember } from "@/lib/db/platform-store";

export interface LifetimeGrantInput {
  email: string;
  name: string;
  whatsapp: string;
  stripeCustomerId: string | null;
  stripeSessionId: string;
  existingUserId?: string | null;
}

export interface LifetimeGrantResult {
  email: string;
  name: string;
  userId: string;
}

export async function grantLifetimeMembership(input: LifetimeGrantInput): Promise<LifetimeGrantResult> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim() || "VIP Member";
  const whatsapp = input.whatsapp.trim();
  let userId = input.existingUserId?.trim() || null;

  if (isSupabaseConfigured()) {
    const supabase = createAdminClient();
    const user = await ensureAuthUser(email, name, {
      whatsapp,
      lifetime: true,
      preferredId: input.existingUserId,
    });
    userId = user.id;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email,
      name,
      whatsapp,
      is_lifetime_member: true,
      stripe_customer_id: input.stripeCustomerId,
      stripe_session_id: input.stripeSessionId,
    });
    if (error) console.error("profiles upsert:", error.message);
  }

  const existing = await getMemberByEmail(email);
  const memberId = existing?.id ?? userId ?? uuidv4();
  await upsertMember({
    id: memberId,
    email,
    name: name || existing?.name || "VIP Member",
    plan: existing?.plan === "enterprise" ? "enterprise" : "academy",
    status: "active",
    notes: existing?.notes ?? `Stripe lifetime ${input.stripeSessionId}`,
    created_at: existing?.created_at ?? new Date().toISOString(),
  });

  return { email, name, userId: userId || memberId };
}
