import type { ReactNode } from "react";
import { SOHA_PLAN_OUTLOOK } from "@/lib/soha/plan-outlook";
import {
  DIFFICULTY_READOUT,
  QUESTION_MAP,
  type QuestionCell,
} from "@/lib/soha/diagnostic-report-data";

function pctClass(pct: number) {
  if (pct >= 95) return "good";
  if (pct >= 80) return "warn";
  return "bad";
}

function QuestionCellView({ cell }: { cell: QuestionCell }) {
  if (!cell.miss) {
    return <div className="soha-report__qc ok">{cell.n}</div>;
  }
  return (
    <div className="soha-report__qc miss">
      {cell.n}
      <span className="soha-report__qc-dt">{cell.miss}</span>
    </div>
  );
}

export function DiagnosticHero() {
  return (
    <div className="soha-report__hero">
      <div className="soha-report__hero-main">
        <p className="soha-report__eyebrow">SAT Diagnostic Analysis</p>
        <h1 className="soha-report__student">Soha Naveed</h1>
        <div className="soha-report__scoreblock">
          <div className="soha-report__bignum">
            <span className="soha-report__bignum-lab">Total</span>
            1380–1430
          </div>
        </div>
      </div>
      <div className="soha-report__subscores">
        <div>
          <span className="soha-report__ss-lab">Reading and Writing</span>
          <span className="soha-report__ss-rng">670–690</span>
        </div>
        <div>
          <span className="soha-report__ss-lab">Math</span>
          <span className="soha-report__ss-rng">710–740</span>
        </div>
      </div>
      <div className="soha-report__hero-note">
        <div className="soha-report__hero-rule" />
        <p>
          Soha is performing in the upper 1300s to the lower 1400s; we estimate her current
          performance is between 1380 and 1430. Her math is stronger than her reading and writing;
          she scored 710-740 on math and 670-690 on reading and writing.
        </p>
      </div>
    </div>
  );
}

