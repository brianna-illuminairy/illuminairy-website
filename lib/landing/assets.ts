/**
 * One file per slot. `null` = show placeholder until you add the file to public/photos/.
 * See growth/b3-lp-photo-shot-list.md
 */
export const landingPhotoSlots = {
  b3aHeroStudent: "/photos/male-student.png",
  b3aHeroSession: "/photos/tutor-student-session.png",
  b3cHero: null as string | null,
  science: null as string | null,
  greatNews: "/photos/team-hero.jpg",
  included: null as string | null,
  stepAssessment: null as string | null,
  stepDiagnostic: null as string | null,
  stepPlan: null as string | null,
  stepTutor: null as string | null,
  review1Before: null as string | null,
  review1After: null as string | null,
  review2Before: null as string | null,
  review2After: null as string | null,
  review3Before: null as string | null,
  review3After: null as string | null
} as const;

export type LandingPhotoSlotId = keyof typeof landingPhotoSlots;

/** @deprecated use landingPhotoSlots */
export const landingAssets = {
  heroStudentA: landingPhotoSlots.b3aHeroStudent,
  heroStudentB: landingPhotoSlots.b3aHeroSession,
  heroAuthority: landingPhotoSlots.b3cHero,
  science: landingPhotoSlots.science,
  scoreReport: "/photos/score-report.png",
  greatNews: landingPhotoSlots.greatNews,
  programIncluded: landingPhotoSlots.included,
  stepAssessment: landingPhotoSlots.stepAssessment,
  stepDiagnostic: landingPhotoSlots.stepDiagnostic,
  stepPlan: landingPhotoSlots.stepPlan,
  stepTutor: landingPhotoSlots.stepTutor,
  reviewBefore: landingPhotoSlots.review1Before,
  reviewAfter: landingPhotoSlots.review1After
} as const;

export const reviewPhotoSlotsByIndex = [
  {
    before: landingPhotoSlots.review1Before,
    after: landingPhotoSlots.review1After
  },
  {
    before: landingPhotoSlots.review2Before,
    after: landingPhotoSlots.review2After
  },
  {
    before: landingPhotoSlots.review3Before,
    after: landingPhotoSlots.review3After
  }
] as const;
