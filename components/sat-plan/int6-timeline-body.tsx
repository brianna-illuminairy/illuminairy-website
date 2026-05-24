import type { Int6TimelineCopy } from "@/lib/sat-plan-funnel/int6-timeline-copy";

type Int6TimelineBodyProps = {
  copy: Int6TimelineCopy;
};

export function Int6TimelineBody({ copy }: Int6TimelineBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      {copy.paragraphs.map((paragraph, index) => (
        <p key={index} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      {copy.footnote ? <p className="quiz-step-footnote">{copy.footnote}</p> : null}
    </div>
  );
}
