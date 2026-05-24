import {
  ContrastBarChart,
  GOOD_BAR_COLOR,
  LOW_BAR_COLOR
} from "@/components/sat-plan/contrast-bar-chart";
import { satPrepComparison, satRetakeResearch } from "@/lib/site";

export function Int3RetakeContrastGraphic() {
  const retakePoints = satRetakeResearch.avgPointsWithoutNewApproach;
  const guidedPoints = satPrepComparison.guidedAvgPoints;

  return (
    <ContrastBarChart
      title={satRetakeResearch.chartTitle}
      className="int8-prep-chart int3-retake-chart"
      ariaLabel={`${satRetakeResearch.chartTitle}: about ${retakePoints} points when retaking with the same prep, ${guidedPoints} points with guided one-on-one tutoring`}
      bars={[
        {
          points: retakePoints,
          label: satRetakeResearch.samePrepRetakeLabel,
          fill: LOW_BAR_COLOR,
          valueColor: LOW_BAR_COLOR,
          delayMs: 80
        },
        {
          points: guidedPoints,
          label: satPrepComparison.guidedLabel,
          fill: GOOD_BAR_COLOR,
          valueColor: GOOD_BAR_COLOR,
          accentLabel: true,
          delayMs: 260
        }
      ]}
    />
  );
}
