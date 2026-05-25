import type { Int8MistakeDrivenCopy } from "@/lib/sat-plan-funnel/int8-mistake-driven-copy";
import { Int8MistakeDrivenGraphic } from "@/components/sat-plan/int8-mistake-driven-graphic";

type Int8MistakeDrivenBodyProps = {
  copy: Int8MistakeDrivenCopy;
};

export function Int8MistakeDrivenBody({ copy }: Int8MistakeDrivenBodyProps) {
  return (
    <div className="quiz-step-trust-content int8-mistake-driven">
      <p className="quiz-step-copy int8-mistake-driven__intro">
        {copy.introParagraph}
      </p>

      <Int8MistakeDrivenGraphic copy={copy} />

      <p className="quiz-step-copy int8-mistake-driven__closing">
        {copy.closingParagraph}
      </p>
    </div>
  );
}
