import Image from "next/image";
import {
  SOHA_MATH_Q13_WORKED,
  SOHA_MATH_Q9_WORKED_PANELS,
} from "@/lib/soha/diagnostic-analysis-copy";

export function WorkedExampleQ13() {
  const ex = SOHA_MATH_Q13_WORKED;
  return (
    <div className="diag-report__worked">
      <div className="diag-report__worked-head">
        <span>Example · Module 2, Q13</span>
        <span className="diag-report__worked-badge">Hard · Equivalent expressions</span>
      </div>
      <div className="diag-report__worked-body">
        <p>{ex.setup}</p>
        <div className="diag-report__mathline">{ex.factorLine}</div>
        <p>{ex.after}</p>
        <div className="diag-report__answers">
          <div className="diag-report__ans-block right">
            <small>Correct</small>
            <b>{ex.correct}</b>
          </div>
          <div className="diag-report__ans-block wrong">
            <small>Marked</small>
            <b>{ex.marked}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated use WorkedExampleQ13 */
export function WorkedExample() {
  return <WorkedExampleQ13 />;
}

export function WorkedExampleQ9() {
  return (
    <div className="diag-report__worked">
      <div className="diag-report__worked-head">
        <span>Worked example · Module 1, Q9</span>
        <span className="diag-report__worked-badge">Medium · Nonlinear equations</span>
      </div>
      <div className="diag-report__worked-body">
        <div className="diag-report__worked-gallery">
          {SOHA_MATH_Q9_WORKED_PANELS.map((panel) => (
            <figure key={panel.src} className="diag-report__worked-figure">
              <Image
                src={panel.src}
                alt={panel.alt}
                width={panel.width}
                height={panel.height}
                className="diag-report__worked-img"
              />
            </figure>
          ))}
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
