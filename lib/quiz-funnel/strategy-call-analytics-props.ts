/** Strategy Call quiz (`/plan`) — PostHog register + shared offer identity. */

export const STRATEGY_CALL_FUNNEL_ID = "sat_quiz";

export const STRATEGY_CALL_ANALYTICS_PROPS = {
  funnel_id: STRATEGY_CALL_FUNNEL_ID,
  offer_goal: "strategy_call",
} as const;
