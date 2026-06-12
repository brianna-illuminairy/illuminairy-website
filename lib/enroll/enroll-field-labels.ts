import type { EnrollPrefill } from "@/lib/enroll/enroll-prefill";

export type EnrollFieldKey = keyof EnrollPrefill;

export const ENROLL_FIELD_LABELS: Record<EnrollFieldKey, string> = {
  parentFirst: "Parent first name",
  parentLast: "Parent last name",
  parentPhone: "Parent phone",
  parentEmail: "Parent email",
  studentFirst: "Student first name",
  studentLast: "Student last name",
  studentGrade: "Grade",
  studentSchool: "School",
  studentPhone: "Student phone",
  studentEmail: "Student email"
};

export const ENROLL_PARENT_FIELDS: EnrollFieldKey[] = [
  "parentFirst",
  "parentLast",
  "parentPhone",
  "parentEmail"
];

export const ENROLL_STUDENT_FIELDS: EnrollFieldKey[] = [
  "studentFirst",
  "studentLast",
  "studentGrade",
  "studentSchool",
  "studentPhone",
  "studentEmail"
];
