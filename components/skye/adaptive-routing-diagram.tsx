export function SkyeAdaptiveRoutingDiagram() {
  return (
    <div className="diag-report__adaptive" role="img" aria-label="Module 1 scores vs adaptive cutoffs">
      <div className="diag-report__adaptive-col">
        <h4>Reading & Writing · Module 1</h4>
        <p className="diag-report__adaptive-score">14 / 27</p>
        <p className="diag-report__adaptive-note">
          Cutoff for hard Module 2 is about 18 correct. She missed by about 4 questions, so Module 2
          had more easy and medium questions.
        </p>
      </div>
      <div className="diag-report__adaptive-mid">routes Module 2</div>
      <div className="diag-report__adaptive-col">
        <h4>Math · Module 1</h4>
        <p className="diag-report__adaptive-score">11 / 22</p>
        <p className="diag-report__adaptive-note">
          Cutoff is about 13–14 correct. She missed by 2–3 questions and saw only one hard question in
          Math Module 2.
        </p>
      </div>
    </div>
  );
}
