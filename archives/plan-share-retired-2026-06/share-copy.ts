/** Reveal · share with spouse, student, or another parent */

export const SHARE_PANEL_HEADLINE = "Share this plan";

export const SHARE_PANEL_LEAD =
  "Send a read-only snapshot to your spouse, your student, or another parent so everyone sees the same projection and focus areas.";

export const SHARE_INCLUDE_NAME_LABEL =
  "Use their first name on the shared page (no scores or contact info in the link).";

export const SHARE_COPY_LINK = "Copy share link";

export const SHARE_NATIVE = "Share…";

export const SHARE_LINK_COPIED = "Link copied";

export const SHARE_ERROR =
  "Could not create a share link right now. Try again in a moment.";

export function sharePageTitle(studentLabel: string | null): string {
  if (studentLabel) {
    return `${studentLabel}'s SAT Improvement Plan`;
  }
  return "SAT Improvement Plan snapshot";
}

export const SHARE_PAGE_INTRO =
  "A parent shared this starter plan and score projection from Illuminairy. Numbers are illustrative until a Skill Diagnostic.";

export const SHARE_PAGE_CTA = "Build your child's Improvement Plan";

export const SHARE_PAGE_CTA_SUB =
  "Free · ~2 minutes · for parents · no test for your child yet";

export const SHARE_PAGE_DISCLAIMER =
  "Snapshot only, not a score guarantee. Individual results vary.";

export function shareMessageText(url: string, studentLabel: string | null): string {
  const subject = studentLabel
    ? `${studentLabel}'s SAT Improvement Plan`
    : "an SAT Improvement Plan";
  return `I built ${subject} on Illuminairy: score projection and which skills to focus on first. Takes about 2 minutes for parents: ${url}`;
}
