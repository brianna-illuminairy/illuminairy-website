import type { ReactNode } from "react";
import Link from "next/link";
import { EE_IDENTITY_FORMULAS } from "@/lib/danielle-equivalent-expressions-formula-sheet";

function Math({ children }: { children: ReactNode }) {
  return <span className="danielle-formula-sheet__math">{children}</span>;
}

function MathBlock({ children }: { children: ReactNode }) {
  return <p className="danielle-formula-sheet__math-block">{children}</p>;
}

function RuleRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="danielle-formula-sheet__rule-row">
      <span className="danielle-formula-sheet__rule-label">{label}</span>
      <span className="danielle-formula-sheet__rule-value">{value}</span>
    </div>
  );
}

export function EquivalentExpressionsFormulaSheet() {
  return (
    <div className="danielle-formula-sheet">
      <div className="danielle-formula-sheet__intro">
        <h3 className="danielle-formula-sheet__intro-title">How to use this sheet</h3>
        <p>
          On equivalent expressions questions, name the pattern first. These identities cover most
          medium and hard SAT factoring. When the expression is two binomials multiplied out, use
          FOIL and match each piece to standard form.
        </p>
      </div>

      <div className="danielle-formula-sheet__grid">
        {EE_IDENTITY_FORMULAS.map((item) => (
          <section key={item.id} className={`danielle-formula-sheet__card is-${item.id}`}>
            <h3 className="danielle-formula-sheet__card-title">{item.title}</h3>
            <MathBlock>{item.formula}</MathBlock>
            <p className="danielle-formula-sheet__example">
              Example: <Math>{item.example}</Math>
            </p>
          </section>
        ))}
      </div>

      <section className="danielle-formula-sheet__panel">
        <h3 className="danielle-formula-sheet__panel-title">Factored = expanded (two binomials)</h3>
        <p className="danielle-formula-sheet__panel-lede">
          Any product of two linear factors expands to a quadratic. Match coefficients on each
          power of <Math>x</Math>.
        </p>
        <MathBlock>
          <Math>(mx + n)(px + q) = ax² + bx + c</Math>
        </MathBlock>
        <div className="danielle-formula-sheet__rules">
          <RuleRow label="x² term" value={<Math>mp = a</Math>} />
          <RuleRow label="x term" value={<Math>mq + np = b</Math>} />
          <RuleRow label="constant" value={<Math>nq = c</Math>} />
        </div>
      </section>

      <section className="danielle-formula-sheet__panel">
        <h3 className="danielle-formula-sheet__panel-title">FOIL: match to standard form</h3>
        <MathBlock>
          <Math>(ax + b)(cx + d) = Ax² + Bx + C</Math>
        </MathBlock>
        <p className="danielle-formula-sheet__panel-lede">
          FOIL means <strong>F</strong>irst, <strong>O</strong>uter, <strong>I</strong>nner,{" "}
          <strong>L</strong>ast.
        </p>
        <MathBlock>
          <Math>(ax + b)(cx + d) = F + O + I + L</Math>
        </MathBlock>
        <div className="danielle-formula-sheet__rules">
          <RuleRow label="F" value={<Math>F = ax · cx = acx²</Math>} />
          <RuleRow label="O" value={<Math>O = ax · d = adx</Math>} />
          <RuleRow label="I" value={<Math>I = b · cx = bcx</Math>} />
          <RuleRow label="L" value={<Math>L = b · d = bd</Math>} />
        </div>
        <p className="danielle-formula-sheet__panel-lede">Match FOIL to standard form:</p>
        <MathBlock>
          <Math>Ax² + Bx + C</Math>
        </MathBlock>
        <div className="danielle-formula-sheet__rules is-highlight">
          <RuleRow label="Ax²" value={<Math>= F</Math>} />
          <RuleRow label="Bx" value={<Math>= O + I</Math>} />
          <RuleRow label="C" value={<Math>= L</Math>} />
        </div>
        <p className="danielle-formula-sheet__shortcut">
          <strong>Even simpler:</strong> first term = F · middle term = O + I · last term = L
        </p>
      </section>

      <section className="danielle-formula-sheet__panel is-example">
        <h3 className="danielle-formula-sheet__panel-title">Worked example</h3>
        <MathBlock>
          <Math>(x + 3)(x + k) = x² + 8x + 15</Math>
        </MathBlock>
        <p className="danielle-formula-sheet__panel-lede">FOIL:</p>
        <div className="danielle-formula-sheet__rules">
          <RuleRow label="F" value={<Math>F = x²</Math>} />
          <RuleRow label="O" value={<Math>O = kx</Math>} />
          <RuleRow label="I" value={<Math>I = 3x</Math>} />
          <RuleRow label="L" value={<Math>L = 3k</Math>} />
        </div>
        <p className="danielle-formula-sheet__panel-lede">Match to standard form:</p>
        <MathBlock>
          <Math>x² + 8x + 15</Math>
        </MathBlock>
        <div className="danielle-formula-sheet__steps">
          <p>
            <Math>8x = kx + 3x</Math> → <Math>8 = k + 3</Math> → <Math>k = 5</Math>
          </p>
          <p>
            <Math>15 = 3k</Math> → <Math>15 = 3(5)</Math> → <Math>k = 5</Math>
          </p>
        </div>
        <div className="danielle-formula-sheet__rules is-highlight">
          <RuleRow label="Ax²" value={<Math>= F</Math>} />
          <RuleRow label="Bx" value={<Math>= O + I</Math>} />
          <RuleRow label="C" value={<Math>= L</Math>} />
        </div>
      </section>

      <p className="danielle-formula-sheet__footer">
        <Link href="/danielle/week-3/lesson-2" className="danielle-week1__inline-link">
          Back to Lesson 2
        </Link>
        {" · "}
        <Link href="/danielle/week-3" className="danielle-week1__inline-link">
          Week 3 hub
        </Link>
      </p>
    </div>
  );
}
