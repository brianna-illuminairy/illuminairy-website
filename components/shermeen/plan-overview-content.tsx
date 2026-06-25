import { ShermeenPlanScoreChart } from "@/components/shermeen/plan-score-chart";
import { MATH_SKILLS, PLAN_TOTALS, RW_SKILLS, type PlanSkill } from "@/lib/shermeen/plan-skill-data";
import { SHERMEEN_HERO } from "@/lib/shermeen/diagnostic-report-data";
import {
  SHERMEEN_PHASE1_TARGET_LOW,
  SHERMEEN_PHASE1_TARGET_HIGH,
  SHERMEEN_PLAN_CHECKPOINT_COPY,
  SHERMEEN_PLAN_PACE_PILLS,
  SHERMEEN_PLAN_REALISTIC_COPY,
} from "@/lib/shermeen/plan-projection";
import { currentPlanWeek, SHERMEEN_PHASE_1_WEEKS } from "@/lib/shermeen/weekly-plan";

function skillRow(skill: PlanSkill, rank: number) {
  return (
    <div className="srow" key={skill.id}>
      <div className="chip">{String(rank).padStart(2, "0")}</div>
      <div className="sname">
        {skill.topic}
        <small>
          {skill.misses.total} missed · {skill.misses.m1} in Module 1
        </small>
      </div>
      <div className="pts">+{skill.points}</div>
    </div>
  );
}

function skillSection(title: string, skills: PlanSkill[], subtotal: number) {
  return (
    <>
      <div className="skills-title">{title}</div>
      {skills.map((skill, index) => skillRow(skill, index + 1))}
      <div className="total">
        <span>Section subtotal</span>
        <b>+{subtotal}</b>
      </div>
    </>
  );
}

export function ShermeenPlanOverviewContent() {
  const activeWeek = currentPlanWeek() ?? 1;
  const totalMisses = RW_SKILLS.reduce((sum, skill) => sum + skill.misses.total, 0)
    + MATH_SKILLS.reduce((sum, skill) => sum + skill.misses.total, 0);
  const phaseTargetLabel = `${SHERMEEN_PHASE1_TARGET_LOW}–${SHERMEEN_PHASE1_TARGET_HIGH}`;

  return (
    <section>
      <div className="card">
        <div className="head">
          <div>
            <div className="eyebrow">SAT Improvement Plan</div>
            <div className="name">Shermeen</div>
          </div>
          <div className="right">
            12-week Phase 1 · Week {activeWeek} of {SHERMEEN_PHASE_1_WEEKS}
          </div>
        </div>

        <p className="card-intro">
          Shermeen scored {SHERMEEN_HERO.totalRange} on her June 23 diagnostic ({SHERMEEN_HERO.rwRange}{" "}
          Reading and Writing · {SHERMEEN_HERO.mathRange} Math) and missed {totalMisses} questions. Phase
          1 targets {phaseTargetLabel} by Week 12. The skills below are ranked by modeled section impact
          from those misses.
        </p>

        <ShermeenPlanScoreChart />

        <div className="stats">
          <div className="stat">
            <b>{SHERMEEN_HERO.totalRange}</b>
            <span>Diagnostic</span>
          </div>
          <div className="stat">
            <b>{phaseTargetLabel}</b>
            <span>Phase 1 target</span>
          </div>
          <div className="stat">
            <b>Jun 29 – Sep 20</b>
            <span>12 weeks</span>
          </div>
          <div className="stat">
            <b>2 / wk</b>
            <span>Sessions</span>
          </div>
        </div>

        <div className="rating-label">What&apos;s realistic for Phase 1</div>
        <div className="pills">
          {SHERMEEN_PLAN_PACE_PILLS.map((pill) => (
            <div className={`pill${pill.active ? " on" : ""}`} key={pill.label}>
              <b>{pill.label}</b>
              <span>{pill.pace}</span>
              <span className="sc">{pill.score}</span>
            </div>
          ))}
        </div>

        <div className="honest">
          <b>What is realistic:</b> {SHERMEEN_PLAN_REALISTIC_COPY}
        </div>
        <div className="honest honest--checkpoint">
          <b>First checkpoint:</b> {SHERMEEN_PLAN_CHECKPOINT_COPY}
        </div>

        {skillSection("High Impact Reading & Writing Skills", RW_SKILLS, PLAN_TOTALS.rwSection)}
        {skillSection("High Impact Math Skills", MATH_SKILLS, PLAN_TOTALS.mathSection)}

        <div className="effort">
          <span>2 sessions / week</span>
          <span>60–100 questions / week</span>
          <span>Practice tests on weeks 5, 9, and 11</span>
        </div>
      </div>
    </section>
  );
}
