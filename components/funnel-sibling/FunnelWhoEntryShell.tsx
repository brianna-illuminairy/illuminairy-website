import { FunnelEntryTopChrome } from "./FunnelEntryTopChrome";

type FunnelWhoEntryShellProps = {
  id: string;
  progressPct: number;
};

/** SSR placeholder for Plan A / Plan B step 1 (Who needs SAT help?). */
export function FunnelWhoEntryShell({ id, progressPct }: FunnelWhoEntryShellProps) {
  return (
    <div id={id} className="qf-funnel-step funnel-entry-ssr" aria-hidden="true">
      <div className="qf-page">
        <FunnelEntryTopChrome progressPct={progressPct} />
        <div className="qf-body" style={{ background: "var(--qf-bg)", position: "relative" }}>
          <div className="qf-body-inner">
            <div className="qf-question-head">
              <h1 className="qf-h1">Who needs SAT help?</h1>
            </div>
            <div className="qf-options qf-options--binary">
              <div className="qf-opt">
                <span className="qf-opt-content">
                  <span className="lbl">My child</span>
                </span>
              </div>
              <div className="qf-opt">
                <span className="qf-opt-content">
                  <span className="lbl">Me</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
