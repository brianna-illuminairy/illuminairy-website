const TOPIC_CHIPS = [
  { label: "Algebra", rotate: -4, x: 0 },
  { label: "Reading", rotate: 3, x: 8 },
  { label: "Grammar", rotate: -2, x: 4 },
  { label: "Geometry", rotate: 5, x: 12 },
  { label: "Vocab", rotate: -3, x: 2 }
];

const CHECKLIST_ROWS = 6;

type Int8SelfStudyDashboardGraphicProps = {
  ariaLabel: string;
};

export function Int8SelfStudyDashboardGraphic({
  ariaLabel
}: Int8SelfStudyDashboardGraphicProps) {
  return (
    <div
      className="int8-self-study-graphic quiz-step-trust-graphic"
      role="img"
      aria-label={ariaLabel}
    >
      <div className="quiz-step-trust-card int8-self-study-graphic__card">
        <div className="int8-self-study-graphic__dashboard" aria-hidden>
          <div className="int8-self-study-graphic__tiles">
            <span className="int8-self-study-graphic__tile int8-self-study-graphic__tile--tests">
              Practice tests
            </span>
            <span className="int8-self-study-graphic__tile int8-self-study-graphic__tile--videos">
              Random videos
            </span>
          </div>

          <div className="int8-self-study-graphic__topics">
            {TOPIC_CHIPS.map((chip) => (
              <span
                key={chip.label}
                className="int8-self-study-graphic__topic"
                style={{
                  transform: `rotate(${chip.rotate}deg)`,
                  marginLeft: `${chip.x}px`
                }}
              >
                {chip.label}
              </span>
            ))}
          </div>

          <div className="int8-self-study-graphic__checklist">
            {Array.from({ length: CHECKLIST_ROWS }, (_, index) => (
              <div key={index} className="int8-self-study-graphic__check-row">
                <span className="int8-self-study-graphic__check-box" />
                <span
                  className="int8-self-study-graphic__check-line"
                  style={{ width: `${68 - index * 6}%` }}
                />
              </div>
            ))}
          </div>

          <div className="int8-self-study-graphic__student">
            <span className="int8-self-study-graphic__student-head" />
            <span className="int8-self-study-graphic__student-body" />
            <span className="int8-self-study-graphic__student-z">···</span>
          </div>
        </div>

        <p className="int8-self-study-graphic__overlay">
          More studying ≠ targeted improvement
        </p>

        <p className="int8-self-study-graphic__footer">
          Lots of effort. Little score movement.
        </p>
      </div>
    </div>
  );
}
