import type { IntCh2ScoreFitCopy } from "@/lib/sat-plan-funnel/int-ch2-score-fit-copy";

type IntCh2ScoreFitBodyProps = {
  copy: IntCh2ScoreFitCopy;
};

export function IntCh2ScoreFitBody({ copy }: IntCh2ScoreFitBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      {copy.paragraphs.map((paragraph) => (
        <p key={paragraph} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      <p className="quiz-step-footnote">{copy.footnote}</p>
    </div>
  );
}
