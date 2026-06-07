import { funnelStageLabel } from "@/lib/marketing/funnel-stage-labels";
import {
  getFunnelCounts,
  getStepDropoffs,
  type FunnelCounts,
  type StepDrop
} from "@/lib/marketing/funnel-metrics";

export type FunnelDropStage = {
  id: string;
  label: string;
  reached: number;
  continued: number;
  dropped: number;
  dropPct: number | null;
  retainFromLpPct: number | null;
};

function pct(num: number, den: number): number | null {
  if (den <= 0) return null;
  return Math.round((1000 * num) / den) / 10;
}

function stageRow(
  id: string,
  label: string,
  reached: number,
  continued: number,
  lpTop: number
): FunnelDropStage {
  const dropped = Math.max(0, reached - continued);
  return {
    id,
    label,
    reached,
    continued,
    dropped,
    dropPct: pct(dropped, reached),
    retainFromLpPct: pct(reached, lpTop)
  };
}

function continuedAfterStep(
  steps: StepDrop[],
  index: number,
  leads: number
): number {
  const curr = steps[index];
  const next = steps[index + 1];
  if (next) return next.visitors;
  if (curr.step === "s5") return leads;
  if (index === steps.length - 1) return leads;
  return 0;
}

export function buildFunnelDropoffStages(
  counts: FunnelCounts,
  steps: StepDrop[]
): FunnelDropStage[] {
  const lpTop = counts.lpViews;
  const out: FunnelDropStage[] = [];

  out.push(
    stageRow(
      "landing_page",
      funnelStageLabel("landing_page"),
      counts.lpViews,
      counts.ctaClicks,
      lpTop
    )
  );

  out.push(
    stageRow(
      "cta_click",
      funnelStageLabel("cta_click"),
      counts.ctaClicks,
      counts.quizStarts,
      lpTop
    )
  );

  const firstStepVisitors = steps[0]?.visitors ?? 0;
  out.push(
    stageRow(
      "quiz_started",
      funnelStageLabel("quiz_started"),
      counts.quizStarts,
      firstStepVisitors > 0 ? firstStepVisitors : counts.quizStarts,
      lpTop
    )
  );

  for (let i = 0; i < steps.length; i++) {
    const row = steps[i];
    const continued = continuedAfterStep(steps, i, counts.leads);
    out.push(
      stageRow(
        row.step,
        funnelStageLabel(row.step),
        row.visitors,
        continued,
        lpTop
      )
    );
  }

  if (counts.leads > 0 || counts.books > 0) {
    const leadReached = counts.leads > 0 ? counts.leads : counts.books;
    out.push(
      stageRow(
        "lead_submitted",
        funnelStageLabel("lead_submitted"),
        leadReached,
        counts.books,
        lpTop
      )
    );
  }

  if (counts.books > 0) {
    out.push(
      stageRow(
        "call_booked",
        funnelStageLabel("call_booked"),
        counts.books,
        counts.books,
        lpTop
      )
    );
  }

  return out;
}

export type FunnelDropoffReport = {
  periodDays: number;
  stages: FunnelDropStage[];
  landingBouncePct: number | null;
  topDropStage: FunnelDropStage | null;
};

export async function getFunnelDropoffReport(
  days = 7
): Promise<FunnelDropoffReport> {
  const counts = await getFunnelCounts(days);
  const steps = await getStepDropoffs(days, counts.lpViews, counts.quizStarts);
  const stages = buildFunnelDropoffStages(counts, steps);
  const landingBouncePct =
    counts.lpViews > 0
      ? pct(counts.lpViews - counts.ctaClicks, counts.lpViews)
      : null;

  const topDropStage = [...stages]
    .filter((s) => s.dropPct !== null && s.reached >= 5 && s.dropped > 0)
    .sort((a, b) => (b.dropPct ?? 0) - (a.dropPct ?? 0))[0] ?? null;

  return { periodDays: days, stages, landingBouncePct, topDropStage };
}
