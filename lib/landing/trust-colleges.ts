/**
 * Cold LP trust bar — selective schools families target (not admission guarantees).
 * Pair with `landingTrustBar.disclaimer` on every surface.
 */

export const landingTrustBar = {
  title: "Our students got accepted to:",
  disclaimer:
    "Schools families in our program have targeted. Admission outcomes vary.",
} as const;

/** Display labels for marquee (short, parent-recognizable). */
export const landingTrustColleges = [
  "UGA",
  "Georgia Tech",
  "Emory",
  "Vanderbilt",
  "UT Austin",
  "Duke",
  "UNC Chapel Hill",
  "UVA",
  "Wake Forest",
  "Boston University",
  "NYU",
  "University of Michigan",
  "USC",
  "WashU",
  "Rice",
  "Northeastern",
  "Georgetown",
  "Boston College",
  "Tulane",
  "Auburn",
] as const;
