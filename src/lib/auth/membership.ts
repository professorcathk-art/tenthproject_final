import { v4 as uuidv4 } from "uuid";
import { isAdminEmail } from "@/lib/auth/admin";
import { getMemberByEmail, upsertMember } from "@/lib/db/platform-store";
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
      const upgraded = { ...existing, plan: "enterprise" as const, name: name?.trim() || existing.name };
      await upsertMember(upgraded);
      return upgraded;
    }
    return existing;
  }
  const member: Member = {
    id: uuidv4(),
    email: email.trim().toLowerCase(),
    name: name?.trim() || (admin ? "Professor Cat" : "Member"),
    plan: admin ? "enterprise" : "free",
    status: "active",
    notes: null,
    created_at: new Date().toISOString(),
  };
  await upsertMember(member);
  return member;
}

export async function getMembershipAccess(email: string | null | undefined, isAdmin = false): Promise<MembershipAccess> {
  if (!email) return { paid: false, plan: "free", status: "active", member: null };
  const admin = isAdmin || isAdminEmail(email);
  const member = await ensureMemberRecord(email, undefined, admin);
  if (admin) {
    return { paid: true, plan: member.plan, status: member.status, member };
  }
  return {
    paid: member.status === "active" && isPaidPlan(member.plan),
    plan: member.plan,
    status: member.status,
    member,
  };
}
