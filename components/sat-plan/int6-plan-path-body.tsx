import {
  ContrastBarChart,
  GOOD_BAR_COLOR,
  LOW_BAR_COLOR
} from "@/components/sat-plan/contrast-bar-chart";
import type { Int6PlanPathCopy } from "@/lib/sat-plan-funnel/int6-plan-path-copy";

type Int6PlanPathBodyProps = {
  copy: Int6PlanPathCopy;
};

export function Int6PlanPathBody({ copy }: Int6PlanPathBodyProps) {
  return (
    <div className="quiz-step-int3-content quiz-step-trust-content">
      <p className="quiz-step-copy quiz-step-copy--lead">{copy.gapLine}</p>
      <p className="quiz-step-copy quiz-step-copy--lead">{copy.proofLine}</p>
      <ContrastBarChart
        title="Score path"
        ariaLabel={`Current score about ${copy.chart.current}, goal about ${copy.chart.target}, ${copy.chart.gapPts} point gap`}
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
      <p className="quiz-step-copy">{copy.supportingLine}</p>
      <p className="quiz-step-footnote">{copy.footnote}</p>
    </div>
  );
}
