export type DaniellePortalUpdate = {
  id: string;
  publishedAt: string;
  title: string;
  summary: string;
  href: string;
  cta: string;
};

export const DANIELLE_PORTAL_UPDATES: DaniellePortalUpdate[] = [
  {
    id: "2026-06-26-week-3-equivalent-expressions",
    publishedAt: "2026-06-26",
    title: "Week 3 Equivalent Expressions lesson is live",
    summary:
      "Lesson 2: finish 5 remaining homework misses, patterns deck, and Homework Portal · Equivalent Expressions 3 plus quiz.",
    href: "/danielle/week-3/lesson-2",
    cta: "Open Lesson 2"
  },
  {
    id: "2026-06-23-week-2-report",
    publishedAt: "2026-06-23",
    title: "Week 2 progress report",
    summary:
      "Your Week 2 summary is ready: Transitions homework, Equivalent Expressions patterns, score update, and advanced algebra plan.",
    href: "/danielle/week-2/report",
    cta: "Read Week 2 report"
  },
  {
    id: "2026-06-16-week-2-homework-portal",
    publishedAt: "2026-06-16",
    title: "Transitions homework sets assigned",
    summary:
      "Transitions 1 due Wednesday, June 17. Transitions 2 opens and is due Saturday, June 27. Review slides → flashcards 95% → problem sets.",
    href: "/danielle/week-2#week-2-homework-workflow",
    cta: "View homework schedule"
  },
  {
    id: "2026-06-16-transitions-flashcards",
    publishedAt: "2026-06-16",
    title: "Week 2 post-session exercise is live",
    summary:
      "Transitions category flashcards: 26 most common phrases, four categories, round tracking. Goal is 95% accuracy.",
    href: "/danielle/week-2/exercises/transitions-flashcards",
    cta: "Open exercise"
  },
  {
    id: "2026-06-16-week-2-transitions",
    publishedAt: "2026-06-16",
    title: "Week 2 Transitions lesson is live",
    summary:
      "Tuesday's interactive Transitions deck is on Week 2 Lesson 1. Open it fullscreen during session for sorting games and your diagnostic revisits.",
    href: "/danielle/week-2/lesson-1",
    cta: "Open Lesson 1"
  },
  {
    id: "2026-06-16-week-1-report",
    publishedAt: "2026-06-16",
    title: "Week 1 progress report",
    summary:
      "Your Week 1 summary is ready: practice stats, score trajectory, what we covered in math, and what is next.",
    href: "/danielle/week-1/report",
    cta: "Read Week 1 report"
  },
  {
    id: "2026-06-10-lesson-2-deck",
    publishedAt: "2026-06-10",
    title: "Lesson 2 deck and whiteboard session",
    summary:
      "Thursday's factoring deck is on Lesson 2. We will work through it live on a shared whiteboard.",
    href: "/danielle/week-1/lesson-2",
    cta: "Open Lesson 2"
  },
  {
    id: "2026-06-10-homework-due-sunday",
    publishedAt: "2026-06-10",
    title: "Quadratics homework due Sunday",
    summary:
      "Your quadratics homework in the Homework Portal is now due Sunday, June 15 so you have more time to work through it with solutions visible.",
    href: "/danielle/week-1/lesson-1#homework-due",
    cta: "Read session note"
  },
  {
    id: "2026-06-09-post-session-1",
    publishedAt: "2026-06-09",
    title: "Post Session 1 notes are live",
    summary:
      "Your Tuesday session summary is on Lesson 1, with skills from the session and what we are building next.",
    href: "/danielle/week-1/lesson-1#post-session-1",
    cta: "Read session summary"
  }
];

export function getLatestPortalUpdateId() {
  return DANIELLE_PORTAL_UPDATES[0]?.id ?? "none";
}
