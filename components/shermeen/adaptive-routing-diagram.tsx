type AdaptiveSectionRow = {
  section: string;
  m1Score: string;
  m1Note: string;
  m2Label: string;
  m2Score: string;
  m2Note: string;
};

const SHERMEEN_ADAPTIVE_ROWS: AdaptiveSectionRow[] = [
  {
    section: "Reading & Writing",
    m1Score: "21 / 27",
    m1Note: "About 18 correct unlocks the harder Module 2. She cleared it by three questions.",
    m2Label: "Module 2 · harder set",
    m2Score: "13 / 27",
    m2Note: "Higher section score ceiling than the easier Module 2 path.",
  },
  {
    section: "Math",
    m1Score: "16 / 22",
    m1Note: "About 13 to 14 correct unlocks the harder Module 2. She cleared it.",
    m2Label: "Module 2 · harder set",
    m2Score: "14 / 22",
    m2Note: "Higher section score ceiling than the easier Module 2 path.",
  },
];

export function ShermeenAdaptiveRoutingDiagram() {
  return (
    <div
      className="diag-report__adaptive-stack"
      role="img"
      aria-label="Reading and Writing and Math Module 1 scores, harder Module 2 assignment, and Module 2 results"
    >
      {SHERMEEN_ADAPTIVE_ROWS.map((row) => (
        <div key={row.section} className="diag-report__adaptive-section">
          <h4 className="diag-report__adaptive-section-title">{row.section}</h4>
          <div className="diag-report__adaptive-flow">
            <div className="diag-report__adaptive-step">
              <span className="diag-report__adaptive-step-label">Module 1</span>
              <p className="diag-report__adaptive-score">{row.m1Score}</p>
              <p className="diag-report__adaptive-note">{row.m1Note}</p>
            </div>
            <div className="diag-report__adaptive-arrow" aria-hidden="true">
              →
            </div>
            <div className="diag-report__adaptive-step diag-report__adaptive-step--hard">
              <span className="diag-report__adaptive-step-label">{row.m2Label}</span>
              <p className="diag-report__adaptive-score">{row.m2Score}</p>
              <p className="diag-report__adaptive-note">{row.m2Note}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
