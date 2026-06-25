import {
  SHERMEEN_MATH_SKILL_AREA_COUNT,
  SHERMEEN_RW_SKILL_AREA_COUNT,
} from "@/lib/shermeen/diagnostic-skill-points";

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

export const SHERMEEN_PROFILE = {
  student: {
    role: "Student",
    firstName: "Shermeen",
    lastName: "Yousaf",
    email: "shermeen.sohail2010@gmail.com",
  },
  parent: {
    role: "Parent",
    firstName: "Sohail",
    lastName: "Yousaf",
    email: "sohailft@gmail.com",
  },
  programPlan: [
    {
      label: "Phase 1",
      value:
        "12-week foundation cycle (Jun 29 through Sep 20, 2026): rebuild the base and fix the skills that likely cost her the most points first. Pace follows her sessions, not a test countdown.",
    },
    {
      label: "Tutoring",
      value: "Weekly private 1:1 sessions with homework between sessions (~15 problems per week to start).",
    },
    {
      label: "Practice tests",
      value: "Full-length timed practice tests on weeks 5, 9, and 11 of Phase 1.",
    },
    {
      label: "Longer arc",
      value:
        "Sophomore PSAT (Oct 2026), then Phase 2 National Merit push the summer before junior year, first official SAT May 2027 target.",
    },
  ],
  about: [
    "Rising sophomore.",
    "Unproctored Blue Book practice average about 1080 before the June Skill Diagnostic.",
    "Proctored diagnostic on June 23, 2026: 1100 to 1150 total (540 to 560 Reading and Writing · 560 to 590 Math).",
    "Phase 1 uses the summer to build the base before the sophomore PSAT and later SAT attempts.",
  ],
  testingNotes: [
    "Prior official testing: unproctored Blue Book practice only (1070 to 1080 range).",
    "June 23 Skill Diagnostic was her first full-length proctored test with Illuminairy.",
    `Reading and Writing: 70% on hard questions, 38% on easy. She missed 20 questions across ${SHERMEEN_RW_SKILL_AREA_COUNT} question types. Transition questions and command of evidence questions had the most misses (four each). She also missed several other question types.`,
    `Math: she missed 14 questions across ${SHERMEEN_MATH_SKILL_AREA_COUNT} question types, including factoring, circles, linear functions, and grid-in questions. She scored 92% on easy and 50% on medium. On many misses she needs to name the question type and the method first, then finish the problem.`,
  ],
  timeline: [
    { label: "Strategy Call", value: "June 9, 2026" },
    { label: "Phase 1 start", value: "Week of June 29, 2026 (Week 1)" },
    { label: "Skill Diagnostic", value: "June 23, 2026 (full-length, proctored)" },
    {
      label: "Diagnostic score",
      value: "1100 to 1150 (540 to 560 R&W · 560 to 590 Math)",
    },
    { label: "Full-length practice test", value: "Week of September 7, 2026 (Week 11)" },
    { label: "Phase 1 review", value: "Week of September 14, 2026 (Week 12)" },
  ],
  workingOn: [
    "Question types, identification, and methods: teach each SAT question type, how to spot what it is asking, and the best approach to use. Review examples every session until she has the type, what it is asking, and the method memorized, so she can start right away instead of losing time on setup or reading every choice.",
    "Factoring and equivalent forms: move to zero, factor out a common term, verify by expanding, factor theorem when a factor is given.",
    "Reading and Writing: transitions, command of evidence, form and structure, boundaries, and rhetorical synthesis.",
    "Math follow-ons: linear word problems, circle arc length and tangency, statistics (variation vs average), grid-in habits (never leave blank).",
    "Pacing: know the question type and method right away so she does not run out of time or guess wrong on the last questions in a module.",
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
