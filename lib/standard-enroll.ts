/**
 * Standard post-Strategy Call enrollment page system.
 *
 * URL pattern: `/enroll/{slug}` — one route per lead, but every page
 * renders from the same `StandardEnrollPage` component. Per-lead config
 * here only carries the parts that change (name, email, student name,
 * call date, etc.). The page chrome — progress strip, "What's included",
 * pricing, FAQ, "Inside a session" image, reviews marquee — is the same
 * for every lead.
 *
 * This is **not** Sohail's stack. Sohail's `/enroll/sohail-shermeen` lives
 * in `lib/personalized-enroll.ts` + `components/personalized-enroll/*` +
 * `app/api/personalized-enroll/*` and is locked. Do not import from any
 * of those into this file.
 */

import {
  buildStandardFaqFromPreset,
  type StandardFaqPreset
} from "@/lib/standard-enroll-faq-bank";

export type { StandardFaqPreset };

export type StandardProgramVariant = "standard" | "aug22-bootcamp";

export type StandardDiagnosticPromo = {
  /** List price shown struck through on the pay card. */
  listPrice: number;
  /** Actual charge at checkout (0 = SetupIntent path, no PI). */
  chargePrice: number;
  label: string;
  displayCode: string;
  stripeCouponId: string;
};

/** Display-only list → charge anchoring on the weekly tutoring row. */
export type StandardWeeklyPromo = {
  listPrice: number;
  chargePrice: number;
  label: string;
};

export type StandardProgressStep = {
  label: string;
  state: "done" | "active" | "next";
};

export type StandardIncludedItem = {
  /** Bold line of the bullet. */
  nm: string;
  /** Sub-line below the bold line. */
  ds: string;
};

export type StandardFaqItem = {
  q: string;
  /** One paragraph per entry. */
  a: string[];
};

export type StandardFaqGroup = {
  label: string;
  items: StandardFaqItem[];
};

export type StandardTestimonial = {
  /** "1180 → 1500" — optional badge on the card. */
  gain?: string;
  quote: string;
  name: string;
  /** "Parent of an 11th grader · Atlanta, GA" or similar. */
  detail: string;
};

export type StandardEnrollLead = {
  slug: string;
  parent: { first: string; last?: string; full: string; email?: string };
  student: { first: string; full: string; gradeNote: string };
  pricing: {
    diagPrice: number;
    weeklyPrice: number;
    /** Stable Stripe product IDs. Default Price IDs resolve server-side. */
    stripeDiagnosticProductId: string;
    stripeWeeklyProductId: string;
    /** Trial days on the weekly subscription. First charge hits at trial end. */
    weeklyTrialDays: number;
    /** Legacy fallback link if the on-page checkout call fails. */
    stripeFallbackLink: string;
  };
  advisor: { first: string; full: string; email: string };
  call: {
    /** ISO-style date label of the Strategy Call this enrollment follows. */
    dateLabel: string;
  };
  /** FAQ preset from `lib/standard-enroll-faq-bank.ts`. Default: standard-full. */
  faqPreset?: StandardFaqPreset;
  /** Replaces STANDARD_INCLUDED when set (e.g. 1:1-only bullet for Shelly). */
  includedOverride?: StandardIncludedItem[];
  /** Family / BOGO diagnostic promo — sprint page only. */
  diagnosticPromo?: StandardDiagnosticPromo;
  /** List → charge weekly anchoring (e.g. $198 → $175 family rate). */
  weeklyPromo?: StandardWeeklyPromo;
  /** Drives pay-card session frequency and plan card headline. */
  programVariant?: StandardProgramVariant;
};

/**
 * Standard four-step progress strip. Every standard enroll page uses
 * this — there is no per-lead override, on purpose, to keep the funnel
 * step labels consistent.
 */
export const STANDARD_POST_CALL_STEPS: StandardProgressStep[] = [
  { label: "Free SAT Plan", state: "done" },
  { label: "Free Strategy Call", state: "done" },
  { label: "Diagnostic", state: "active" },
  { label: "Tutoring", state: "next" }
];

/**
 * Standard "What's included" list (9 items). SAT Vocabulary Lists and
 * SAT Learning Library were intentionally removed Jun 15, 2026.
 */
