import type { RevealStakesCopy } from "@/lib/sat-plan-funnel/final-reveal-copy";

type FunnelRevealStakesBodyProps = {
  copy: RevealStakesCopy;
};

export function FunnelRevealStakesBody({ copy }: FunnelRevealStakesBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      {copy.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      <div>
        {copy.ladder.map((step, index) => (
          <RevealStakesLadderStep key={step.label} index={index} step={step} />
        ))}
      </div>
      <p className="quiz-step-footnote">{copy.footnote}</p>
    </div>
  );
}

function RevealStakesLadderStep({
  index,
  step
}: {
  index: number;
  step: RevealStakesCopy["ladder"][number];
}) {
  return (
    <div>
      {index > 0 ? <p className="quiz-step-copy">↓</p> : null}
      <p className="quiz-step-copy quiz-step-copy--lead">{step.label}</p>
      {step.sublabel ? <p className="quiz-step-footnote">{step.sublabel}</p> : null}
    </div>
  );
}
