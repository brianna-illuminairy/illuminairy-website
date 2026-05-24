import type { Int8GroupClassFailCopy } from "@/lib/sat-plan-funnel/int8-group-class-fail-copy";
import { Int8GroupClassClassroomGraphic } from "@/components/sat-plan/int8-group-class-classroom-graphic";
import { Int8PrepContrastPair } from "@/components/sat-plan/int8-prep-contrast-pair";
import { prepContrastPairAvailable } from "@/lib/sat-plan-funnel/prep-path-images";

type Int8GroupClassFailBodyProps = {
  copy: Int8GroupClassFailCopy;
  testTaker?: string;
};

export function Int8GroupClassFailBody({ copy, testTaker }: Int8GroupClassFailBodyProps) {
  const showContrastImage = prepContrastPairAvailable("crowd", testTaker);

  return (
    <div className="quiz-step-trust-content int8-group-class-fail">
      {copy.paragraphs.map((paragraph, index) => (
        <p key={index} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      {showContrastImage ? (
        <Int8PrepContrastPair pair="crowd" testTaker={testTaker} />
      ) : (
        <Int8GroupClassClassroomGraphic ariaLabel={copy.graphicAriaLabel} />
      )}
    </div>
  );
}
