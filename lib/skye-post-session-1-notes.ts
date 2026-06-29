/** Post-session notes for Skye Week 2 Session 1 (June 29, 2026). */

/** Filled from Google Meet / Gemini transcript in Google Drive — do not edit without source. */
export const POST_SESSION_1_SUMMARY = "";

/** Filled from Google Meet / Gemini transcript in Google Drive — do not edit without source. */
export const POST_SESSION_1_WINS: readonly string[] = [];

export type SkyeHomeworkPortalSet = {
  id: string;
  title: string;
  note: string;
};

export const SKYE_HOMEWORK_PORTAL_SETS: SkyeHomeworkPortalSet[] = [
  {
    id: "equivalent-expressions-1",
    title: "Equivalent Expressions 1",
    note: "Complete before your next session. Finish all questions in one sitting if you can.",
  },
  {
    id: "equivalent-expressions-2",
    title: "Equivalent Expressions 2",
    note: "Complete after Equivalent Expressions 1, before your next session.",
  },
];

export const POST_SESSION_1_HOMEWORK = {
  headline: "Homework Portal · Equivalent Expressions 1 & 2",
  body:
    "Two problem sets live in the Homework Portal (separate login from the lesson portal). Complete Equivalent Expressions 1, then Equivalent Expressions 2, before our next session.",
} as const;

export const POST_SESSION_1_NEXT_SESSION = {
  headline: "Next session",
  body:
    "We will work through any problems you got incorrect or skipped from Equivalent Expressions 1 and 2. Come ready to name the pattern, walk the method, and redo missed questions on the whiteboard.",
} as const;

export const SKYE_LESSON_DECK_HREF = "/skye/files/quadratics-lesson";
export const SKYE_WHITEBOARD_URL =
  "https://link.excalidraw.com/l/A4T4CdBzqDH/5FcyM67mE1R";
