import type { RevealBottlenecksCopy } from "@/lib/sat-plan-funnel/final-reveal-copy";

type FunnelRevealBottlenecksBodyProps = {
  copy: RevealBottlenecksCopy;
};

export function FunnelRevealBottlenecksBody({ copy }: FunnelRevealBottlenecksBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      <ul className="promises">
        {copy.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <p className="quiz-step-copy">{copy.closingLine}</p>
    </div>
  );
}
