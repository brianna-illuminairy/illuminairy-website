import { scoreReviewLpCopy } from "./score-review-content";

export function ScoreReviewTrustBar() {
  return (
    <section className="lp-trust" aria-label="Trust">
      <div className="lp-container">
        <div className="lp-trust-grid">
          {scoreReviewLpCopy.trustStats.map((stat) => (
            <div className="lp-trust-cell" key={stat.label}>
              <span className={"em" in stat && stat.em ? "lp-trust-num em" : "lp-trust-num"}>
                {stat.value}
                {"star" in stat && stat.star ? <span className="star">★</span> : null}
              </span>
              <span className="lp-trust-lbl">{stat.label}</span>
            </div>
          ))}
        </div>
        <p className="sr-lp-results-vary">{scoreReviewLpCopy.resultsVary}</p>
      </div>
    </section>
  );
}
