import { v4TrustStats } from "./v4-content";

/** Static 3-stat trust band before the footer. */
export function V4TrustBar() {
  return (
    <section className="lp-trust" aria-label="Trust">
      <div className="lp-container">
        <div className="lp-trust-grid">
          {v4TrustStats.map((stat) => (
            <div className="lp-trust-cell" key={stat.label}>
              <span className={stat.em ? "lp-trust-num em" : "lp-trust-num"}>
                {stat.value}
                {"star" in stat && stat.star ? <span className="star">★</span> : null}
                {stat.unit ? <span className="unit">{stat.unit}</span> : null}
              </span>
              <span className="lp-trust-lbl">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
