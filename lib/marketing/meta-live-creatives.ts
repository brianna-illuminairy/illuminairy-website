import type { LandingHeroHook } from "@/lib/landing/hero-hooks";
import {
  metaLandingUrl,
  metaSatPlanBuilderLandingUrl,
  metaScoreReviewLandingUrl,
} from "@/lib/landing/meta-traffic";
import { SAT_PLAN_BUILDER_LP_PATH } from "@/lib/plan-builder-routes";
import { SCORE_REVIEW_LP_PATH } from "@/lib/score-review-routes";
import { canonicalizeUtmContent } from "@/lib/marketing/utm-content-aliases";

/** Live Meta cold ads — source of truth for utm_content → LP hook. */
export type MetaLiveCreative = {
  id: string;
  utmContent: string;
  utmCampaign: string;
  utmTerm: string;
  landingPath: "/" | "/sat-plan-builder" | "/june-score-review";
  heroHook: LandingHeroHook;
  angle: string;
  /** Optional creative revision — appended as `?version=` on ad URL. */
  version?: string;
};

/** All live cold ads land on the ad LP path (never `/plan?step=…`). */
export const META_LIVE_AD_LP_PATH = SAT_PLAN_BUILDER_LP_PATH;

export const META_LIVE_CREATIVES: readonly MetaLiveCreative[] = [
  {
    id: "ad1_concerned_mom",
    utmContent: "script_5",
    utmCampaign: "c1_concerned_mom_cold_test",
    utmTerm: "broad_moms_35_58",
    landingPath: META_LIVE_AD_LP_PATH,
    heroHook: "gap",
    angle: "Good grades, SAT score shock — v4 default headline (no score band)"
  },
  {
    id: "ad2_enough_time",
    utmContent: "ad2_enough_time",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: META_LIVE_AD_LP_PATH,
    heroHook: "fall",
    angle: "Do we have enough time before deadlines?"
  },
  {
    id: "ad3_before_tutoring",
    utmContent: "ad3_before_tutoring",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: META_LIVE_AD_LP_PATH,
    heroHook: "tutor",
    angle: "Before paying for tutoring — what score is realistic?"
  },
  {
    id: "ad3_before_tutoring_hd1080",
    utmContent: "ad3_before_tutoring_hd1080",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: META_LIVE_AD_LP_PATH,
    heroHook: "tutor",
    version: "hd1080",
    angle: "HD relaunch — tutor LP → Plan Builder B (`/plan-b`) lab funnel"
  },
  {
    id: "ad4_mom_first_story",
    utmContent: "ad4_mom_first_story",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: META_LIVE_AD_LP_PATH,
    heroHook: "student_story",
    angle: "Same video as ad5 (mom cut) — variant-highgpa-ap-lowsat LP headline"
  },
  {
    id: "ad5_high_gpa_student_story",
    utmContent: "ad5_high_gpa_student_story",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: META_LIVE_AD_LP_PATH,
    heroHook: "student_story",
    angle: "Student-led story — 3.9 GPA / 11 AP / 1160, mom asks why score low, 1430 outcome"
  },
  {
    id: "ad6_june_score_review",
    utmContent: "june_score_review",
    utmCampaign: "c1_june_score_review",
    utmTerm: "broad_moms_35_58",
    landingPath: SCORE_REVIEW_LP_PATH,
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
  heroHook: LandingHeroHook;
  url: string;
};

/** Copy-paste destinations for Meta Ads Manager — LP entry only. */
export function metaLiveAdDestinationUrls(): MetaLiveAdUrlRow[] {
  return META_LIVE_CREATIVES.map((creative) => ({
    id: creative.id,
    utmContent: creative.utmContent,
    landingPath: creative.landingPath,
    heroHook: creative.heroHook,
    url: metaLiveCreativeUrl(creative)
  }));
}

export function assertMetaAdDestinationUrl(url: string): void {
  const lower = url.toLowerCase();
  if (lower.includes("/plan") || lower.includes("/quiz")) {
    throw new Error(`Meta ad URL must land on LP, not funnel: ${url}`);
  }
  if (lower.includes("step=")) {
    throw new Error(`Meta ad URL must not deep-link a funnel step: ${url}`);
  }
}

export function heroHookForUtmContent(content: string): LandingHeroHook | null {
  const canonical = canonicalizeUtmContent(content);
  const row = META_LIVE_CREATIVES.find((c) => c.utmContent === canonical);
  return row?.heroHook ?? null;
}
