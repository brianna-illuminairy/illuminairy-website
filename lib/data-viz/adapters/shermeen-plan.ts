import type { LedgerRow } from "@/components/data-viz/ledger-rank";
import type { MilestonePin, MilestoneWeek } from "@/components/data-viz/milestone-ribbon";
import { MATH_SKILLS, RW_SKILLS, type PlanSkill } from "@/lib/shermeen/plan-skill-data";
import { SHERMEEN_WEEKLY_PLAN } from "@/lib/shermeen/weekly-plan";

function skillToLedgerRow(skill: PlanSkill, rank: number): LedgerRow {
  return {
    rank,
    name: skill.topic,
    note: `${skill.misses.total} missed · ${skill.misses.m1} in Module 1`,
    points: skill.points,
  };
}

export function shermeenRwLedgerRows(): LedgerRow[] {
  return RW_SKILLS.map((s, i) => skillToLedgerRow(s, i + 1));
}

export function shermeenMathLedgerRows(): LedgerRow[] {
  return MATH_SKILLS.map((s, i) => skillToLedgerRow(s, i + 1));
}

export function shermeenMilestoneWeeks(): MilestoneWeek[] {
  return SHERMEEN_WEEKLY_PLAN.map((w) => ({
    week: w.week,
    skill: ribbonSkillLabel(w),
    points: w.points ?? null,
    highlight: w.section === "rw",
  }));
}

function ribbonSkillLabel(week: (typeof SHERMEEN_WEEKLY_PLAN)[number]): string {
  if (week.phase === "diagnostic") return "Diagnostic review";
  if (week.phase === "mixed") return "Full-length practice test";
  if (week.phase === "review") return "Plan next steps";
  return week.skillLabel.split("(")[0]?.trim() ?? week.skillLabel;
}

export function shermeenMilestonePins(): MilestonePin[] {
  return SHERMEEN_WEEKLY_PLAN.filter((w) => w.hasPracticeTest).map((w) => ({
    week: w.week,
    label: "Practice test",
  }));
}
