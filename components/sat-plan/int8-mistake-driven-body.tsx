import type { Int8MistakeDrivenCopy } from "@/lib/sat-plan-funnel/int8-mistake-driven-copy";
import { Int8MistakeDrivenGraphic } from "@/components/sat-plan/int8-mistake-driven-graphic";

type Int8MistakeDrivenBodyProps = {
  copy: Int8MistakeDrivenCopy;
};

export function Int8MistakeDrivenBody({ copy }: Int8MistakeDrivenBodyProps) {
  return (
    <div className="quiz-step-trust-content int8-mistake-driven">
      <Int8MistakeDrivenGraphic copy={copy} />

      {copy.introParagraphs.map((paragraph, index) => (
        <p key={`intro-${index}`} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}

      <p className="quiz-step-copy int8-mistake-driven__session">
        <strong>{copy.sessionIntro}</strong> {copy.sessionSteps[0]}
      </p>

      {copy.closingParagraphs.map((paragraph, index) => (
        <p key={`close-${index}`} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
