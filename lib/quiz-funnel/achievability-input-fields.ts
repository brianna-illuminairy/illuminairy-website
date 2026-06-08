import { hasKnownStartingScore } from "@/lib/quiz-funnel/quiz-profile";

/** Analytics + UI field ids for achievability inline edits. */
export type AchievabilityInputField =
  | "target"
  | "test_date"
  | "starting"
  | "gpa";

export type AchievabilityAnswerKey = "q8" | "q5" | "q4" | "q9";

export const ACHIEVABILITY_FIELD_TO_ANSWER_KEY: Record<
  AchievabilityInputField,
  AchievabilityAnswerKey
> = {
  target: "q8",
  test_date: "q5",
  starting: "q4",
  gpa: "q9",
};

export const Q8_ACHIEVABILITY_OPTIONS = [
  { id: "1250", label: "1250" },
  { id: "1300", label: "1300" },
  { id: "1350", label: "1350" },
  { id: "1400", label: "1400" },
  { id: "1450", label: "1450+" },
  { id: "tbd", label: "Not sure yet" },
] as const;

export const Q4_ACHIEVABILITY_OPTIONS = [
  { id: "u1000", label: "Under 1100" },
  { id: "1100-1200", label: "1100–1200" },
  { id: "1200-1300", label: "1200–1300" },
  { id: "1300-1400", label: "1300–1400" },
  { id: "1400plus", label: "1400+" },
] as const;

export const Q9_ACHIEVABILITY_OPTIONS = [
  { id: "u3.0", label: "Under 3.0" },
  { id: "3.0-3.3", label: "3.0 – 3.3" },
  { id: "3.3-3.5", label: "3.3 – 3.5" },
  { id: "3.5-3.7", label: "3.5 – 3.7" },
  { id: "3.7-3.9", label: "3.7 – 3.9" },
  { id: "4.0+", label: "4.0+" },
] as const;

export const Q5_ACHIEVABILITY_OPTIONS = [
  { id: "aug22", label: "August 22, 2026" },
  { id: "sept12", label: "September 12, 2026" },
  { id: "oct3", label: "October 3, 2026" },
  { id: "nov7", label: "November 7, 2026" },
  { id: "dec5", label: "December 5, 2026" },
  { id: "tbd", label: "Not sure yet" },
] as const;

const Q8_LABEL: Record<string, string> = {
  "1250": "1250",
  "1300": "1300",
  "1350": "1350",
  "1400": "1400",
  "1450": "1450+",
  tbd: "Not sure yet",
};

const Q4_LABEL: Record<string, string> = {
  u1000: "Under 1100",
  "1100-1200": "1100–1200",
  "1200-1300": "1200–1300",
  "1300-1400": "1300–1400",
  "1400plus": "1400+",
  na: "No SAT yet",
};

const Q9_LABEL: Record<string, string> = {
  "u3.0": "Under 3.0",
  "3.0-3.3": "3.0 – 3.3",
  "3.3-3.5": "3.3 – 3.5",
  "3.5-3.7": "3.5 – 3.7",
  "3.7-3.9": "3.7 – 3.9",
  "4.0+": "4.0+",
};

const Q5_LABEL: Record<string, string> = {
  aug22: "Aug 22, 2026",
  sept12: "Sept 12, 2026",
  oct3: "Oct 3, 2026",
  nov7: "Nov 7, 2026",
  dec5: "Dec 5, 2026",
  tbd: "Not sure yet",
  "2027": "Spring 2027 or later",
};

export type AchievabilityInputChip = {
  field: AchievabilityInputField;
  label: string;
  value: string;
  answerKey: AchievabilityAnswerKey;
};

/** True when achievability uses GPA-inferred starting score (no official q4 band). */
export function needsGpaForStart(answers: {
  q3?: string;
  q4?: string;
}): boolean {
  if (answers.q3 === "none") return true;
  if (!answers.q4 || answers.q4 === "na") return true;
  return false;
}

export function buildAchievabilityInputChips(
  answers: { q3?: string; q4?: string; q5?: string; q8?: string; q9?: string },
  startingScoreLabel?: string | null
): AchievabilityInputChip[] {
  const chips: AchievabilityInputChip[] = [];

  if (needsGpaForStart(answers)) {
    if (startingScoreLabel) {
      chips.push({
        field: "starting",
        label: "Current",
        value: startingScoreLabel,
        answerKey: "q4",
      });
    }
  } else if (hasKnownStartingScore(answers.q4)) {
    chips.push({
      field: "starting",
      label: "Current",
      value: Q4_LABEL[answers.q4 ?? ""] ?? "—",
      answerKey: "q4",
    });
  }

  chips.push(
    {
      field: "target",
      label: "Target",
      value: Q8_LABEL[answers.q8 ?? ""] ?? "Not sure yet",
      answerKey: "q8",
    },
    {
      field: "test_date",
      label: "Test date",
      value: Q5_LABEL[answers.q5 ?? ""] ?? "Not sure yet",
      answerKey: "q5",
    }
  );

  if (needsGpaForStart(answers)) {
    chips.push({
      field: "gpa",
      label: "GPA",
      value: Q9_LABEL[answers.q9 ?? ""] ?? "—",
      answerKey: "q9",
    });
  }

  return chips;
}

export function optionsForAchievabilityField(field: AchievabilityInputField) {
  switch (field) {
    case "target":
      return Q8_ACHIEVABILITY_OPTIONS;
    case "test_date":
      return Q5_ACHIEVABILITY_OPTIONS;
    case "starting":
      return Q4_ACHIEVABILITY_OPTIONS;
    case "gpa":
      return Q9_ACHIEVABILITY_OPTIONS;
    default:
      return Q8_ACHIEVABILITY_OPTIONS;
  }
}

/** Starting (est.) chip opens GPA picker when start is GPA-inferred. */
export function pickerFieldForChip(
  chip: AchievabilityInputChip,
  answers: { q3?: string; q4?: string }
): AchievabilityInputField {
  if (chip.field === "starting" && needsGpaForStart(answers)) {
    return "gpa";
  }
  return chip.field;
}

export function sheetTitleForField(field: AchievabilityInputField): string {
  switch (field) {
    case "target":
      return "Target score";
    case "test_date":
      return "Test date";
    case "starting":
      return "Current score";
    case "gpa":
      return "GPA";
    default:
      return "Update";
  }
}