export function QuestionPerformanceMap() {
  const totalCorrect = 85;
  const totalMissed = 13;

  return (
    <div className="soha-report__card">
      <div className="soha-report__qmap-head">
        <p className="soha-report__card-lab">Question Performance Map</p>
        <div className="soha-report__qmap-legend">
          <span>
            <i className="lg-ok" /> Correct
          </span>
          <span>
            <i className="lg-miss" /> Missed
          </span>
          <span>
            <b>
              {totalCorrect} / 98
            </b>{" "}
            correct · {totalMissed} missed
          </span>
        </div>
      </div>

      {QUESTION_MAP.map((section) => (
        <div key={section.title}>
          <p className="soha-report__qsec">{section.title}</p>
          {section.modules.map((mod) => (
            <div key={mod.label} className="soha-report__qmod">
              <p className="soha-report__qmod-lab">{mod.label}</p>
              <div className="soha-report__qrow">
                {mod.cells.map((cell) => (
                  <QuestionCellView key={cell.n} cell={cell} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <p className="soha-report__qmap-foot">
        Letters on missed cells mark difficulty · E easy, M medium, H hard.
      </p>
    </div>
  );
}

export function DifficultyReadout() {
  return (
    <div className="soha-report__diffstrip">
      {DIFFICULTY_READOUT.map((row) => (
        <div key={row.label} className="soha-report__dr">
          <p className="soha-report__dr-h">{row.label}</p>
          <div className="soha-report__dr-cells">
            {(
              [
                ["Easy", row.easy],
                ["Medium", row.medium],
                ["Hard", row.hard],
              ] as const
            ).map(([label, pct]) => (
              <div key={label} className="soha-report__dr-d">
                <div className={`soha-report__dr-pct ${pctClass(pct)}`}>{pct}%</div>
                <div className="soha-report__dr-t">{label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type MissRow = {
  mod: string;
  q: string;
  topic: string;
  diff: "easy" | "med" | "hard";
  correct: string;
  marked: string;
};

export function MissTable({ rows }: { rows: MissRow[] }) {
  return (
    <div className="soha-report__tablewrap">
      <table className="soha-report__table">
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
              <td className="soha-report__tq">{row.q}</td>
              <td>{row.topic}</td>
              <td>
                <span className={`soha-report__pill ${row.diff}`}>{row.diff === "med" ? "Medium" : row.diff === "easy" ? "Easy" : "Hard"}</span>
              </td>
              <td className="soha-report__ans">
                <span className="cor">{row.correct}</span>
              </td>
              <td className="soha-report__ans">
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
    <div className="soha-report__pcard">
      <span className="soha-report__pcard-n">{String(index).padStart(2, "0")}</span>
      <h4>{title}</h4>
      <p>{body}</p>
      <div className="soha-report__fix">
        <span className="soha-report__fix-lab">How to fix</span>
        {fix}
      </div>
    </div>
  );
}

export function PriorityList({ items }: { items: { topic: string; pts: string }[] }) {
  return (
    <div className="soha-report__prio">
      {items.map((item, i) => (
        <div key={item.topic} className="soha-report__prio-row">
          <span className="soha-report__prio-rank">{String(i + 1).padStart(2, "0")}</span>
          <span className="soha-report__prio-topic">{item.topic}</span>
          <span className="soha-report__prio-pts">{item.pts}</span>
        </div>
      ))}
    </div>
  );
}

export function WorkedExample() {
  return (
    <div className="soha-report__worked">
      <div className="soha-report__worked-head">
        <span>Example · Module 2, Q13</span>
        <span className="soha-report__worked-badge">Hard · Equivalent expressions</span>
      </div>
      <div className="soha-report__worked-body">
        <p>
          The question gives 9x³ - 6x² - 24x and says 3x + k is a factor, then asks for k. The path
          is to factor:
        </p>
        <div className="soha-report__mathline">
          9x³ - 6x² - 24x = 3x(3x² - 2x - 8) = 3x(x - 2)(3x + 4), so 3x + k matches 3x + 4 and{" "}
          <span className="k">k = 4</span>
        </div>
        <p>
          Instead of factoring, she tried to graph her way to the answer and entered 13.15, which was
          a point where two curves crossed on the graphing calculator. There is no graphing path to k
          here. The question is built to reward factoring, and the calculator pulled her away from it.
        </p>
        <div className="soha-report__answers">
          <div className="soha-report__ans-block right">
            <small>Correct</small>
            <b>4</b>
          </div>
          <div className="soha-report__ans-block wrong">
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
    <div className="soha-report__ka">
      <div className="soha-report__ka-col keep">
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
      <div className="soha-report__ka-col adj">
        <h4>Two habits to adjust</h4>
        <ul>
          <li>
            <span className="m">✦</span>
            <span>How she reviews — one careful pass instead of re-reading every question twice</span>
          </li>
          <li>
            <span className="m">✦</span>
            <span>Defaulting to the calculator on algebra problems that need factoring by hand</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function ScoreProjection() {
  const o = SOHA_PLAN_OUTLOOK;

  return (
    <div className="soha-report__proj">
      <div className="soha-report__milestones">
        <div className="soha-report__mstone now">
          <span className="soha-report__mstone-t">Now</span>
          <span className="soha-report__mstone-v">{o.startScore}</span>
        </div>
        <span className="soha-report__marrow">›</span>
        <div className="soha-report__mstone">
          <span className="soha-report__mstone-t">This plan · {o.testDate}</span>
          <span className="soha-report__mstone-v">{o.planGoal}</span>
        </div>
        <span className="soha-report__marrow">›</span>
        <div className="soha-report__mstone stretch">
          <span className="soha-report__mstone-t">Stretch</span>
          <span className="soha-report__mstone-v">{o.stretchGoal}</span>
        </div>
      </div>
      <div className="soha-report__planrow">
        <div className="soha-report__plan-card">
          <div className="soha-report__plan-n">{o.tutoringPerWeek}</div>
          <div>Tutoring sessions per week.</div>
        </div>
        <div className="soha-report__plan-card">
          <div className="soha-report__plan-n">{o.questionsPerWeek}</div>
          <div>Questions per week on average across the nine-week plan.</div>
        </div>
        <div className="soha-report__plan-card">
          <div className="soha-report__plan-n">{o.totalQuestions}</div>
          <div>Total questions by {o.testDate} toward the {o.planGoal} goal.</div>
        </div>
      </div>
    </div>
  );
}

export function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <>
      <div className="soha-report__sec-head">
        <span className="soha-report__sec-num">{num}</span>
        <h2>{title}</h2>
      </div>
      <div className="soha-report__sec-rule" />
    </>
  );
}

export function Callout({ tag, children }: { tag: string; children: ReactNode }) {
  return (
    <div className="soha-report__callout">
      <p className="soha-report__callout-tag">{tag}</p>
      <div className="soha-report__callout-body">{children}</div>
    </div>
  );
}
