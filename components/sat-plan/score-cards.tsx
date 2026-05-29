export function ScoreCards({
  gpa = "3.9",
  beforeScore = 1180,
  afterScore = 1400
}: {
  gpa?: string;
  beforeScore?: number;
  afterScore?: number;
}) {
  const delta = afterScore - beforeScore;
  const tomato = "#f24822";
  const green = "#2f8b55";

  function card(variant: "before" | "after") {
    const isBefore = variant === "before";
    const accent = isBefore ? tomato : green;
    const score = isBefore ? beforeScore : afterScore;
    const status = isBefore ? "OUT OF RANGE" : "COMPETITIVE";

    return (
      <div className="sc-card">
        <div className="sc-head">APPLICATION</div>
        <div className="sc-body">
          <div className="sc-row">
            <div className="sc-label">GPA</div>
            <div className="sc-gpa">{gpa}</div>
          </div>
          <div className="sc-row">
            <div className="sc-label">SAT</div>
            <div className="sc-sat" style={{ color: accent }}>
              {score}
            </div>
          </div>
        </div>
        <div className="sc-status" style={{ color: accent }}>
          <span className="sc-status-square" style={{ background: accent }} />
          <span>{status}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sc-wrap">
      <div className="sc-cards">
        {card("before")}
        {card("after")}
      </div>
      <p className="sc-caption">
        +{delta} PTS
      </p>
    </div>
  );
}
