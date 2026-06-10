import { normalizeDanielleEmail } from "@/lib/danielle-auth";
import { normalizeDaniellePhone } from "@/lib/danielle-phone";

export type DanielleNotifyRegistryEntry = {
  email: string;
  phone: string | null;
};

export function getDanielleNotifyRegistry(): DanielleNotifyRegistryEntry[] {
  const raw = process.env.DANIELLE_NOTIFY_TARGETS?.trim();
  if (!raw) {
    return [];
  }

  const entries: DanielleNotifyRegistryEntry[] = [];

  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      entries.push({
        email: normalizeDanielleEmail(trimmed),
        phone: null
      });
      continue;
    }

    const email = normalizeDanielleEmail(trimmed.slice(0, eq));
    const phoneRaw = trimmed.slice(eq + 1).trim();
    const phone = phoneRaw ? normalizeDaniellePhone(phoneRaw) : null;

    entries.push({ email, phone });
  }

  return entries;
}

export function isDanielleNotifyRegistryEmail(email: string) {
  const normalized = normalizeDanielleEmail(email);
  return getDanielleNotifyRegistry().some((entry) => entry.email === normalized);
}
