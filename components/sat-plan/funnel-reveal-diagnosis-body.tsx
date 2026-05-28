import type { RevealDiagnosisCopy } from "@/lib/sat-plan-funnel/final-reveal-copy";

type FunnelRevealDiagnosisBodyProps = {
  copy: RevealDiagnosisCopy;
};

export function FunnelRevealDiagnosisBody({ copy }: FunnelRevealDiagnosisBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content reveal-diagnosis">
      {copy.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      <p className="quiz-step-copy">{copy.differenceParagraph}</p>
    </div>
  );
}
