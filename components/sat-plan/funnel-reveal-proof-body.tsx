import type { RevealProofCopy } from "@/lib/sat-plan-funnel/final-reveal-copy";

type FunnelRevealProofBodyProps = {
  copy: RevealProofCopy;
};

export function FunnelRevealProofBody({ copy }: FunnelRevealProofBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      {copy.storyParagraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      <p className="quiz-step-footnote">{copy.footnote}</p>
    </div>
  );
}
