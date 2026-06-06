import type { FunnelCounts, StepDrop } from "@/lib/marketing/funnel-metrics";

export type FunnelLeak = {
  id: string;
  label: string;
  severity: "high" | "medium" | "low";
  ratePct: number | null;
  detail: string;
};

function rate(num: number, den: number) {
  if (den <= 0) return null;
  return Math.round((1000 * num) / den) / 10;
}

function bounceRate(counts: FunnelCounts) {
  if (counts.lpViews <= 0) return null;
  const bounced = Math.max(0, counts.lpViews - counts.ctaClicks);
  return rate(bounced, counts.lpViews);
}

export function rankFunnelLeaks(
  current: FunnelCounts,
  previous: FunnelCounts,
  steps: StepDrop[]
): FunnelLeak[] {
  const leaks: FunnelLeak[] = [];

  const lpBounce = bounceRate(current);
  if (lpBounce !== null && current.lpViews >= 20) {
    leaks.push({
      id: "lp_bounce",
      label: "Landing page bounce (views without CTA click)",
      severity: lpBounce >= 70 ? "high" : lpBounce >= 50 ? "medium" : "low",
      ratePct: lpBounce,
      detail: `${current.lpViews - current.ctaClicks} of ${current.lpViews} LP views did not click a CTA (${lpBounce}%).`
    });
  }

  const ctaToQuiz = rate(current.quizStarts, current.ctaClicks);
  if (ctaToQuiz !== null && current.ctaClicks >= 10) {
    leaks.push({
      id: "cta_to_q1",
      label: "CTA click → quiz start",
      severity: ctaToQuiz < 60 ? "high" : ctaToQuiz < 80 ? "medium" : "low",
      ratePct: ctaToQuiz,
      detail: `${current.quizStarts} quiz starts from ${current.ctaClicks} CTA clicks (${ctaToQuiz}% handoff).`
    });
  }

  const quizToLead = rate(current.leads, current.quizStarts);
  if (quizToLead !== null && current.quizStarts >= 10) {
    leaks.push({
      id: "quiz_to_lead",
      label: "Quiz start → lead (s5 submit)",
      severity: quizToLead < 25 ? "high" : quizToLead < 40 ? "medium" : "low",
      ratePct: quizToLead,
      detail: `${current.leads} leads from ${current.quizStarts} quiz starts (${quizToLead}% completion to lead).`
    });
  }

  const leadToBook = rate(current.books, current.leads);
  if (leadToBook !== null && current.leads >= 5) {
    leaks.push({
      id: "lead_to_book",
      label: "Lead → Strategy Call booked",
      severity: leadToBook < 40 ? "high" : leadToBook < 60 ? "medium" : "low",
      ratePct: leadToBook,
      detail: `${current.books} bookings from ${current.leads} leads (${leadToBook}% book rate). Check s5 errors in PostHog.`
    });
  }

  const maxStep = [...steps]
    .filter((s) => s.dropPct !== null && s.visitors >= 5)
    .sort((a, b) => (b.dropPct ?? 0) - (a.dropPct ?? 0))[0];

  if (maxStep && (maxStep.dropPct ?? 0) >= 15) {
    leaks.push({
      id: "step_drop",
      label: `Biggest quiz step drop: ${maxStep.step}`,
      severity: (maxStep.dropPct ?? 0) >= 35 ? "high" : "medium",
      ratePct: maxStep.dropPct,
      detail: `${maxStep.dropPct}% exit between prior step and ${maxStep.step} (${maxStep.visitors} visitors reached this step, last ${7}d).`
    });
  }

  const prevLeadToBook = rate(previous.leads, previous.quizStarts);
  const currLeadToBook = rate(current.leads, current.quizStarts);
  if (
    prevLeadToBook !== null &&
    currLeadToBook !== null &&
    previous.quizStarts >= 10 &&
    currLeadToBook < prevLeadToBook - 10
  ) {
    leaks.push({
      id: "regression_quiz_lead",
      label: "Quiz → lead rate vs prior period",
      severity: "high",
      ratePct: currLeadToBook,
      detail: `Down from ${prevLeadToBook}% prior 7d to ${currLeadToBook}% this 7d.`
    });
  }

  const severityOrder = { high: 0, medium: 1, low: 2 };
  return leaks.sort(
    (a, b) =>
      severityOrder[a.severity] - severityOrder[b.severity] ||
      (b.ratePct ?? 0) - (a.ratePct ?? 0)
  );
}
