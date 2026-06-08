/**
 * SAT Landing v4 copy — ported verbatim from the offline design
 * (growth/lp-designs/sat-landing-v4.standalone.html).
 *
 * NOTE: kept verbatim per owner decision. Some claims are not backed by
 * `lib/site.ts` and are flagged in growth/lp-designs/README.md:
 *   - trust bar "500+ families helped" / "4.8 avg parent rating"
 *   - authority line "Backed by College Board data from 250,000+ students."
 * `+182 avg pts` is backed (n=95).
 */

/** Default v4 hero headline — two lines, fold-tested (shown when no ad hook). */
export const v4Headline = {
  lines: ["Your child has good grades.", "So why a low SAT score?"],
  /** index of the line rendered in the accent color */
  accentLine: 1
} as const;

export const v4Authority = "Backed by College Board data from 250,000+ students.";

export const v4Cta = {
  intro: "Your free SAT plan shows:",
  bullets: [
    "Why smart students struggle on the SAT",
    "If 150\u2013200+ points is realistic before their next test",
    "What their SAT improvement plan looks like between now and test day"
  ],
  button: "Build my child\u2019s free SAT plan",
  finePrint: "Takes about 2 minutes. No student required."
} as const;

export const v4TrustStats = [
  { value: "+182", unit: "avg pts", em: true, label: "After Following a 12-Week Plan" },
  { value: "500+", unit: null, em: false, label: "Families helped" },
  { value: "4.8", unit: null, star: true, em: true, label: "Avg parent rating" }
] as const;
