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

export const SOHA_PROFILE = {
  student: {
    role: "Student",
    firstName: "Soha",
    lastName: "Naveed",
    email: "",
  },
  parent: {
    role: "Parent",
    firstName: "Nada",
    lastName: "Naveed",
    email: "nj00@hotmail.com",
    phone: "818-391-0906",
  },
  programPlan: [
    {
      label: "Enrollment",
      value: "Not enrolled. The August 22 bootcamp offer is open if the family chooses to move forward.",
    },
    {
      label: "Proposed tutoring",
      value:
        "3 sessions per week, 45 minutes each (27 total), June 23 through August 21, 2026, built from her diagnostic misses",
    },
    {
      label: "Homework",
      value:
        "About 30 problems assigned after each session; roughly 100 or more per week with mistake-driven review between sessions",
    },
    {
      label: "Practice tests",
      value: "Full-length timed tests at Weeks 3, 6, and 8 on her improvement plan",
    },
    {
      label: "Target test",
      value: "August 22, 2026 SAT",
    },
  ],
  about: [
    "Rising 12th grader.",
    "GPA in the 3.7–3.9 range. Strong in school; the SAT gap is about precision and repeat mistakes on specific question types, not overall ability.",
    "Stuck in the upper 1300s to low 1400s after multiple official attempts.",
    "Wants to reach the upper 1400s; ideally would like to break into the 1500s.",
    "Merit scholarships are on the line for college.",
  ],
  testingNotes: [
    "Has taken the official SAT three or more times (parent reported on the SAT Score Path).",
    "Current band from parent report: 1300–1400. Diagnostic estimate on June 17: 1380–1430 composite.",
    "Score is lower than her GPA would suggest (parent flagged this on the Score Path).",
    "Past self-study and a structured plan were blockers: she studied on her own without a ranked skill list.",
    "Tried a group class and self-paced online practice; score still would not move.",
    "Parent concern from the Score Path: studied hard but cannot raise the score.",
  ],
  timeline: [
    { label: "Strategy Call", value: "June 15, 2026 (scheduled; missed — follow-up sent)" },
    { label: "Skill Diagnostic", value: "June 17, 2026 (full-length, proctored; complimentary)" },
    {
      label: "Diagnostic estimate",
      value: "1380–1430 composite (670–690 R&W · 710–740 Math)",
    },
    {
      label: "Why August 22",
      value:
        "Official SAT before early admissions and early decision deadlines so she has a competitive score in hand for fall applications",
    },
    { label: "Next official SAT", value: "August 22, 2026" },
  ],
  workingOn: [
    "Reading and Writing: transitions, boundaries, command of evidence, subject-verb agreement with interrupting phrases.",
    "Math: factoring and factor theorem when the calculator cannot finish the problem, off-formula-sheet geometry setup, and deciding calculator vs by-hand before she starts.",
    "Test habits: error log for 1500+ target band, mistake-driven review in sessions, and full-length timed checks at Weeks 3, 6, and 8.",
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
  return `${person.firstName} ${person.lastName}`.trim();
}
