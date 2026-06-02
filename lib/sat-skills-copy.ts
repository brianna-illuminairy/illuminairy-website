/**
 * SAT breadth copy — two layers:
 *
 * 1) **Digital SAT test structure** (domains / topics) — use for hit-q7, prep failure, diagnostic contrast.
 *    Aligns with MentoMind reports: Section → Domain → Topic.
 *
 * 2) **Khan course scale** (111 math lessons, 175 R&W lessons, 260 videos) — legacy contrast only;
 *    do not use in parent-facing hit-q7 after breadth refresh.
 */

/** Digital SAT Math — one section, two modules, 44 questions. */
export const DIGITAL_SAT_MATH = {
  modules: 2,
  questions: 44,
  domains: 4,
  /** Measurable topic areas (MentoMind “Topic” column). */
  topics: 15,
} as const;

/** Digital SAT Reading & Writing — two modules, 64 minutes total. */
export const DIGITAL_SAT_RW = {
  modules: 2,
  minutesTotal: 64,
  domains: 4,
  topics: 11,
} as const;

/** Domain + topic nodes the Skill Diagnostic can rank (15 + 11). */
export const DIGITAL_SAT_TOPIC_COUNT_TOTAL =
  DIGITAL_SAT_MATH.topics + DIGITAL_SAT_RW.topics;

/** Parent-facing school-curriculum span (paired with domain/topic counts). */
export const SAT_MATH_SCHOOL_COURSES_LABEL = "3–4 years of high school math";
export const SAT_RW_SCHOOL_COURSES_LABEL = "3 years of language arts";

export function satMathTestBreadthPhrase(): string {
  const m = DIGITAL_SAT_MATH;
  return `${m.domains} domains and ${m.topics} topic areas across ${m.questions} questions`;
}

export function satRwTestBreadthPhrase(): string {
  const r = DIGITAL_SAT_RW;
  return `${r.domains} domains and ${r.topics} topic areas across 2 modules`;
}

export function satBothTestBreadthPhrase(): string {
  return `${satMathTestBreadthPhrase()}, plus Reading & Writing's ${DIGITAL_SAT_RW.domains} domains and ${DIGITAL_SAT_RW.topics} topic areas`;
}

/** School span + test structure — for hit-q7 body after prep-method headline. */
export function satMathCurriculumAndTopicsPhrase(): string {
  return `${SAT_MATH_SCHOOL_COURSES_LABEL}, ${satMathTestBreadthPhrase()}`;
}

export function satRwCurriculumAndTopicsPhrase(): string {
  return `${SAT_RW_SCHOOL_COURSES_LABEL}, ${satRwTestBreadthPhrase()}`;
}

export function satBothCurriculumAndTopicsPhrase(): string {
  return `${SAT_MATH_SCHOOL_COURSES_LABEL} and ${SAT_RW_SCHOOL_COURSES_LABEL}, ${DIGITAL_SAT_TOPIC_COUNT_TOTAL} topic areas the diagnostic can rank`;
}

export function satDiagnosticGranularityPhrase(): string {
  return "domain and topic, the same breakdown as their Skill Diagnostic report";
}

/**
 * Khan Digital SAT course (Khan UI, 2025) — not the test's 15/11 topic map.
 * - SAT Math: 111 skills across 13 units; ~2–3 videos per skill → ~220–330 math videos
 * - SAT Reading & Writing: 175 lessons (11 units)
 */

/** SAT Math lesson nodes in Khan's Digital SAT course (Layer C — say "lessons," not "skills"). */
export const KHAN_SAT_MATH_LESSON_COUNT = 111;

/** @deprecated Use KHAN_SAT_MATH_LESSON_COUNT in parent-facing copy. */
export const KHAN_SAT_MATH_SKILL_COUNT = KHAN_SAT_MATH_LESSON_COUNT;

export const KHAN_SAT_MATH_UNITS = 13;
export const KHAN_SAT_RW_UNITS = 11;

/** SAT Reading & Writing lesson nodes in Khan's Digital SAT course. */
export const KHAN_SAT_RW_LESSON_COUNT = 175;

/** Total skill nodes for breadth copy (111 math + ~100 R&W at similar granularity). */
export const KHAN_SAT_SKILL_COUNT = 200;

/** Display label — always show + since R&W total is estimated. */
export const KHAN_SAT_SKILL_COUNT_LABEL = "200+";

/** Dedicated Khan SAT YouTube channel (all SAT playlists). */
export const KHAN_SAT_YOUTUBE_VIDEO_COUNT = 260;

/** In-course instructional videos (math + R&W; most clips ~3–7 min). */
export const KHAN_SAT_VIDEO_COUNT_LABEL = "300–500+";

/** Skills Illuminairy ranks and teaches in priority order. */
export const FOCUS_SKILL_COUNT = 5;

/** Rough hours: one pass through all Khan lessons + practice vs full mastery. */
export const KHAN_SAT_HOURS_FIRST_PASS = "60–100";
export const KHAN_SAT_HOURS_MASTERY = "100+";

/** High-school curriculum span the SAT draws on (parent-facing). */
export const SAT_CURRICULUM_YEARS_LABEL = "3+ years";

export function satCurriculumSpanPhrase(): string {
  return `${SAT_CURRICULUM_YEARS_LABEL} of high school math and language arts`;
}

/** Khan SAT prep breadth — cite both numbers together on insight hits. */
export function khanSatPrepSkillVideoPhrase(): string {
  return `${KHAN_SAT_MATH_SKILL_COUNT} math skills and ${KHAN_SAT_YOUTUBE_VIDEO_COUNT} SAT videos`;
}

/** @deprecated Moved to lib/quiz-funnel/i-compare-copy.ts */
export function iComparePrepBodyLine(): string {
  return `Our students averaged +182 on their next SAT. We start with a diagnostic that finds the ${FOCUS_SKILL_COUNT}–6 skills hurting their score most, then tutors work those first.`;
}

export function khanAllSkillsPhrase(): string {
  return `all ${KHAN_SAT_SKILL_COUNT_LABEL} skills on Khan`;
}

export function khanAndBluebookBreadthPhrase(): string {
  return `all ${KHAN_SAT_SKILL_COUNT_LABEL} skills on Khan and Bluebook`;
}

export function notAllKhanSkillsPhrase(): string {
  return `not all ${KHAN_SAT_SKILL_COUNT_LABEL} skills`;
}

export function notAllKhanSkillsTitleCase(): string {
  return `Not all ${KHAN_SAT_SKILL_COUNT_LABEL} skills`;
}

export function khanMathSkillsAlonePhrase(): string {
  return `${KHAN_SAT_MATH_SKILL_COUNT} math skills on Khan alone`;
}

export function khanVideoBreadthPhrase(): string {
  return `${KHAN_SAT_VIDEO_COUNT_LABEL} short videos on Khan`;
}

export function satBreadthVsFocusLine(): string {
  return `Khan's Digital SAT course has ${KHAN_SAT_MATH_SKILL_COUNT} math skills alone, plus dozens in Reading & Writing. Most students lose points on the same ${FOCUS_SKILL_COUNT}.`;
}
