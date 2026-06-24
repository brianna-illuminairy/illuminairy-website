import Image from "next/image";
import { QUIZ_ENTRY_STEP, QUIZ_ENTRY_STEP_LEGACY } from "@/lib/quiz-funnel-b/funnel-steps";
import { BASE_LAB_ROUTE_STEPS } from "@/lib/quiz-funnel-b/quiz-route";

const ENTRY_FILL_PCT = Math.round((1 / BASE_LAB_ROUTE_STEPS.length) * 100);

type PlanBEntryShellProps = {
  id?: string;
};

/** SSR placeholder for step 1 — matches QFScreen + QFQWho before client QuizRunner loads. */
export function PlanBEntryShell({ id = "plan-b-entry-ssr" }: PlanBEntryShellProps) {
  return (
    <div id={id} className="qf-funnel-step plan-b-entry-ssr" aria-hidden="true">
      <div className="qf-page">
        <div className="qf-top">
          <div className="qf-top-row">
            <button className="qf-back hidden" aria-label="Back" type="button" tabIndex={-1}>
              ←
            </button>
            <div className="qf-logo-wrap">
              <span className="qf-brand-lockup">
                <Image
                  src="/brand/logo-horizontal.png"
                  alt="Illuminairy"
                  width={95}
                  height={36}
                  priority
                  fetchPriority="high"
                  style={{ height: 30, width: "auto", maxWidth: "100%" }}
                />
              </span>
            </div>
            <div className="qf-top-row-spacer" aria-hidden />
          </div>
          <div className="qf-progress">
            <div className="fill" style={{ width: `${ENTRY_FILL_PCT}%` }} />
          </div>
        </div>

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

export function isPlanBEntrySearchStep(step: string | undefined): boolean {
  if (!step || step === QUIZ_ENTRY_STEP || step === QUIZ_ENTRY_STEP_LEGACY) {
    return true;
  }
  return false;
}
