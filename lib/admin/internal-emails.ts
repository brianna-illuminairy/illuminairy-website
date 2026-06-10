/** Internal / QA emails excluded from CRM admin aggregates. */
export const INTERNAL_CRM_EMAILS = [
  "noelbrianna@gmail.com",
  "testemil@gmail.com",
  "testemial@gmail.com",
  "brianna@illuminairy.com",
  "support@illuminairy.com",
  "zajicek@gmail.com",
  "zajicek.brianna@gmail.com",
  "jane.test+quiz@example.com",
  "adas@gmail.com"
] as const;

export function isInternalCrmEmail(email: string | null | undefined) {
  if (!email) return false;
  return INTERNAL_CRM_EMAILS.includes(
    email.trim().toLowerCase() as (typeof INTERNAL_CRM_EMAILS)[number]
  );
}
