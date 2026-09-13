import { cache } from "react";
import { v4 as uuidv4 } from "uuid";
import { isAdminEmail } from "@/lib/auth/admin";
import { getMemberByEmail, upsertMember } from "@/lib/db/platform-store";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isPaidPlan, type Member } from "@/types/platform";

export interface MembershipAccess {
  paid: boolean;
  plan: Member["plan"];
  status: Member["status"];
  member: Member | null;
}

export async function ensureMemberRecord(email: string, name?: string, admin = false): Promise<Member> {
  const existing = await getMemberByEmail(email);
  if (existing) {
    if (admin && existing.plan === "free") {
      const upgraded = { ...existing, plan: "academy" as const, name: name?.trim() || existing.name };
      await upsertMember(upgraded);
      return upgraded;
    }
    return existing;
  }
  const member: Member = {
    id: uuidv4(),
    email: email.trim().toLowerCase(),
    name: name?.trim() || (admin ? "Professor Cat" : "Member"),
    plan: admin ? "academy" : "free",
    status: "active",
    notes: null,
    created_at: new Date().toISOString(),
  };
  await upsertMember(member);
  return member;
}

export async function isPaidEmail(email: string | null | undefined): Promise<boolean> {
  const normalized = email?.trim().toLowerCase() || "";
  if (!normalized) return false;
  if (isAdminEmail(normalized)) return true;
  const member = await getMemberByEmail(normalized);
  if (member && member.status === "active" && isPaidPlan(member.plan)) return true;
  if (isSupabaseConfigured()) {
    const { data } = await createServiceClient()
      .from("profiles")
      .select("is_lifetime_member")
      .eq("email", normalized)
      .maybeSingle();
    if (data?.is_lifetime_member) return true;
  }
  return false;
}

export async function captureFreeCheckoutLead(email: string, name: string, whatsapp: string): Promise<Member> {
  const member = await ensureMemberRecord(email, name);
  if (isPaidPlan(member.plan) && member.status === "active") return member;

  const whatsappNote = whatsapp.trim() ? `WhatsApp ${whatsapp.trim()}` : "";
  let notes = member.notes;
  if (whatsappNote && !notes?.includes(whatsappNote)) {
    notes = notes ? `${notes} · ${whatsappNote}` : whatsappNote;
  }

  const next: Member = {
    ...member,
    name: name.trim() || member.name,
    plan: "free",
    notes,
  };
  if (next.name !== member.name || next.notes !== member.notes) {
    await upsertMember(next);
  }
  return next;
}

export const getMembershipAccess = cache(async function getMembershipAccess(email: string | null | undefined, isAdmin = false): Promise<MembershipAccess> {
  if (!email) return { paid: false, plan: "free", status: "active", member: null };
  const admin = isAdmin || isAdminEmail(email);
  const member = await ensureMemberRecord(email, undefined, admin);
  if (admin) {
    return { paid: true, plan: member.plan, status: member.status, member };
  }
  const paid = member.status === "active" && isPaidPlan(member.plan);
  if (!paid && isSupabaseConfigured()) {
    const { data } = await createServiceClient()
      .from("profiles")
      .select("is_lifetime_member")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();
    if (data?.is_lifetime_member) {
      return { paid: true, plan: isPaidPlan(member.plan) ? member.plan : "academy", status: "active", member };
    }
  }
  return {
    paid,
    plan: member.plan,
    status: member.status,
    member,
  };
});
