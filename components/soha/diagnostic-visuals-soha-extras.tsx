export function WorkedExample() {
  return (
    <div className="diag-report__worked">
      <div className="diag-report__worked-head">
        <span>Example · Module 2, Q13</span>
        <span className="diag-report__worked-badge">Hard · Equivalent expressions</span>
      </div>
      <div className="diag-report__worked-body">
        <p>
          The question gives 9x³ - 6x² - 24x and says 3x + k is a factor, then asks for k. The path
          is to factor:
        </p>
        <div className="diag-report__mathline">
          9x³ - 6x² - 24x = 3x(3x² - 2x - 8) = 3x(x - 2)(3x + 4), so 3x + k matches 3x + 4 and{" "}
          <span className="k">k = 4</span>
        </div>
        <p>
          Instead of factoring, she tried to graph her way to the answer and entered 13.15, which was
          a point where two curves crossed on the graphing calculator. There is no graphing path to k
          here. The question is built to reward factoring, and the calculator pulled her away from it.
        </p>
        <div className="diag-report__answers">
          <div className="diag-report__ans-block right">
            <small>Correct</small>
            <b>4</b>
          </div>
          <div className="diag-report__ans-block wrong">
            <small>Marked</small>
            <b>13.15</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HabitsGrid() {
  return (
    <div className="diag-report__ka">
      <div className="diag-report__ka-col keep">
        <h4>Strong habits worth keeping</h4>
        <ul>
          <li>
            <span className="m">✦</span>
            <span>Fast, efficient pace</span>
          </li>
          <li>
            <span className="m">✦</span>
            <span>Used the mark for review tool well</span>
          </li>
          <li>
            <span className="m">✦</span>
            <span>Comfortable with Desmos and the calculator</span>
          </li>
          <li>
            <span className="m">✦</span>
            <span>Used the built-in formula sheet</span>
          </li>
          <li>
            <span className="m">✦</span>
            <span>Used scratch paper when she needed it</span>
          </li>
        </ul>
      </div>
      <div className="diag-report__ka-col adj">
        <h4>Two habits to adjust</h4>
        <ul>
          <li>
            <span className="m">✦</span>
            <span>How she reviews — one careful pass instead of re-reading every question twice</span>
          </li>
          <li>
            <span className="m">✦</span>
            <span>
              Plugging into the calculator before identifying whether the question can be solved with
              it
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
