import { SAT_EXAM_DAY } from "@/lib/sat-program-schedule";

export type SummerSatPhase = {
  title: string;
  focus: string;
  tasks: string[];
};

function parseLocalDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

/** Ordered phases — works whether you have many weeks left or only a few; keep the sequence. */
export function getSummerSatPhases(): SummerSatPhase[] {
  return [
    {
      title: "Phase 1 — Baseline",
      focus: "Know your real starting point",
      tasks: [
        "One full-length Bluebook SAT under real rules (timer, laptop, breaks).",
        "Log total score plus Math and R&W — not just “felt fine.”",
        "List top miss types per section (e.g. systems, inference, comma rules)."
      ]
    },
    {
      title: "Phase 2 — Diagnose",
      focus: "Turn misses into a study list",
      tasks: [
        "Review every wrong and skipped question from the baseline — why, not just the key.",
        "Sort misses: content gap vs. careless vs. ran out of time.",
        "Pick the few topic clusters that cost the most points first.",
        "Run timed R&W and Math module sets — note where time breaks down.",
        "Update the study list; drop topics that were one-off careless errors."
      ]
    },
    {
      title: "Phase 3 — Learn content",
      focus: "Cover what the digital SAT actually tests",
      tasks: [
        "Reading & Writing — Standard English and Expression of Ideas (punctuation, agreement, transitions, concision).",
        "Reading & Writing — Information & Ideas and Craft & Structure (evidence, charts, tone, function of a sentence).",
        "Math — algebra and advanced math (linear, systems, functions, quadratics); use Desmos wherever a graph or table helps.",
        "Math — problem-solving and geometry (ratios, stats, triangles, circles, coordinates); timed sets by module.",
        "Mid-learn checkpoint: one more full-length Bluebook under timed conditions — compare to your baseline."
      ]
    },
    {
      title: "Phase 4 — Practice",
      focus: "Weak spots only, then mixed work",
      tasks: [
        "No new topics — only error types that still show up.",
        "Alternate R&W and Math practice days; keep sessions short and focused.",
        "One timed section (full module length) mid-week when energy is low.",
        "Short mixed drills across both sections, then another full-length Bluebook — same device and rules as test day.",
        "Re-score your miss log; drop patterns that stopped appearing."
      ]
    },
    {
      title: "Phase 5 — Pace and adapt",
      focus: "Module 2, tools, and test-day rhythm",
      tasks: [
        "Practice sets biased toward harder second modules (time pressure).",
        "Desmos speed drills — when to graph vs. when to do algebra.",
        "Know the reference sheet cold so you are not re-deriving on test day.",
        "One more full-length Bluebook — sleep, snacks, start time like exam day.",
        "Review only misses and timing — no brand-new content.",
        "Confirm registration, ID, device charge, approved calculator policy."
      ]
    },
    {
      title: "Phase 6 — Taper",
      focus: "Light touch before the exam",
      tasks: [
        "Two or three short timed sections or one half-length — confidence, not cramming.",
        "Protect sleep and the morning of the exam on the family calendar.",
        "Pack: device, charger, admission ticket, ID, snacks for break."
      ]
    }
  ];
}

export function getSummerPlanExamDay() {
  const exam = parseLocalDate(SAT_EXAM_DAY);
  return {
    iso: SAT_EXAM_DAY,
    dateLabel: new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(exam),
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(exam)
  };
}
