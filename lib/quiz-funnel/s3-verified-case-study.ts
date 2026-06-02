import { formatSatScoreLabel } from "@/lib/quiz-funnel/score-path-copy";

export const S3_VERIFIED_RATING_LABEL = "SAT Score Verified";

/** Verified case study on plan step s3 (Ethan · Katherine M.). */
export const S3_VERIFIED_CASE = {
  studentName: "Ethan",
  scoreBefore: 1170,
  scoreAfter: 1410,
  weeks: 12,
  photo: "/photos/ethan-uga-acceptance.jpg",
  photoAlt: "Student smiling and holding a University of Georgia acceptance envelope",
  quote:
    "It was such a relief not to have to worry if his score was getting better, and being able to see his progress in each weeks score reports and knowing he was on track. It took a lot of effort but the tutor really held him accountable to his plan.",
  attribution: "Katherine M. · Alpharetta, GA · Class of 2026",
} as const;

export function s3VerifiedCaseHeadlineParts() {
  const { studentName, scoreBefore, scoreAfter, weeks } = S3_VERIFIED_CASE;
  return {
    studentName,
    before: formatSatScoreLabel(scoreBefore),
    after: formatSatScoreLabel(scoreAfter),
    weeks,
  };
}
