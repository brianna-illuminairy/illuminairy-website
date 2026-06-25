import { MilestoneRibbon } from "@/components/data-viz/milestone-ribbon";
import { shermeenMilestonePins, shermeenMilestoneWeeks } from "@/lib/data-viz/adapters/shermeen-plan";
import { approachForWeek } from "@/lib/shermeen/plan-topic-approaches";
import { currentPlanWeek, SHERMEEN_WEEKLY_PLAN } from "@/lib/shermeen/weekly-plan";

function weekTopicLabel(skillLabel: string) {
  return skillLabel.split("(")[0]?.trim() ?? skillLabel;
}

function weekSummary(week: (typeof SHERMEEN_WEEKLY_PLAN)[number]): string {
  if (week.reviewFocus) return week.reviewFocus;
  const bullets = approachForWeek(week);
  if (bullets?.[0]) return bullets[0];
  return week.skillLabel;
}

export function ShermeenPlanScheduleContent() {
  const activeWeek = currentPlanWeek();

  return (
    <div className="shermeen-plan-schedule">
      <section className="skye-plan__section">
        <p className="eyebrow">The Schedule</p>
        <h2 className="shermeen-plan-schedule__title">Twelve-week Phase 1 plan</h2>
        <p className="shermeen-plan-schedule__lede">
          Week 1 reviews the June 23 diagnostic. Weeks 2–10 teach one skill at a time, alternating
          Reading and Writing with math. Week 11 is a full-length timed practice test. Week 12 reviews
          misses from that test and maps next steps.
        </p>

        <MilestoneRibbon
          weeks={shermeenMilestoneWeeks()}
          pins={shermeenMilestonePins()}
          ariaLabel="Twelve week SAT improvement schedule for Shermeen"
          interactive={false}
        />

        <ol className="skye-plan__topic-list skye-plan__topic-list--schedule">
          {SHERMEEN_WEEKLY_PLAN.map((week) => (
            <li
              key={week.week}
              className={[
                activeWeek === week.week ? "is-current" : "",
                week.week >= 11 ? "shermeen-plan-schedule__week--closing" : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined}
            >
              {week.week === 11 ? (
                <p className="shermeen-plan-schedule__phase-label">
                  Weeks 11–12 · Practice test and next-step plan
                </p>
              ) : null}
              <div className="skye-plan__topic-head">
                <span className="skye-plan__topic-week">Week {week.week}</span>
                <span className="skye-plan__topic-name">
                  {week.section === "review" || week.phase === "diagnostic" || week.phase === "mixed"
                    ? week.skillLabel
                    : weekTopicLabel(week.skillLabel)}
                </span>
              </div>
              <ul className="skye-plan__topic-bullets">
                <li>{weekSummary(week)}</li>
                {week.volume ? <li>{week.volume}</li> : null}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
