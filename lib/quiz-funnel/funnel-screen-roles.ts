/**
 * Plan Builder screen roles — disambiguates PostHog step IDs from product names.
 *
 * **Plan reveal** = step `v1` (`QFV1Projection`). Eyebrow "Personalized SAT plan"; chart + "What's on the line".
 * **Goal achievability rating** = step `achievability` (`QFSGoalAchievability`). Pre-name; tier gauge, no chart.
 *
 * Legacy aliases `reveal` / `s1` map to `achievability`, NOT `v1`. Do not grep "plan reveal" and land here.
 */
import { canonicalizeQuizStepId } from "@/lib/quiz-funnel/step-aliases";

export type FunnelScreenRole =
  | "goal_achievability_rating"
  | "plan_reveal"
  | "plan_handoff"
  | "funnel_step";

export type FunnelScreenMeta = {
  /** Stable analytics + agent-facing role (PostHog `funnel_screen_role`). */
  role: FunnelScreenRole;
  /** React component that renders this step. */
  component: string | null;
  /** Human label for dashboards (not customer copy). */
  label: string;
  /** True only for step `v1` — the Personalized SAT plan reveal. */
  isPlanReveal: boolean;
  /** PostHog `quiz_step_viewed.step` after canonicalization. */
  postHogStep: string;
};

const SCREEN_META: Record<string, FunnelScreenMeta> = {
  achievability: {
    role: "goal_achievability_rating",
    component: "QFSGoalAchievability",
    label: "Goal score achievability rating (pre-name)",
    isPlanReveal: false,
    postHogStep: "achievability",
  },
  v1: {
    role: "plan_reveal",
    component: "QFV1Projection",
    label: "Plan reveal · Personalized SAT plan",
    isPlanReveal: true,
    postHogStep: "v1",
  },
  s4: {
    role: "plan_handoff",
    component: "QFS4PlanHandoff",
    label: "Plan handoff (post-reveal)",
    isPlanReveal: false,
    postHogStep: "s4",
  },
};

const DEFAULT_META: FunnelScreenMeta = {
  role: "funnel_step",
  component: null,
  label: "Funnel step",
  isPlanReveal: false,
  postHogStep: "",
};

/** SSOT: role + component for a funnel step ID (canonical or alias). */
export function funnelScreenMeta(stepId: string): FunnelScreenMeta {
  const canonical = canonicalizeQuizStepId(stepId);
  const meta = SCREEN_META[canonical];
  if (!meta) {
    return { ...DEFAULT_META, postHogStep: canonical };
  }
  return meta;
}

export function funnelScreenRole(stepId: string): FunnelScreenRole {
  return funnelScreenMeta(stepId).role;
}

export function funnelScreenComponent(stepId: string): string | null {
  return funnelScreenMeta(stepId).component;
}

export function isPlanRevealStep(stepId: string): boolean {
  return funnelScreenMeta(stepId).isPlanReveal;
}

/** PostHog / admin label; falls back to step id. */
export function funnelScreenLabel(stepId: string): string {
  const meta = funnelScreenMeta(stepId);
  return meta.label || meta.postHogStep || stepId;
}
