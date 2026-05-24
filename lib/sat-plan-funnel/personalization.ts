/** Step 3 headline — pronoun follows Step 2 `test_taker`. */

export function targetScoreHeadline(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_daughter":
      return "What score is she aiming for?";
    case "test_taker_son":
      return "What score is he aiming for?";
    case "test_taker_self":
      return "What score are you aiming for?";
    case "test_taker_other":
      return "What score are they aiming for?";
    default:
      return "What score are you aiming for on the SAT?";
  }
}
