/** Pronouns for Step 2 `test_taker` — used on Step 3+ and interstitials. */

export type SubjectPronouns = {
  subject: string;
  child: string;
};

export function subjectPronouns(testTaker?: string): SubjectPronouns {
  switch (testTaker) {
    case "test_taker_daughter":
      return { subject: "she", child: "daughter" };
    case "test_taker_son":
      return { subject: "he", child: "son" };
    case "test_taker_self":
      return { subject: "you", child: "student" };
    case "test_taker_other":
      return { subject: "they", child: "them" };
    default:
      return { subject: "they", child: "student" };
  }
}

export function childGoalPhrase(testTaker: string | undefined, child: string): string {
  if (testTaker === "test_taker_self") return "you";
  if (child === "them") return "them";
  return `their ${child}`;
}
