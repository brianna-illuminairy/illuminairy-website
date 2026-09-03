/** Plan Builder lab funnel (variant B) — analytics + CRM segmentation. */
export const PLAN_BUILDER_FUNNEL_ID = "plan_builder_b";

export const PLAN_BUILDER_VARIANT = "b";

/** Free lesson quiz (`/plan-b`) — PostHog + CRM + touch_events use `plan_builder_b`.
 * Legacy CRM rows may still say `sat_quiz_b`; treat as an alias via isFreeLessonFunnelId. */
export const LAB_ANALYTICS_PROPS = {
  plan_builder_funnel: PLAN_BUILDER_VARIANT,
  funnel_id: PLAN_BUILDER_FUNNEL_ID,
  offer_goal: "free_lesson",
} as const;
