/** Week 4 Session 1 — July 16, 2026 · Right Triangles Lesson 1 (pre-session). */

export type SkyeHomeworkPortalSet = {
  id: string;
  title: string;
  note: string;
};

export const WEEK4_LESSON1_HOMEWORK_SETS: SkyeHomeworkPortalSet[] = [
  {
    id: "triangles-1",
    title: "Triangles 1",
    note: "Homework Portal set assigned after today's lesson. Complete before your next session.",
  },
];

export const WEEK4_LESSON1 = {
  dateLabel: "Thursday, July 16",
  title: "Right triangles · Lesson 1",
  lede: "Reading triangles and the basic tools — marks, angle sum, right triangles, Pythagorean theorem, and SOH CAH TOA.",
  homework: {
    headline: "Homework Portal · Triangles 1",
    body: "After today's lesson, complete the Triangles 1 set in the Homework Portal. Next session we will review anything you miss or skip.",
  },
  nextSession: {
    headline: "Next session",
    body: "We will walk through any incorrect or skipped Triangles homework problems, then keep building right-triangle tools.",
  },
};

export const SKYE_TRIANGLES_LESSON_HREF = "/skye/files/triangles-lesson-1";
