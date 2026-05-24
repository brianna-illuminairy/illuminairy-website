import type { Int8MistakeDrivenCopy } from "@/lib/sat-plan-funnel/int8-mistake-driven-copy";

type Int8MistakeDrivenGraphicProps = {
  copy: Pick<
    Int8MistakeDrivenCopy,
    "flowSteps" | "drillTitle" | "drillQuestions" | "graphicAriaLabel"
  >;
};

export function Int8MistakeDrivenGraphic({ copy }: Int8MistakeDrivenGraphicProps) {
  return (
    <div className="int8-mistake-graphic" role="img" aria-label={copy.graphicAriaLabel}>
      <div className="quiz-step-trust-card int8-mistake-graphic__card">
        <div className="int8-mistake-graphic__flow" aria-hidden>
          {copy.flowSteps.map((step) => (
            <span
              key={step.label}
              className={[
                "int8-mistake-graphic__flow-step",
                step.isMastery ? "int8-mistake-graphic__flow-step--mastery" : ""
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {step.isMastery ? <span className="int8-mistake-graphic__flow-check">✓</span> : null}
              <span className="int8-mistake-graphic__flow-label">{step.label}</span>
            </span>
          ))}
        </div>

        <div className="int8-mistake-graphic__drill" aria-hidden>
          <p className="int8-mistake-graphic__drill-title">{copy.drillTitle}</p>
          <ul className="int8-mistake-graphic__drill-list">
            {copy.drillQuestions.map((question) => (
              <li
                key={question.label}
                className={[
                  "int8-mistake-graphic__drill-item",
                  question.mastered ? "int8-mistake-graphic__drill-item--done" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="int8-mistake-graphic__drill-q">{question.label}</span>
                {question.mastered ? (
                  <span className="int8-mistake-graphic__drill-check" aria-hidden>
                    ✓
                  </span>
                ) : (
                  <span className="int8-mistake-graphic__drill-pending" aria-hidden>
                    ···
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
