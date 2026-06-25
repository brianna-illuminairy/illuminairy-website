import Link from "next/link";
import { LedgerRank } from "@/components/data-viz/ledger-rank";
import { MilestoneRibbon } from "@/components/data-viz/milestone-ribbon";
import {
  shermeenMathLedgerRows,
  shermeenMilestonePins,
  shermeenMilestoneWeeks,
  shermeenRwLedgerRows,
} from "@/lib/data-viz/adapters/shermeen-plan";
import { MODELED_SKILL_POINTS_FOOTNOTE } from "@/lib/diagnostic/skill-point-model";
import { approachForWeek } from "@/lib/shermeen/plan-topic-approaches";
import { PLAN_TOTALS } from "@/lib/shermeen/plan-skill-data";
import { currentPlanWeek, SHERMEEN_WEEKLY_PLAN } from "@/lib/shermeen/weekly-plan";

function weekTopicLabel(skillLabel: string) {
  return skillLabel.split("(")[0]?.trim() ?? skillLabel;
}

export function ShermeenPlanSkillContent() {
  const activeWeek = currentPlanWeek();

  return (
    <div className="skye-plan">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Improvement Plan</p>
        <h1 className="aurora-portal__title">Shermeen&apos;s SAT plan</h1>
        <div className="skye-plan__intro">
          <p>
            Shermeen scored {PLAN_TOTALS.baselineScore} on her June 23 diagnostic and missed{" "}
            {PLAN_TOTALS.missCount} questions. The skills below are what she needs to learn to improve her
            SAT score, sorted so the highest-impact skills are taught first. Point totals are modeled
            recoverable points from her miss pattern, not a score guarantee.
          </p>
          <p>
            In Week 1, we review each question she got wrong on the June 23 diagnostic. The first session
            covers math: question type, how to solve it, and whether the calculator can finish it once the
            problem is set up. The second session covers Reading and Writing: question type and how to answer
            it. She gets homework between the two sessions. New skill lessons start in Week 2.
          </p>
          <p>
            Starting Week 2 on June 30, we cover one topic each week, alternating Reading and Writing with
            math. Each week has two sessions and homework on what we covered. Full practice tests are on weeks
            5 and 9. Week 11 is the Phase 1 mock review milestone (Sep 1 through Sep 7).
          </p>
        </div>
      </header>

      <section className="skye-plan__section">
        <h2>Highest Priority Reading &amp; Writing Skills +{PLAN_TOTALS.rwSection} pts</h2>
        <LedgerRank
          rows={shermeenRwLedgerRows()}
          footerLeft="Section subtotal"
          footerTotal={PLAN_TOTALS.rwSection}
          ariaLabel="Reading and writing skills ranked by points on the diagnostic"
          interactive={false}
        />
        <p className="diag-report__tnote">{MODELED_SKILL_POINTS_FOOTNOTE}</p>
      </section>

      <section className="skye-plan__section">
        <h2>Highest Priority Math Skills +{PLAN_TOTALS.mathSection} pts</h2>
        <LedgerRank
          rows={shermeenMathLedgerRows()}
          footerLeft="Section subtotal"
          footerTotal={PLAN_TOTALS.mathSection}
          ariaLabel="Math skills ranked by points on the diagnostic"
          interactive={false}
        />
        <p className="diag-report__tnote">{MODELED_SKILL_POINTS_FOOTNOTE}</p>
      </section>

      <section className="skye-plan__section">
        <h2>Eleven-week Phase 1 schedule</h2>
        <MilestoneRibbon
          weeks={shermeenMilestoneWeeks()}
          pins={shermeenMilestonePins()}
          ariaLabel="Eleven week SAT improvement schedule"
          interactive={false}
        />
        <ol className="skye-plan__topic-list skye-plan__topic-list--schedule">
          {SHERMEEN_WEEKLY_PLAN.map((week) => {
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
              </li>
            );
          })}
        </ol>
      </section>

      <p className="skye-plan__foot-link">
        For question-level misses and teaching notes, see the{" "}
        <Link href="/shermeen/diagnostic">diagnostic analysis</Link> page.
      </p>
    </div>
  );
}
