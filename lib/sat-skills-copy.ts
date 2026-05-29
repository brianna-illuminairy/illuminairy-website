/**
 * Khan Digital SAT breadth — source of truth for contrast copy vs Illuminairy's 5-skill focus.
 *
 * Digital SAT course (Khan UI, 2025):
 * - SAT Math: 111 skills across 13 units; ~2–3 videos per skill → ~220–330 math videos
 * - SAT Reading & Writing: similar unit/skill structure (11 units); dozens of skills
 * - Total instructional videos: ~300–500+ short clips (many 3–7 min); dedicated SAT YouTube ~260
 * - Thousands of practice questions, lessons, and hints
 *
 * We use 200+ for total skill breadth (111 math + similar R&W scale). Update when R&W count is confirmed.
 */

/** SAT Math lesson nodes in Khan's Digital SAT course (Layer C — say "lessons," not "skills"). */
export const KHAN_SAT_MATH_LESSON_COUNT = 111;

/** @deprecated Use KHAN_SAT_MATH_LESSON_COUNT in parent-facing copy. */
export const KHAN_SAT_MATH_SKILL_COUNT = KHAN_SAT_MATH_LESSON_COUNT;

export const KHAN_SAT_MATH_UNITS = 13;
export const KHAN_SAT_RW_UNITS = 11;

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
  return `Our students averaged +182 on their next SAT. We start with a diagnostic that finds the ${FOCUS_SKILL_COUNT}–6 skills hurting their score most — then tutors work those first.`;
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
  return `Khan's Digital SAT course has ${KHAN_SAT_MATH_SKILL_COUNT} math skills alone — plus dozens in Reading & Writing. Most students lose points on the same ${FOCUS_SKILL_COUNT}.`;
}
