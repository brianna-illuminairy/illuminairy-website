/**
 * After q7 — why their prep method failed on their weak spot (q6).
 * Slide 1 before i-compare proof chart. Eyebrow: Did you know (surprise).
 */

import { normalizeQ7, Q7_PREP_PRIORITY } from "@/lib/quiz-funnel/prep-copy";
import type { InsightHit, InsightHitPart } from "@/lib/quiz-funnel/insight-hits";
import {
  FOCUS_SKILL_COUNT,
  KHAN_SAT_MATH_LESSON_COUNT,
  KHAN_SAT_RW_LESSON_COUNT,
  KHAN_SAT_YOUTUBE_VIDEO_COUNT,
  SAT_MATH_SCHOOL_COURSES_LABEL,
  SAT_RW_SCHOOL_COURSES_LABEL,
} from "@/lib/sat-skills-copy";

/** Khan: 175 R&W lessons + 260 math videos (parent-facing total). */
const KHAN_SAT_TOTAL_CONTENT_PIECES =
  KHAN_SAT_RW_LESSON_COUNT + KHAN_SAT_YOUTUBE_VIDEO_COUNT;

const SAT_TOPIC_AREAS_LABEL = "25+ topic areas";

type SectionFocus = "math" | "reading" | "both" | "general";

const KHAN_MATH_HAYSTACK_IMAGE = {
  src: "/quiz/khan-math-lessons-haystack.png",
  alt: "Student facing a wall of numbered SAT lesson books",
} as const;

const KHAN_HAYSTACK_UI = {
  image: KHAN_MATH_HAYSTACK_IMAGE,
  imageCaption: [
    { text: "They're looking for a " },
    { text: "needle in a haystack", em: true },
    { text: "." },
  ] as InsightHitPart[],
  followUp: [
    {
      text: "Without a diagnostic to figure out where they're losing points, there's no way for them to know what to focus on to actually improve their score.",
    },
  ] as InsightHitPart[],
};

const DIAGNOSTIC_FOLLOW_UP: InsightHitPart[] = [
  {
    text: `The Skill Diagnostic ranks their ${FOCUS_SKILL_COUNT}–6 highest-impact gaps first. That's where the Improvement Plan starts.`,
  },
];

export function prepSectionFocus(q6: string[] = []): SectionFocus {
  const math = q6.includes("math");
  const reading = q6.includes("reading");
  if (math && reading) return "both";
  if (math) return "math";
  if (reading) return "reading";
  return "general";
}

export function primaryPrepId(q7: unknown): string {
  const ids = normalizeQ7(q7);
  return Q7_PREP_PRIORITY.find((id) => ids.includes(id)) ?? "nothing";
}

function khanHit(section: SectionFocus): InsightHit {
  const shared = {
    type: "surprise" as const,
    ...KHAN_HAYSTACK_UI,
  };

  if (section === "reading") {
    return {
      ...shared,
      parts: [
        { text: "Khan's SAT Reading & Writing alone has " },
        { text: `${KHAN_SAT_RW_LESSON_COUNT} lessons`, em: true },
        { text: "." },
      ],
    };
  }

  if (section === "both" || section === "general") {
    return {
      ...shared,
      parts: [
        { text: "Khan's SAT courses contain " },
        { text: `${KHAN_SAT_TOTAL_CONTENT_PIECES} pieces of content`, em: true },
        { text: "." },
      ],
      followUpBlocks: [
        [
          { text: "That's " },
          { text: `${KHAN_SAT_RW_LESSON_COUNT} Reading & Writing lessons`, em: true },
          { text: " and " },
          { text: `${KHAN_SAT_YOUTUBE_VIDEO_COUNT} math videos`, em: true },
          { text: "." },
        ],
        KHAN_HAYSTACK_UI.followUp,
      ],
      followUp: undefined,
    };
  }

  return {
    ...shared,
    parts: [
      { text: "Khan's SAT math course alone has " },
      { text: `${KHAN_SAT_MATH_LESSON_COUNT} lessons`, em: true },
      { text: " and " },
      { text: `${KHAN_SAT_YOUTUBE_VIDEO_COUNT} videos`, em: true },
      { text: "." },
    ],
  };
}

