/**
 * SSOT for standard post-call enrollment FAQ items.
 *
 * Each lead picks a preset (or explicit id list) so pages show only
 * call-relevant questions instead of the full ~19-question bank.
 */

import type { StandardFaqGroup, StandardFaqItem } from "@/lib/standard-enroll";

export type StandardFaqId =
  | "paying-today"
  | "contract"
  | "diag-results"
  | "weekly-start"
  | "time-per-week"
  | "session-length"
  | "sessions-per-week"
  | "tutor-credentials"
  | "same-tutor"
  | "scheduling"
  | "reschedule"
  | "score-increase"
  | "student-effort"
  | "progress-reports"
  | "improvement-speed"
  | "program-duration"
  | "digital-sat"
  | "adaptive-sat"
  | "sat-scoring";

export type StandardFaqPreset =
  | "standard-full"
  | "shelly-standard"
  | "shelly-sprint";

export type StandardFaqPricing = {
  /** List or charge price shown on the pay card for the diagnostic line. */
  diagPrice: number;
  weeklyPrice: number;
  /** Actual diagnostic charge at checkout (0 when family promo applies). */
  diagChargePrice?: number;
  /** When set, weekly-start FAQ uses sprint backward-planning copy. */
  sprintExamLabel?: string;
};

type FaqEntry = {
  group: string;
  item: (p: StandardFaqPricing) => StandardFaqItem;
};

