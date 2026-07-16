import Link from "next/link";
import { LedgerRank } from "@/components/data-viz/ledger-rank";
import { MilestoneRibbon } from "@/components/data-viz/milestone-ribbon";
import {
  skyeMathLedgerRows,
  skyeMilestonePins,
  skyeMilestoneWeeks,
  skyeRwLedgerRows,
} from "@/lib/data-viz/adapters/skye-plan";
import { approachForWeek } from "@/lib/skye/plan-topic-approaches";
import { PLAN_TOTALS } from "@/lib/skye/plan-skill-data";
import { currentPlanWeek, SKYE_WEEKLY_PLAN } from "@/lib/skye/weekly-plan";

function weekTopicLabel(skillLabel: string) {
  return skillLabel.split("(")[0]?.trim() ?? skillLabel;
}

export function SkyePlanSkillContent() {
  const activeWeek = currentPlanWeek();

  return (
    <div className="skye-plan">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Improvement Plan</p>
        <h1 className="aurora-portal__title">Skye&apos;s SAT plan</h1>
        <div className="skye-plan__intro">
          <p>
            Skye scored {PLAN_TOTALS.baselineScore} on her June 18 diagnostic and missed{" "}
            {PLAN_TOTALS.missCount} questions. The skills below are what she needs to learn to improve her
            SAT score, sorted so the highest-impact skills are taught first.
          </p>
          <p>
            In Week 1, we review each question she got wrong on the June 18 diagnostic. The first session
            covers math: question type, how to solve it, and whether the calculator can finish it once the
            problem is set up. The second session covers Reading and Writing: question type and how to answer
            it. She gets homework between the two sessions. New skill lessons start in Week 2.
          </p>
          <p>
            Starting Week 2 on June 30, we cover one topic each week, alternating Reading and Writing with
            math. Each week has two sessions and homework on what we covered. Full practice tests are on weeks
            5, 9, and 13. Week 15 is a review week on the skills from the plan.
          </p>
        </div>
      </header>

      <section className="skye-plan__section">
        <h2>
          Highest Priority Reading &amp; Writing Skills +{PLAN_TOTALS.rwSection} pts
        </h2>
        <LedgerRank
          rows={skyeRwLedgerRows()}
          footerLeft="Section subtotal"
          footerTotal={PLAN_TOTALS.rwSection}
          ariaLabel="Reading and writing skills ranked by points on the diagnostic"
          interactive={false}
        />
      </section>

      <section className="skye-plan__section">
        <h2>Highest Priority Math Skills +{PLAN_TOTALS.mathSection} pts</h2>
        <LedgerRank
          rows={skyeMathLedgerRows()}
          footerLeft="Section subtotal"
          footerTotal={PLAN_TOTALS.mathSection}
          ariaLabel="Math skills ranked by points on the diagnostic"
          interactive={false}
        />
      </section>

      <section className="skye-plan__section">
        <h2>Fifteen-week schedule</h2>
        <MilestoneRibbon
          weeks={skyeMilestoneWeeks()}
          pins={skyeMilestonePins()}
          ariaLabel="Fifteen week SAT improvement schedule"
          interactive={false}
        />
        <ol className="skye-plan__topic-list skye-plan__topic-list--schedule">
          {SKYE_WEEKLY_PLAN.map((week) => {
            const bullets = approachForWeek(week);
            return (
              <li
                key={week.week}
                className={activeWeek === week.week ? "is-current" : undefined}
              >
                <div className="skye-plan__topic-head">
                  <span className="skye-plan__topic-week">Week {week.week}</span>
                  <span className="skye-plan__topic-name">{weekTopicLabel(week.skillLabel)}</span>
                </div>
                {bullets ? (
                  <ul className="skye-plan__topic-bullets">
                    {bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {week.week === 1 && week.phase === "diagnostic" ? (
                  <>
                    <p className="skye-plan__topic-lesson-link">
                      <Link href="/skye/week-1/lesson-1">Session 1 · diagnostic review →</Link>
                    </p>
                    <p className="skye-plan__topic-lesson-link">
                      <Link href="/skye/week-1/lesson-2">Session 2 · equivalent expressions →</Link>
                    </p>
                    <p className="skye-plan__topic-lesson-link">
                      <Link href="/skye/week-1/report">Week 1 progress report (parents) →</Link>
                    </p>
                  </>
                ) : null}
                {week.week === 2 && week.skillId === "math-nonlinear" ? (
                  <p className="skye-plan__topic-lesson-link">
                    <Link href="/skye/week-2/lesson-1">Open Session 1 lesson →</Link>
                  </p>
                ) : null}
                {week.week === 4 ? (
                  <p className="skye-plan__topic-lesson-link">
                    <Link href="/skye/week-4/lesson-1">Session 1 · right triangles →</Link>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      <p className="skye-plan__foot-link">
        For question-level misses and teaching notes, see the{" "}
        <Link href="/skye/diagnostic">diagnostic analysis</Link> page.
      </p>
    </div>
  );
}