function groupHit(_section: SectionFocus): InsightHit {
  return {
    type: "surprise",
    parts: [
      { text: "Group classes teach " },
      { text: "one lesson for every child in the room", em: true },
      { text: "." },
    ],
    followUpBlocks: [
      [
        { text: "They cover the full SAT at a surface level. The SAT spans " },
        { text: "3–4 years of high school math and language arts", em: true },
        { text: " and " },
        { text: SAT_TOPIC_AREAS_LABEL, em: true },
        {
          text: ", way too much to cover in a few weeks with enough depth to actually close gaps your child has.",
        },
      ],
      DIAGNOSTIC_FOLLOW_UP,
    ],
  };
}

/** Online and/or app — full SAT breadth; q6 does not narrow this copy. */
function onlineCoursesAndAppsHit(): InsightHit {
  return {
    type: "surprise",
    parts: [
      { text: "SAT courses and apps try to cover " },
      { text: "4 years of math and English", em: true },
      { text: " across " },
      { text: "25+ skills", em: true },
      { text: "." },
    ],
    followUpBlocks: [
      [
        {
          text: "With hundreds of lessons and thousands of practice problems, it's difficult to spend enough time on the specific skills ",
        },
        { text: "your child", em: true },
        {
          text: " is struggling with. Some SAT topics appear repeatedly while others rarely show up.",
        },
      ],
      [
        {
          text: "It's not realistic to cover the entire SAT deeply enough to address real weaknesses.",
        },
      ],
      [
        {
          text: `The Skill Diagnostic identifies a student's ${FOCUS_SKILL_COUNT}–6 highest-impact skill gaps, and the Improvement Plan starts there.`,
        },
      ],
    ],
  };
}

function onlineHit(_section: SectionFocus): InsightHit {
  return onlineCoursesAndAppsHit();
}

function onlineAppHit(_section: SectionFocus): InsightHit {
  return onlineCoursesAndAppsHit();
}

function appHit(_section: SectionFocus): InsightHit {
  return onlineCoursesAndAppsHit();
}

function bookHit(_section: SectionFocus): InsightHit {
  return {
    type: "surprise",
    parts: [
      { text: "Prep books put kids at a " },
      { text: "disadvantage", em: true },
      { text: "." },
    ],
    followUpBlocks: [
      [
        { text: "The SAT is now " },
        { text: "digital", em: true },
        { text: ": it's taken on a " },
        { text: "laptop", em: true },
        { text: ", not with pen and paper. To finish on time, students need training on the " },
        { text: "built-in tools", em: true },
        { text: " in the " },
        { text: "Digital SAT", em: true },
        { text: " interface, including the formula sheet and graphing calculator, which improve both speed and accuracy." },
      ],
    ],
  };
}

function nothingHit(_section: SectionFocus): InsightHit {
  return {
    type: "surprise",
    parts: [
      { text: "Most students procrastinate because " },
      { text: "it's overwhelming", em: true },
      { text: "." },
    ],
    followUpBlocks: [
      [
        {
          text: "Apps, videos, and courses all compete for attention. The SAT spans ",
        },
        {
          text: `${SAT_MATH_SCHOOL_COURSES_LABEL} and ${SAT_RW_SCHOOL_COURSES_LABEL} and ${SAT_TOPIC_AREAS_LABEL}`,
          em: true,
        },
        { text: ', so "just start studying" rarely works.' },
      ],
      [
        {
          text: "Without a plan built for their gaps, weeks of effort often go to topics that wouldn't move their score.",
        },
      ],
      DIAGNOSTIC_FOLLOW_UP,
    ],
  };
}

function fallbackHit(): InsightHit {
  return {
    type: "surprise",
    parts: [
      { text: "Past prep spread time across " },
      { text: "everything on the SAT", em: true },
      { text: `, not the ${FOCUS_SKILL_COUNT}–6 gaps that actually move a score.` },
    ],
    followUp: DIAGNOSTIC_FOLLOW_UP,
  };
}

function hasHigherPriorityPrepThanOnlineApp(ids: string[]): boolean {
  return ids.some((id) => id === "khan" || id === "group");
}

/** q7 × q6 — why their prep failed; autoprogress insight before i-compare. */
export function prepFailureInsight(q7: unknown, q6: unknown): InsightHit {
  const ids = normalizeQ7(q7);
  const section = prepSectionFocus(Array.isArray(q6) ? q6.filter(Boolean) : []);

  if (
    ids.includes("online") &&
    ids.includes("app") &&
    !hasHigherPriorityPrepThanOnlineApp(ids)
  ) {
    return onlineAppHit(section);
  }

  const prep = primaryPrepId(q7);

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
