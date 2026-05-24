import type { Int8GroupClassFailCopy } from "@/lib/sat-plan-funnel/int8-group-class-fail-copy";
import { Int8GroupClassClassroomGraphic } from "@/components/sat-plan/int8-group-class-classroom-graphic";

type Int8GroupClassFailBodyProps = {
  copy: Int8GroupClassFailCopy;
};

export function Int8GroupClassFailBody({ copy }: Int8GroupClassFailBodyProps) {
  return (
    <div className="quiz-step-trust-content int8-group-class-fail">
      {copy.paragraphs.map((paragraph, index) => (
        <p key={index} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      <Int8GroupClassClassroomGraphic ariaLabel={copy.graphicAriaLabel} />
    </div>
  );
}
