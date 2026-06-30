/** Week 1 Lesson 2 — June 25, 2026 (from Meet transcript). */

export type SohaHomeworkPortalSet = {
  id: string;
  title: string;
  dueLabel: string;
  note: string;
};

export const WEEK1_LESSON2_HOMEWORK_SETS: SohaHomeworkPortalSet[] = [
  {
    id: "transitions-3",
    title: "Transitions 3 (timed quiz)",
    dueLabel: "Before Session 3",
    note: "Timed mixed easy/medium/hard — you scored 28/30 (93%) in session.",
  },
  {
    id: "transitions-medium-hard",
    title: "Transitions · medium & hard",
    dueLabel: "Before Week 2",
    note: "Assigned after the timed quiz — focus on medium/hard now that easies are at 100%.",
  },
];

export const WEEK1_LESSON2 = {
  dateLabel: "Wednesday, June 25",
  title: "Transitions homework review + timed quiz",
  summary:
    "Soha had completed Transitions 1 and 2 and felt good overall; misses were mostly relationship naming, not vocabulary. We walked every homework miss on a shared deck — Yeats/mysticism → symbolic poetry (soft cause-and-effect: consequentially, not likewise; watch “he was also” traps), Paleo diet (moreover — second independent reason to doubt, not therefore), stingless bees (nevertheless — despite is a contrast tip-off, not cause-and-effect), solar panels (therefore), and more. We reviewed tip-off words by category, then she took the timed Transitions 3 quiz in session: 28/30 (93%), 100% on easy, ~95% on medium/hard. Misses: Q15 (medium) and Q28 (hard). Homework: log all misses in the Google Sheet mistake log; finish medium/hard transition set. Transitions closes out this week; math starts Week 2.",
  wins: [
    "Soft vs strong cause-and-effect: Yeats’s mysticism influenced symbolic poetry — consequentially/as a result, not likewise.",
    "“He was also” can look like addition but the test is whether interest influenced the poetry outcome.",
    "Likewise = same verb/direction; influence ≠ parallel action — swap “in the same way” vs “as a result” to check.",
    "Paleo diet: moreover when a second independent reason supports the same doubt (also scientist… fits).",
    "Despite / even though / still / yet / but → contrast; nevertheless when defense exists without stinging.",
    "Cause-and-effect tip-offs: as a result, because of, due to, for this reason — sometimes “as a result” appears elsewhere in the passage.",
    "Addition tip-offs: also, another, besides, further evidence, second example.",
    "Timed Transitions 3: 28/30 (93%) — 100% easy, ~95% medium/hard; target 95%+ overall.",
    "Mistake log: for each miss — what relationship did I think? what tricked me? what clue did I miss?",
  ] as const,
  homework: {
    headline: "Homework Portal · finish transitions",
    body:
      "Log every miss from Transitions 1, 2, and 3 in your Google Sheet. Complete the medium/hard transition set before Week 2 math sessions.",
  },
  nextSession: {
    headline: "Next session (June 28)",
    body:
      "Review mistake-log entries for Q15 and Q28, then close out transitions and preview factoring / equivalent expressions for Week 2.",
  },
};
