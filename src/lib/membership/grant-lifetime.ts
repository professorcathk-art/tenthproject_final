import { v4 as uuidv4 } from "uuid";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getMemberByEmail, upsertMember } from "@/lib/db/platform-store";

export interface LifetimeGrantInput {
  email: string;
  name: string;
  whatsapp: string;
  stripeCustomerId: string | null;
  stripeSessionId: string;
}

export interface LifetimeGrantResult {
  email: string;
  name: string;
  userId: string;
}

async function findAuthUserByEmail(email: string): Promise<User | null> {
  const supabase = createAdminClient();
  const admin = supabase.auth.admin as typeof supabase.auth.admin & {
    getUserByEmail?: (value: string) => Promise<{ data: { user: User | null }; error: Error | null }>;
  };

  if (typeof admin.getUserByEmail === "function") {
    const { data, error } = await admin.getUserByEmail(email);
    if (!error && data?.user) return data.user;
  }

  const { data: profile } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
  if (profile?.id) {
    const { data } = await supabase.auth.admin.getUserById(profile.id);
    return data.user ?? null;
  }

  return null;
}

export async function grantLifetimeMembership(input: LifetimeGrantInput): Promise<LifetimeGrantResult> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim() || "VIP Member";
  const whatsapp = input.whatsapp.trim();
  let userId: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = createAdminClient();
    let user = await findAuthUserByEmail(email);

    if (!user) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: name, whatsapp },
        app_metadata: { lifetime: true, plan: "academy" },
      });
      if (error && !/already/i.test(error.message)) {
        console.error("createUser:", error.message);
      }
      user = data?.user ?? (await findAuthUserByEmail(email));
    } else {
      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, full_name: name, whatsapp },
        app_metadata: { ...user.app_metadata, lifetime: true, plan: "academy" },
      });
      if (error) console.error("updateUserById:", error.message);
    }

    userId = user?.id ?? null;

    if (userId) {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        email,
        name,
        whatsapp,
        is_lifetime_member: true,
        stripe_customer_id: input.stripeCustomerId,
        stripe_session_id: input.stripeSessionId,
      });
      if (error) console.error("profiles upsert:", error.message);
    }
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

  return { email, name, userId: memberId };
}
