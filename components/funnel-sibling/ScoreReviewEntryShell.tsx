import { SR_GRADE_OPTIONS } from "@/lib/score-review-funnel/intake-options";
import { FunnelEntryTopChrome } from "./FunnelEntryTopChrome";

type ScoreReviewEntryShellProps = {
  id: string;
  progressPct: number;
};

/** SSR placeholder for Score Review step 1 (grade). */
export function ScoreReviewEntryShell({ id, progressPct }: ScoreReviewEntryShellProps) {
  return (
    <div id={id} className="qf-funnel-step funnel-entry-ssr" aria-hidden="true">
      <div className="qf-page">
        <FunnelEntryTopChrome progressPct={progressPct} />
        <div className="qf-body" style={{ background: "var(--qf-bg)", position: "relative" }}>
          <div className="qf-body-inner">
            <div className="gap-22">
              <div>
                <p className="qf-meta" style={{ color: "var(--qf-forest)", marginBottom: 8 }}>
                  Quick questions
                </p>
                <h1 className="qf-h1">What grade is your student in?</h1>
              </div>
              <div className="gap-10">
                {SR_GRADE_OPTIONS.map((option) => (
                  <div key={option.id} className="qf-opt">
                    <span className="qf-opt-content">
                      <span className="lbl">{option.label}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
