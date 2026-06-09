import { normalizeDanielleEmail } from "@/lib/danielle-auth";

export type DaniellePortalRole = "student" | "parent" | "owner" | "other";

const VALID_ROLES = new Set<DaniellePortalRole>(["student", "parent", "owner", "other"]);

export function getDaniellePortalRole(email: string): DaniellePortalRole {
  const normalized = normalizeDanielleEmail(email);
  const raw = process.env.DANIELLE_PORTAL_ROLES?.trim();
  if (!raw) {
    return "other";
  }

  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const entryEmail = normalizeDanielleEmail(trimmed.slice(0, eq));
    const role = trimmed.slice(eq + 1).trim().toLowerCase() as DaniellePortalRole;
    if (entryEmail === normalized && VALID_ROLES.has(role)) {
      return role;
    }
  }

  return "other";
}
