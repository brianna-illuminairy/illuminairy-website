import type { Int1TrustCopy } from "@/lib/sat-plan-funnel/int1-trust-copy";
import { Int1TrustGraphic } from "@/components/sat-plan/int1-trust-graphic";

type Int1TrustBodyProps = {
  copy: Int1TrustCopy;
};

export function Int1TrustBody({ copy }: Int1TrustBodyProps) {
  return (
    <div className="quiz-step-trust-content quiz-step-trust-content--center">
      <Int1TrustGraphic />
      <p className="quiz-step-copy">{copy.lead}</p>
      <p className="quiz-step-copy">
        {copy.bridgeBefore}
        {copy.bridgeTarget !== "" ? (
          <strong className="quiz-step-trust-target">{copy.bridgeTarget}</strong>
        ) : null}
        {copy.bridgeAfter}
      </p>
    </div>
  );
}
