import type { LandingHeroHook } from "@/lib/landing/hero-hooks";
import {
  metaLandingUrl,
  metaSatPlanBuilderLandingUrl
} from "@/lib/landing/meta-traffic";

/** Live Meta cold ads — source of truth for utm_content → LP hook. */
export type MetaLiveCreative = {
  id: string;
  utmContent: string;
  utmCampaign: string;
  utmTerm: string;
  landingPath: "/" | "/sat-plan-builder";
  heroHook: LandingHeroHook;
  angle: string;
};

export const META_LIVE_CREATIVES: readonly MetaLiveCreative[] = [
  {
    id: "ad1_concerned_mom",
    utmContent: "script_5",
    utmCampaign: "c1_concerned_mom_cold_test",
    utmTerm: "broad_moms_35_58",
    landingPath: "/",
    heroHook: "gap",
    angle: "Good grades, SAT score shock — v4 default headline (no score band)"
  },
  {
    id: "ad2_enough_time",
    utmContent: "ad2_enough_time",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: "/sat-plan-builder",
    heroHook: "fall",
    angle: "Do we have enough time before deadlines?"
  },
  {
    id: "ad3_before_tutoring",
    utmContent: "ad3_before_tutoring",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: "/sat-plan-builder",
    heroHook: "tutor",
    angle: "Before paying for tutoring — what score is realistic?"
  },
  {
    id: "ad4_mom_first_story",
    utmContent: "ad4_mom_first_story",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: "/sat-plan-builder",
    heroHook: "mom_story",
    angle: "Testimonial — 3.9 GPA / 1160 SAT, mom panic on time, 1160→1430 outcome"
  },
  {
    id: "ad5_high_gpa_student_story",
    utmContent: "ad5_high_gpa_student_story",
    utmCampaign: "c1_sat_plan_builder_cold_creative_test",
    utmTerm: "broad_moms_35_58",
    landingPath: "/sat-plan-builder",
    heroHook: "student_story",
    angle: "Student-led story — 3.9 GPA / 11 AP / 1160, mom asks why score low, 1430 outcome"
  }
] as const;

export function metaLiveCreativeUrl(creative: MetaLiveCreative): string {
  const input = {
    campaign: creative.utmCampaign,
    content: creative.utmContent,
    term: creative.utmTerm,
    hook: creative.heroHook
  };
  if (creative.landingPath === "/sat-plan-builder") {
    return metaSatPlanBuilderLandingUrl(input);
  }
  return metaLandingUrl(input);
}

export function heroHookForUtmContent(content: string): LandingHeroHook | null {
  const row = META_LIVE_CREATIVES.find((c) => c.utmContent === content);
  return row?.heroHook ?? null;
}
