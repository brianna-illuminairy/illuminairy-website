import { satProgram, site } from "@/lib/site";

/** Pre-consultation intake — canonical questions and option labels. */
export const qualificationIntake = {
  path: "/get-started",
  schedulePath: "/get-started/schedule",
  eyebrow: "SAT Accelerator",
  title: "Tell us about your child before we meet.",
  /** Apply page — lead with outcome, then time + next step */
  intro:
    "Three quick questions about your child — where they're starting, what you're aiming for, and whether our twelve-week August program is the right fit.",
  introNext:
    "About 3 minutes. When you're done, you'll pick a time for your free consultation.",
  steps: [
    { id: "parent", label: "Your contact" },
    { id: "student", label: "Your child" },
    { id: "fit", label: "Program fit" }
  ] as const,
  examLabel: site.satDate
};

export const studentGrades = [
  "9th grade",
  "10th grade",
  "11th grade",
  "12th grade"
] as const;

export const defaultStudentGrade = "11th grade" satisfies (typeof studentGrades)[number];

export const targetSchoolOptions = [
  "UGA",
  "Georgia Tech",
  "Emory",
  "Georgia State",
  "Kennesaw State",
  "Auburn",
  "Clemson",
  "Other / not sure yet"
] as const;

export const targetExamOptions = [
  `${site.satDate} (our August 2026 program)`,
  "A different 2026 SAT date",
  "Not sure yet"
] as const;

export const satBaselineOptions = [
  "No SAT or PSAT score yet",
  "Official SAT score",
  "Practice SAT score",
  "PSAT score"
] as const;

export const scoreRangeOptions = [
  "Under 1000",
  "1000–1199",
  "1200–1349",
  "1350–1499",
  "1500+"
] as const;

export const mainGoalOptions = [
  "Reach a specific target score",
  "Need weekly accountability and a clear plan",
  "Strengthen weak areas (math, reading, or both)",
  "Still exploring — want your honest recommendation"
] as const;

/** Parent-facing budget bands — qualify consults; tuition from lib/site.ts. */
export const investmentBudgetQuestion =
  "What is your family prepared to invest to help raise your child's SAT score before the August SAT?";

export const investmentBudgetHint =
  "One honest answer helps us route you to the right next step. No payment details here.";

/** High → low anchors premium; band 3 triggers tuition + pay-over-time confirmation. */
export const investmentBudgetBandOptions = [
  "Up to $5,000 — whatever it takes if the plan is clearly right",
  "$2,500 – $5,000 — if I understood the plan and weekly support",
  "$1,000 – $2,000 — for the right August SAT plan",
  "$500 – $1,000",
  "Free or low-cost prep only"
] as const;

/** @deprecated alias — same as investmentBudgetBandOptions */
export const programInvestmentOptions = investmentBudgetBandOptions;

export const programInvestmentQuestion = investmentBudgetQuestion;
export const programInvestmentHint = investmentBudgetHint;

export function isDisqualifiedProgramInvestment(
  value: (typeof investmentBudgetBandOptions)[number]
) {
  return value === investmentBudgetBandOptions[4];
}

export function needsInvestmentBudgetConfirmation(
  value: (typeof investmentBudgetBandOptions)[number]
) {
  return value === investmentBudgetBandOptions[3];
}

export function getInvestmentBudgetConfirmationCopy() {
  return {
    title: "Quick note on program tuition",
    lead: `The SAT Accelerator is ${satProgram.tuitionDisplay} for the full twelve-week program — one-time tuition, not hourly tutoring.`,
    payment:
      "Pay-over-time options may be available at enrollment (for example card installments through checkout). We can review what's available on your free consultation.",
    prompt: "Would you still like to apply and schedule a consultation?",
    ctaYes: "Yes — continue my application",
    ctaNo: "No — not right now"
  };
}

export type QualificationIntakePayload = {
  parentEmail: string;
  parentFirst: string;
  parentLast: string;
  parentPhone: string;
  studentFirst: string;
  studentGrade: (typeof studentGrades)[number];
  studentSchool: string;
  targetExam: (typeof targetExamOptions)[number];
  satBaseline: (typeof satBaselineOptions)[number];
  scoreRange: (typeof scoreRangeOptions)[number] | "";
  mainGoal: (typeof mainGoalOptions)[number];
  programInvestment: (typeof investmentBudgetBandOptions)[number];
  confirmBudgetGap?: boolean;
  additionalContext: string;
  confirmParentOnCall: boolean;
  confirmNoGuarantee: boolean;
  company?: string;
};

export const INTAKE_SESSION_KEY = "illuminairy_qualification_intake";
export const INTAKE_LEAD_ID_KEY = "illuminairy_intake_lead_id";
/** Set after Calendly books or user confirms on schedule step */
export const CONSULT_BOOKED_SESSION_KEY = "illuminairy_consult_booked";

export type IntakeSessionSummary = {
  parentFirst: string;
  parentLast: string;
  parentEmail: string;
  parentPhone: string;
  studentFirst: string;
};

export function buildCalendlyPrefillUrl(
  baseUrl: string,
  summary: Pick<
    IntakeSessionSummary,
    "parentFirst" | "parentLast" | "parentEmail"
  >
) {
  const url = new URL(baseUrl);
  const fullName = [summary.parentFirst, summary.parentLast]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
  if (fullName) {
    url.searchParams.set("name", fullName);
  }
  if (summary.parentEmail) {
    url.searchParams.set("email", summary.parentEmail);
  }
  return url.toString();
}

export function formatIntakeEmailBody(payload: QualificationIntakePayload) {
  const lines = [
    "SAT Accelerator — pre-consultation intake",
    "",
    "— Parent / guardian —",
    `Name: ${payload.parentFirst} ${payload.parentLast}`,
    `Email: ${payload.parentEmail}`,
    `Phone: ${payload.parentPhone}`,
    "",
    "— Student —",
    `First name: ${payload.studentFirst}`,
    `Grade: ${payload.studentGrade}`,
    `School: ${payload.studentSchool || "(not provided)"}`,
    `Target exam: ${payload.targetExam}`,
    `Score starting point: ${payload.satBaseline}`,
    `Score range: ${payload.scoreRange || "(not provided)"}`,
    `Main goal: ${payload.mainGoal}`,
    `Investment budget band: ${payload.programInvestment}`,
    ...(payload.confirmBudgetGap
      ? ["Acknowledged program tuition above selected band: yes"]
      : []),
    "",
    "— Additional context —",
    payload.additionalContext || "(none)",
    "",
    "— Acknowledgments —",
    `Parent on consultation call: ${payload.confirmParentOnCall ? "yes" : "no"}`,
    `No score guarantee understood: ${payload.confirmNoGuarantee ? "yes" : "no"}`
  ];
  return lines.join("\n");
}
