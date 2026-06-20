import {
  DIFFICULTY_READOUT,
  MATH_MISS_TABLE,
  QUESTION_MAP,
  RW_MISS_TABLE,
  SKYE_HERO,
} from "@/lib/skye/diagnostic-report-data";
import {
  MATH_WALKTHROUGH_ROWS,
  SKYE_ADAPTIVE_INTRO,
  SKYE_ADAPTIVE_MATH,
  SKYE_ADAPTIVE_RW,
  SKYE_MATH_AFTER_TABLE,
  SKYE_MATH_FORMULAS,
  SKYE_MATH_FORMULAS_HEAD,
  SKYE_MATH_FORMULAS_INTRO,
  SKYE_MATH_INTRO,
  SKYE_MATH_QUESTION_TYPES,
  SKYE_MATH_SKILLS_HEAD,
  SKYE_MATH_SKILLS_INTRO,
  SKYE_OVERVIEW_INTRO,
  SKYE_OVERVIEW_INTRO_FOOTNOTE,
  SKYE_RW_INTRO_LEAD,
  SKYE_RW_SKILLS,
  SKYE_RW_SKILLS_RANK_HEAD,
  SKYE_SKIP_TIME,
  type RwSkillBodyBlock,
  type RwSkillListItem,
} from "@/lib/skye/diagnostic-analysis-copy";
import {
  DiagnosticHero,
  DifficultyReadout,
  QuestionPerformanceMap,
  MissTable,
  SectionHead,
} from "@/components/diagnostic/report-visuals";
import { SkyeAdaptiveRoutingDiagram } from "@/components/skye/adaptive-routing-diagram";
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

function MathWalkthroughTable() {
  return (
    <div className="diag-report__tablewrap diag-report__tablewrap--wide">
      <table className="diag-report__table diag-report__table--walkthrough">
        <thead>
          <tr>
            <th>Question</th>
            <th>How to solve it</th>
            <th>Desmos once set up?</th>
            <th>Memorized formula needed?</th>
            <th>Which formula?</th>
            <th>Marked answer vs correct</th>
          </tr>
        </thead>
        <tbody>
          {MATH_WALKTHROUGH_ROWS.map((row) => (
            <tr key={row.question}>
              <td className="diag-report__tq">{row.question}</td>
              <td>{row.how}</td>
              <td>{row.desmos}</td>
              <td>{row.formulaNeeded}</td>
              <td>{row.formulaName || "—"}</td>
              <td>{row.marked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkyeDiagnosticAnalysisContent() {
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
              Date · <b>June 18, 2026</b>
            </div>
          </div>
        </header>

        <DiagnosticHero {...SKYE_HERO} />

        <section className="diag-report__section diag-report__prose" id="skye-overall">
          <SectionHead num="01" title="Performance Overview" />
          <ProseParagraphs lines={SKYE_OVERVIEW_INTRO} />
          <p className="diag-report__tnote">{SKYE_OVERVIEW_INTRO_FOOTNOTE}</p>
          <QuestionPerformanceMap sections={QUESTION_MAP} totalCorrect={63} totalQuestions={98} />
          <DifficultyReadout rows={DIFFICULTY_READOUT} />
        </section>

        <section className="diag-report__section diag-report__prose" id="skye-adaptive">
          <SectionHead num="02" title="Adaptive Results" />
          <ProseParagraphs lines={SKYE_ADAPTIVE_INTRO} />
          <SkyeAdaptiveRoutingDiagram />
          <p>{SKYE_ADAPTIVE_RW}</p>
          <p>{SKYE_ADAPTIVE_MATH}</p>
        </section>

        <section className="diag-report__section diag-report__prose" id="skye-rw">
          <SectionHead num="03" title="Reading and Writing Analysis" />
          <p>{SKYE_RW_INTRO_LEAD}</p>

          <MissTable rows={RW_MISS_TABLE} />
          <p className="diag-report__tnote">
            Question-level miss table · 19 Reading and Writing misses across both modules.
          </p>

          <h3 className="diag-report__gap-title">{SKYE_RW_SKILLS_RANK_HEAD}</h3>

          {SKYE_RW_SKILLS.map((skill) => (
            <div key={skill.rank} className="diag-report__skill-block" id={`skye-rw-skill-${skill.rank}`}>
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
        </section>

        <section className="diag-report__section diag-report__prose" id="skye-math">
          <SectionHead num="04" title="Math Performance" />
          <ProseParagraphs lines={SKYE_MATH_INTRO} />

          <p>
            The table below walks through each missed math question: how to solve it, whether
            Desmos can finish it after the problem is set up, whether a memorized formula is
            required (yes or no, and which one if yes), and how the marked answer compares to the
            correct approach. Full formulas are listed in the section below the table.
          </p>
          <MathWalkthroughTable />

          <ProseParagraphs lines={SKYE_MATH_AFTER_TABLE} />

          <h3 className="diag-report__gap-title">{SKYE_MATH_SKILLS_HEAD}</h3>
          <ProseParagraphs lines={SKYE_MATH_SKILLS_INTRO} />
          <p>{SKYE_MATH_QUESTION_TYPES}</p>

          <h3 className="diag-report__gap-title">{SKYE_MATH_FORMULAS_HEAD}</h3>
          <p>{SKYE_MATH_FORMULAS_INTRO}</p>
          <ul className="diag-report__skill-ul">
            {SKYE_MATH_FORMULAS.map((item) => (
              <RwSkillListItemView
                key={typeof item === "string" ? item.slice(0, 32) : item.label}
                item={item}
              />
            ))}
          </ul>

          <MissTable rows={MATH_MISS_TABLE} />
          <p className="diag-report__tnote">
            Tabular reference · 15 math misses across both modules (same rows as mentor table above).
          </p>
        </section>

        <section className="diag-report__section diag-report__prose" id="skye-focus">
          <SectionHead num="05" title="Sections she does not need to practice" />
          <p>
            <strong>Reading:</strong> {SKYE_SKIP_TIME.reading}
          </p>
          <p>
            <strong>Math:</strong> {SKYE_SKIP_TIME.math}
          </p>
          <p className="diag-report__plan-link">
            For skill priority, points by skill, and the week-by-week schedule, see the{" "}
            <Link href="/skye/plan">Improvement Plan</Link> tab.
          </p>
        </section>

        <section className="diag-report__section diag-report__appendix" id="skye-appendix">
          <SectionHead num="—" title="Raw Reports" />
          <p className="diag-report__lede">PDF exports from the June 18 diagnostic session.</p>
          <div className="diag-report__doc-links">
            <Link href="/skye/diagnostic/full">Full report →</Link>
            <Link href="/skye/diagnostic/tabular">Tabular report →</Link>
          </div>
        </section>

        <footer className="diag-report__foot">
          <span>
            <span className="diag-report__star">✦</span> Illuminairy · SAT Diagnostic Analysis
          </span>
          <span>Skye · June 18, 2026</span>
        </footer>
      </div>
    </article>
  );
}
