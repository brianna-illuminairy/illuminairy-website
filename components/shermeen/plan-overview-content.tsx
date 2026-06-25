import { MATH_SKILLS, PLAN_TOTALS, RW_SKILLS, type PlanSkill } from "@/lib/shermeen/plan-skill-data";
import { SHERMEEN_HERO } from "@/lib/shermeen/diagnostic-report-data";
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
  const progress = Math.min(100, Math.round((activeWeek / SHERMEEN_PHASE_1_WEEKS) * 100));
  const totalMisses = RW_SKILLS.reduce((sum, skill) => sum + skill.misses.total, 0)
    + MATH_SKILLS.reduce((sum, skill) => sum + skill.misses.total, 0);

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
          Reading and Writing · {SHERMEEN_HERO.mathRange} Math) and missed {totalMisses} questions. The
          skills below are ranked by modeled section impact from those misses.
        </p>

        <div
          className="progress"
          style={{
            height: 6,
            borderRadius: 6,
            background: "rgba(47, 110, 71, 0.12)",
            marginTop: 18,
            overflow: "hidden",
          }}
          aria-hidden
        >
          <span
            style={{
              display: "block",
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7fd0a0, #2f8b55)",
              borderRadius: 6,
            }}
          />
        </div>

        <div className="stats">
          <div className="stat">
            <b>{SHERMEEN_HERO.totalRange}</b>
            <span>Diagnostic</span>
          </div>
          <div className="stat">
            <b>Jun 29 – Sep 20</b>
            <span>Phase 1</span>
          </div>
          <div className="stat">
            <b>2 / wk</b>
            <span>Sessions</span>
          </div>
          <div className="stat">
            <b>{totalMisses}</b>
            <span>Misses mapped</span>
          </div>
        </div>

        {skillSection("High Impact Reading & Writing Skills", RW_SKILLS, PLAN_TOTALS.rwSection)}
        {skillSection("High Impact Math Skills", MATH_SKILLS, PLAN_TOTALS.mathSection)}

        <div className="effort">
          <span>2 sessions / week</span>
          <span>~15 problems / week homework</span>
          <span>Practice tests on weeks 5, 9, and 11</span>
        </div>
      </div>
    </section>
  );
}
