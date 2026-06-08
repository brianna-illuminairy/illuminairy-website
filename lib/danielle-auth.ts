import { cookies } from "next/headers";

export const DANIELLE_COOKIE = "illuminairy_danielle";

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
