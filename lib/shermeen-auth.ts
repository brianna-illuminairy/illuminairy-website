import { cookies } from "next/headers";

export const SHERMEEN_COOKIE = "illuminairy_shermeen";
export const SHERMEEN_VISITOR_COOKIE = "illuminairy_shermeen_visitor";

export function normalizeShermeenEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getShermeenAllowlist() {
  const raw = process.env.SHERMEEN_ACCESS_ALLOWLIST?.trim();
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((entry) => normalizeShermeenEmail(entry))
    .filter(Boolean);
}

export function isShermeenConfigured() {
  return getShermeenAllowlist().length > 0;
}

export function isEmailAllowed(email: string) {
  const normalized = normalizeShermeenEmail(email);
  return getShermeenAllowlist().includes(normalized);
}

export async function isShermeenAuthenticated() {
  const allowlist = getShermeenAllowlist();
  if (allowlist.length === 0) {
    return false;
  }
  const jar = await cookies();
  const value = jar.get(SHERMEEN_COOKIE)?.value;
  if (!value) {
    return false;
  }
  return allowlist.includes(normalizeShermeenEmail(value));
}

export async function getShermeenSessionEmail() {
  const jar = await cookies();
  const value = jar.get(SHERMEEN_COOKIE)?.value;
  if (!value) {
    return null;
  }
  return normalizeShermeenEmail(value);
}

export function getShermeenOwnerQaSecret() {
  return process.env.SHERMEEN_OWNER_QA_SECRET?.trim() ?? "";
}

export function isShermeenOwnerQaSecretValid(code: string | undefined) {
  const secret = getShermeenOwnerQaSecret();
  if (!secret || !code?.trim()) {
    return false;
  }
  return code.trim() === secret;
}

export async function getShermeenVisitorContext(email: string) {
  const jar = await cookies();
  const visitorFlag = jar.get(SHERMEEN_VISITOR_COOKIE)?.value;
  const isOwnerQa = visitorFlag === "owner";

  return {
    email: normalizeShermeenEmail(email),
    isOwnerQa
  };
}

export function shermeenVisitorCookieOptions(maxAge = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge
  };
}
