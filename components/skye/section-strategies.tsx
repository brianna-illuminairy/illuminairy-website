"use client";

import { useState } from "react";

type StrategyTip = {
  id: string;
  name: string;
  when: string;
  how: string;
  example?: string;
};

const RW_STRATEGIES: StrategyTip[] = [
  {
    id: "read-question-first",
    name: "Read the question first",
    when: "Longer passages or when you feel lost reading.",
    how: "Skim what they are asking, then read the passage hunting for that answer. Saves re-reading the whole thing three times."
  },
  {
    id: "swap-vocab",
    name: "Swap the word in",
    when: "Words in Context questions.",
    how: "Replace the vocab word with each answer choice and read the sentence. The right one should sound natural and keep the meaning."
  },
  {
    id: "skip-return",
    name: "Skip and come back",
    when: "A passage or question is taking too long.",
    how: "Mark for Review once you hit your first-pass cap (about 1 minute on R&W, 1½ minutes on Math), pick a guess if you have one, click the next question number, and return on the review screen."
  },
  {
    id: "eliminate-two",
    name: "Cross off two wrong answers",
    when: "Every multiple-choice question.",
    how: "On scratch paper, mark choices you know are wrong. Pick from what is left instead of debating all four forever."
  },
  {
    id: "evidence-hunt",
    name: "Find the proof line",
    when: "Command of Evidence questions.",
    how: "Your answer must be backed by a specific sentence in the passage. If you cannot point to the line, reconsider."
  },
  {
    id: "sound-test",
    name: "Read it aloud in your head",
    when: "Grammar and punctuation (Standard English Conventions).",
    how: "Slow down and say the sentence quietly to yourself. If it sounds broken, it probably needs a fix."
  },
  {
    id: "transition-logic",
    name: "Check the logic between sentences",
    when: "Transitions questions.",
    how: "Ask: is the next sentence agreeing, adding an example, or contrasting? However = contrast. Therefore = result. For example = illustration."
  }
];

const MATH_STRATEGIES: StrategyTip[] = [
  {
    id: "skip-return",
    name: "Skip and come back",
    when: "A problem is eating your time.",
    how: "Mark for Review once you hit about 1½ minutes, guess if needed, jump to an easier question, and fix flagged ones on the end-of-module review screen."
  },
  {
    id: "plug-choices",
    name: "Plug in the answer choices",
    when: "Multiple choice with one variable, or \"which value works\" questions.",
    how: "Start with choice B or C and substitute into the equation. If it works, you are done. If too big or small, try the direction that makes sense.",
    example: "3x + 7 = 22 → try x = 5 from the choices → 3(5) + 7 = 22 ✓"
  },
  {
    id: "plug-own-numbers",
    name: "Pick your own numbers",
    when: "Questions with variables but no single equation to solve, or \"must be true\" problems.",
    how: "Choose easy numbers for the variables (avoid 0 and 1). Test each answer choice with your numbers.",
    example: "If x > 0, which expression is always even? Try x = 2, then x = 4."
  },
  {
    id: "graph-desmos",
    name: "Graph it in Desmos",
    when: "Systems of equations, intersections, quadratics, or anything with two variables.",
    how: "Type each equation on a new line. Click where graphs cross for the answer. Zoom if you need to.",
    example: "y = 2x + 1 and y = -x + 5 → click the intersection point"
  },
  {
    id: "reference-sheet",
    name: "Open the Reference sheet",
    when: "Area, volume, circle, or special right-triangle problems.",
    how: "Click Reference in the toolbar. Match the shape in the question to the formula on the sheet. Plug the numbers they give you into that formula."
  },
  {
    id: "scratch-steps",
    name: "Write every step on scratch paper",
    when: "Algebra, fractions, or multi-step word problems.",
    how: "Do not do it all in your head. One line per step makes careless errors easier to catch."
  },
  {
    id: "sketch-geometry",
    name: "Draw a quick diagram",
    when: "Triangles, circles, angles, or word problems with shapes.",
    how: "Label what you know. A 10-second sketch beats staring at words on screen."
  },
  {
    id: "translate-words",
    name: "Turn words into math",
    when: "Word problems.",
    how: "Underline numbers and key phrases. \"Is\" or \"equals\" often means =. \"Of\" often means multiply. \"Per\" often means divide.",
    example: "\"25% off $80\" → 0.25 × 80 = discount, then subtract from 80"
  }
];

function StrategyList({ tips }: { tips: StrategyTip[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set([tips[0]?.id]));

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="skye-strategy-list">
      {tips.map((tip) => {
        const expanded = open.has(tip.id);
        return (
          <div key={tip.id} className={`skye-strategy-card${expanded ? " is-open" : ""}`}>
            <button
              type="button"
              className="skye-strategy-card__head"
              onClick={() => toggle(tip.id)}
              aria-expanded={expanded}
            >
              <span className="skye-strategy-card__name">{tip.name}</span>
              <span className="skye-strategy-card__toggle">{expanded ? "−" : "+"}</span>
            </button>
            {expanded ? (
              <div className="skye-strategy-card__body">
                <p>
                  <strong>When:</strong> {tip.when}
                </p>
                <p>
                  <strong>How:</strong> {tip.how}
                </p>
                {tip.example ? (
                  <p className="skye-strategy-card__example">
                    <strong>Example:</strong> {tip.example}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function ReadingWritingStrategiesSlide() {
  return (
    <>
      <p>
        These seven habits cover most Reading &amp; Writing questions. Tap each to expand.
      </p>
      <StrategyList tips={RW_STRATEGIES} />
      <p className="skye-scoring__rule">
        <strong>Default move when stuck:</strong> eliminate two choices, pick your best guess, Mark for
        Review, and skip ahead. No extra penalty for trying.
      </p>
    </>
  );
}

export function MathStrategiesSlide() {
  return (
    <>
      <p>
        On Math, you always have scratch paper, Desmos, the Reference sheet, and multiple choice. These
        eight moves are the ones tutors use most. Tap each to expand.
      </p>
      <StrategyList tips={MATH_STRATEGIES} />
      <p className="skye-scoring__rule">
        <strong>Default order when stuck:</strong> write it on paper → open Reference if it is geometry → try
        plugging in a choice → graph it in Desmos → guess and flag.
      </p>
    </>
  );
}
