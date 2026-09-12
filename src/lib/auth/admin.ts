export const ADMIN_EMAIL = "professor.cat.hk@gmail.com";

function canonicalizeEmail(email: string) {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at < 0) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const plus = local.indexOf("+");
    const user = (plus >= 0 ? local.slice(0, plus) : local).replace(/\./g, "");
    return `${user}@gmail.com`;
  }
  return trimmed;
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return canonicalizeEmail(email) === canonicalizeEmail(ADMIN_EMAIL);
}
