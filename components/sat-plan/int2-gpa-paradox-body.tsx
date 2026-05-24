import type { Int2GpaParadoxCopy } from "@/lib/sat-plan-funnel/int2-gpa-paradox-copy";
import { Int2ExpertVideo } from "@/components/sat-plan/int2-expert-video";
import { Int2GpaScoreSplit } from "@/components/sat-plan/int2-gpa-score-split";

type Int2GpaParadoxBodyProps = {
  copy: Int2GpaParadoxCopy;
};

export function Int2GpaParadoxBody({ copy }: Int2GpaParadoxBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content int2-gpa-paradox">
      <p className="quiz-step-eyebrow">{copy.eyebrow}</p>

      <Int2ExpertVideo title={copy.eyebrow} />
      <Int2GpaScoreSplit gpaLabel={copy.gpaLabel} scoreLabel={copy.scoreLabel} />

      {copy.paragraphs.map((paragraph, index) => (
        <p key={index} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}

      {copy.footnote ? <p className="quiz-step-footnote">{copy.footnote}</p> : null}
    </div>
  );
}