const FAQ_BANK: Record<StandardFaqId, FaqEntry> = {
  "paying-today": {
    group: "Pricing & billing",
    item: (p) => {
      const charge = p.diagChargePrice ?? p.diagPrice;
      const diagLine =
        charge === 0
          ? "Your diagnostic and personalized plan are included today at no charge (family bundle). We still run the full proctored diagnostic and build the improvement plan from it."
          : `The $${charge} today covers your proctored diagnostic, the full analysis of where your student is losing points, and the personalized improvement plan built from it.`;
      return {
        q: "What exactly am I paying for today?",
        a: [
          `${diagLine} Tutoring is separate and you will be billed for it weekly starting 7 days from checkout.`
        ]
      };
    }
  },
  contract: {
    group: "Pricing & billing",
    item: () => ({
      q: "Is there a contract or minimum commitment?",
      a: [
        "No. Enrollment is week to week. You can cancel anytime before your next weekly charge. There is no fixed term, no package that runs out, and no penalty for stopping when your student has reached their goal or you are ready to pause."
      ]
    })
  },
  "diag-results": {
    group: "Pricing & billing",
    item: () => ({
      q: "How soon can I get my diagnostic results back?",
      a: [
        "Once your diagnostic payment is complete, you'll be provided a link to book your diagnostic. We will analyze your diagnostic results, create your personalized plan, and provide it back to you within 2 business days."
      ]
    })
  },
  "weekly-start": {
    group: "Pricing & billing",
    item: (p) => {
      const sprintNote = p.sprintExamLabel
        ? ` For the ${p.sprintExamLabel} test, we work backward from that date so every week between now and test day has a clear focus.`
        : "";
      const charge = p.diagChargePrice ?? p.diagPrice;
      const setupLead =
        charge === 0
          ? "After you enroll, the next 7 days are setup:"
          : `After you pay the $${charge}, the next 7 days are setup:`;
      return {
        q: `When does the tutoring and $${p.weeklyPrice} per week start?`,
        a: [
          `The weekly fee does not start until your tutoring does. ${setupLead} we run the diagnostic, get your plan back to you, and build and schedule your first lesson. There are no sessions and no weekly charge during that time. Your first weekly charge is 7 days from today. After it starts, enrollment stays week to week, never a fixed contract.${sprintNote}`
        ]
      };
    }
  },
  "time-per-week": {
    group: "Sessions & scheduling",
    item: () => ({
      q: "How much time should my child expect to spend on the SAT each week?",
      a: [
        "Students are expected to do 30 to 60 minutes of homework a day, five days a week. For the typical student aiming for a 1400 or higher, expect 7 to 10 hours a week of total work. That includes lesson reviews, one-on-one sessions, homework, and practice tests."
      ]
    })
  },
  "session-length": {
    group: "Sessions & scheduling",
    item: () => ({
      q: "How long is each tutoring session?",
      a: [
        "Each session is booked for one hour. We usually create about 45 minutes of lesson content for each session.",
        "In rare cases, a student may finish before the full 45 minutes. More often, sessions run closer to the full hour because we may need to pause and reteach a concept, work through an example more slowly, or do more practice until the concept clicks.",
        "We only end early if the student has completed that day's content and is ready to practice on their own."
      ]
    })
  },
  "sessions-per-week": {
    group: "Sessions & scheduling",
    item: () => ({
      q: "How many sessions does my student get each week?",
      a: [
        "Your student gets 2 tutoring sessions every week, both with their own tutor. We guarantee that at least 3 out of every 4 sessions are one-on-one. No more than 1 out of every 4 sessions will be small group.",
        "Small group sessions only happen when a few students are working on the same skill, at the same time, and at the same level of difficulty."
      ]
    })
  },
  "tutor-credentials": {
    group: "Sessions & scheduling",
    item: () => ({
      q: "Who will be tutoring my student?",
      a: [
        "Your student will work with near-peer graduate students from schools like Duke, Emory, Georgia Tech, University of Florida, UT Austin, and Vanderbilt. We use near-peer tutors on purpose because students often respond well to someone who recently went through the same test and admissions pressure.",
        "Every tutor has taken the SAT and scored 1450 or higher. Tutors complete training and shadowing before working with families, and they retrain whenever the SAT changes. Math tutors specialize in Math; Reading and Writing tutors specialize in R&W. Each section tutor scored 750 or higher on the section they teach.",
        "They are all deeply familiar with the Digital SAT, including the Desmos calculator and adaptive format."
      ]
    })
  },
  "same-tutor": {
    group: "Sessions & scheduling",
    item: () => ({
      q: "Will my student have the same tutor each week?",
      a: [
        "We believe the relationship between the tutor and student matters. Over time, the tutor learns how the student thinks, where they get stuck, and what kind of explanation works best for them. The student also gets more comfortable asking questions and saying when something does not make sense.",
        "Because of this, your student works with the same tutor week to week for each subject we cover. If tutoring is math-only or Reading and Writing only, they have one tutor for that section. If we cover both sections, they have no more than two tutors: one for Reading and Writing and one for Math. Each tutor scored 750 or higher on the SAT section they teach. That gives your student consistency and subject-specific support where it applies."
      ]
    })
  },
  scheduling: {
    group: "Sessions & scheduling",
    item: () => ({
      q: "How are sessions scheduled?",
      a: [
        "Scheduling is flexible because students are often balancing school, sports, jobs, extracurriculars, and heavy course loads. We offer evening and weekend sessions.",
        "Some students keep the same 2 time slots every week, such as Tuesday and Thursday for one hour each. Others prefer to do both sessions back to back, such as 2 hours on Sunday.",
        "At the end of each week, your student updates us on their available time slots for the following week. We build the schedule around what works for your student, and you can adjust it when needed."
      ]
    })
  },
  reschedule: {
    group: "Sessions & scheduling",
    item: () => ({
      q: "What if we need to reschedule or cancel a session?",
      a: [
        "No problem, as long as you give us at least 24 hours' notice. You can reschedule or cancel a session, and we will find another time that works.",
        "If something comes up last minute or your student is running late, reach out and we will see what we can do."
      ]
    })
  },
  "score-increase": {
    group: "Results & progress",
    item: () => ({
      q: "What kind of score increase is possible?",
      a: [
        "On average, students improve about 182 points over 12 weeks, or about 15 points per week. That is only the average. Some students improve by about 10 points per week, and others by about 25.",
        "The range we have seen across families is wide. We have had students gain about 150 points, and others gain 450 points across the program. To give you the best estimate of your student's specific score improvement range, we first need to complete the diagnostic.",
        "The diagnostic shows us which specific content and test-taking skills your student is struggling with. From there we can tell you a realistic score range and how long it will likely take to get there. Results vary by student."
      ]
    })
  },
  "student-effort": {
    group: "Results & progress",
    item: () => ({
      q: "What does my student need to do to get there?",
      a: [
        "Your student needs to come prepared, work in a quiet place, and pay attention during each session.",
        "Between sessions, they need to complete the assigned homework and practice problems. They should also bring any questions they could not solve on their own to the next session.",
        "They also need to track their skill practice. If they are off track, they will need to put in more work between sessions to catch up.",
        "We use spaced practice and mistake review to improve long-term retention. Many students are used to studying for a school test, taking the test, and then forgetting the material. The SAT is different. It pulls from several years of math, reading, and writing, and it combines skills, like using factoring inside a harder algebra problem.",
        "That is why we focus on real understanding, steady practice, and long-term retention. The goal is not to cram for one test day. The goal is to build skills that hold up when the student takes the SAT."
      ]
    })
  },
  "progress-reports": {
    group: "Results & progress",
    item: () => ({
      q: "How will we know if tutoring is working?",
      a: [
        "You get a progress report every week, sent to both you and your student. Each report covers what was taught that week, what your student started to understand, what homework was assigned, how much homework was completed, and how accurate your student was on practice problems by difficulty level.",
        "On weeks with a full-length practice test, you also get the test results, the score improvement so far, and any changes we are making to the lesson plan for the next four weeks.",
        "You are never left guessing about where things stand."
      ]
    })
  },
  "improvement-speed": {
    group: "Results & progress",
    item: () => ({
      q: "What affects how fast my student improves?",
      a: [
        "A student's starting score affects how quickly their score may improve. Students usually make faster progress early because they are fixing clearer gaps in content, strategy, and timing. As their score gets higher, each additional point becomes harder to earn because the remaining mistakes are usually harder to find and fix.",
        "For example, a student starting at 1150 might gain about 100 points in the first month, 50 points in the second month, and 30 points in the third month. That could look like 1150 to 1250, then 1300, then 1330. These are examples, not promises. Every student improves at a different pace.",
        "This pattern is common across score ranges. Moving from about 1100 to 1350 is usually faster than moving from 1350 to 1500. Moving from 1400 to 1500 is harder still because the student has fewer easy mistakes left to fix. Moving from 1500 to 1550 is often the slowest stage because the student has to get nearly every question right and finish within the time limit.",
        "That is why a large score increase may take more than one test date and a longer prep timeline. The diagnostic test helps us see where your student is starting, what is holding them back, and what pace is realistic from the beginning."
      ]
    })
  },
  "program-duration": {
    group: "Results & progress",
    item: () => ({
      q: "How long should we expect tutoring to take?",
      a: [
        "There is no set number of weeks and no package that runs out. Enrollment is week to week, and we keep working with your student toward their goal score for as long as you want to continue.",
        "That said, we usually recommend tutoring for at least 12 to 16 weeks. The right timeline depends on how many points your student is trying to gain, where they are starting, and how much time they can spend practicing outside of sessions.",
        "For a large score increase, tutoring often takes more than one test date. In those cases, your student may improve across multiple tests, with some superscoring along the way, and we stay with you through that process.",
        "If your student has less time because of an upcoming test date or application deadline, we may recommend meeting 3 or 4 times per week instead of once or twice per week. This gives your student more support in a shorter window, but it does not change the fact that larger score gains usually need time.",
        "You decide when you are done."
      ]
    })
  },
  "digital-sat": {
    group: "About the SAT",
    item: () => ({
      q: "What is the Digital SAT, and how is it different from the paper test?",
      a: [
        "The Digital SAT is the College Board's college admissions exam, now taken on a computer. It has two sections, Reading and Writing and Math, and runs 2 hours and 14 minutes, which is shorter than the old paper test. Reading and Writing is 64 minutes with 54 questions, Math is 70 minutes with 44 questions, and there is a 10-minute break in between. The Desmos graphing calculator is built in and available for the whole Math section. The biggest change is that the test is adaptive, so the difficulty shifts based on how your student is doing."
      ]
    })
  },
  "adaptive-sat": {
    group: "About the SAT",
    item: () => ({
      q: "Is the Digital SAT adaptive, and how does it work?",
      a: [
        "Yes. Each section has two modules. The first module mixes easy, medium, and hard questions, and how your student does on it decides whether the second module gets harder or easier. Strong performance on the first module unlocks the harder, higher-scoring questions in the second. Because roughly 60 to 70 percent of the score ceiling is set by that first module, accuracy early in each section matters a lot, and it is one of the things we train for."
      ]
    })
  },
  "sat-scoring": {
    group: "About the SAT",
    item: () => ({
      q: "How is the SAT scored, and what is a good score?",
      a: [
        "The SAT is scored from 400 to 1600, combining two sections that each run 200 to 800, Reading and Writing and Math. What counts as a good score depends on the colleges on your student's list. As a rough guide, 1400 to 1600 is competitive for highly selective schools, 1300 to 1390 is strong for many selective colleges, and 1200 to 1290 is above average and fits many four-year universities. Many colleges also superscore, taking the highest section scores across multiple test dates, which is part of why we often plan for more than one test."
      ]
    })
  }
};

