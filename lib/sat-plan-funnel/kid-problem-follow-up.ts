import type { SatPlanStep } from "@/lib/sat-plan-funnel/types";

/**
 * Future: branch to a short follow-up screen keyed by primary blocker.
 * Selections are stored on `answers.kid_problem_blocks` until then.
 */
export function nextKidProblemFollowUpStep(_selectedIds: string[]): SatPlanStep | null {
  return null;
}