export const STANDARD_INCLUDED: StandardIncludedItem[] = [
  {
    nm: "Proctored Full-Length Adaptive SAT Diagnostic",
    ds: "Timed under real test conditions, results in 24 to 48 hours"
  },
  {
    nm: "Personalized SAT Improvement Plan",
    ds: "Built from your diagnostic results"
  },
  {
    nm: "Twice-Weekly SAT Tutoring",
    ds: "At least 3 of every 4 sessions are one-on-one"
  },
  {
    nm: "Personalized Lesson Plans",
    ds: "Built around your student's specific gaps"
  },
  {
    nm: "Homework from 3,500+ SAT Practice Questions",
    ds: "That match the style and difficulty of the real SAT"
  },
  {
    nm: "11 Full-Length Digital SAT Practice Tests",
    ds: "One proctored every 4 weeks to measure progress"
  },
  {
    nm: "Weekly Progress Tracking",
    ds: "Reports sent to you and your student every week"
  },
  {
    nm: "Aurora, Our AI SAT Study Companion",
    ds: "24/7 answers, hints, and what-went-wrong explanations"
  },
  {
    nm: "Built-in Desmos Calculator",
    ds: "The same graphing calculator as the real Math section"
  }
];

/** Shelly Sood pages: 1:1 twice weekly (matches Jun 16 Strategy Call). */
export const SHELLY_INCLUDED: StandardIncludedItem[] = STANDARD_INCLUDED.map(
  (it) =>
    it.nm === "Twice-Weekly SAT Tutoring"
      ? {
          nm: "Twice-Weekly SAT Tutoring",
          ds: "Two hourlong one-on-one sessions per week with your student's tutor"
        }
      : it
);

/** Bootcamp variant: 4×/wk included list for August 22 SAT push. */
export const SHELLY_BOOTCAMP_INCLUDED: StandardIncludedItem[] =
  SHELLY_INCLUDED.map((it) =>
    it.nm === "Twice-Weekly SAT Tutoring"
      ? {
          nm: "Four Weekly SAT Tutoring Sessions",
          ds: "Four hourlong one-on-one sessions per week, planned backward from the August 22, 2026 SAT"
        }
      : it
  );

/**
 * Six real testimonials used in the scrolling marquee below the grid.
 * Source: `SAT Checkout (standalone).html` `Testimonials()` component.
 */
