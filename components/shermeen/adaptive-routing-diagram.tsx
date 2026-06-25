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
          About 18 correct is usually enough for a harder Module 2. She reached that bar. In Module
          2 she got 13 / 27 correct.
        </p>
      </div>
      <div className="diag-report__adaptive-mid">then Module 2</div>
      <div className="diag-report__adaptive-col">
        <h4>Math · Module 1</h4>
        <p className="diag-report__adaptive-score">16 / 22</p>
        <p className="diag-report__adaptive-note">
          About 13–14 correct is usually enough for a harder Module 2. She reached that bar. In
          Module 2 she got 14 / 22 correct.
        </p>
      </div>
    </div>
  );
}
