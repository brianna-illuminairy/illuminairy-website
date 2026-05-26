import {
  ContrastBarChart,
  GOOD_BAR_COLOR,
  LOW_BAR_COLOR
} from "@/components/sat-plan/contrast-bar-chart";
import type {
  Ch3MethodCopy,
  Ch3PathCopy,
  Ch3PreviewCopy,
  Ch3SocialCopy
} from "@/lib/sat-plan-funnel/ch3-interstitial-copy";

export function Ch3SocialBody({ copy }: { copy: Ch3SocialCopy }) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      {copy.paragraphs.map((paragraph) => (
        <p key={paragraph} className="quiz-step-copy">
          {paragraph}
        </p>
      ))}
      <p className="quiz-step-footnote">{copy.credential}</p>
    </div>
  );
}

export function Ch3MethodBody({ copy }: { copy: Ch3MethodCopy }) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      {copy.bullets.map((bullet) => (
        <div key={bullet.title}>
          <p className="quiz-step-copy quiz-step-copy--lead">{bullet.title}</p>
          <p className="quiz-step-copy">{bullet.body}</p>
        </div>
      ))}
    </div>
  );
}

export function Ch3PreviewBody({ copy }: { copy: Ch3PreviewCopy }) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      {copy.phases.map((phase) => (
        <div key={phase.title}>
          <p className="quiz-step-copy quiz-step-copy--lead">{phase.title}</p>
          <p className="quiz-step-copy">{phase.body}</p>
        </div>
      ))}
    </div>
  );
}

export function Ch3PathBody({ copy }: { copy: Ch3PathCopy }) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      <p className="quiz-step-copy">{copy.runwayLine}</p>
      <ContrastBarChart
        title="Milestones"
        ariaLabel={`Current about ${copy.chart.current}, goal about ${copy.chart.target}`}
        className="int8-prep-chart int6-plan-path-chart"
        bars={[
          {
            points: copy.chart.current,
            label: copy.chart.currentLabel,
            fill: LOW_BAR_COLOR,
            valueColor: LOW_BAR_COLOR
          },
          {
            points: copy.chart.target,
            label: copy.chart.targetLabel,
            fill: GOOD_BAR_COLOR,
            valueColor: GOOD_BAR_COLOR,
            accentLabel: true,
            delayMs: 220
          }
        ]}
      />
      <p className="quiz-step-copy">{copy.tutoringLine}</p>
      <p className="quiz-step-footnote">
        Diagnostic → practice tests → test day. No price on this screen — details on your free
        review call.
      </p>
    </div>
  );
}
