import type { SituationId } from "@/lib/assessment-funnel/situation-options";

type InsightSituationCopy = {
  headline: string;
  body: string;
};

const DEFAULT_SITUATION: InsightSituationCopy = {
  headline: "You’re not alone in this",
  body:
    "Most families hit a point where effort and results stop matching. The SAT rewards pattern recognition and timing—not just how hard your student studies. Naming your situation is the first step toward a plan that fits."
};

const BY_SITUATION: Partial<Record<SituationId, InsightSituationCopy>> = {
  deadline_pressure: {
    headline: "Deadlines make the stakes real",
    body:
      "When applications are close, every week matters—but panic usually leads to random practice. A clear sequence of diagnostics, weak-skill work, and timed practice tends to work better than cramming."
  },
  retake_big_lift: {
    headline: "Big jumps need a system, not more hours",
    body:
      "Large score changes usually come from fixing recurring mistake types, not retaking full tests endlessly. Your student’s next gains are often sitting in questions they’ve already missed."
  },
  fall_high_intent: {
    headline: "Starting now is a strength",
    body:
      "Families who begin with a structured plan before the test—rather than after a disappointing score—often waste less time and money. You’re in a good position to build momentum."
  },
  winter_research: {
    headline: "Comparison is smart—if you know what to compare",
    body:
      "Apps, classes, and tutors all promise progress. What matters is whether someone is tracking your student’s actual weak skills and adjusting week to week."
  },
  proactive_early: {
    headline: "Getting ahead reduces pressure later",
    body:
      "Early starts work best with light structure: baseline diagnostics, a realistic target, and steady practice—without burning out months before the test."
  },
  none_of_above: {
    headline: "Every family’s timeline is different",
    body:
      "What you shared still helps us shape recommendations. The SAT is predictable enough that a personalized path beats one-size-fits-all advice."
  }
};

export function insightSituationCopy(situationId?: string): InsightSituationCopy {
  if (!situationId) return DEFAULT_SITUATION;
  return BY_SITUATION[situationId as SituationId] ?? DEFAULT_SITUATION;
}

/** Draft — sync with quizfunnel assessment-hims-question-map.md I2 before approval. */
export const INSIGHT_PATH_COPY = {
  headline: "Why random practice usually stalls",
  body:
    "The SAT rewards repeating mistake types under time pressure—not more hours of generic review. A useful plan names the gaps, assigns practice against them, and checks progress week to week. That's what we'll reflect in your results summary."
};
