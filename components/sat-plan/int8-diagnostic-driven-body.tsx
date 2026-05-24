import type { Int8DiagnosticDrivenCopy } from "@/lib/sat-plan-funnel/int8-diagnostic-driven-copy";
import { Int8DiagnosticDrivenGraphic } from "@/components/sat-plan/int8-diagnostic-driven-graphic";

type Int8DiagnosticDrivenBodyProps = {
  copy: Int8DiagnosticDrivenCopy;
};

export function Int8DiagnosticDrivenBody({ copy }: Int8DiagnosticDrivenBodyProps) {
  return (
    <div className="quiz-step-trust-content int8-diagnostic-driven">
      {copy.paragraphs.map((paragraph, index) => (
        <p key={index} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      <Int8DiagnosticDrivenGraphic copy={copy} />
    </div>
  );
}
