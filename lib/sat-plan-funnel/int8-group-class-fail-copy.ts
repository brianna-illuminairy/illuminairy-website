export type Int8GroupClassFailCopy = {
  headline: string;
  paragraphs: string[];
  graphicAriaLabel: string;
};

export function buildInt8GroupClassFailCopy(): Int8GroupClassFailCopy {
  return {
    headline: "Why group SAT classes rarely work for plateaued students",
    paragraphs: [
      "Most SAT classes move every student through the same topics at the same pace.",
      "But students stuck in the 1100s and 1200s usually aren't struggling with everything equally.",
      "They're losing points from a smaller number of recurring weaknesses that never get fully fixed.",
      "So while classes keep moving forward, those gaps compound test after test."
    ],
    graphicAriaLabel:
      "Classroom with fifteen students, each highlighting a different weak area, while the teacher delivers one broad lesson. Overlay: one curriculum, different weaknesses. Score progression shows minimal movement: 1100 to 1120 to 1110 to 1140."
  };
}
