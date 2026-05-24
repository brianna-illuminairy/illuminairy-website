import { normalizePrepMethods } from "@/lib/sat-plan-funnel/prep-options";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

function voice(testTaker?: string) {
  switch (testTaker) {
    case "test_taker_daughter":
      return { subject: "she", possessive: "her" };
    case "test_taker_son":
      return { subject: "he", possessive: "his" };
    case "test_taker_self":
      return { subject: "you", possessive: "your" };
    default:
      return { subject: "they", possessive: "their" };
  }
}

export function shouldShowKidProblem(prepMethod?: SatPlanAnswers["prep_method"]): boolean {
  const prepIds = normalizePrepMethods(prepMethod);
  if (prepIds.length === 0) return true;
  if (prepIds.includes("prep_class")) return false;
  return prepIds.some((id) =>
    ["prep_khan", "prep_bluebook", "prep_youtube", "prep_little_none", "prep_app"].includes(id)
  );
}

export function kidProblemHeadline(testTaker?: string): string {
  const { subject, possessive } = voice(testTaker);
  if (subject === "you") {
    return "What gets in your way most on SAT prep?";
  }
  return `What gets in ${possessive} way most on SAT prep?`;
}