export const STANDARD_TESTIMONIALS: StandardTestimonial[] = [
  {
    gain: "+190 from diagnostic",
    quote:
      "We tried Khan Academy and Bluebook, and we tried an SAT course. None of that worked, and her score was stuck in the 1100s. I knew this was going to work when I overheard a session and she was able to explain her math reasoning out loud, which she'd never done before. We haven't gotten her score back yet but she's up 190 points from her diagnostic.",
    name: "Priya M.",
    detail: "Parent of an 11th grader · Atlanta, GA"
  },
  {
    gain: "1310 → 1530",
    quote:
      "The weekly report meant I never had to nag. I could see exactly what was being taught, what homework was assigned, and whether it was getting done. That alone was worth the price.",
    name: "Allison K.",
    detail: "Parent · Charlotte, NC"
  },
  {
    gain: "1090 → 1380",
    quote:
      "Started below 1100 and didn't think 1300 was realistic. The diagnostic and plan showed how to get my score up quickly. Four months later I was past my goal at a 1380.",
    name: "Ethan T.",
    detail: "Student · Class of 2025"
  },
  {
    gain: "1370 → 1560",
    quote:
      "Worth every dollar. My son played lacrosse and was on a travel team. He needed structure to hold him accountable but also flexibility. They worked around his crazy schedule while also keeping him on track and making sure his SAT wasn't the thing that got in the way.",
    name: "Renee O.",
    detail: "Parent of a 12th grader · Boston, MA"
  },
  {
    gain: "1240 → 1490",
    quote:
      "I liked having the same two tutors that stuck with me. And also that they had gone to the same schools I was hoping to get into. They helped me get my score up by 250 points and reviewed my college essays with me which made me feel more confident applying.",
    name: "Sofia D.",
    detail: "Student · Class of 2026"
  },
  {
    gain: "1230 → mid-1500s",
    quote:
      "I started tutoring with a 1230 SAT score and was scoring in the mid-1500s by my final practice test. The strategies were clear, practical, and completely changed the way I approached the exam. My instructor, Mr. Chavarria, explained every question in a calm and easy-to-understand way and always made sure I truly understood the material. I would honestly rate it a 20/10 and have already recommended it to several friends.",
    name: "Jacob A.",
    detail: "Student · Class of 2025"
  },
  {
    quote:
      "Wardell has been such an asset to my daughter's SAT study process. He has guided her in her studying. He has helped her and challenged her where she needed it. We couldn't have done this without him. Five stars all the way.",
    name: "Nadia A.",
    detail: "Parent of an 11th grader"
  },
  {
    quote:
      "My tutor, Benjamin, was very professional and greatly helped me with the English part of the digital SAT. If you are looking for help on the SAT, Benjamin is the perfect tutor for it. He made sure I understood exactly what concepts I struggled with and gave tips to understand how to answer those questions. Thank you for helping me reach my goal, Ben.",
    name: "Emma J.",
    detail: "Student · Class of 2026"
  },
  {
    quote:
      "When we were in a pinch trying to get my daughter's SAT scores up in order to qualify for a full scholarship, we turned to Illuminairy in order to provide her with the very best 1:1 tutoring service. Her tutor was incredibly knowledgeable and supportive. She made my daughter feel confident when facing the SAT again. She hasn't taken it yet so I cannot say whether or not she achieved her goal score, but I feel extremely confident that her Illuminairy experience provided her with the absolute best chance possible to succeed.",
    name: "Jennifer K.",
    detail: "Parent of a 12th grader · Scholarship push"
  },
  {
    quote:
      "I called Illuminairy because my senior needed help with her SAT. They have been amazing and paired my daughter with a wonderful teacher. My daughter feels confident about taking the exam and she has scheduled it for next week.",
    name: "Amy R.",
    detail: "Parent of a senior"
  },
  {
    quote:
      "Bhavana was amazing, very smart and helped walk me through all of the problems. I recommend her if you need any SAT help.",
    name: "Sophia K.",
    detail: "Student · Class of 2027"
  },
  {
    gain: "Targeting 1500",
    quote:
      "Learning tips and tricks will only get one so far. Going through problems with Peter and getting one-to-one help in problem areas is helping my child get closer to her goal of 1500 SAT than any other program we've tried before.",
    name: "Soraya R.",
    detail: "Parent of an 11th grader"
  },
  {
    quote:
      "I searched for a way to help my twins prep for the SAT and I'm so glad I found Illuminairy. They did an initial assessment on the three areas of the SAT and built sessions around the areas they needed to strengthen. Each girl got her own 1-to-1 tutoring sessions twice a week, plus a small-group session, plus practice questions chosen for their weaknesses. They worked with the girls' busy schedules and accommodated changes when needed.",
    name: "Gabriela L.",
    detail: "Parent of twins · Class of 2026"
  },
  {
    quote:
      "Jacob was thorough, patient, accommodating and very positive and motivating, so he gave our daughter an excellent experience. Plus his after-session notes were always provided immediately and described her progress and areas of opportunity.",
    name: "Lauren F.",
    detail: "Parent of a junior"
  },
  {
    quote:
      "Mr. Nath is an excellent tutor. My son loves how quickly he has improved in the SAT prep. I would highly recommend him.",
    name: "Patricia C.",
    detail: "Parent of an 11th grader"
  },
  {
    quote:
      "Illuminairy is a great resource for getting help with SAT prep. My tutor has been very patient with me and has explained the problems to me in a way that is more clear and easier to comprehend. I have learned so many new skills, and I feel more confident going into the exam the second time.",
    name: "Michael R.",
    detail: "Student · Retake"
  },
  {
    quote:
      "I liked the multiple practice tests and study plans. I also kind of liked that there was a thing that told me when I was pushing myself too much. I loved how it gave me a personalized study plan as well.",
    name: "Emily M.",
    detail: "Student · Class of 2026"
  },
  {
    gain: "Final score: 1540",
    quote:
      "After my second-to-last SAT, I decided to ditch all my prior studying ways (locking in last minute) and actually tried out Illuminairy. I loved it. I would credit my 1540 score to this program, and I seriously believe this is the best study material for the SAT. As a graduating senior now, I've told my junior and sophomore friends all about this program.",
    name: "Joshua P.",
    detail: "Student · Class of 2025"
  },
  {
    quote:
      "I loved using Illuminairy's tutoring and practice problems so much for studying for the SAT. I just finished my study plan for the March SAT and got the score that I wanted. They provided detailed explanations for questions I missed and also gave me an extensive weekly study plan to space out what I learned and prepare me in the best way for the actual exam. I would highly recommend everyone try out Illuminairy for SAT tutoring.",
    name: "Madison C.",
    detail: "Student · Class of 2026 · March SAT"
  },
  {
    gain: "Upper 1200s → 1470",
    quote:
      "My son had taken the SAT a couple of times but was stuck in the upper 1200s to low 1300s. I decided to try Illuminairy and through the blend of tutoring, practice questions and exams, study guide, and other resources they provide, the next time he took it he got a 1470. This is a great program and I highly recommend it. Obviously there is also a place for individual effort and motivation.",
    name: "Samira K.",
    detail: "Parent of an 11th grader"
  },
  {
    gain: "1450 → 1530",
    quote:
      "I was able to raise my score on the SAT from a 1450 to a 1530. I'm so happy I got tutored and it helped tremendously with my studying. Illuminairy's study plan feature was nice, and I especially appreciated the ability to assign as many questions as I wanted at a hard difficulty level. This helped me master those higher-level questions that can be tricky. It was also really helpful that it broke down my accuracy scores by section so I could see where I needed the most improvement, and then I'd go do questions in that specific area.",
    name: "Ava L.",
    detail: "Student · Class of 2026"
  },
  {
    gain: "Beat goal score",
    quote:
      "Illuminairy's plan was a super great study tool that truly helped me achieve even higher than my goal score. The massive question bank along with the AI helper when you get stuck is something that Illuminairy does so much better than any free resource I've ever used. Overall, a 10/10 experience with my plan and my tutor, and I would highly recommend it to anyone looking to do well on the SAT.",
    name: "Noah W.",
    detail: "Student · Class of 2026"
  },
  {
    gain: "+100 points in 3 weeks",
    quote:
      "My child tried using books to prepare and Khan Academy. After months of daily studying, she scored the exact same score. As a last-ditch effort we enrolled her in Illuminairy. She only had three weeks before her final SAT attempt. She did 4 sessions a week and practiced 30 minutes to an hour most days, sometimes only 15 minutes a day, for those three weeks. She increased her score by over 100 points. I wish we had started Illuminairy sooner.",
    name: "Alicia M.",
    detail: "Parent of a senior"
  },
  {
    gain: "1080 → 1560 SAT · 1520 PSAT",
    quote:
      "I used Illuminairy for 3 rounds of tutoring after my first practice test came back an 1080. They really helped me on the PSAT as well as the SAT. I got a 1520 on the PSAT after 20 weeks of tutoring, and a 1560 on the SAT with an additional set of tutoring. The sheer quantity of practice problems and custom plan made my time very fruitful. It may seem like an expensive purchase, but it will pay me dividends in scholarship and future college opportunities.",
    name: "Nathan K.",
    detail: "Student · National Merit track"
  },
  {
    gain: "1100 → 1390 in 6 months",
    quote:
      "Illuminairy is truly one of the best SAT tutoring companies out there. I started using them with an 1100 and with every practice test I took I saw improvement. The solutions and practice problem features really help when you have no idea what to do on a problem, and at some point questions become easier. The way they review your missed questions in tutoring is very helpful, and I feel it's one of the best ways of teaching. Overall, amazing experience. In 6 months I was able to raise my score by over 290 points and get to a 1390.",
    name: "Mia R.",
    detail: "Student · Class of 2026"
  }
];

