type FunnelPlanReadyBodyProps = {
  bodyCopy: string;
};

export function FunnelPlanReadyBody({ bodyCopy }: FunnelPlanReadyBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      <p className="quiz-step-copy">{bodyCopy}</p>
      <p className="quiz-step-footnote">No artificial wait — tap continue when you are ready.</p>
    </div>
  );
}
