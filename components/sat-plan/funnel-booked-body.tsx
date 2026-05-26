type FunnelBookedBodyProps = {
  bodyCopy: string;
};

export function FunnelBookedBody({ bodyCopy }: FunnelBookedBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      <p className="quiz-step-copy">{bodyCopy}</p>
      <p className="quiz-step-footnote">
        Did not book yet? Use Back to pick a time, or email support@illuminairy.com.
      </p>
    </div>
  );
}
