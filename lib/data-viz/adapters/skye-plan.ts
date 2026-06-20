import { RW_SKILLS, MATH_SKILLS, type PlanSkill } from "@/lib/skye/plan-skill-data";
import type { LedgerRow } from "@/components/data-viz/ledger-rank";
import type { MilestonePin, MilestoneWeek } from "@/components/data-viz/milestone-ribbon";
import { SKYE_WEEKLY_PLAN } from "@/lib/skye/weekly-plan";

function skillToLedgerRow(skill: PlanSkill, rank: number): LedgerRow {
  return {
    rank,
    name: skill.topic,
    note: `${skill.misses.total} missed · ${skill.misses.m1} in Module 1`,
    points: skill.points,
  };
}

export function skyeRwLedgerRows(): LedgerRow[] {
  return RW_SKILLS.map((s, i) => skillToLedgerRow(s, i + 1));
}

export function skyeMathLedgerRows(): LedgerRow[] {
  return MATH_SKILLS.map((s, i) => skillToLedgerRow(s, i + 1));
}

export function skyeMilestoneWeeks(): MilestoneWeek[] {
  return SKYE_WEEKLY_PLAN.filter((w) => w.phase === "topic").map((w) => ({
    week: w.week,
    skill: w.skillLabel.split("(")[0]?.trim() ?? w.skillLabel,
    points: w.points ?? null,
    highlight: w.section === "rw",
  }));
}

export function skyeMilestonePins(): MilestonePin[] {
  return SKYE_WEEKLY_PLAN.filter((w) => w.hasPracticeTest).map((w) => ({
    week: w.week,
    label: "Practice test",
  }));
}
