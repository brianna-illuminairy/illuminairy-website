import Link from "next/link";
import { LedgerRank } from "@/components/data-viz/ledger-rank";
import { MilestoneRibbon } from "@/components/data-viz/milestone-ribbon";
import {
  shermeenMathLedgerRows,
  shermeenMilestonePins,
  shermeenMilestoneWeeks,
  shermeenRwLedgerRows,
} from "@/lib/data-viz/adapters/shermeen-plan";
import { SHERMEEN_SKILL_POINTS_FOOTNOTE } from "@/lib/shermeen/diagnostic-skill-points";
import { approachForWeek } from "@/lib/shermeen/plan-topic-approaches";
import { PLAN_TOTALS } from "@/lib/shermeen/plan-skill-data";
import { currentPlanWeek, SHERMEEN_WEEKLY_PLAN } from "@/lib/shermeen/weekly-plan";

function weekTopicLabel(skillLabel: string) {
  return skillLabel.split("(")[0]?.trim() ?? skillLabel;
}

const week1 = SHERMEEN_WEEKLY_PLAN[0];
const week11 = SHERMEEN_WEEKLY_PLAN[10];
const week12 = SHERMEEN_WEEKLY_PLAN[SHERMEEN_WEEKLY_PLAN.length - 1];

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
            SAT score, sorted so the skills that likely cost her the most section points come first. Each
            total is the sum of modeled points from her misses in that skill (weighted by difficulty and
            module).
          </p>
          <p>
            Week 1 starts {week1?.dateLabel ?? "the week of June 29"}. We review each question she got
            wrong on the June 23 diagnostic. The first session covers math: question type, how to solve
            it, and whether the calculator can finish it once the problem is set up. The second session
            covers Reading and Writing: question type and how to answer it. She gets homework between
            the two sessions. New skill lessons start in Week 2.
          </p>
          <p>
            Weeks 2 through 10 cover one topic each week, alternating Reading and Writing with math. Each
            week has two sessions and homework on what we covered. Full-length timed practice tests are on
            weeks 5, 9, and 11 ({week11?.dateLabel ?? "early September"}). Week 12 (
            {week12?.dateLabel ?? "mid-September"}) we review every miss from the week 11 test and from
            earlier practice tests.
          </p>
        </div>
      </header>

      <section className="skye-plan__section">
        <h2>High Impact Reading &amp; Writing Skills</h2>
        <LedgerRank
          rows={shermeenRwLedgerRows()}
          footerLeft="Section subtotal"
          footerTotal={PLAN_TOTALS.rwSection}
          ariaLabel="Reading and writing skills ranked by points on the diagnostic"
          interactive={false}
        />
        <p className="diag-report__tnote">{SHERMEEN_SKILL_POINTS_FOOTNOTE}</p>
      </section>

      <section className="skye-plan__section">
        <h2>High Impact Math Skills</h2>
        <LedgerRank
          rows={shermeenMathLedgerRows()}
          footerLeft="Section subtotal"
          footerTotal={PLAN_TOTALS.mathSection}
          ariaLabel="Math skills ranked by points on the diagnostic"
          interactive={false}
        />
        <p className="diag-report__tnote">{SHERMEEN_SKILL_POINTS_FOOTNOTE}</p>
      </section>

      <section className="skye-plan__section">
        <h2>Twelve-week Phase 1 schedule</h2>
        <MilestoneRibbon
          weeks={shermeenMilestoneWeeks()}
          pins={shermeenMilestonePins()}
          ariaLabel="Twelve week SAT improvement schedule"
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
