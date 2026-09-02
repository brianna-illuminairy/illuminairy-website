import type { LandingHeroHook } from "@/lib/landing/hero-hooks";
import {
  metaLandingUrl,
  metaSatPlanBuilderLandingUrl,
  metaScoreReviewLandingUrl,
  metaStrategyCallFunnelUrl,
} from "@/lib/landing/meta-traffic";
import { AD3_HD_LANDING_PATH } from "@/lib/plan-builder-b-routes";
import { SCORE_REVIEW_LP_PATH } from "@/lib/score-review-routes";
import { canonicalizeUtmContent } from "@/lib/marketing/utm-content-aliases";

/** Offer the ad books into — PostHog `offer_goal` + CRM funnel split. */
export type MetaLiveOfferGoal = "strategy_call" | "free_lesson" | "score_review";

/** Live Meta cold ads — source of truth for utm_content → destination + hook. */
export type MetaLiveCreative = {
  id: string;
  utmContent: string;
  utmCampaign: string;
  utmTerm: string;
  landingPath: "/" | "/plan" | "/sat-plan-builder" | "/june-score-review";
  offerGoal: MetaLiveOfferGoal;
  heroHook: LandingHeroHook;
  angle: string;
  /** Optional creative revision — appended as `?version=` on ad URL. */
  version?: string;
};

/** Default free-lesson cold LP (ad3 HD). */
export const META_LIVE_AD_LP_PATH = AD3_HD_LANDING_PATH;

export const META_LIVE_CREATIVES: readonly MetaLiveCreative[] = [
  {
    id: "ad1_concerned_mom",
    utmContent: "script_5",
    utmCampaign: "c1_concerned_mom_cold_test",
    utmTerm: "broad_moms_35_58",
    landingPath: "/",
    offerGoal: "strategy_call",
    heroHook: "gap",
    angle: "Good grades, SAT score shock — v4 default headline (no score band)"
  },
  {
    id: "ad2_enough_time",
    utmContent: "ad2_enough_time",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: "/",
    offerGoal: "strategy_call",
    heroHook: "fall",
    angle: "Do we have enough time before deadlines?"
  },
  {
    id: "ad3_before_tutoring",
    utmContent: "ad3_before_tutoring",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: "/plan",
    offerGoal: "strategy_call",
    heroHook: "tutor",
    angle: "Legacy (not HD) tutor creative → Strategy Call funnel `/plan`"
  },
  {
    id: "ad3_before_tutoring_hd1080",
    utmContent: "ad3_before_tutoring_hd1080",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: META_LIVE_AD_LP_PATH,
    offerGoal: "free_lesson",
    heroHook: "tutor",
    version: "hd1080",
    angle: "Ad3 HD — `/sat-plan-builder` → free lesson `/plan-b`"
  },
  {
    id: "ad4_mom_first_story",
    utmContent: "ad4_mom_first_story",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: "/",
    offerGoal: "strategy_call",
    heroHook: "student_story",
    angle: "Same video as ad5 (mom cut) — variant-highgpa-ap-lowsat LP headline"
  },
  {
    id: "ad5_high_gpa_student_story",
    utmContent: "ad5_high_gpa_student_story",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: "/",
    offerGoal: "strategy_call",
    heroHook: "student_story",
    angle: "Student-led story — 3.9 GPA / 11 AP / 1160, mom asks why score low, 1430 outcome"
  },
  {
    id: "ad6_june_score_review",
    utmContent: "june_score_review",
    utmCampaign: "c1_june_score_review",
    utmTerm: "broad_moms_35_58",
    landingPath: SCORE_REVIEW_LP_PATH,
    offerGoal: "score_review",
    heroHook: "june_score_review",
    angle: "Mom story 1200s→1450 + free June score review before early apps"
  }
] as const;

export function metaLiveCreativeUrl(creative: MetaLiveCreative): string {
  const input = {
    campaign: creative.utmCampaign,
    content: creative.utmContent,
    term: creative.utmTerm,
    hook: creative.heroHook,
    version: creative.version
  };
  if (creative.landingPath === "/plan") {
    return metaStrategyCallFunnelUrl(input);
  }
  if (creative.landingPath === "/") {
    return metaLandingUrl(input);
  }
  if (creative.landingPath === SCORE_REVIEW_LP_PATH) {
    return metaScoreReviewLandingUrl(input);
  }
  return metaSatPlanBuilderLandingUrl(input);
}

export type MetaLiveAdUrlRow = {
  id: string;
  utmContent: string;
  landingPath: string;
  offerGoal: MetaLiveOfferGoal;
  heroHook: LandingHeroHook;
  url: string;
};

/** Copy-paste destinations for Meta Ads Manager. */
export function metaLiveAdDestinationUrls(): MetaLiveAdUrlRow[] {
  return META_LIVE_CREATIVES.map((creative) => ({
    id: creative.id,
    utmContent: creative.utmContent,
    landingPath: creative.landingPath,
    offerGoal: creative.offerGoal,
    heroHook: creative.heroHook,
    url: metaLiveCreativeUrl(creative)
  }));
}

/**
 * Ad destinations may be LP (`/`, `/sat-plan-builder`) or Strategy Call entry (`/plan`).
 * Never deep-link a quiz step.
 */
export function assertMetaAdDestinationUrl(url: string): void {
  const lower = url.toLowerCase();
  if (lower.includes("step=")) {
    throw new Error(`Meta ad URL must not deep-link a funnel step: ${url}`);
  }
  if (lower.includes("/quiz") && !lower.includes("/sat-plan-builder")) {
    throw new Error(`Meta ad URL must not use internal /quiz path: ${url}`);
  }
  try {
    const path = new URL(url).pathname.replace(/\/$/, "") || "/";
    const allowed = new Set([
      "/",
      "/plan",
      "/sat-plan-builder",
      "/june-score-review",
    ]);
    if (!allowed.has(path)) {
      throw new Error(`Meta ad URL path not allowed: ${url}`);
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Meta ad")) throw err;
    throw new Error(`Meta ad URL invalid: ${url}`);
  }
}

export function heroHookForUtmContent(content: string): LandingHeroHook | null {
  const canonical = canonicalizeUtmContent(content);
  const row = META_LIVE_CREATIVES.find((c) => c.utmContent === canonical);
  return row?.heroHook ?? null;
}

/** Human label for CRM / dashboards from lead.funnel. */
export function offerLabelForCrmFunnel(funnel: string | null | undefined): string {
  if (funnel === "sat_quiz_b") return "Free lesson";
  if (funnel === "score_review") return "Score review";
  if (funnel === "sat_quiz") return "Strategy Call";
  return funnel?.trim() || "Unknown";
}
