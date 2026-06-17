import { cookies } from "next/headers";

export const SOHA_COOKIE = "illuminairy_soha";
export const SOHA_VISITOR_COOKIE = "illuminairy_soha_visitor";

export function normalizeSohaEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getSohaAllowlist() {
  const raw = process.env.SOHA_ACCESS_ALLOWLIST?.trim();
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((entry) => normalizeSohaEmail(entry))
    .filter(Boolean);
}

export function isSohaConfigured() {
  return getSohaAllowlist().length > 0;
}

export function isEmailAllowed(email: string) {
  const normalized = normalizeSohaEmail(email);
  return getSohaAllowlist().includes(normalized);
}

export async function isSohaAuthenticated() {
  const allowlist = getSohaAllowlist();
  if (allowlist.length === 0) {
    return false;
  }
  const jar = await cookies();
  const value = jar.get(SOHA_COOKIE)?.value;
  if (!value) {
    return false;
  }
  return allowlist.includes(normalizeSohaEmail(value));
}

export async function getSohaSessionEmail() {
  const jar = await cookies();
  const value = jar.get(SOHA_COOKIE)?.value;
  if (!value) {
    return null;
  }
  return normalizeSohaEmail(value);
}

export function getSohaOwnerQaSecret() {
  return process.env.SOHA_OWNER_QA_SECRET?.trim() ?? "";
}

export function isSohaOwnerQaSecretValid(code: string | undefined) {
  const secret = getSohaOwnerQaSecret();
  if (!secret || !code?.trim()) {
    return false;
  }
  return code.trim() === secret;
}

export async function getSohaVisitorContext(email: string) {
  const jar = await cookies();
  const visitorFlag = jar.get(SOHA_VISITOR_COOKIE)?.value;
  const isOwnerQa = visitorFlag === "owner";

  return {
    email: normalizeSohaEmail(email),
    isOwnerQa
  };
}

export function sohaVisitorCookieOptions(maxAge = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge
  };
}
