import { cookies } from "next/headers";

export const SKYE_COOKIE = "illuminairy_skye";
export const SKYE_VISITOR_COOKIE = "illuminairy_skye_visitor";

export function normalizeSkyeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getSkyeAllowlist() {
  const raw = process.env.SKYE_ACCESS_ALLOWLIST?.trim();
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((entry) => normalizeSkyeEmail(entry))
    .filter(Boolean);
}

export function isSkyeConfigured() {
  return getSkyeAllowlist().length > 0;
}

export function isEmailAllowed(email: string) {
  const normalized = normalizeSkyeEmail(email);
  return getSkyeAllowlist().includes(normalized);
}

export async function isSkyeAuthenticated() {
  const allowlist = getSkyeAllowlist();
  if (allowlist.length === 0) {
    return false;
  }
  const jar = await cookies();
  const value = jar.get(SKYE_COOKIE)?.value;
  if (!value) {
    return false;
  }
  return allowlist.includes(normalizeSkyeEmail(value));
}

export async function getSkyeSessionEmail() {
  const jar = await cookies();
  const value = jar.get(SKYE_COOKIE)?.value;
  if (!value) {
    return null;
  }
  return normalizeSkyeEmail(value);
}

export function getSkyeOwnerQaSecret() {
  return process.env.SKYE_OWNER_QA_SECRET?.trim() ?? "";
}

export function isSkyeOwnerQaSecretValid(code: string | undefined) {
  const secret = getSkyeOwnerQaSecret();
  if (!secret || !code?.trim()) {
    return false;
  }
  return code.trim() === secret;
}

export async function getSkyeVisitorContext(email: string) {
  const jar = await cookies();
  const visitorFlag = jar.get(SKYE_VISITOR_COOKIE)?.value;
  const isOwnerQa = visitorFlag === "owner";

  return {
    email: normalizeSkyeEmail(email),
    isOwnerQa
  };
}

export function skyeVisitorCookieOptions(maxAge = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge
  };
}
