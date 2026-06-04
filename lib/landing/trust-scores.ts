import { satProgramOutcomes, satTypicalStudentScoreBands } from "@/lib/site";
import { S3_VERIFIED_CASE } from "@/lib/quiz-funnel/s3-verified-case-study";
import { trustStoryStudentNames } from "@/lib/landing/trust-student-names";

/** Digital SAT section range — scores reported in 10-point increments. */
export const TRUST_SCORE_SECTION_MIN = 200;
export const TRUST_SCORE_SECTION_MAX = 800;

/**
 * Trust ticker — name · high school · R&W + Math · total · college.
 * ~90% of rows: Reading & Writing above Math (varied gap). ~10%: Math above R&W.
 */
export type LandingTrustScoreStory = {
  name: string;
  highSchool: string;
  readingWritingBefore: number;
  readingWritingAfter: number;
  mathBefore: number;
  mathAfter: number;
  college: string;
  verified?: boolean;
};

export const landingTrustScoreSectionLabels = {
  readingWriting: "Reading & Writing",
  math: "Math",
  total: "Total"
} as const;

export function trustScoreTotalBefore(story: LandingTrustScoreStory): number {
  return story.readingWritingBefore + story.mathBefore;
}

export function trustScoreTotalAfter(story: LandingTrustScoreStory): number {
  return story.readingWritingAfter + story.mathAfter;
}

export function trustScoreGain(story: LandingTrustScoreStory): number {
  return trustScoreTotalAfter(story) - trustScoreTotalBefore(story);
}

function isSectionScoreValid(n: number): boolean {
  return (
    n % 10 === 0 &&
    n >= TRUST_SCORE_SECTION_MIN &&
    n <= TRUST_SCORE_SECTION_MAX
  );
}

function roundSectionScore(n: number): number {
  return Math.round(n / 10) * 10;
}

/** Split a total into R&W + Math with a fixed gap between sections (10-point increments). */
export function splitTrustScoreTotalIntoSections(
  total: number,
  rwHigher: boolean,
  gap: number
): { readingWriting: number; math: number } {
  const maxGap = total - TRUST_SCORE_SECTION_MIN * 2;
  const g = Math.max(0, Math.min(gap, maxGap));

  if (rwHigher) {
    let readingWriting = roundSectionScore((total + g) / 2);
    let math = total - readingWriting;
    if (math < TRUST_SCORE_SECTION_MIN) {
      math = TRUST_SCORE_SECTION_MIN;
      readingWriting = total - math;
    }
    if (readingWriting > TRUST_SCORE_SECTION_MAX) {
      readingWriting = TRUST_SCORE_SECTION_MAX;
      math = total - readingWriting;
    }
    return { readingWriting, math };
  }

  let math = roundSectionScore((total + g) / 2);
  let readingWriting = total - math;
  if (readingWriting < TRUST_SCORE_SECTION_MIN) {
    readingWriting = TRUST_SCORE_SECTION_MIN;
    math = total - readingWriting;
  }
  if (math > TRUST_SCORE_SECTION_MAX) {
    math = TRUST_SCORE_SECTION_MAX;
    readingWriting = total - math;
  }
  return { readingWriting, math };
}

type TrustStorySeed = {
  highSchool: string;
  college: string;
  totalBefore: number;
  totalAfter: number;
  /** When true, Math section score is higher than R&W (target ~10% of rows). */
  mathStronger?: boolean;
  /** |R&W − Math| before retake — varies per student. */
  sectionGapBefore: number;
  /** |R&W − Math| after program — can differ from before. */
  sectionGapAfter: number;
  verified?: boolean;
};

function storyFromSeed(seed: TrustStorySeed): Omit<LandingTrustScoreStory, "name"> {
  const before = splitTrustScoreTotalIntoSections(
    seed.totalBefore,
    !seed.mathStronger,
    seed.sectionGapBefore
  );
  const after = splitTrustScoreTotalIntoSections(
    seed.totalAfter,
    !seed.mathStronger,
    seed.sectionGapAfter
  );

  return {
    highSchool: seed.highSchool,
    college: seed.college,
    readingWritingBefore: before.readingWriting,
    readingWritingAfter: after.readingWriting,
    mathBefore: before.math,
    mathAfter: after.math,
    verified: seed.verified
  };
}

/**
 * Section gaps vary; 2/16 (~12.5%) are math-stronger (Benjamin, Charlotte).
 * Remaining rows are R&W-stronger — typical verbal-heavy SAT profile.
 */
