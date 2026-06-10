/**
 * @deprecated Import from `@/lib/quiz-funnel/goal-achievability-screen`.
 *
 * Historical misnomer: this module builds the **goal achievability rating** screen
 * (PostHog step `achievability`), NOT the plan reveal (`v1` / `QFV1Projection`).
 */
export {
  type GoalAchievabilityScreenModel,
  type GoalAchievabilityScreenLever,
  type PlanRevealInputGroup,
  type PlanRevealInputRow,
  type PlanRevealLever,
  type PlanRevealModel,
  buildGoalAchievabilityScreenModel,
  buildInputGroups,
  buildPlanReveal,
} from "./goal-achievability-screen";
