export function ShermeenAdaptiveRoutingDiagram() {
  return (
    <div
      className="diag-report__adaptive"
      role="img"
      aria-label="Module 1 scores and which Module 2 question set Shermeen received"
    >
      <div className="diag-report__adaptive-col">
        <h4>Reading & Writing · Module 1</h4>
        <p className="diag-report__adaptive-score">21 / 27</p>
        <p className="diag-report__adaptive-note">
          About 18 correct is usually enough for the harder Module 2. She got 21, so she unlocked
          the harder set. That path allows a higher section score than the easier Module 2 would. In
          Module 2 she got 13 out of 27 correct.
        </p>
      </div>
      <div className="diag-report__adaptive-mid">then Module 2</div>
      <div className="diag-report__adaptive-col">
        <h4>Math · Module 1</h4>
        <p className="diag-report__adaptive-score">16 / 22</p>
        <p className="diag-report__adaptive-note">
          About 13 to 14 correct is usually enough for the harder Module 2. She got 16, so she
          unlocked the harder set. That path allows a higher section score than the easier Module 2
          would. In Module 2 she got 14 out of 22 correct.
        </p>
      </div>
    </div>
  );
}
