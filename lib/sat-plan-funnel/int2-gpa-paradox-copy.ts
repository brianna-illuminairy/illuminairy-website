import { GPA_OPTIONS } from "@/lib/sat-plan-funnel/gpa-options";
import { isHighGpaLowSat } from "@/lib/sat-plan-funnel/score-gap";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int2GpaParadoxCopy = {
  headline: string;
  paragraphs: string[];
};

function voice(testTaker?: string) {
  switch (testTaker) {
    case "test_taker_daughter":
      return { subject: "she", possessive: "her", object: "her" };
    case "test_taker_son":
      return { subject: "he", possessive: "his", object: "him" };
    case "test_taker_self":
      return { subject: "you", possessive: "your", object: "you" };
    case "test_taker_other":
      return { subject: "they", possessive: "their", object: "them" };
    default:
      return { subject: "they", possessive: "their", object: "them" };
  }
}

function gpaLabel(gpaBand?: string): string {
  const row = GPA_OPTIONS.find((opt) => opt.id === gpaBand);
  return row?.label ?? "strong";
}

export function buildInt2GpaParadoxCopy(answers: SatPlanAnswers): Int2GpaParadoxCopy {
  const { subject, possessive, object } = voice(answers.test_taker);
  const gpa = gpaLabel(answers.gpa_band);
  const fullGap = isHighGpaLowSat(answers.gpa_band, answers.recent_score);

  if (fullGap) {
    const headline =
      subject === "you"
        ? "Your GPA says one thing. Your SAT says another."
        : `${possessive.charAt(0).toUpperCase()}${possessive.slice(1)} GPA says one thing. ${possessive.charAt(0).toUpperCase()}${possessive.slice(1)} SAT says another.`;

    const paragraphs =
      subject === "you"
        ? [
            `With a ${gpa} GPA, you've proven you can learn the material — but the Digital SAT rewards speed, format, and decision-making under pressure.`,
            "Classroom grades measure consistency over a semester. The SAT measures how fast you apply what you know when the clock is running.",
            "That gap isn't a character flaw — it's a skills gap we can map and train."
          ]
        : [
            `With a ${gpa} GPA, ${subject} has proven ${subject} can learn the material — but the Digital SAT rewards speed, format, and decision-making under pressure.`,
            "Classroom grades measure consistency over a semester. The SAT measures how fast you apply what you know when the clock is running.",
            `That gap isn't a character flaw — it's a skills gap we can map for ${object}.`
          ];

    return { headline, paragraphs };
  }

  const headline =
    subject === "you"
      ? "Strong grades don't automatically translate to SAT scores."
      : "Strong grades don't automatically translate to SAT scores.";

  const paragraphs =
    subject === "you"
      ? [
          `A ${gpa} GPA shows you can handle schoolwork — but the SAT tests timing, format, and pressure in ways homework doesn't.`,
          "The good news: those are trainable skills, not fixed traits."
        ]
      : [
          `A ${gpa} GPA shows ${subject} can handle schoolwork — but the SAT tests timing, format, and pressure in ways homework doesn't.`,
          "The good news: those are trainable skills, not fixed traits."
        ];

  return { headline, paragraphs };
}
