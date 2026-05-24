import type { Int12SatChangedCopy } from "@/lib/sat-plan-funnel/int12-sat-changed-copy";

type Int12SatChangedBodyProps = {
  copy: Int12SatChangedCopy;
};

export function Int12SatChangedBody({ copy }: Int12SatChangedBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content int12-sat-changed">
      <p className="quiz-step-eyebrow">{copy.eyebrow}</p>
      <div className="int12-format-split" aria-hidden="true">
        <div className="int12-format-split__panel int12-format-split__panel--digital">
          <span className="int12-format-split__label">Digital SAT</span>
          <span className="int12-format-split__detail">Laptop · Desmos · formula sheet</span>
        </div>
        <div className="int12-format-split__panel int12-format-split__panel--paper">
          <span className="int12-format-split__label">Paper prep</span>
          <span className="int12-format-split__detail">Pencil · book · classroom drills</span>
        </div>
      </div>
      {copy.paragraphs.map((paragraph, index) => (
        <p key={index} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      {copy.prepLine ? <p className="quiz-step-copy quiz-step-copy--accent">{copy.prepLine}</p> : null}
      {copy.analogy.map((line, index) => (
        <p key={`analogy-${index}`} className="quiz-step-copy quiz-step-copy--quote">
          {line}
        </p>
      ))}
      <p className="quiz-step-footnote">{copy.footnote}</p>
    </div>
  );
}
