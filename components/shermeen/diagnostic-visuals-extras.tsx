import Image from "next/image";
import { SOHA_MATH_Q9_WORKED_PANELS } from "@/lib/soha/diagnostic-analysis-copy";
import {
  SHERMEEN_MATH_M2Q20_WORKED,
  SHERMEEN_MATH_M2Q9_WORKED,
} from "@/lib/shermeen/diagnostic-analysis-copy";

function WorkedExampleCard({
  label,
  badge,
  setup,
  mathLine,
  after,
  correct,
  marked,
}: {
  label: string;
  badge: string;
  setup: string;
  mathLine: string;
  after: string;
  correct: string;
  marked: string;
}) {
  return (
    <div className="diag-report__worked">
      <div className="diag-report__worked-head">
        <span>{label}</span>
        <span className="diag-report__worked-badge">{badge}</span>
      </div>
      <div className="diag-report__worked-body">
        <p>{setup}</p>
        <div className="diag-report__mathline">{mathLine}</div>
        <p>{after}</p>
        <div className="diag-report__answers">
          <div className="diag-report__ans-block right">
            <small>Correct</small>
            <b>{correct}</b>
          </div>
          <div className="diag-report__ans-block wrong">
            <small>Marked</small>
            <b>{marked}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkedExampleM2Q9() {
  const ex = SHERMEEN_MATH_M2Q9_WORKED;
  return (
    <WorkedExampleCard
      label="Example · Module 2, Q9"
      badge="Medium · Equivalent expressions"
      setup={ex.setup}
      mathLine={ex.factorLine}
      after={ex.after}
      correct={ex.correct}
      marked={ex.marked}
    />
  );
}

export function WorkedExampleM2Q20() {
  const ex = SHERMEEN_MATH_M2Q20_WORKED;
  return (
    <WorkedExampleCard
      label="Example · Module 2, Q20"
      badge="Hard · Nonlinear functions"
      setup={ex.setup}
      mathLine={ex.factorLine}
      after={ex.after}
      correct={ex.correct}
      marked={ex.marked}
    />
  );
}

/** Same M1 Q9 scratch-paper walkthrough used for Soha; Shermeen missed the same problem. */
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
