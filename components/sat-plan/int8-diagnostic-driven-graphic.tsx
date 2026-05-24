import type { Int8DiagnosticDrivenCopy } from "@/lib/sat-plan-funnel/int8-diagnostic-driven-copy";

type Int8DiagnosticDrivenGraphicProps = {
  copy: Pick<
    Int8DiagnosticDrivenCopy,
    "topicMap" | "planTitle" | "planItems" | "scoreProgression" | "graphicAriaLabel"
  >;
};

export function Int8DiagnosticDrivenGraphic({ copy }: Int8DiagnosticDrivenGraphicProps) {
  return (
    <div className="int8-diagnostic-graphic" role="img" aria-label={copy.graphicAriaLabel}>
      <div className="quiz-step-trust-card int8-diagnostic-graphic__card">
        <div className="int8-diagnostic-graphic__split" aria-hidden>
          <div className="int8-diagnostic-graphic__map">
            <p className="int8-diagnostic-graphic__map-label">SAT topic map</p>
            <ul className="int8-diagnostic-graphic__topics">
              {copy.topicMap.map((topic) => (
                <li
                  key={topic.label}
                  className={[
                    "int8-diagnostic-graphic__topic",
                    topic.highlighted ? "int8-diagnostic-graphic__topic--hot" : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="int8-diagnostic-graphic__topic-name">{topic.label}</span>
                  {topic.highlighted && topic.pointsLost ? (
                    <span className="int8-diagnostic-graphic__topic-pts">
                      −{topic.pointsLost} pts
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="int8-diagnostic-graphic__plan">
            <p className="int8-diagnostic-graphic__plan-title">{copy.planTitle}</p>
            <ol className="int8-diagnostic-graphic__plan-list">
              {copy.planItems.map((item, index) => (
                <li key={item} className="int8-diagnostic-graphic__plan-item">
                  <span className="int8-diagnostic-graphic__plan-rank">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="int8-diagnostic-graphic__scores" aria-hidden>
          {copy.scoreProgression.map((score, index) => (
            <span key={score} className="int8-diagnostic-graphic__score-wrap">
              {index > 0 ? (
                <span className="int8-diagnostic-graphic__score-arrow" aria-hidden>
                  →
                </span>
              ) : null}
              <span
                className={[
                  "int8-diagnostic-graphic__score",
                  index === copy.scoreProgression.length - 1
                    ? "int8-diagnostic-graphic__score--goal"
                    : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {score}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
