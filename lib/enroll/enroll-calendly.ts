import type { CalendlyPrefill } from "@/lib/calendly-embed";

type EnrollContactFields = {
  parentFirst: string;
  parentLast: string;
  parentEmail: string;
  parentPhone: string;
  studentFirst: string;
};

export function buildEnrollCalendlyPrefill(fields: EnrollContactFields): CalendlyPrefill | null {
  const email = fields.parentEmail.trim();
  const name = `${fields.parentFirst.trim()} ${fields.parentLast.trim()}`.trim();
  if (!email.includes("@") || !name) return null;

  return {
    email,
    name,
    phone: fields.parentPhone.trim() || undefined,
    kidFirstName: fields.studentFirst.trim() || undefined
  };
}

export function formatDiagnosticScheduledAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short"
    });
  } catch {
    return iso;
  }
}
