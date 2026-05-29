/**
 * After q7 — why their prep method failed on their weak spot (q6).
 * Slide 1 before i-compare proof chart. Eyebrow: Did you know (surprise).
 */

import { normalizeQ7, Q7_PREP_PRIORITY } from "@/lib/quiz-funnel/prep-copy";
import type { InsightHit, InsightHitPart } from "@/lib/quiz-funnel/insight-hits";
import {
  FOCUS_SKILL_COUNT,
  KHAN_SAT_MATH_LESSON_COUNT,
  KHAN_SAT_RW_UNITS,
  KHAN_SAT_YOUTUBE_VIDEO_COUNT,
} from "@/lib/sat-skills-copy";

type SectionFocus = "math" | "reading" | "both" | "general";

const KHAN_MATH_HAYSTACK_IMAGE = {
  src: "/quiz/khan-math-lessons-haystack.png",
  alt: "Student facing a wall of 111 numbered SAT math lesson books",
} as const;

const DIAGNOSTIC_FOLLOW_UP: InsightHitPart[] = [
  {
    text: `The Skill Diagnostic ranks their ${FOCUS_SKILL_COUNT}–6 highest-impact gaps first — that's where the plan starts.`,
  },
];

function sectionFocus(q6: string[] = []): SectionFocus {
  const math = q6.includes("math");
  const reading = q6.includes("reading");
  if (math && reading) return "both";
  if (math) return "math";
  if (reading) return "reading";
  return "general";
}

function primaryPrepId(q7: unknown): string {
  const ids = normalizeQ7(q7);
  return Q7_PREP_PRIORITY.find((id) => ids.includes(id)) ?? "nothing";
}

const KHAN_NEEDLE_CLOSE: InsightHitPart[] = [
  {
    text: ". Without a diagnostic there's no way for them to know what to focus on to actually improve their score. They're looking for a ",
  },
  { text: "needle in a haystack", em: true },
  { text: "." },
];

function khanHit(section: SectionFocus): InsightHit {
  if (section === "reading") {
    return {
      type: "surprise",
      parts: [
        { text: "Khan's Reading & Writing course spans " },
        { text: `${KHAN_SAT_RW_UNITS} domain units`, em: true },
        { text: " and hundreds of practice items" },
        ...KHAN_NEEDLE_CLOSE,
      ],
    };
  }

  if (section === "both") {
    return {
      type: "surprise",
      parts: [
        { text: "Khan's SAT prep maps " },
        { text: `${KHAN_SAT_MATH_LESSON_COUNT} math lessons`, em: true },
        { text: ", " },
        { text: `${KHAN_SAT_RW_UNITS} Reading & Writing units`, em: true },
        { text: ", and " },
        { text: `${KHAN_SAT_YOUTUBE_VIDEO_COUNT} videos`, em: true },
        ...KHAN_NEEDLE_CLOSE,
      ],
    };
  }

  // math + general — canonical Khan math copy (hit-q7 haystack image)
  return {
    type: "surprise",
    parts: [
      { text: "Khan's SAT math course alone has " },
      { text: `${KHAN_SAT_MATH_LESSON_COUNT} lessons`, em: true },
      { text: " and " },
      { text: `${KHAN_SAT_YOUTUBE_VIDEO_COUNT} videos`, em: true },
      ...KHAN_NEEDLE_CLOSE,
    ],
    image: KHAN_MATH_HAYSTACK_IMAGE,
  };
}

function breadthLessonRef(section: SectionFocus): string {
  if (section === "reading") {
    return `${KHAN_SAT_RW_UNITS} Reading & Writing units and dozens of question types`;
  }
  if (section === "both") {
    return `${KHAN_SAT_MATH_LESSON_COUNT} math lessons, ${KHAN_SAT_RW_UNITS} R&W units, and ${KHAN_SAT_YOUTUBE_VIDEO_COUNT} videos`;
  }
  return `${KHAN_SAT_MATH_LESSON_COUNT} math lessons alone`;
}

