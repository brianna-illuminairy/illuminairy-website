/**
 * LOCKED — Sohail Yousaf custom enrollment page data (sent Jun 2026).
 *
 * This file exists to serve `/enroll/sohail-shermeen` only. It is **not** a
 * template for new enrollment pages. Do not add new leads here, do not
 * import this file from anything but Sohail's own page + components +
 * APIs, and do not edit Sohail's lead config without an explicit owner
 * unlock — the page link was already sent and must remain stable.
 *
 * New enrollment pages live in `lib/standard-enroll.ts`.
 *
 * See: app/enroll/sohail-shermeen/LOCK.md
 *
 * --- Original header ---
 * Personalized post-call enrollment pages (one per high-value lead).
 *
 * URL pattern: /enroll/{slug}  e.g. /enroll/sohail-shermeen
 * Hand-tuned per lead from the Strategy Call notes + their email replies,
 * so the page answers their specific objections inline before they re-ask.
 *
 * Stats from `lib/site.ts` are NOT duplicated here — only per-lead facts
 * (names, score baseline, phase plan, recap quote, Stripe link variant).
 */

export type PersonalizedEnrollLead = {
  slug: string;
  parent: { first: string; last?: string; full: string; email?: string };
  student: { first: string; full: string; gradeNote: string };
  /** Their last known score baseline + source so the page is honest. */
  startScore: number;
  startScoreSource: string;
  /** Phase 1 only — full path is mapped in the call-recap copy, not the metrics. */
  phase1: {
    weeks: number;
    pacePerWeek: number;
    /** Locked at page-send time so dates do not shift if the lead reads it later. */
    startDateLabel: string;
    reviewDateLabel: string;
    /** What "Phase 1 review" actually is (PSAT, mock SAT, etc.). */
    reviewMilestoneLabel: string;
  };
  /** Optional phase 2 / 3 framing for the call-recap section. */
  longerArc?: string[];
  pricing: {
    diagPrice: number;
    weeklyPrice: number;
    /** Stable product IDs in our Stripe account. Their default Price IDs are
     *  resolved server-side at checkout creation, so changing the price (or
     *  swapping in a coupon) does not require a code change. */
    stripeDiagnosticProductId: string;
    stripeWeeklyProductId: string;
    /** Days of trial to apply to the weekly subscription. The first weekly
     *  charge does not hit until trial end. */
    weeklyTrialDays: number;
    /** Legacy Stripe Payment Link, kept as a fallback if the on-page checkout
     *  call fails for any reason. */
    stripeFallbackLink: string;
  };
  advisor: { first: string; full: string; email: string };
  call: {
    /** ISO date — the Strategy Call we are following up on. */
    dateLabel: string;
    /** 1-2 sentences from the actual call we want to surface as a pull-quote. */
    recapPullQuote: string;
  };
  /** A short, Sohail-specific opening line on the welcome card. Optional. */
  welcomeLeadIn?: string;
};

const sohailShermeen: PersonalizedEnrollLead = {
  slug: "sohail-shermeen",
  parent: {
    first: "Sohail",
    last: "Yousaf",
    full: "Sohail Yousaf",
    email: "sohailft@gmail.com"
  },
  student: {
    first: "Shermeen",
    full: "Shermeen Yousaf",
    gradeNote: "rising sophomore"
  },
  startScore: 1080,
  startScoreSource:
    "Average of two unproctored College Board Blue Book practice tests (1070–1080).",
  phase1: {
    weeks: 12,
    pacePerWeek: 15,
    startDateLabel: "Jun 15, 2026",
    reviewDateLabel: "Sep 20, 2026",
    reviewMilestoneLabel: "Review missed questions"
  },
  longerArc: [
    "Phase 1 (now → Sep 20): foundation cycle. Rebuild the base, fix the highest-impact gaps first.",
    "October sophomore PSAT: first official benchmark, written into the College Board record.",
    "Phase 2 (summer before junior year): National Merit / PSAT-NMSQT push, and her first official SAT (May 1, 2027 target — Mar 6 or Jun 5 as backups).",
    "Phase 3 (junior year, if needed): final score optimization for 1500+ and superscoring."
  ],
  pricing: {
    diagPrice: 249,
    weeklyPrice: 99,
    stripeDiagnosticProductId: "prod_UfmBm2GawHFXRA",
    stripeWeeklyProductId: "prod_UfmE3JUG5ykfSk",
    weeklyTrialDays: 7,
    stripeFallbackLink: "https://buy.stripe.com/7sYcMY7DK1X19lO7gZc7u01"
  },
  advisor: {
    first: "Brianna",
    full: "Brianna Zajicek",
    email: "brianna@illuminairy.com"
  },
  call: {
    dateLabel: "June 9, 2026",
    recapPullQuote:
      "We'd want to spread the work across two or three official SATs. Phase 1 is the foundation. We use Shermeen's summer to build the base, then push through Phase 2 the summer before junior year for National Merit, and Phase 3 during junior year if needed for the final 1500+ push."
  },
  welcomeLeadIn:
    "I built this page so you and Shermeen can see Phase 1 in one place before you decide. Every question from your reply is answered below."
};

export const personalizedEnrollLeads: Record<string, PersonalizedEnrollLead> = {
  [sohailShermeen.slug]: sohailShermeen
};

export function getPersonalizedEnrollLead(
  slug: string
): PersonalizedEnrollLead | null {
  return personalizedEnrollLeads[slug] ?? null;
}

/**
 * Phase 1 derived metrics — pure function, no `new Date()` so dates are stable.
 */
export function phase1Metrics(lead: PersonalizedEnrollLead) {
  const gain = lead.phase1.weeks * lead.phase1.pacePerWeek;
  const goalScore = lead.startScore + gain;
  const days = lead.phase1.weeks * 7;
  return { gain, goalScore, days };
}