/**
 * Build the standard FAQ. Diag and weekly prices are threaded in so the
 * answers stay in sync with whatever the right-side pay card is showing.
 *
 * Source: `SAT Checkout (standalone).html` `FaqBlock()` component, with two
 * on-the-record edits Jun 15, 2026 (score-range answer rewritten to the
 * 150-to-450 framing; tutoring-length answer reframed positively).
 */
export function buildStandardFaq(
  diagPrice: number,
  weeklyPrice: number,
  preset?: StandardFaqPreset,
  diagChargePrice?: number
): StandardFaqGroup[] {
  return buildStandardFaqFromPreset(
    preset ?? "standard-full",
    diagPrice,
    weeklyPrice,
    diagChargePrice
  );
}

const michelleMichaela: StandardEnrollLead = {
  slug: "michelle-michaela",
  parent: {
    first: "Michelle",
    full: "Michelle",
    email: "mitchmikekt@gmail.com"
  },
  student: {
    first: "Michaela",
    full: "Michaela",
    gradeNote: "rising senior"
  },
  pricing: {
    diagPrice: 249,
    weeklyPrice: 99,
    stripeDiagnosticProductId: "prod_UfmBm2GawHFXRA",
    stripeWeeklyProductId: "prod_UfmE3JUG5ykfSk",
    weeklyTrialDays: 7,
    stripeFallbackLink: "https://buy.stripe.com/7sYcMY7DK1X19lO7gZc7u01"
  },
  advisor: {
    first: "Brianna",
    full: "Brianna Zajicek",
    email: "brianna@illuminairy.com"
  },
  call: { dateLabel: "June 13, 2026" }
};

