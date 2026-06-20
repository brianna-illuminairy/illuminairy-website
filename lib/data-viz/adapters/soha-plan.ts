import type { MilestonePin, MilestoneWeek } from "@/components/data-viz/milestone-ribbon";
import { SOHA_WEEKLY_PLAN } from "@/lib/soha/weekly-plan";

export function sohaMilestoneWeeks(): MilestoneWeek[] {
  return SOHA_WEEKLY_PLAN.map((w) => ({
    week: w.week,
    skill:
      w.section === "review"
        ? w.skillLabel.split(" and ")[0]?.trim() ?? w.skillLabel
        : w.skillLabel.split(",")[0]?.trim() ?? w.skillLabel,
    points: w.points ?? null,
    highlight: w.section === "rw",
  }));
}

export function sohaMilestonePins(): MilestonePin[] {
  const pins: MilestonePin[] = SOHA_WEEKLY_PLAN.filter((w) => w.hasPracticeTest).map((w) => ({
    week: w.week,
    label: "Practice test",
  }));
  pins.push({ week: 9, label: "Aug 22", test: true });
  return pins;
}
