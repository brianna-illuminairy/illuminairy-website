/** Plan Builder B — student grade for the upcoming 2026–27 school year. */

export const PLAN_B_GRADE_SCHOOL_YEAR = "2026–27 school year";

export const PLAN_B_GRADE_OPTIONS = [
  { id: "9", label: "9th grade" },
  { id: "10", label: "10th grade" },
  { id: "11", label: "11th grade" },
  { id: "12", label: "12th grade" },
] as const;

export type PlanBGradeId = (typeof PLAN_B_GRADE_OPTIONS)[number]["id"];

const GRADE_LABEL_BY_ID: Record<PlanBGradeId, string> = {
  "9": "9th grade",
  "10": "10th grade",
  "11": "11th grade",
  "12": "12th grade",
};

export function planBGradeQuestion(qWho?: string): string {
  return qWho === "self"
    ? `What grade will you be in during the ${PLAN_B_GRADE_SCHOOL_YEAR}?`
    : `What grade will your child be in during the ${PLAN_B_GRADE_SCHOOL_YEAR}?`;
}

/** CRM `student_grade` column — canonical label without school-year suffix. */
export function studentGradeFromPlanBGradeId(id: string | null | undefined): string | null {
  if (!id) return null;
  return GRADE_LABEL_BY_ID[id as PlanBGradeId] ?? null;
}
