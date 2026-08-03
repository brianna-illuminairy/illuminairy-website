/** Plan Builder lab funnel (variant B) — analytics + CRM segmentation. */
export const PLAN_BUILDER_FUNNEL_ID = "plan_builder_b";

export const PLAN_BUILDER_VARIANT = "b";

/** Free lesson quiz (`/plan-b`) — PostHog register + event props. CRM touch funnel stays `sat_quiz_b`. */
export const LAB_ANALYTICS_PROPS = {
  plan_builder_funnel: PLAN_BUILDER_VARIANT,
  funnel_id: PLAN_BUILDER_FUNNEL_ID,
  offer_goal: "free_lesson",
} as const;
