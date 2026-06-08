/** Human labels for admin funnel drop-off tables. */
export const FUNNEL_STAGE_LABELS: Record<string, string> = {
  landing_page: "Landing page",
  cta_click: "CTA click",
  quiz_started: "Quiz started",
  lead_submitted: "Lead submitted (s5)",
  call_booked: "Strategy Call booked",
  "q1-parent-child": "Q1 · Who needs SAT help",
  "q-who": "Q1 · Who needs SAT help",
  "q-score-lower": "Q2 · Score lower than expected",
  q1: "Q3 · What feels most urgent",
  q2: "Q4 · Stakes",
  q3: "Q5 · Times taken SAT",
  "i-steps": "Insight · Steps",
  q4: "Q6 · Recent score",
  "q-doubts": "Q · Doubts",
  q5: "Q7 · Next test date",
  "hit-outcome-month-one": "Insight · First month outcome",
  q6: "Q8 · Blocker",
  q7: "Q9 · What they tried",
  "hit-q7": "Insight · Prep failure",
  "i-diag": "Insight · Diagnosis",
  "i-compare": "Insight · Compare prep",
  q8: "Q10 · Goal score",
  achievability: "Insight · Achievability",
  q9: "Q11 · GPA",
  name: "Parent + student name",
  "i-gap": "Insight · GPA gap",
  "hit-q3-none": "Insight · No prior SAT",
  "doubts-insight": "Insight · Doubts",
  "hit-q5-tbd": "Insight · Test date TBD",
  "hit-q8-scores": "Insight · Goal TBD",
  i2: "Insight · I2 compute",
  v1: "Insight · Projection",
  s4: "Plan reveal",
  s5: "Lead form + booking (s5)"
};

export function funnelStageLabel(stageId: string): string {
  return FUNNEL_STAGE_LABELS[stageId] ?? stageId;
}
