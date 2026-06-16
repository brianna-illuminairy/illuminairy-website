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

/**
 * Six real testimonials used in the scrolling marquee below the grid.
 * Source: `SAT Checkout (standalone).html` `Testimonials()` component.
 */
export const STANDARD_TESTIMONIALS: StandardTestimonial[] = [
  {
    gain: "1180 → 1500",
    quote:
      "We tried two other tutoring services before Illuminairy. The difference was night and day. Within four weeks our daughter could explain her math reasoning out loud, which she'd never done before.",
    name: "Priya M.",
    detail: "Parent of an 11th grader · Atlanta, GA"
  },
  {
    gain: "1240 → 1470",
    quote:
      "My tutor actually took the digital SAT. She'd say 'on the second module, you're going to see a problem like this' and she was right every time. That made me trust the strategy.",
    name: "Daniel R.",
    detail: "Student · Class of 2026"
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
      "Started below 1100 and didn't think 1300 was realistic. The diagnostic showed me where the easy points were. Three months later I was past my goal.",
    name: "Marcus T.",
    detail: "Student · Class of 2025"
  },
  {
    gain: "1370 → 1560",
    quote:
      "Worth every dollar. The scheduling was flexible enough to work around my son's soccer travel, and the tutor was patient when he had off weeks.",
    name: "Renee O.",
    detail: "Parent of a 12th grader · Boston, MA"
  },
  {
    gain: "1200 → 1490",
    quote:
      "I liked having the same two tutors all the way through. By month two they knew exactly where I'd freeze up and could walk me through it in a way that actually stuck.",
    name: "Sofia D.",
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
  weeklyPrice: number
): StandardFaqGroup[] {
  return [
    {
      label: "Pricing & billing",
      items: [
        {
          q: "What exactly am I paying for today?",
          a: [
            `The $${diagPrice} today covers your proctored diagnostic, the full analysis of where your student is losing points, and the personalized improvement plan built from it. Tutoring is separate and you will be billed for it weekly starting 7 days from checkout.`
          ]
        },
        {
          q: "How soon can I get my diagnostic results back?",
          a: [
            "Once your diagnostic payment is complete, you'll be provided a link to book your diagnostic. We will analyze your diagnostic results, create your personalized plan, and provide it back to you within 2 business days."
          ]
        },
        {
          q: `When does the tutoring and $${weeklyPrice} per week start?`,
          a: [
            `The weekly fee does not start until your tutoring does. After you pay the $${diagPrice}, the next 7 days are setup: we run the diagnostic, get your plan back to you, and build and schedule your first lesson. There are no sessions and no weekly charge during that time. Your first weekly charge is 7 days from today, and you can cancel anytime before then. After it starts, enrollment stays week to week, never a fixed contract.`
          ]
        }
      ]
    },
    {
      label: "Sessions & scheduling",
      items: [
        {
          q: "How much time should my student expect to spend each week?",
          a: [
            "Students are expected to do 30 to 60 minutes of homework a day, five days a week. For the typical student aiming for a 1400 or higher, expect 7 to 10 hours a week of total work. That includes lesson reviews, one-on-one sessions, homework, and practice tests."
          ]
        },
        {
          q: "How long is each tutoring session?",
          a: [
            "Each session is booked for one hour. We usually create about 45 minutes of lesson content for each session.",
            "In rare cases, a student may finish before the full 45 minutes. More often, sessions run closer to the full hour because we may need to pause and reteach a concept, work through an example more slowly, or do more practice until the concept clicks.",
            "We only end early if the student has completed that day's content and is ready to practice on their own."
          ]
        },
        {
          q: "How many sessions does my student get each week?",
          a: [
            "Your student gets 2 tutoring sessions every week, both with their own tutor. We guarantee that at least 3 out of every 4 sessions are one-on-one. No more than 1 out of every 4 sessions will be small group.",
            "Small group sessions only happen when a few students are working on the same skill, at the same time, and at the same level of difficulty."
          ]
        },
        {
          q: "Who will be tutoring my student?",
          a: [
            "Your student will work with near-peer graduate students from schools like Emory, Georgia Tech, Vanderbilt, and Duke. We use near-peer tutors on purpose because students often respond well to someone who recently went through the same test and admissions pressure.",
            "Every tutor has taken the Digital SAT and scored 1450 or higher. Tutors also complete training and shadowing before working with families, and they retrain whenever the SAT changes.",
            "We also survey students after sessions so we can keep a high quality bar."
          ]
        },
        {
          q: "Will my student have the same tutor each week?",
          a: [
            "We believe the relationship between the tutor and student matters. Over time, the tutor learns how the student thinks, where they get stuck, and what kind of explanation works best for them. The student also gets more comfortable asking questions and saying when something does not make sense.",
            "Because of this, we aim to give each student one primary Math tutor and one primary Reading and Writing tutor. Each tutor scored 750 or higher on the SAT section they teach. This gives your student both consistency and subject-specific support."
          ]
        },
        {
          q: "How are sessions scheduled?",
          a: [
            "Scheduling is flexible because students are often balancing school, sports, jobs, extracurriculars, and heavy course loads. We offer evening and weekend sessions.",
            "Some students keep the same 2 time slots every week, such as Tuesday and Thursday for one hour each. Others prefer to do both sessions back to back, such as 2 hours on Sunday.",
            "At the end of each week, your student updates us on their available time slots for the following week. We build the schedule around what works for your student, and you can adjust it when needed."
          ]
        },
        {
          q: "What if we need to reschedule or cancel a session?",
          a: [
            "No problem, as long as you give us at least 24 hours' notice. You can reschedule or cancel a session, and we will find another time that works.",
            "If something comes up last minute or your student is running late, reach out and we will see what we can do."
          ]
        }
      ]
    },
    {
      label: "Results & progress",
      items: [
        {
          q: "What kind of score increase is possible?",
          a: [
            "On average, students improve about 182 points over 12 weeks, or about 15 points per week. That is only the average — some students improve by about 10 points per week, and others by about 25.",
            "The range we have seen across families is wide. We have had students gain about 150 points, and others gain 450 points across the program. To give you the best estimate of your student's specific score improvement range, we first need to complete the diagnostic.",
            "The diagnostic shows us the specific content skills and test-taking skills your student is struggling with, so we can give meaningful feedback on what their score potential looks like and what is realistic on their timeline. Results vary by student."
          ]
        },
        {
          q: "What does my student need to do to get there?",
          a: [
            "The biggest factors are simple. Your student needs to show up to each session prepared, work in a quiet space, stay focused during the lesson, and complete the homework between sessions.",
            "Practice matters. Students improve faster when they put in real work outside of tutoring. That means doing the assigned practice problems, reviewing mistakes, and building the habit of using the strategies correctly on their own.",
            "Students with full schedules may move more slowly. This is common for students balancing sports, music, clubs, honors classes, AP classes, or IB classes. It does not mean they cannot improve. It usually means they have less time and energy available, so the work may take longer.",
            "We also teach students how to keep what they learn. Many students are used to studying for a school test, taking the test, and then forgetting the material. The SAT is different. It pulls from several years of math, reading, and writing. It also combines skills, like using factoring inside a harder algebra problem.",
            "That is why we focus on real understanding, steady practice, and long-term memory. The goal is not to cram for one test day. The goal is to build skills that hold up when the student takes the SAT."
          ]
        },
        {
          q: "How will we know if tutoring is working?",
          a: [
            "You get a progress report every week, sent to both you and your student. Each report covers what was taught that week, what your student started to understand, what homework was assigned, how much homework was completed, and how accurate your student was on practice problems by difficulty level.",
            "On weeks with a full-length practice test, you also get the test results, the score improvement so far, and any changes we are making to the lesson plan for the next four weeks.",
            "You are never left guessing about where things stand."
          ]
        },
        {
          q: "What affects how fast my student improves?",
          a: [
            "A student's starting score affects how quickly their score may improve. Students usually make faster progress early because they are fixing clearer gaps in content, strategy, and timing. As their score gets higher, each additional point becomes harder to earn because the remaining mistakes are usually harder to find and fix.",
            "For example, a student starting at 1150 might gain about 100 points in the first month, 50 points in the second month, and 30 points in the third month. That could look like 1150 to 1250, then 1300, then 1330. These are examples, not promises. Every student improves at a different pace.",
            "This pattern is common across score ranges. Moving from about 1100 to 1350 is usually faster than moving from 1350 to 1500. Moving from 1400 to 1500 is harder still because the student has fewer easy mistakes left to fix. Moving from 1500 to 1550 is often the slowest stage because the student has to get nearly every question right and finish within the time limit.",
            "That is why a large score increase may take more than one test date and a longer prep timeline. The diagnostic test helps us see where your student is starting, what is holding them back, and what pace is realistic from the beginning."
          ]
        },
        {
          q: "How long should we expect tutoring to take?",
          a: [
            "There is no set number of weeks and no package that runs out. Enrollment is week to week, and we keep working with your student toward their goal score for as long as you want to continue.",
            "That said, we usually recommend tutoring for at least 12 to 16 weeks. The right timeline depends on how many points your student is trying to gain, where they are starting, and how much time they can spend practicing outside of sessions.",
            "For a large score increase, tutoring often takes more than one test date. In those cases, your student may improve across multiple tests, with some superscoring along the way, and we stay with you through that process.",
            "If your student has less time because of an upcoming test date or application deadline, we may recommend meeting 3 or 4 times per week instead of once or twice per week. This gives your student more support in a shorter window, but it does not change the fact that larger score gains usually need time.",
            "You decide when you are done."
          ]
        }
      ]
    },
    {
      label: "About the SAT",
      items: [
        {
          q: "What is the Digital SAT, and how is it different from the paper test?",
          a: [
            "The Digital SAT is the College Board's college admissions exam, now taken on a computer. It has two sections, Reading and Writing and Math, and runs 2 hours and 14 minutes, which is shorter than the old paper test. Reading and Writing is 64 minutes with 54 questions, Math is 70 minutes with 44 questions, and there is a 10-minute break in between. The Desmos graphing calculator is built in and available for the whole Math section. The biggest change is that the test is adaptive, so the difficulty shifts based on how your student is doing."
          ]
        },
        {
          q: "Is the Digital SAT adaptive, and how does it work?",
          a: [
            "Yes. Each section has two modules. The first module mixes easy, medium, and hard questions, and how your student does on it decides whether the second module gets harder or easier. Strong performance on the first module unlocks the harder, higher-scoring questions in the second. Because roughly 60 to 70 percent of the score ceiling is set by that first module, accuracy early in each section matters a lot, and it is one of the things we train for."
          ]
        },
        {
          q: "How is the SAT scored, and what is a good score?",
          a: [
            "The SAT is scored from 400 to 1600, combining two sections that each run 200 to 800, Reading and Writing and Math. What counts as a good score depends on the colleges on your student's list. As a rough guide, 1400 to 1600 is competitive for highly selective schools, 1300 to 1390 is strong for many selective colleges, and 1200 to 1290 is above average and fits many four-year universities. Many colleges also superscore, taking the highest section scores across multiple test dates, which is part of why we often plan for more than one sitting."
          ]
        }
      ]
    }
  ];
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

export const standardEnrollLeads: Record<string, StandardEnrollLead> = {
  [michelleMichaela.slug]: michelleMichaela
};

export function getStandardEnrollLead(
  slug: string
): StandardEnrollLead | null {
  return standardEnrollLeads[slug] ?? null;
}
