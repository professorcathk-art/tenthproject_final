import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAnonClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { ensureMemberRecord } from "@/lib/auth/membership";
import { isAdminEmail } from "@/lib/auth/admin";
import { getCheckoutBaseUrl } from "@/lib/stripe";

export type AuthResult =
  | { ok: true; userId: string; email: string; name: string; isAdmin: boolean }
  | { ok: false; code: "invalid_input" | "no_account" | "invalid_password" | "already_exists" | "unavailable"; message: string };

const MIN_PASSWORD = 6;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

async function finishAuthenticatedSession(user: User, name?: string): Promise<Extract<AuthResult, { ok: true }>> {
  const email = normalizeEmail(user.email || "");
  const displayName = name?.trim() || String(user.user_metadata?.full_name || "").trim() || "Member";
  const member = await ensureMemberRecord(email, displayName, isAdminEmail(email));
  if (isSupabaseConfigured()) {
    const { error } = await createAdminClient().from("profiles").upsert({
      id: user.id,
      email,
      name: member.name,
    });
    if (error) console.error("auth profile upsert:", error.message);
  }
  return { ok: true, userId: user.id, email, name: member.name, isAdmin: isAdminEmail(email) };
}

export async function loginWithPassword(emailRaw: string, password: string): Promise<AuthResult> {
  const email = normalizeEmail(emailRaw);
  if (!validEmail(email) || password.length < MIN_PASSWORD) {
    return { ok: false, code: "invalid_input", message: "請輸入有效電郵，以及至少 6 位密碼。" };
  }
  if (!isSupabaseConfigured()) {
    return { ok: false, code: "unavailable", message: "登入服務尚未設定，請稍後再試。" };
  }

  const existing = await findAuthUserByEmail(email);
  if (!existing) {
    return { ok: false, code: "no_account", message: "此電郵尚未註冊，請先免費註冊。" };
  }

  const { data, error } = await createAnonClient().auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { ok: false, code: "invalid_password", message: "密碼不正確，請再試一次。" };
  }

  return finishAuthenticatedSession(data.user);
}

export async function signupWithPassword(emailRaw: string, password: string, nameRaw: string): Promise<AuthResult> {
  const email = normalizeEmail(emailRaw);
  const name = nameRaw.trim();
  if (!validEmail(email) || password.length < MIN_PASSWORD || !name) {
    return { ok: false, code: "invalid_input", message: "請輸入姓名、有效電郵，以及至少 6 位密碼。" };
  }
  if (!isSupabaseConfigured()) {
    return { ok: false, code: "unavailable", message: "註冊服務尚未設定，請稍後再試。" };
  }

  const existing = await findAuthUserByEmail(email);
  if (existing) {
    const { data, error } = await createAnonClient().auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      return finishAuthenticatedSession(data.user, name);
    }
    return { ok: false, code: "already_exists", message: "此電郵已有帳號，請登入。" };
  }

  const user = await ensureAuthUser(email, name, { password });
  return finishAuthenticatedSession(user, name);
}

export async function requestPasswordReset(emailRaw: string): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  const email = normalizeEmail(emailRaw);
  if (!validEmail(email)) {
    return { ok: false, message: "請輸入有效電郵。" };
  }
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "重設密碼服務尚未設定，請稍後再試。" };
  }

  const existing = await findAuthUserByEmail(email);
  if (existing) {
    const { error } = await createAnonClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${getCheckoutBaseUrl()}/reset-password`,
    });
    if (error) {
      return { ok: false, message: error.message };
    }
  }

  return { ok: true, message: "若此電郵已註冊，重設連結已寄出。請查看收件匣。" };
}
