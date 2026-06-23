import type { PortalProfileContact } from "@/lib/portal/load-dashboard";

export type PortalProfilePatch = Pick<
  PortalProfileContact,
  "studentFirst" | "parentFirst" | "parentLast" | "parentPhone" | "parentZip"
>;

const FIELD_LABELS: Record<keyof PortalProfilePatch, string> = {
  studentFirst: "Student first name",
  parentFirst: "Parent first name",
  parentLast: "Parent last name",
  parentPhone: "Phone",
  parentZip: "Zip code",
};

const FIELD_MAX: Record<keyof PortalProfilePatch, number> = {
  studentFirst: 80,
  parentFirst: 80,
  parentLast: 80,
  parentPhone: 32,
  parentZip: 10,
};

export function cleanPortalProfileField(value: unknown, key: keyof PortalProfilePatch): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, FIELD_MAX[key]);
}

export function portalProfileContactFromLead(lead: {
  student_first?: string | null;
  parent_first?: string | null;
  parent_last?: string | null;
  parent_phone?: string | null;
  parent_zip?: string | null;
  parent_email?: string | null;
}): PortalProfileContact {
  return {
    studentFirst: lead.student_first?.trim() ?? "",
    parentFirst: lead.parent_first?.trim() ?? "",
    parentLast: lead.parent_last?.trim() ?? "",
    parentEmail: lead.parent_email?.trim() ?? "",
    parentPhone: lead.parent_phone?.trim() ?? "",
    parentZip: lead.parent_zip?.trim() ?? "",
  };
}

/** Parents may add or update contact fields, not clear ones already on file. */
export function validatePortalProfilePatch(
  existing: PortalProfileContact,
  patch: Partial<PortalProfilePatch>
): { ok: true; merged: PortalProfileContact } | { ok: false; error: string } {
  const merged: PortalProfileContact = {
    ...existing,
    studentFirst: cleanPortalProfileField(patch.studentFirst ?? existing.studentFirst, "studentFirst"),
    parentFirst: cleanPortalProfileField(patch.parentFirst ?? existing.parentFirst, "parentFirst"),
    parentLast: cleanPortalProfileField(patch.parentLast ?? existing.parentLast, "parentLast"),
    parentPhone: cleanPortalProfileField(patch.parentPhone ?? existing.parentPhone, "parentPhone"),
    parentZip: cleanPortalProfileField(patch.parentZip ?? existing.parentZip, "parentZip"),
  };

  if (!merged.studentFirst) {
    return { ok: false, error: "Student first name is required." };
  }

  for (const key of Object.keys(FIELD_LABELS) as (keyof PortalProfilePatch)[]) {
    const wasSet = Boolean(existing[key]?.trim());
    const nowSet = Boolean(merged[key]?.trim());
    if (wasSet && !nowSet) {
      return {
        ok: false,
        error: `${FIELD_LABELS[key]} can't be removed. Update it or contact support.`,
      };
    }
  }

  return { ok: true, merged };
}

export function portalProfileFieldLabel(key: keyof PortalProfilePatch): string {
  return FIELD_LABELS[key];
}

export function canClearPortalProfileField(
  baseline: PortalProfileContact,
  key: keyof PortalProfilePatch
): boolean {
  return !baseline[key]?.trim();
}
