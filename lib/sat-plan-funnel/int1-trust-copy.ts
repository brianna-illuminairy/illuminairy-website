import { satProgramOutcomes } from "@/lib/site";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";
import type { TargetScoreId } from "@/lib/sat-plan-funnel/target-score-options";

/** @deprecated Use satProgramOutcomes.plansBuiltCount — kept for imports during transition */
export const INT1_PARENTS_HELPED_COUNT = satProgramOutcomes.plansBuiltCount;

function targetGoalPhrase(targetScore?: string): string {
  switch (targetScore as TargetScoreId | undefined) {
    case "target_1200_1300":
      return "1200+";
    case "target_1300_1400":
      return "1300+";
    case "target_1400_1500":
      return "1400+";
    case "target_1500_plus":
      return "1500+";
    default:
      return "";
  }
}

type ChildVoice = {
  planPossessive: string;
  isSelf: boolean;
};

function childVoice(testTaker?: string): ChildVoice {
  switch (testTaker) {
    case "test_taker_son":
      return { planPossessive: "your son's", isSelf: false };
    case "test_taker_daughter":
      return { planPossessive: "your daughter's", isSelf: false };
    case "test_taker_self":
      return { planPossessive: "your", isSelf: true };
    case "test_taker_other":
    default:
      return { planPossessive: "your student's", isSelf: false };
  }
}

export type Int1TrustCopy = {
  lead: string;
  bridgeBefore: string;
  bridgeTarget: string;
  bridgeAfter: string;
};

export const INT1_TRUST_HEADLINE = "You're in good hands.";

function buildLead(voice: ChildVoice): string {
  if (voice.isSelf) {
    return "Most students came to us to build a plan after their first SAT score came back too low.";
  }

  return "Most parents came to us to build them a plan after their first SAT score came back too low.";
}

function buildBridge(
  voice: ChildVoice,
  targetGoal: string
): Pick<Int1TrustCopy, "bridgeBefore" | "bridgeTarget" | "bridgeAfter"> {
  if (targetGoal === "") {
    return {
      bridgeBefore: `Let's build ${voice.planPossessive} plan.`,
      bridgeTarget: "",
      bridgeAfter: ""
    };
  }

  return {
    bridgeBefore: `Let's build ${voice.planPossessive} plan to hit `,
    bridgeTarget: targetGoal,
    bridgeAfter: "."
  };
}

export function buildInt1TrustCopy(answers: SatPlanAnswers): Int1TrustCopy {
  const voice = childVoice(answers.test_taker);
  const targetGoal = targetGoalPhrase(answers.target_score);

  return {
    lead: buildLead(voice),
    ...buildBridge(voice, targetGoal)
  };
}
