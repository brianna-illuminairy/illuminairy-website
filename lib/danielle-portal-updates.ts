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
    id: "2026-06-09-post-session-1",
    publishedAt: "2026-06-09",
    title: "Post Session 1 notes are live",
    summary:
      "Your Tuesday session summary is on Week 1, including what you locked in and what we are building next.",
    href: "/danielle/week-1#post-session-1",
    cta: "Read session summary"
  },
  {
    id: "2026-06-09-lesson-2-math",
    publishedAt: "2026-06-09",
    title: "Thursday Lesson 2 plan updated",
    summary:
      "Lesson 2 stays in Math so we can go deeper on factoring, expression recognition, radicals, and the quadratic formula.",
    href: "/danielle/week-1#lesson-2",
    cta: "See Thursday plan"
  }
];

export function getLatestPortalUpdateId() {
  return DANIELLE_PORTAL_UPDATES[0]?.id ?? "none";
}
