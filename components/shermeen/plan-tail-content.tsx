import Link from "next/link";
import {
  SHERMEEN_PHASE1_LEARNING_OBJECTIVES,
  SHERMEEN_PLAN_ACCURACY_FOCUS,
  SHERMEEN_PLAN_ACCURACY_ROWS,
  SHERMEEN_PLAN_ACCURACY_SECTION_NOTE,
  SHERMEEN_PLAN_ACCURACY_SKILL_NOTE,
  SHERMEEN_PLAN_PRACTICE_VOLUME_COPY,
  formatAccuracyDelta,
} from "@/lib/shermeen/plan-accuracy";

export function ShermeenPlanTailContent() {
  return (
    <section>
      <div className="eyebrow">The Plan</div>

      <p className="subh">Practice volume</p>
      <p className="note">{SHERMEEN_PLAN_PRACTICE_VOLUME_COPY}</p>

      <p className="subh">Phase 1 learning objectives</p>
      <p className="note">By the end of this 12-week phase, Shermeen should be able to do all of the following:</p>
      <ul className="checks">
        {SHERMEEN_PHASE1_LEARNING_OBJECTIVES.map((objective, index) => (
          <li key={index}>{objective}</li>
        ))}
      </ul>

      <p className="subh">Phase 1 focus: easy and medium accuracy</p>
      <p className="note">{SHERMEEN_PLAN_ACCURACY_FOCUS}</p>

      <p className="subh">Accuracy: diagnostic vs Phase 1 target</p>
      <table className="session-table">
        <thead>
          <tr>
            <th>Level</th>
            <th>Reading &amp; Writing today</th>
            <th>RW Phase 1 target</th>
            <th>Math today</th>
            <th>Math Phase 1 target</th>
          </tr>
        </thead>
        <tbody>
          {SHERMEEN_PLAN_ACCURACY_ROWS.map((row) => (
            <tr key={row.level}>
              <td>{row.level}</td>
              <td>{row.rwToday}%</td>
              <td>
                {row.rwTarget}% ({formatAccuracyDelta(row.rwToday, row.rwTarget)})
              </td>
              <td>{row.mathToday}%</td>
              <td>
                {row.mathTarget}% ({formatAccuracyDelta(row.mathToday, row.mathTarget)})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="note">{SHERMEEN_PLAN_ACCURACY_SECTION_NOTE}</p>
      <p className="note">{SHERMEEN_PLAN_ACCURACY_SKILL_NOTE}</p>

      <p className="subh">Check-ins:</p>
      <ul className="checks">
        <li>
          <b>Week 1.</b> Review every miss from the June 23 diagnostic (math session, then Reading and
          Writing).
        </li>
        <li>
          <b>Week 5.</b> Full-length timed practice test after the Week 4 skill block.
        </li>
        <li>
          <b>Week 9.</b> Second full-length timed practice test after the Week 8 skill block.
        </li>
        <li>
          <b>Week 11.</b> Third full-length timed practice test under test conditions.
        </li>
        <li>
          <b>Week 12.</b> Review every miss from the week 11 test and build her next-step SAT plan
          together.
        </li>
      </ul>

      <p className="note">
        Question-level misses and teaching notes live on the{" "}
        <Link href="/shermeen/diagnostic">diagnostic analysis</Link> page.
      </p>
    </section>
  );
}