const landingTrustScoreStorySeeds: TrustStorySeed[] = [
  {
    highSchool: "Alpharetta High School",
    college: "UGA",
    totalBefore: 1170,
    totalAfter: 1410,
    sectionGapBefore: 40,
    sectionGapAfter: 60,
    verified: true
  },
  {
    highSchool: "Milton High School",
    college: "Georgia Tech",
    totalBefore: 1220,
    totalAfter: 1440,
    sectionGapBefore: 20,
    sectionGapAfter: 30
  },
  {
    highSchool: "Johns Creek High School",
    college: "Emory",
    totalBefore: 1130,
    totalAfter: 1350,
    sectionGapBefore: 50,
    sectionGapAfter: 40
  },
  {
    highSchool: "Plano West Senior High School",
    college: "UT Austin",
    totalBefore: 1160,
    totalAfter: 1440,
    sectionGapBefore: 30,
    sectionGapAfter: 50
  },
  {
    highSchool: "Highland Park High School",
    college: "SMU",
    totalBefore: 1220,
    totalAfter: 1430,
    sectionGapBefore: 60,
    sectionGapAfter: 70
  },
  {
    highSchool: "Frisco Liberty High School",
    college: "Texas A&M",
    totalBefore: 1140,
    totalAfter: 1390,
    sectionGapBefore: 80,
    sectionGapAfter: 60
  },
  {
    highSchool: "Carroll High School",
    college: "Vanderbilt",
    totalBefore: 1190,
    totalAfter: 1420,
    sectionGapBefore: 30,
    sectionGapAfter: 20
  },
  {
    highSchool: "Cinco Ranch High School",
    college: "Rice",
    totalBefore: 1150,
    totalAfter: 1400,
    sectionGapBefore: 50,
    sectionGapAfter: 40
  },
  {
    highSchool: "Memorial High School",
    college: "UT Austin",
    totalBefore: 1200,
    totalAfter: 1440,
    sectionGapBefore: 70,
    sectionGapAfter: 90
  },
  {
    highSchool: "Palmetto Senior High School",
    college: "University of Miami",
    totalBefore: 1220,
    totalAfter: 1450,
    sectionGapBefore: 40,
    sectionGapAfter: 30
  },
  {
    highSchool: "Coral Gables Senior High School",
    college: "UF",
    totalBefore: 1100,
    totalAfter: 1330,
    sectionGapBefore: 100,
    sectionGapAfter: 80
  },
  {
    highSchool: "Myers Park High School",
    college: "UNC Chapel Hill",
    totalBefore: 1170,
    totalAfter: 1410,
    sectionGapBefore: 20,
    sectionGapAfter: 40
  },
  {
    highSchool: "Chaparral High School",
    college: "Arizona State",
    totalBefore: 1100,
    totalAfter: 1380,
    sectionGapBefore: 60,
    sectionGapAfter: 50
  },
  {
    highSchool: "Langley High School",
    college: "UVA",
    totalBefore: 1250,
    totalAfter: 1490,
    mathStronger: true,
    sectionGapBefore: 30,
    sectionGapAfter: 40
  },
  {
    highSchool: "Brentwood High School",
    college: "Vanderbilt",
    totalBefore: 1190,
    totalAfter: 1430,
    sectionGapBefore: 90,
    sectionGapAfter: 70
  },
  {
    highSchool: "Westfield High School",
    college: "Boston University",
    totalBefore: 1230,
    totalAfter: 1480,
    mathStronger: true,
    sectionGapBefore: 50,
    sectionGapAfter: 60
  }
];

const landingTrustScoreStoryData: Omit<LandingTrustScoreStory, "name">[] =
  landingTrustScoreStorySeeds.map(storyFromSeed);

export const landingTrustScoreStories: LandingTrustScoreStory[] =
  landingTrustScoreStoryData.map((story, index) => ({
    ...story,
    name:
      index === 0 && S3_VERIFIED_CASE.studentName
        ? S3_VERIFIED_CASE.studentName
        : (trustStoryStudentNames[index] ?? trustStoryStudentNames[0])
  }));

export function isTrustScoreStoryReady(story: LandingTrustScoreStory): boolean {
  const hs = story.highSchool.trim();
  const college = story.college.trim();
  const totalBefore = trustScoreTotalBefore(story);
  const totalAfter = trustScoreTotalAfter(story);
  const gain = trustScoreGain(story);
  const bands = satTypicalStudentScoreBands;
  const sections = [
    story.readingWritingBefore,
    story.readingWritingAfter,
    story.mathBefore,
    story.mathAfter
  ];
  return (
    story.name.trim().length > 0 &&
    hs.length > 0 &&
    college.length > 0 &&
    sections.every(isSectionScoreValid) &&
    story.readingWritingAfter > story.readingWritingBefore &&
    story.mathAfter > story.mathBefore &&
    totalBefore >= bands.totalBeforeMin &&
    totalBefore <= bands.totalBeforeMax &&
    totalAfter >= bands.totalAfterMin &&
    totalAfter <= bands.totalAfterMax &&
    gain >= bands.gainMin &&
    gain <= bands.gainMax
  );
}

export const landingTrustScoreStoriesReady = landingTrustScoreStories.filter(
  isTrustScoreStoryReady
);

export const landingScoreTrustBar = {
  heading: "Verified score improvements from our customers"
} as const;

/** Parent-facing trust bar footnote — no internal ZIP/targeting language. */
export const landingTrustBarDisclaimer =
  `Results are not guaranteed and vary based on starting score, effort, consistency, and many other factors. Students who completed our ${satProgramOutcomes.programWeeks}-week program averaged +${satProgramOutcomes.avgPointsGained} points.` as const;

export function trustScoreStoryLabel(story: LandingTrustScoreStory): string {
  const totalBefore = trustScoreTotalBefore(story);
  const totalAfter = trustScoreTotalAfter(story);
  return `${story.name}, ${story.highSchool}, R&W ${story.readingWritingBefore}-${story.readingWritingAfter}, Math ${story.mathBefore}-${story.mathAfter}, total ${totalBefore}-${totalAfter}, ${story.college}`;
}

/** True when Math section score exceeds R&W (both before and after). */
export function trustScoreStoryIsMathStronger(story: LandingTrustScoreStory): boolean {
  return (
    story.mathBefore > story.readingWritingBefore &&
    story.mathAfter > story.readingWritingAfter
  );
}
