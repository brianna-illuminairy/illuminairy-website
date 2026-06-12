import type { EnrollPrefill } from "@/lib/enroll/enroll-prefill";
import type { EnrollReceipt } from "@/lib/enroll/enroll-receipt";
import { satProgram, site } from "@/lib/site";

/**
 * Preview-mode session id for `/enroll`. Lets developers and reviewers walk
 * the post-payment onboarding flow without going through real Stripe checkout.
 *
 * Usage: navigate to `/enroll?preview=1` or `/enroll?session_id=preview`.
 *
 * Hard-blocked on production deploys (`VERCEL_ENV === "production"`). On
 * preview / development, the session route returns canned prefill instead
 * of calling Stripe, and the intake route accepts but no-ops the submit.
 */
export const ENROLL_PREVIEW_SESSION_ID = "preview";

function previewTrialEndIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString();
}

/** Stub receipt for `?preview=1` — mirrors CHECKOUT-TRUTH.md product names. */
export const ENROLL_PREVIEW_RECEIPT: EnrollReceipt = {
  entityName: "Illuminairy SAT Prep",
  legalEntityLine: `Illuminairy SAT Prep is a service of ${site.legalName}, ${site.location}.`,
  customerEmail: "preview+parent@illuminairy.com",
  oneTime: {
    productName: "Skill Diagnostic + Plan",
    amountCents: 24_900,
    currency: "usd",
    paidAtIso: new Date().toISOString(),
    receiptSuffix: "PREVIEW01"
  },
  subscription: {
    productName: "Weekly Tutoring",
    amountCents: 9_900,
    currency: "usd",
    interval: "week",
    trialEndIso: previewTrialEndIso(),
    billingWeekday: "Monday"
  },
  examDayLabel: satProgram.examDayLabel
};

export const ENROLL_PREVIEW_PREFILL: EnrollPrefill = {
  parentFirst: "Brianna",
  parentLast: "Zajicek",
  parentPhone: "",
  parentEmail: "preview+parent@illuminairy.com",
  studentFirst: "Sophia",
  studentLast: "Zajicek",
  studentGrade: "11",
  studentSchool: "",
  studentPhone: "",
  studentEmail: ""
};

/** Returns true when the request should use preview-mode short-circuit. */
export function isEnrollPreviewSessionId(sessionId: string | null | undefined): boolean {
  if (!sessionId) return false;
  if (sessionId.trim().toLowerCase() !== ENROLL_PREVIEW_SESSION_ID) return false;
  return enrollPreviewModeAllowed();
}

/**
 * Production *deploys* are never allowed to short-circuit Stripe.
 * Local `next dev` is always allowed regardless of `VERCEL_ENV` (Brianna's
 * `.env.local` mirrors prod env vars, so we can't gate solely on VERCEL_ENV).
 */
export function enrollPreviewModeAllowed(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return process.env.VERCEL_ENV !== "production";
}
