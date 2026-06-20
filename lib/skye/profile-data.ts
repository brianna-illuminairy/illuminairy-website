export type ProfilePerson = {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export type ProfilePlanField = {
  label: string;
  value: string;
};

export const SKYE_PROFILE = {
  student: {
    role: "Student",
    firstName: "Skye",
    lastName: "Crisafulli",
    email: "skyelacrosse13@gmail.com",
  },
  parent: {
    role: "Parent",
    firstName: "Sara",
    lastName: "Crisafulli",
    email: "sara_crisafulli@hotmail.com",
    phone: "(908) 797-4875",
  },
  programPlan: [
    {
      label: "Tutoring",
      value: "Twice weekly private 1:1 sessions (Session 1 + Session 2)",
    },
    {
      label: "Homework",
      value: "Problem sets assigned between every session on what we covered that week",
    },
    {
      label: "Practice tests",
      value: "Full-length timed test every three weeks (weeks 5, 9, and 13 on her schedule)",
    },
    {
      label: "Plan start",
      value: "June 23, 2026",
    },
  ],
  about: [
    "Plays lacrosse.",
    "4.0+ GPA. Strong in school; the SAT gap is about test mechanics and focus, not ability.",
    "Aiming for Cornell and other highly selective schools.",
    "Target SAT score: 1400.",
  ],
  testingNotes: [
    "Took the PSAT before the June 18 Skill Diagnostic.",
    "Did not know enough about how the SAT works: pacing, when to guess, and how adaptive modules affect difficulty.",
    "Left questions blank when she was unsure instead of making a best guess.",
    "Struggled with running out of time, especially when she got stuck on a question type she had not seen before.",
  ],
  timeline: [
    { label: "Strategy Call", value: "June 11, 2026" },
    { label: "Skill Diagnostic", value: "June 18, 2026 (full-length, proctored)" },
    { label: "Diagnostic score", value: "1115 (1090 to 1140 range on College Board scoring)" },
  ],
  workingOn: [
    "Reading and Writing: question-type method (transitions, reading logic, boundaries, words in context, rhetorical synthesis).",
    "Math: recognizing question types, formulas not on the reference sheet, and when Desmos can finish a problem once it is set up.",
    "Pacing and guessing strategy so she uses the full section time and does not leave easy points blank.",
  ],
} satisfies {
  student: ProfilePerson;
  parent: ProfilePerson;
  programPlan: ProfilePlanField[];
  about: string[];
  testingNotes: string[];
  timeline: { label: string; value: string }[];
  workingOn: string[];
};

export function profileFullName(person: ProfilePerson): string {
  return `${person.firstName} ${person.lastName}`;
}
