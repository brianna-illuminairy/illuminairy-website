/** Whether to insert the GPA vs SAT score gap interstitial before the name step. */
export function showGapScreen(answers: {
  q9?: string;
  q4?: string;
}): boolean {
  const highGpa = ["3.0-3.3", "3.3-3.5", "3.5-3.7", "3.7-3.9", "4.0+"].includes(
    answers.q9 ?? ""
  );
  const q4 = answers.q4 ?? "";
  const lowScore =
    q4 !== "na" &&
    ["u1000", "1100-1200", "1200-1300", "1300-1400"].includes(q4);
  return highGpa && lowScore;
}
