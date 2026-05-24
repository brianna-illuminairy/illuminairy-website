import type { Int8MistakeDrivenCopy } from "@/lib/sat-plan-funnel/int8-mistake-driven-copy";

type Int8MistakeDrivenGraphicProps = {
  copy: Pick<
    Int8MistakeDrivenCopy,
    | "sessionBannerLead"
    | "sessionSkillLabel"
    | "progressionSteps"
    | "footerLabel"
    | "footerStatus"
    | "graphicAriaLabel"
  >;
};

export function Int8MistakeDrivenGraphic({ copy }: Int8MistakeDrivenGraphicProps) {
  return (
    <div
      className="int8-mistake-graphic int8-mistake-graphic--reveal quiz-step-trust-graphic int8-mistake-graphic--inset"
      role="img"
      aria-label={copy.graphicAriaLabel}
    >
      <div className="quiz-step-trust-card int8-mistake-graphic__card">
        <div className="int8-mistake-graphic__banner" aria-hidden>
          <span className="int8-mistake-graphic__banner-lead">{copy.sessionBannerLead}</span>
          <strong className="int8-mistake-graphic__banner-skill">{copy.sessionSkillLabel}</strong>
        </div>

        <ol className="int8-mistake-graphic__progression" aria-hidden>
          {copy.progressionSteps.map((step) => (
            <li
              key={step.status}
              className={[
                "int8-mistake-graphic__row",
                `int8-mistake-graphic__row--${step.status}`
              ].join(" ")}
            >
              <div className="int8-mistake-graphic__row-copy">
                <strong>{step.title}</strong>
              </div>
              <span
                className={[
                  "int8-mistake-graphic__badge",
                  `int8-mistake-graphic__badge--${step.status}`
                ].join(" ")}
              >
                {step.statusMark}
              </span>
            </li>
          ))}
        </ol>

        <div className="int8-mistake-graphic__footer" aria-hidden>
          <span>{copy.footerLabel}</span>
          <strong>{copy.footerStatus}</strong>
        </div>
        <div className="int8-mistake-graphic__bar" aria-hidden />
      </div>
    </div>
  );
}