const moniqueKylan: StandardEnrollLead = {
  slug: "monique-kylan",
  parent: {
    first: "Monique",
    last: "Reynolds",
    full: "Monique Reynolds",
    email: "moniquedreynolds@gmail.com"
  },
  student: {
    first: "Kylan",
    full: "Kylan",
    gradeNote: "rising junior"
  },
  pricing: {
    diagPrice: 249,
    weeklyPrice: 99,
    stripeDiagnosticProductId: "prod_UfmBm2GawHFXRA",
    stripeWeeklyProductId: "prod_UfmE3JUG5ykfSk",
    weeklyTrialDays: 7,
    stripeFallbackLink: "https://buy.stripe.com/7sYcMY7DK1X19lO7gZc7u01"
  },
  advisor: {
    first: "Brianna",
    full: "Brianna Zajicek",
    email: "brianna@illuminairy.com"
  },
  call: { dateLabel: "June 12, 2026" }
};

const shellyStandard: StandardEnrollLead = {
  slug: "shelly-standard",
  parent: {
    first: "Shelly",
    last: "Sood",
    full: "Shelly Sood",
    email: "shellysood@hotmail.com"
  },
  student: {
    first: "",
    full: "",
    gradeNote: "confirm name/grade in follow-up"
  },
  pricing: {
    diagPrice: 249,
    weeklyPrice: 99,
    stripeDiagnosticProductId: "prod_UfmBm2GawHFXRA",
    stripeWeeklyProductId: "prod_UfmE3JUG5ykfSk",
    weeklyTrialDays: 7,
    stripeFallbackLink: "https://buy.stripe.com/7sYcMY7DK1X19lO7gZc7u01"
  },
  advisor: {
    first: "Brianna",
    full: "Brianna Zajicek",
    email: "brianna@illuminairy.com"
  },
  call: { dateLabel: "June 16, 2026" },
  faqPreset: "shelly-standard",
  includedOverride: SHELLY_INCLUDED,
  programVariant: "standard"
};

const shellyAug22Bootcamp: StandardEnrollLead = {
  slug: "shelly-aug22-bootcamp",
  parent: {
    first: "Shelly",
    last: "Sood",
    full: "Shelly Sood",
    email: "shellysood@hotmail.com"
  },
  student: {
    first: "",
    full: "",
    gradeNote: "confirm name/grade in follow-up"
  },
  pricing: {
    diagPrice: 0,
    weeklyPrice: 175,
    stripeDiagnosticProductId: "prod_UfmBm2GawHFXRA",
    stripeWeeklyProductId: "prod_UimaXmu7UDx54U",
    weeklyTrialDays: 7,
    stripeFallbackLink: "https://buy.stripe.com/7sYcMY7DK1X19lO7gZc7u01"
  },
  advisor: {
    first: "Brianna",
    full: "Brianna Zajicek",
    email: "brianna@illuminairy.com"
  },
  call: { dateLabel: "June 16, 2026" },
  faqPreset: "shelly-sprint",
  includedOverride: SHELLY_BOOTCAMP_INCLUDED,
  programVariant: "aug22-bootcamp",
  diagnosticPromo: {
    listPrice: 249,
    chargePrice: 0,
    label: "Family diagnostic bundle",
    displayCode: "SHELLY-2DIAG",
    stripeCouponId: "ocOXTShE"
  },
  weeklyPromo: {
    listPrice: 198,
    chargePrice: 175,
    label: "Family discount"
  }
};

export const standardEnrollLeads: Record<string, StandardEnrollLead> = {
  [michelleMichaela.slug]: michelleMichaela,
  [moniqueKylan.slug]: moniqueKylan,
  [shellyStandard.slug]: shellyStandard,
  [shellyAug22Bootcamp.slug]: shellyAug22Bootcamp
};

export function getStandardEnrollLead(
  slug: string
): StandardEnrollLead | null {
  return standardEnrollLeads[slug] ?? null;
}

/** Customer-facing student label when name not confirmed on the call. */
export function standardEnrollStudentLabel(lead: StandardEnrollLead): string {
  const name = lead.student.first?.trim();
  return name || "your student";
}

export function standardEnrollStudentPossessive(lead: StandardEnrollLead): string {
  const name = lead.student.first?.trim();
  return name ? `${name}'s` : "your student's";
}

export function standardEnrollDiagnosticDescription(lead: StandardEnrollLead): string {
  const name = lead.student.first?.trim();
  if (name) return `${name} — Skill Diagnostic + Personalized Plan`;
  return "Skill Diagnostic + Personalized Plan";
}
