/** Score Review intake option lists — safe for SSR entry shell + client screens. */

export const SR_GRADE_OPTIONS = [
  { id: "9", label: "9th grade" },
  { id: "10", label: "10th grade" },
  { id: "11", label: "11th grade" },
  { id: "12", label: "12th grade" },
  { id: "graduated", label: "Graduated high school" },
] as Array<{ id: string; label: string }>;

export const SR_SCORE_OPTIONS = [
  { id: "u1000", label: "Under 1100" },
  { id: "1100-1200", label: "1100–1200" },
  { id: "1200-1300", label: "1200–1300" },
  { id: "1300-1400", label: "1300–1400" },
  { id: "1400plus", label: "1400+" },
  { id: "na", label: "No official SAT yet" },
] as Array<{ id: string; label: string }>;

export const SR_PREPARED_OPTIONS = [
  { id: "khan", label: "Khan / Bluebook / YouTube" },
  { id: "group", label: "In-person group class" },
  { id: "online", label: "Online course or class" },
  { id: "tutor", label: "Private tutor" },
  { id: "book", label: "SAT study book" },
  { id: "nothing", label: "Did not study much" },
] as Array<{ id: string; label: string }>;

export const SR_TEST_DATE_OPTIONS = [
  { id: "aug22", label: "August 22, 2026" },
  { id: "sept12", label: "September 12, 2026" },
  { id: "oct3", label: "October 3, 2026" },
  { id: "nov7", label: "November 7, 2026" },
  { id: "dec5", label: "December 5, 2026" },
  { id: "tbd", label: "Not sure yet" },
] as Array<{ id: string; label: string }>;

export const SR_TARGET_OPTIONS = [
  { id: "1250", label: "1250" },
  { id: "1300", label: "1300" },
  { id: "1350", label: "1350" },
  { id: "1400", label: "1400" },
  { id: "1450", label: "1450+" },
  { id: "tbd", label: "Not sure yet" },
] as Array<{ id: string; label: string }>;
