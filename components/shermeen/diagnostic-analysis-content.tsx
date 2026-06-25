import {
  DIFFICULTY_READOUT,
  MATH_MISS_TABLE,
  QUESTION_MAP,
  RW_MISS_TABLE,
  SHERMEEN_HERO,
} from "@/lib/shermeen/diagnostic-report-data";
import {
  MATH_PRIORITY,
  RW_PRIORITY,
  SHERMEEN_SKILL_POINT_MODEL,
} from "@/lib/shermeen/diagnostic-skill-points";
import {
  SHERMEEN_ADAPTIVE_INTRO,
  SHERMEEN_ADAPTIVE_MATH,
  SHERMEEN_ADAPTIVE_RW,
  SHERMEEN_MATH_FORMULAS,
  SHERMEEN_MATH_FORMULAS_HEAD,
  SHERMEEN_MATH_FORMULAS_INTRO,
  SHERMEEN_MATH_GAP1_AFTER,
  SHERMEEN_MATH_GAP1_INTRO,
  SHERMEEN_MATH_GAP2,
  SHERMEEN_MATH_GAP2_RESOLVE,
  SHERMEEN_MATH_INTRO,
  SHERMEEN_MATH_PLAN_NOTE,
  SHERMEEN_MATH_Q9_CONTEXT,
  SHERMEEN_MATH_REMAINING,
  SHERMEEN_OVERVIEW_INTRO,
  SHERMEEN_OVERVIEW_INTRO_FOOTNOTE,
  SHERMEEN_RW_INTRO_LEAD,
  SHERMEEN_RW_M1_MISSES,
  SHERMEEN_RW_M1_MISSES_HEAD,
  SHERMEEN_RW_M2_MISSES,
  SHERMEEN_RW_M2_MISSES_HEAD,
  SHERMEEN_RW_PLAN_NOTE,
  SHERMEEN_RW_SKILLS,
  SHERMEEN_RW_SKILLS_RANK_HEAD,
  SHERMEEN_SKIP_TIME,
  SHERMEEN_TIMING_INTRO,
  SHERMEEN_TIMING_MATH,
  SHERMEEN_TIMING_RW,
  type RwSkillBodyBlock,
  type RwSkillListItem,
} from "@/lib/shermeen/diagnostic-analysis-copy";
import {
  DiagnosticHero,
  DifficultyReadout,
  QuestionPerformanceMap,
  MissTable,
  PriorityList,
  SectionHead,
} from "@/components/diagnostic/report-visuals";
import {
  WorkedExampleM2Q20,
  WorkedExampleM2Q9,
  WorkedExampleQ9,
} from "@/components/shermeen/diagnostic-visuals-extras";
import { ShermeenAdaptiveRoutingDiagram } from "@/components/shermeen/adaptive-routing-diagram";
import Link from "next/link";

function ProseParagraphs({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line) => (
        <p key={line.slice(0, 48)}>{line}</p>
      ))}
    </>
  );
}

function RwSkillListItemView({ item }: { item: RwSkillListItem }) {
  if (typeof item === "string") {
    return <li>{item}</li>;
  }
  return (
    <li>
      <strong>{item.label}:</strong> {item.text}
    </li>
  );
}

function RwSkillBody({ blocks }: { blocks: RwSkillBodyBlock[] }) {
  return (
    <>
      {blocks.map((block, idx) => {
        if (block.kind === "p") {
          return <p key={`p-${idx}`}>{block.text}</p>;
        }

        const ListTag = block.kind === "ol" ? "ol" : "ul";
        const listClass =
          block.kind === "ol" ? "diag-report__skill-ol" : "diag-report__skill-ul";

        return (
          <div key={`list-${idx}`} className="diag-report__skill-body-list">
            {block.intro ? <p>{block.intro}</p> : null}
            <ListTag className={listClass}>
              {block.items.map((item, itemIdx) => (
                <RwSkillListItemView
                  key={typeof item === "string" ? `${idx}-${itemIdx}` : item.label}
                  item={item}
                />
              ))}
            </ListTag>
          </div>
        );
      })}
    </>
  );
}