function groupHit(section: SectionFocus): InsightHit {
  const breadth = breadthLessonRef(section);
  const sectionBit =
    section === "math"
      ? "On SAT Math, that meant reviewing topics other students needed — not the word-problem types eating their time."
      : section === "reading"
        ? "On Reading & Writing, that meant generic passage work — not the inference gaps where their points slip."
        : section === "both"
          ? "Their math and reading gaps never got ranked — everyone got the same syllabus."
          : "Nobody ranked which of the 111+ lesson areas actually moved their score.";

  return {
    type: "surprise",
    parts: [
      { text: "Group class runs " },
      { text: "one lesson for the whole room", em: true },
      { text: `. The SAT map includes ${breadth}. ${sectionBit}` },
    ],
    followUp: DIAGNOSTIC_FOLLOW_UP,
  };
}

function onlineHit(section: SectionFocus): InsightHit {
  const breadth = breadthLessonRef(section);
  return {
    type: "surprise",
    parts: [
      { text: "Online courses use " },
      { text: "one syllabus for every student", em: true },
      { text: `. The full SAT spans ${breadth} — without a diagnostic, there's no way to know which gaps were theirs.` },
    ],
    followUp: DIAGNOSTIC_FOLLOW_UP,
  };
}

function appHit(section: SectionFocus): InsightHit {
  const breadth = breadthLessonRef(section);
  const sectionBit =
    section === "math"
      ? " It kept serving math questions — never which lesson types to master first."
      : section === "reading"
        ? " It kept serving reading items — never which inference types to fix first."
        : " It never said which 5–6 to work first.";

  return {
    type: "surprise",
    parts: [
      { text: "SAT apps can drill across " },
      { text: breadth, em: true },
      { text: `.${sectionBit} Without a diagnostic, practicing what they already know doesn't move a score.` },
    ],
    followUp: DIAGNOSTIC_FOLLOW_UP,
  };
}

function bookHit(section: SectionFocus): InsightHit {
  const sectionBit =
    section === "math"
      ? "SAT Math needs digital pacing and Desmos — not workbook drills across 111 lesson types."
      : section === "reading"
        ? "Reading & Writing needs module timing and inference reps — not flipping pages."
        : "Test day is on a laptop; paper prep trains the wrong format.";

  return {
    type: "surprise",
    parts: [
      { text: "Prep books go " },
      { text: "broad on paper", em: true },
      { text: `. ${sectionBit} Without a diagnostic, they couldn't tell which lessons were worth their time.` },
    ],
    followUp: DIAGNOSTIC_FOLLOW_UP,
  };
}

function nothingHit(section: SectionFocus): InsightHit {
  const breadth = breadthLessonRef(section);
  return {
    type: "surprise",
    parts: [
      { text: "Without prep or a diagnostic, they guessed where to start across " },
      { text: breadth, em: true },
      { text: " — and lost weeks on low-impact review." },
    ],
    followUp: DIAGNOSTIC_FOLLOW_UP,
  };
}

function fallbackHit(): InsightHit {
  return {
    type: "surprise",
    parts: [
      { text: "Past prep spread time across " },
      { text: "everything on the SAT", em: true },
      { text: ` — not the ${FOCUS_SKILL_COUNT}–6 gaps that actually move a score.` },
    ],
    followUp: DIAGNOSTIC_FOLLOW_UP,
  };
}

/** q7 × q6 — why their prep failed; autoprogress insight before i-compare. */
export function prepFailureInsight(q7: unknown, q6: unknown): InsightHit {
  const prep = primaryPrepId(q7);
  const section = sectionFocus(Array.isArray(q6) ? q6.filter(Boolean) : []);

  switch (prep) {
    case "khan":
      return khanHit(section);
    case "group":
      return groupHit(section);
    case "online":
      return onlineHit(section);
    case "app":
      return appHit(section);
    case "book":
      return bookHit(section);
    case "nothing":
      return nothingHit(section);
    default:
      return fallbackHit();
  }
}
