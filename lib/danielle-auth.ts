import { cookies } from "next/headers";
import { getDaniellePortalRole, type DaniellePortalRole } from "@/lib/danielle-portal-roles";

export const DANIELLE_COOKIE = "illuminairy_danielle";
export const DANIELLE_VISITOR_COOKIE = "illuminairy_danielle_visitor";

export function normalizeDanielleEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getDanielleAllowlist() {
  const raw = process.env.DANIELLE_ACCESS_ALLOWLIST?.trim();
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((entry) => normalizeDanielleEmail(entry))
    .filter(Boolean);
}

export function isDanielleConfigured() {
  return getDanielleAllowlist().length > 0;
}

export function isEmailAllowed(email: string) {
  const normalized = normalizeDanielleEmail(email);
  return getDanielleAllowlist().includes(normalized);
}

export async function isDanielleAuthenticated() {
  const allowlist = getDanielleAllowlist();
  if (allowlist.length === 0) {
    return false;
  }
  const jar = await cookies();
  const value = jar.get(DANIELLE_COOKIE)?.value;
  if (!value) {
    return false;
  }
  return allowlist.includes(normalizeDanielleEmail(value));
}

export async function getDanielleSessionEmail() {
  const jar = await cookies();
  const value = jar.get(DANIELLE_COOKIE)?.value;
  if (!value) {
    return null;
  }
  return normalizeDanielleEmail(value);
}

export function getDanielleOwnerQaSecret() {
  return process.env.DANIELLE_OWNER_QA_SECRET?.trim() ?? "";
}

export function isDanielleOwnerQaSecretValid(code: string | undefined) {
  const secret = getDanielleOwnerQaSecret();
  if (!secret || !code?.trim()) {
    return false;
  }
  return code.trim() === secret;
}

export type DanielleVisitorContext = {
  email: string;
  sessionRole: DaniellePortalRole;
  visitorRole: DaniellePortalRole;
  isOwnerQa: boolean;
};

export async function getDanielleVisitorContext(
  email: string
): Promise<DanielleVisitorContext> {
  const sessionRole = getDaniellePortalRole(email);
  const jar = await cookies();
  const visitorFlag = jar.get(DANIELLE_VISITOR_COOKIE)?.value;
  const ownerQaCookie = visitorFlag === "owner";
  const visitorRole: DaniellePortalRole = ownerQaCookie ? "owner" : sessionRole;
  const isOwnerQa = ownerQaCookie && sessionRole !== "owner";

  return {
    email: normalizeDanielleEmail(email),
    sessionRole,
    visitorRole,
    isOwnerQa
  };
}

export function danielleVisitorCookieOptions(maxAge = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge
  };
}
