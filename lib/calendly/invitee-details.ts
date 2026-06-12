const CALENDLY_API = "https://api.calendly.com";

type InviteeResource = {
  text_reminder_number?: string | null;
  phone_number?: string | null;
};

/** Load phone collected on a prior Calendly booking (Strategy Call, etc.). */
export async function fetchCalendlyInviteePhone(
  inviteeApiUri: string
): Promise<string | null> {
  const token = process.env.CALENDLY_API_TOKEN?.trim();
  if (!token || !inviteeApiUri.trim()) return null;

  try {
    const path = new URL(inviteeApiUri).pathname;
    const res = await fetch(`${CALENDLY_API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { resource?: InviteeResource };
    const phone =
      data.resource?.text_reminder_number?.trim() ||
      data.resource?.phone_number?.trim() ||
      "";
    return phone || null;
  } catch {
    return null;
  }
}

export function phoneFromCalendlyPostMessage(
  payload: Record<string, unknown> | undefined
): string | null {
  if (!payload) return null;
  const invitee = payload.invitee as Record<string, unknown> | undefined;
  if (!invitee) return null;

  for (const key of ["text_reminder_number", "phone_number", "phone"] as const) {
    const value = invitee[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}
