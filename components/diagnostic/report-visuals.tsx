import type { ReactNode } from "react";
import type { QuestionCell, SectionMap } from "@/lib/diagnostic/report-types";

function pctClass(pct: number) {
  if (pct >= 95) return "good";
  if (pct >= 80) return "warn";
  return "bad";
}

function QuestionCellView({ cell }: { cell: QuestionCell }) {
  if (!cell.miss) {
    return <div className="diag-report__qc ok">{cell.n}</div>;
  }
  return (
    <div className="diag-report__qc miss">
      {cell.n}
      <span className="diag-report__qc-dt">{cell.miss}</span>
    </div>
  );
}

export type DiagnosticHeroProps = {
  studentName: string;
  totalRange: string;
  rwRange: string;
  mathRange: string;
  note: string;
};

export function DiagnosticHero({
  studentName,
  totalRange,
  rwRange,
  mathRange,
  note,
}: DiagnosticHeroProps) {
  return (
    <div className="diag-report__hero">
      <div className="diag-report__hero-main">
        <p className="diag-report__eyebrow">SAT Diagnostic Analysis</p>
        <h1 className="diag-report__student">{studentName}</h1>
        <div className="diag-report__scoreblock">
          <div className="diag-report__bignum">
            <span className="diag-report__bignum-lab">Total</span>
            {totalRange}
          </div>
        </div>
      </div>
      <div className="diag-report__subscores">
        <div>
          <span className="diag-report__ss-lab">Reading and Writing</span>
          <span className="diag-report__ss-rng">{rwRange}</span>
        </div>
        <div>
          <span className="diag-report__ss-lab">Math</span>
          <span className="diag-report__ss-rng">{mathRange}</span>
        </div>
      </div>
      <div className="diag-report__hero-note">
        <div className="diag-report__hero-rule" />
        <p>{note}</p>
      </div>
    </div>
  );
}

export type DifficultyRow = {
  label: string;
  easy: number;
  medium: number;
  hard: number;
};

export function QuestionPerformanceMap({
  sections,
  totalCorrect,
  totalQuestions,
}: {
  sections: SectionMap[];
  totalCorrect: number;
  totalQuestions: number;
}) {
  const totalMissed = totalQuestions - totalCorrect;

  return (
    <div className="diag-report__card">
      <div className="diag-report__qmap-head">
        <p className="diag-report__card-lab">Question Performance Map</p>
        <div className="diag-report__qmap-legend">
          <span>
            <i className="lg-ok" /> Correct
          </span>
          <span>
            <i className="lg-miss" /> Missed
          </span>
          <span>
            <b>
              {totalCorrect} / {totalQuestions}
            </b>{" "}
            correct · {totalMissed} missed
          </span>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title}>
          <p className="diag-report__qsec">{section.title}</p>
          {section.modules.map((mod) => (
            <div key={mod.label} className="diag-report__qmod">
              <p className="diag-report__qmod-lab">{mod.label}</p>
              <div className="diag-report__qrow">
                {mod.cells.map((cell) => (
                  <QuestionCellView key={cell.n} cell={cell} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <p className="diag-report__qmap-foot">
        Letters on missed cells mark difficulty · E easy, M medium, H hard.
      </p>
    </div>
  );
}

export function DifficultyReadout({ rows }: { rows: readonly DifficultyRow[] }) {
  return (
    <div className="diag-report__diffstrip">
      {rows.map((row) => (
        <div key={row.label} className="diag-report__dr">
          <p className="diag-report__dr-h">{row.label}</p>
          <div className="diag-report__dr-cells">
            {(
              [
                ["Easy", row.easy],
                ["Medium", row.medium],
                ["Hard", row.hard],
              ] as const
            ).map(([label, pct]) => (
              <div key={label} className="diag-report__dr-d">
                <div className={`diag-report__dr-pct ${pctClass(pct)}`}>{pct}%</div>
                <div className="diag-report__dr-t">{label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export type MissRow = {
  mod: string;
  q: string;
  topic: string;
  diff: "easy" | "med" | "hard";
  correct: string;
  marked: string;
};

export function MissTable({ rows }: { rows: MissRow[] }) {
  return (
    <div className="diag-report__tablewrap">
      <table className="diag-report__table">
        <thead>
          <tr>
            <th>Module</th>
            <th>Q</th>
            <th>Topic</th>
            <th>Difficulty</th>
            <th>Correct</th>
            <th>Marked</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.mod}-${row.q}`}>
              <td>{row.mod}</td>
              <td className="diag-report__tq">{row.q}</td>
              <td>{row.topic}</td>
              <td>
                <span className={`diag-report__pill ${row.diff}`}>
                  {row.diff === "med" ? "Medium" : row.diff === "easy" ? "Easy" : "Hard"}
                </span>
              </td>
              <td className="diag-report__ans">
                <span className="cor">{row.correct}</span>
              </td>
              <td className="diag-report__ans">
                <span className="wr">{row.marked}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PatternCard({
  index,
  title,
  body,
  fix,
}: {
  index: number;
  title: string;
  body: string;
  fix: string;
}) {
  return (
    <div className="diag-report__pcard">
      <span className="diag-report__pcard-n">{String(index).padStart(2, "0")}</span>
      <h4>{title}</h4>
      <p>{body}</p>
      <div className="diag-report__fix">
        <span className="diag-report__fix-lab">How to fix</span>
        {fix}
      </div>
    </div>
  );
}

export function PriorityList({ items }: { items: { topic: string; pts: string }[] }) {
  return (
    <div className="diag-report__prio">
      {items.map((item, i) => (
        <div key={item.topic} className="diag-report__prio-row">
          <span className="diag-report__prio-rank">{String(i + 1).padStart(2, "0")}</span>
          <span className="diag-report__prio-topic">{item.topic}</span>
          <span className="diag-report__prio-pts">{item.pts}</span>
        </div>
      ))}
    </div>
  );
}

export function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <>
      <div className="diag-report__sec-head">
        <span className="diag-report__sec-num">{num}</span>
        <h2>{title}</h2>
      </div>
      <div className="diag-report__sec-rule" />
    </>
  );
}

export function Callout({ tag, children }: { tag: string; children: ReactNode }) {
  return (
    <div className="diag-report__callout">
      <p className="diag-report__callout-tag">{tag}</p>
      <div className="diag-report__callout-body">{children}</div>
    </div>
  );
}

export function TeachingStepsList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="diag-report__steps">
      {steps.map((step, i) => (
        <li key={step.title} className="diag-report__step">
          <span className="diag-report__step-n">{i + 1}</span>
          <div>
            <strong>{step.title}</strong>
            <p>{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FormulaGrid({ items }: { items: { label: string; formula: string }[] }) {
  return (
    <div className="diag-report__formula-grid">
      {items.map((item) => (
        <div key={item.label} className="diag-report__formula-card">
          <p className="diag-report__formula-label">{item.label}</p>
          <p className="diag-report__formula-expr">{item.formula}</p>
        </div>
      ))}
    </div>
  );
}
