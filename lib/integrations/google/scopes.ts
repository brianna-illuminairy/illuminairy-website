/**
 * Google OAuth scopes required by the CRM v4 call-intelligence pipeline.
 *
 * Owner grants these once at /admin/integrations -> Connect Google. The OAuth
 * consent screen for `illuminairy-crm` lists the same scopes; if you add to
 * this list, add them in the Google Cloud Console as well.
 */

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/meetings.space.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/drive.readonly"
] as const;

export type GoogleScope = (typeof GOOGLE_SCOPES)[number];

/** Returns the space-separated scope string for OAuth URLs. */
export function googleScopesParam(): string {
  return GOOGLE_SCOPES.join(" ");
}