const PRESET_IDS: Record<StandardFaqPreset, StandardFaqId[]> = {
  "standard-full": [
    "paying-today",
    "diag-results",
    "weekly-start",
    "time-per-week",
    "session-length",
    "sessions-per-week",
    "tutor-credentials",
    "same-tutor",
    "scheduling",
    "reschedule",
    "score-increase",
    "student-effort",
    "progress-reports",
    "improvement-speed",
    "program-duration",
    "digital-sat",
    "adaptive-sat",
    "sat-scoring"
  ],
  "shelly-standard": [
    "paying-today",
    "contract",
    "diag-results",
    "weekly-start",
    "tutor-credentials",
    "same-tutor",
    "score-increase",
    "student-effort",
    "progress-reports",
    "scheduling"
  ],
  "shelly-sprint": [
    "paying-today",
    "contract",
    "diag-results",
    "weekly-start",
    "tutor-credentials",
    "same-tutor",
    "progress-reports"
  ]
};

const GROUP_ORDER = [
  "Pricing & billing",
  "Sessions & scheduling",
  "Results & progress",
  "About the SAT"
];

function buildGroupsFromIds(
  ids: StandardFaqId[],
  pricing: StandardFaqPricing
): StandardFaqGroup[] {
  const byGroup = new Map<string, StandardFaqItem[]>();

  for (const id of ids) {
    const entry = FAQ_BANK[id];
    if (!entry) continue;
    const item = entry.item(pricing);
    const list = byGroup.get(entry.group) ?? [];
    list.push(item);
    byGroup.set(entry.group, list);
  }

  const groups: StandardFaqGroup[] = [];
  for (const label of GROUP_ORDER) {
    const items = byGroup.get(label);
    if (items && items.length > 0) {
      groups.push({ label, items });
    }
  }
  return groups;
}

export function resolveStandardFaq(
  preset: StandardFaqPreset,
  pricing: StandardFaqPricing
): StandardFaqGroup[] {
  const ids = PRESET_IDS[preset];
  const enriched: StandardFaqPricing = { ...pricing };
  if (preset === "shelly-sprint") {
    enriched.sprintExamLabel = "August 22, 2026";
  }
  return buildGroupsFromIds(ids, enriched);
}

export function buildStandardFaqFromPreset(
  preset: StandardFaqPreset | undefined,
  diagPrice: number,
  weeklyPrice: number,
  diagChargePrice?: number
): StandardFaqGroup[] {
  return resolveStandardFaq(preset ?? "standard-full", {
    diagPrice,
    weeklyPrice,
    diagChargePrice
  });
}
