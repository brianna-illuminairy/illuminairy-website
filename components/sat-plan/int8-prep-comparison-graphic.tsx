"use client";

import {
  ContrastBarChart,
  GOOD_BAR_COLOR,
  LOW_BAR_COLOR
} from "@/components/sat-plan/contrast-bar-chart";

type Int8PrepComparisonGraphicProps = {
  selfStudyPoints: number;
  groupClassPoints: number;
  guidedPoints: number;
  chartTitle: string;
};

export function Int8PrepComparisonGraphic({
  selfStudyPoints,
  groupClassPoints,
  guidedPoints,
  chartTitle
}: Int8PrepComparisonGraphicProps) {
  return (
    <ContrastBarChart
      title={chartTitle}
      ariaLabel={`${chartTitle}: about ${selfStudyPoints} points self-study, ${groupClassPoints} points group class, ${guidedPoints} points with 1:1 tutoring`}
      bars={[
        {
          points: selfStudyPoints,
          label: "Self-study",
          fill: LOW_BAR_COLOR,
          valueColor: LOW_BAR_COLOR,
          delayMs: 80
        },
        {
          points: groupClassPoints,
          label: "Group class",
          fill: LOW_BAR_COLOR,
          valueColor: LOW_BAR_COLOR,
          delayMs: 220
        },
        {
          points: guidedPoints,
          label: "1:1 tutoring",
          fill: GOOD_BAR_COLOR,
          valueColor: GOOD_BAR_COLOR,
          accentLabel: true,
          delayMs: 360
        }
      ]}
    />
  );
}
