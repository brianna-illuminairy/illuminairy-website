import Image from "next/image";
import {
  SOHA_CIRCLE_FORM,
  SOHA_DISCRIMINANT,
  SOHA_FACTORING_PATTERNS,
  SOHA_FORMULAS_INTRO,
  SOHA_MATH_750_LIST,
  SOHA_MATH_Q13_WORKED,
  SOHA_MATH_Q9_WORKED_PANELS,
  SOHA_MEMORIZE_TABLE,
  SOHA_PATTERN_RULES,
  SOHA_QUADRATIC_FORMULA,
  SOHA_SIGN_TRICK,
  SOHA_VERTEX_FORM,
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

export function SohaMathFormulaReference() {
  return (
    <div className="diag-report__formula-ref">
      <p style={{ marginTop: 24 }}>
        For off-formula-sheet math she needs to memorize, such as the following:
      </p>
      <p>{SOHA_FORMULAS_INTRO}</p>
      <p>The two most important forms are:</p>

      <h3 className="diag-report__gap-title">1. Quadratic Vertex Form</h3>
      <div className="diag-report__mathline">{SOHA_VERTEX_FORM.equation}</div>
      <p>You should immediately know:</p>
      <ul className="diag-report__skill-ul">
        {SOHA_VERTEX_FORM.bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p>Example:</p>
      <div className="diag-report__mathline">{SOHA_VERTEX_FORM.example}</div>
      <ul className="diag-report__skill-ul">
        {SOHA_VERTEX_FORM.exampleBullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p>{SOHA_VERTEX_FORM.foot}</p>

      <h3 className="diag-report__gap-title">2. Circle Form</h3>
      <div className="diag-report__mathline">{SOHA_CIRCLE_FORM.equation}</div>
      <p>You should immediately know:</p>
      <ul className="diag-report__skill-ul">
        {SOHA_CIRCLE_FORM.bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p>Example:</p>
      <div className="diag-report__mathline">{SOHA_CIRCLE_FORM.example}</div>
      <ul className="diag-report__skill-ul">
        {SOHA_CIRCLE_FORM.exampleBullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p>{SOHA_CIRCLE_FORM.foot}</p>

      <h3 className="diag-report__gap-title">Sign Trick (Very Important)</h3>
      <p>{SOHA_SIGN_TRICK.intro}</p>
      {SOHA_SIGN_TRICK.examples.map((ex) => (
        <div key={ex.given} className="diag-report__mathline">
          {ex.given} → {ex.result}
        </div>
      ))}
      <p>{SOHA_SIGN_TRICK.rule}</p>
      <div className="diag-report__tablewrap">
        <table className="diag-report__table">
          <thead>
            <tr>
              <th>Equation</th>
              <th>h</th>
              <th>k</th>
            </tr>
          </thead>
          <tbody>
            {SOHA_SIGN_TRICK.table.map((row) => (
              <tr key={row.equation}>
                <td>{row.equation}</td>
                <td>{row.h}</td>
                <td>{row.k}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="diag-report__gap-title">What Should Be Memorized for SAT?</h3>
      <p>You should instantly recognize:</p>
      <div className="diag-report__tablewrap">
        <table className="diag-report__table">
          <thead>
            <tr>
              <th>Form</th>
              <th>What to Memorize</th>
            </tr>
          </thead>
          <tbody>
            {SOHA_MEMORIZE_TABLE.map((row) => (
              <tr key={row.form}>
                <td>{row.form}</td>
                <td>{row.memorize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        If you&apos;re studying SAT Math, I&apos;d focus less on memorizing the letters h and k
        themselves and more on recognizing the <strong>patterns</strong>:
      </p>
      <ul className="diag-report__skill-ul">
        {SOHA_PATTERN_RULES.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p>Those four rules cover about 95% of the SAT questions where h and k appear.</p>

      <h4 className="diag-report__skill-title">Quadratic Formula</h4>
      <div className="diag-report__mathline">{SOHA_QUADRATIC_FORMULA.formula}</div>
      <p>{SOHA_QUADRATIC_FORMULA.note}</p>

      <h4 className="diag-report__skill-title">Discriminant</h4>
      <div className="diag-report__mathline">{SOHA_DISCRIMINANT.formula}</div>
      <p>Know what it tells you:</p>
      <ul className="diag-report__skill-ul">
        {SOHA_DISCRIMINANT.rules.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <h4 className="diag-report__skill-title">Special Factoring Patterns</h4>
      {SOHA_FACTORING_PATTERNS.map((row) => (
        <div key={row.label}>
          <p>
            <strong>{row.label}:</strong>
          </p>
          <div className="diag-report__mathline">{row.formula}</div>
        </div>
      ))}
      <p>These show up surprisingly often.</p>

      <h4 className="diag-report__skill-title">If Your Goal Is 750–800 Math</h4>
      <p>I would prioritize memorizing these 10 items first:</p>
      <ol className="diag-report__skill-ol">
        {SOHA_MATH_750_LIST.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  );
}
