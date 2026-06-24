import { SOHA_ERROR_LOG_COLUMNS } from "@/lib/soha/plan-copy";

/** Google Sheets setup for Soha's SAT error log (Week 1 homework step 1). */
export const SOHA_MISTAKE_LOG_SETUP_HEADLINE = "Create your mistake log in Google Sheets";

export const SOHA_MISTAKE_LOG_SETUP_INTRO = [
  "Before Transitions practice, set up one Google Sheet you will use for the whole program. Every miss from Transitions 1, Transitions 2, and future homework goes here.",
  "The point is not to collect wrong answers. You write what relationship you thought you saw, what the question was actually testing, and the rule you will use next time.",
] as const;

export const SOHA_MISTAKE_LOG_SETUP_STEPS = [
  {
    title: "Open Google Sheets and create a blank spreadsheet",
    body: 'Name it something you will recognize, like "Soha SAT error log." Keep one tab for Reading and Writing and add a Math tab later when we start math homework.',
  },
  {
    title: "Add these column headers in row 1",
    body: SOHA_ERROR_LOG_COLUMNS.map((col) => col.column).join(" · "),
  },
  {
    title: "Freeze the header row",
    body: "View → Freeze → 1 row. That keeps the labels visible while you scroll.",
  },
  {
    title: "Optional: color-code Error Type",
    body: "Use data validation on the Error Type column: Conceptual, Careless, Misread, Timing. That makes patterns easier to spot when we review together.",
  },
  {
    title: "Log every miss from Transitions 1 and Transitions 2",
    body: 'After each Homework Portal set, add a row for every question you missed or guessed. For transitions, Category should say "Transitions" and The Fix should name the relationship (contrast, example, sequence, etc.) before the answer word.',
  },
] as const;

export const SOHA_MISTAKE_LOG_COLUMN_DETAILS = SOHA_ERROR_LOG_COLUMNS;

export const SOHA_MISTAKE_LOG_TRANSITIONS_EXAMPLE = {
  questionId: "R&W · Transitions 1 · Q14",
  category: "Transitions",
  answers: 'Your answer: "For example," · Correct: "In contrast,"',
  errorType: "Conceptual",
  fix:
    "Cover choices. Sentence A: cortisol slows recovery for most athletes. Sentence B: opposite effect for a marathon runner. Relationship = contrast, not example.",
} as const;
