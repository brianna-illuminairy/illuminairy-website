import type { Int8DiagnosticDrivenCopy } from "@/lib/sat-plan-funnel/int8-diagnostic-driven-copy";
import { Int8DiagnosticAnalysisGraphic } from "@/components/sat-plan/int8-diagnostic-analysis-graphic";

type Int8DiagnosticDrivenBodyProps = {
  copy: Int8DiagnosticDrivenCopy;
};

export function Int8DiagnosticDrivenBody({ copy }: Int8DiagnosticDrivenBodyProps) {
  return (
    <div className="quiz-step-trust-content int8-diagnostic-driven">
      <Int8DiagnosticAnalysisGraphic copy={copy} />
    </div>
  );
}
