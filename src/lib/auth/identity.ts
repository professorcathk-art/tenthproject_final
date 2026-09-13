import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { ensureMemberRecord } from "@/lib/auth/membership";

export async function findAuthUserByEmail(email: string): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createAdminClient();
  const admin = supabase.auth.admin as typeof supabase.auth.admin & {
    getUserByEmail?: (value: string) => Promise<{ data: { user: User | null }; error: Error | null }>;
  };

  const normalized = email.trim().toLowerCase();
  if (typeof admin.getUserByEmail === "function") {
    const { data, error } = await admin.getUserByEmail(normalized);
    if (!error && data?.user) return data.user;
  }

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) break;
    const match = data.users.find((item) => item.email?.toLowerCase() === normalized);
    if (match) return match;
    if (data.users.length < 200) break;
  }

  const { data: profile } = await supabase.from("profiles").select("id").eq("email", normalized).maybeSingle();
  if (profile?.id) {
    const { data } = await supabase.auth.admin.getUserById(profile.id);
    return data.user ?? null;
  }

  return null;
}

export async function ensureAuthUser(
  email: string,
  name: string,
  extras?: { whatsapp?: string; lifetime?: boolean; preferredId?: string | null; password?: string },
): Promise<User> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const normalized = email.trim().toLowerCase();
  const supabase = createAdminClient();
  let user = await findAuthUserByEmail(normalized);
  if (!user) {
    const { data: profile } = await supabase.from("profiles").select("id").eq("email", normalized).maybeSingle();
    const preferredId = extras?.preferredId?.trim() || profile?.id || undefined;
    const created = await supabase.auth.admin.createUser({
      email: normalized,
      email_confirm: true,
      ...(preferredId ? { id: preferredId } : {}),
      ...(extras?.password ? { password: extras.password } : {}),
      user_metadata: { full_name: name, ...(extras?.whatsapp ? { whatsapp: extras.whatsapp } : {}) },
      app_metadata: extras?.lifetime ? { lifetime: true, plan: "academy" } : undefined,
    });
    if (created.error || !created.data.user) {
      user = await findAuthUserByEmail(normalized);
      if (!user && preferredId) {
        const retry = await supabase.auth.admin.createUser({
          email: normalized,
          email_confirm: true,
          ...(extras?.password ? { password: extras.password } : {}),
          user_metadata: { full_name: name, ...(extras?.whatsapp ? { whatsapp: extras.whatsapp } : {}) },
          app_metadata: extras?.lifetime ? { lifetime: true, plan: "academy" } : undefined,
        });
        if (retry.error || !retry.data.user) {
          throw new Error(`Unable to create Auth user: ${retry.error?.message || created.error?.message || "unknown error"}`);
        }
        user = retry.data.user;
      } else if (!user) {
        throw new Error(`Unable to create Auth user: ${created.error?.message || "unknown error"}`);
      }
    } else {
      user = created.data.user;
    }
  }
  if (!user) throw new Error("Unable to resolve Auth user");

  if (extras?.lifetime || extras?.whatsapp || name) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, full_name: name, ...(extras?.whatsapp ? { whatsapp: extras.whatsapp } : {}) },
      app_metadata: extras?.lifetime ? { ...user.app_metadata, lifetime: true, plan: "academy" } : user.app_metadata,
    });
    if (error) console.error("updateUserById:", error.message);
  }

  return user;
}

export async function resolveSignedInAccount(email: string, name?: string, isAdmin = false, password?: string) {
  const member = await ensureMemberRecord(email, name, isAdmin);
  if (!isSupabaseConfigured()) {
    return { member, userId: member.id };
  }

  const supabase = createAdminClient();
  const user = await ensureAuthUser(member.email, member.name, password ? { password } : undefined);
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: member.email,
    name: member.name,
  });
  if (error) console.error("resolveSignedInAccount profile:", error.message);
  return { member, userId: user.id };
}