export function ShermeenDiagnosticAnalysisContent() {
  return (
    <article className="diag-report">
      <div className="diag-report__aurora" aria-hidden="true" />

      <div className="diag-report__wrap">
        <header className="diag-report__mast">
          <div className="diag-report__brand">
            <span className="diag-report__star">✦</span>
            <span className="diag-report__brand-name">Illuminairy</span>
          </div>
          <div className="diag-report__meta">
            <div>
              Test · <b>Full Length Diagnostic Test</b>
            </div>
            <div>
              Date · <b>June 23, 2026</b>
            </div>
          </div>
        </header>

        <DiagnosticHero {...SHERMEEN_HERO} />

        <section className="diag-report__section diag-report__prose" id="shermeen-overall">
          <SectionHead num="01" title="Performance Overview" />
          <ProseParagraphs lines={SHERMEEN_OVERVIEW_INTRO} />
          <p className="diag-report__tnote">{SHERMEEN_OVERVIEW_INTRO_FOOTNOTE}</p>
          <QuestionPerformanceMap sections={QUESTION_MAP} totalCorrect={64} totalQuestions={98} />
          <DifficultyReadout rows={DIFFICULTY_READOUT} />
        </section>

        <section className="diag-report__section diag-report__prose" id="shermeen-adaptive">
          <SectionHead num="02" title="Module 1 and Module 2" />
          <ProseParagraphs lines={SHERMEEN_ADAPTIVE_INTRO} />
          <ShermeenAdaptiveRoutingDiagram />
          <ProseParagraphs lines={SHERMEEN_ADAPTIVE_RW} />
          <ProseParagraphs lines={SHERMEEN_ADAPTIVE_MATH} />
        </section>

        <section className="diag-report__section diag-report__prose" id="shermeen-rw">
          <SectionHead num="03" title="Reading and Writing Analysis" />
          <p>{SHERMEEN_RW_INTRO_LEAD}</p>

          <MissTable rows={RW_MISS_TABLE} />
          <p className="diag-report__tnote">
            Question-level table · 20 Reading and Writing wrong answers across both modules.
          </p>

          <h3 className="diag-report__gap-title">{SHERMEEN_RW_M1_MISSES_HEAD}</h3>
          <p className="diag-report__lede">
            These seven Module 1 wrong answers are mostly easy or medium questions. Six of them are
            easy. Missing easy questions in Module 1 still costs points on the section, even when
            Module 2 uses the harder question set.
          </p>
          <ul className="diag-report__miss-bullets">
            {SHERMEEN_RW_M1_MISSES.map((miss) => (
              <li key={miss.q}>
                <strong>{miss.q}:</strong> {miss.text}
              </li>
            ))}
          </ul>

          <h3 className="diag-report__gap-title">{SHERMEEN_RW_M2_MISSES_HEAD}</h3>
          <p className="diag-report__lede">
            She got 21 of 27 right in Module 1, so Module 2 used harder questions. She got 13 of 27
            correct in Module 2. Most misses are medium or hard, but the same root issue repeats:
            answer the question type asked, not the theme that sounds closest.
          </p>
          <ul className="diag-report__miss-bullets">
            {SHERMEEN_RW_M2_MISSES.map((miss) => (
              <li key={miss.q}>
                <strong>{miss.q}:</strong> {miss.text}
              </li>
            ))}
          </ul>

          <h3 className="diag-report__gap-title">{SHERMEEN_RW_SKILLS_RANK_HEAD}</h3>

          {SHERMEEN_RW_SKILLS.map((skill) => (
            <div key={skill.rank} className="diag-report__skill-block" id={`shermeen-rw-skill-${skill.rank}`}>
              <h4 className="diag-report__skill-title">
                {skill.rank}. {skill.title}
              </h4>
              <p>{skill.lead}</p>
              <ul className="diag-report__miss-bullets">
                {skill.misses.map((miss) => (
                  <li key={miss.q}>
                    <strong>{miss.q}:</strong> {miss.text}
                  </li>
                ))}
              </ul>
              <RwSkillBody blocks={skill.body} />
            </div>
          ))}

          <p style={{ marginTop: 24 }}>
            Based on how often each question type appears on the SAT and what she missed on this test, I
            estimate she lost roughly this many points in each Reading and Writing skill:
          </p>
          <PriorityList items={RW_PRIORITY} />
          <p className="diag-report__tnote">{SHERMEEN_SKILL_POINT_MODEL.footnote}</p>
          <p>{SHERMEEN_RW_PLAN_NOTE}</p>
        </section>

        <section className="diag-report__section diag-report__prose" id="shermeen-math">
          <SectionHead num="04" title="Math Performance" />
          <ProseParagraphs lines={SHERMEEN_MATH_INTRO} />

          <MissTable rows={MATH_MISS_TABLE} />
          <p className="diag-report__tnote">
            Correct answer vs. answer marked · 14 Math wrong answers across both modules.
          </p>

          <h3 className="diag-report__gap-title">Gap 1: Factoring and the factor theorem</h3>
          <p>{SHERMEEN_MATH_GAP1_INTRO}</p>
          <WorkedExampleM2Q9 />
          <WorkedExampleM2Q20 />
          <p>{SHERMEEN_MATH_GAP1_AFTER}</p>
          <p>{SHERMEEN_MATH_Q9_CONTEXT}</p>
          <WorkedExampleQ9 />

          <h3 className="diag-report__gap-title">Gap 2: Circles, arc length, and tangency</h3>
          <p>{SHERMEEN_MATH_GAP2}</p>
          <p>{SHERMEEN_MATH_GAP2_RESOLVE}</p>

          <h3 className="diag-report__gap-title">Other misses worth noting</h3>
          <div className="diag-report__misslines">
            {SHERMEEN_MATH_REMAINING.map((row) => (
              <div key={row.q} className="diag-report__missline">
                <span className="diag-report__missline-star">✦</span>
                <div>
                  <span className="diag-report__missline-q">{row.q}</span>, {row.text}
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 24 }}>
            Based on how often each question type appears on the SAT and what she missed on this test, I
            estimate she lost roughly this many points in each Math skill:
          </p>
          <PriorityList items={MATH_PRIORITY} />
          <p className="diag-report__tnote">{SHERMEEN_SKILL_POINT_MODEL.footnote}</p>
          <p>{SHERMEEN_MATH_PLAN_NOTE}</p>
          <p>
            In the SAT Improvement Plan we would tutor her until she&apos;s reached the required level of
            accuracy, attacking one skill at a time, starting with the one costing the most points.
          </p>

          <h3 className="diag-report__gap-title">{SHERMEEN_MATH_FORMULAS_HEAD}</h3>
          <p>{SHERMEEN_MATH_FORMULAS_INTRO}</p>
          <ul className="diag-report__skill-ul">
            {SHERMEEN_MATH_FORMULAS.map((item) => (
              <RwSkillListItemView
                key={typeof item === "string" ? item.slice(0, 32) : item.label}
                item={item}
              />
            ))}
          </ul>
        </section>

        <section className="diag-report__section diag-report__prose" id="shermeen-timing">
          <SectionHead num="05" title="Timing by Question" />
          <ProseParagraphs lines={SHERMEEN_TIMING_INTRO} />
          <ProseParagraphs lines={SHERMEEN_TIMING_RW} />
          <ProseParagraphs lines={SHERMEEN_TIMING_MATH} />
        </section>

        <section className="diag-report__section diag-report__prose" id="shermeen-focus">
          <SectionHead num="06" title="Sections she does not need to practice first" />
          <p>
            <strong>Reading:</strong> {SHERMEEN_SKIP_TIME.reading}
          </p>
          <p>
            <strong>Math:</strong> {SHERMEEN_SKIP_TIME.math}
          </p>
        </section>

        <section className="diag-report__section diag-report__appendix" id="shermeen-appendix">
          <SectionHead num="—" title="Raw Reports" />
          <p className="diag-report__lede">PDF exports from the June 23 diagnostic session.</p>
          <div className="diag-report__doc-links">
            <Link href="/shermeen/diagnostic/full">Full report →</Link>
            <Link href="/shermeen/diagnostic/tabular">Tabular report →</Link>
          </div>
        </section>

        <footer className="diag-report__foot">
          <span>
            <span className="diag-report__star">✦</span> Illuminairy · SAT Diagnostic Analysis
          </span>
          <span>Shermeen Sohail · June 23, 2026</span>
        </footer>
      </div>
    </article>
  );
}
