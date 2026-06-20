import { MilestoneRibbon } from "@/components/data-viz/milestone-ribbon";
import { sohaMilestonePins, sohaMilestoneWeeks } from "@/lib/data-viz/adapters/soha-plan";
import {
  SOHA_ERROR_LOG_COLUMNS,
  SOHA_ERROR_LOG_INTRO,
  SOHA_ERROR_LOG_OFFER,
  SOHA_ERROR_LOG_STEPS,
  SOHA_MISTAKE_DRIVEN_INTRO,
} from "@/lib/soha/plan-copy";
import { currentSohaPlanWeek, SOHA_WEEKLY_PLAN } from "@/lib/soha/weekly-plan";
import { TeachingStepsList } from "@/components/diagnostic/report-visuals";

function weekTopicLabel(skillLabel: string) {
  return skillLabel.split(",")[0]?.trim() ?? skillLabel;
}

export function SohaPlanScheduleContent() {
  const activeWeek = currentSohaPlanWeek();

  return (
    <div className="soha-plan-schedule">
      <section className="skye-plan__section">
        <p className="aurora-eyebrow">The Schedule</p>
        <h2 className="soha-plan-schedule__title">Nine-week SAT improvement plan</h2>
        <p className="soha-plan-schedule__lede">
          Weeks 1–7 cover ranked skills from the diagnostic. Weeks 8–9 shift to mistake-driven
          practice, full test review, and test-day prep.
        </p>

        <MilestoneRibbon
          weeks={sohaMilestoneWeeks()}
          pins={sohaMilestonePins()}
          ariaLabel="Nine week SAT improvement schedule for Soha"
          interactive={false}
        />

        <ol className="skye-plan__topic-list skye-plan__topic-list--schedule">
          {SOHA_WEEKLY_PLAN.map((week) => (
            <li
              key={week.week}
              className={[
                activeWeek === week.week ? "is-current" : "",
                week.week >= 8 ? "soha-plan-schedule__week--mistake-driven" : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined}
            >
              {week.week === 8 ? (
                <p className="soha-plan-schedule__phase-label">Weeks 8–9 · Mistake-driven practice</p>
              ) : null}
              <div className="skye-plan__topic-head">
                <span className="skye-plan__topic-week">Week {week.week}</span>
                <span className="skye-plan__topic-name">
                  {week.section === "review" ? week.skillLabel : weekTopicLabel(week.skillLabel)}
                </span>
              </div>
              <ul className="skye-plan__topic-bullets">
                <li>{week.summary}</li>
                <li>{week.volume}</li>
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="skye-plan__section soha-plan-schedule__section">
        <h2>Mistake-driven review</h2>
        {SOHA_MISTAKE_DRIVEN_INTRO.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </section>

      <section className="skye-plan__section soha-plan-schedule__section">
        <h2>Error log approach (1500+ target)</h2>
        {SOHA_ERROR_LOG_INTRO.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}

        <h3 className="soha-plan-schedule__subhead">How an error log works</h3>
        <TeachingStepsList steps={SOHA_ERROR_LOG_STEPS} />

        <h3 className="soha-plan-schedule__subhead">Core columns to include</h3>
        <p>
          Whether you use a physical notebook, a Google Sheet, or a specialized practice app, your log
          should capture these data points:
        </p>
        <ul className="soha-plan-schedule__columns">
          {SOHA_ERROR_LOG_COLUMNS.map((row) => (
            <li key={row.column}>
              <strong>{row.column}:</strong> {row.detail}
            </li>
          ))}
        </ul>
        <p>{SOHA_ERROR_LOG_OFFER}</p>
      </section>
    </div>
  );
}
