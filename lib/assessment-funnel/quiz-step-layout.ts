export type AssessmentQuizBodyVariant = "option-list" | "copy";

export type AssessmentQuizHeadlineTier = "hero" | "compact";

export function bodyClassForVariant(variant: AssessmentQuizBodyVariant): string {
  if (variant === "option-list") return "quiz-step--option-list";
  return "quiz-step--copy";
}

export function headlineTierClassFor(tier: AssessmentQuizHeadlineTier): string {
  return tier === "compact" ? "quiz-step--headline-compact" : "";
}
