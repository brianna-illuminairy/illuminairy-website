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
    gain: "+190 from diagnostic",
    quote:
      "We tried Khan Academy and Bluebook, and we tried an SAT course. None of that worked, and her score was stuck in the 1100s. I knew this was going to work when I overheard a session and she was able to explain her math reasoning out loud, which she'd never done before. We haven't gotten her score back yet but she's up 190 points from her diagnostic.",
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
    gain: "Low 1200s → 1510",
    quote:
      "I started with a score in the low 1200s, and honestly only properly started studying about a week before my SAT testing date. Illuminairy's practice modules and detailed explanations helped me get a 1510 even on that time crunch. My experience equipped me to remain calm during testing and gave me the confidence to get a relatively good score on my first try.",
    name: "Olivia R.",
    detail: "Student · Class of 2026"
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
          q: "How much time should my child expect to spend on the SAT each week?",
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
            "Your student will work with near-peer graduate students from schools like Duke, Emory, Georgia Tech, University of Florida, UT Austin, and Vanderbilt. We use near-peer tutors on purpose because students often respond well to someone who recently went through the same test and admissions pressure.",
            "Every tutor has taken the SAT and scored 1450 or higher. Tutors also complete training and shadowing before working with families, and they retrain whenever the SAT changes. They are all deeply familiar with the Digital SAT, including the Desmos calculator and adaptive format."
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
            "On average, students improve about 182 points over 12 weeks, or about 15 points per week. That is only the average. Some students improve by about 10 points per week, and others by about 25.",
            "The range we have seen across families is wide. We have had students gain about 150 points, and others gain 450 points across the program. To give you the best estimate of your student's specific score improvement range, we first need to complete the diagnostic.",
            "The diagnostic shows us which specific content and test-taking skills your student is struggling with. From there we can tell you a realistic score range and how long it will likely take to get there. Results vary by student."
          ]
        },
        {
          q: "What does my student need to do to get there?",
          a: [
            "Your student needs to come prepared, work in a quiet place, and pay attention during each session.",
            "Between sessions, they need to complete the assigned homework and practice problems. They should also bring any questions they could not solve on their own to the next session.",
            "They also need to track their skill practice. If they are off track, they will need to put in more work between sessions to catch up.",
            "We use spaced practice and mistake review to improve long-term retention. Many students are used to studying for a school test, taking the test, and then forgetting the material. The SAT is different. It pulls from several years of math, reading, and writing, and it combines skills, like using factoring inside a harder algebra problem.",
            "That is why we focus on real understanding, steady practice, and long-term retention. The goal is not to cram for one test day. The goal is to build skills that hold up when the student takes the SAT."
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
