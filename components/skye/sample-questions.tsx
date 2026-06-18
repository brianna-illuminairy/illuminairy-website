"use client";

import { useState } from "react";

export type SampleQuestionData = {
  id: string;
  section: "rw" | "math";
  skill: string;
  passage?: string;
  stem: string;
  choices: string[];
  correctIndex: number;
  explain: string;
};

export const RW_SAMPLE_QUESTIONS: SampleQuestionData[] = [
  {
    id: "rw-words-context",
    section: "rw",
    skill: "Words in Context",
    passage:
      "The curator's tour was deliberately unhurried. She paused at each painting long enough for visitors to study the brushwork, and she welcomed questions rather than rushing the group along.",
    stem: "As used in the passage, \"unhurried\" most nearly means:",
    choices: ["careless", "leisurely", "silent", "confusing"],
    correctIndex: 1,
    explain: "She moved slowly on purpose and welcomed questions. Leisurely fits. Nothing suggests careless or confusing."
  },
  {
    id: "rw-transitions",
    section: "rw",
    skill: "Transitions",
    passage:
      "City planners added bike lanes along Main Street. Commuting by bike increased the following year.",
    stem: "Which choice completes the text with the most logical transition?\n\n\"_______, merchants worried that fewer customers would drive to their stores.\"",
    choices: ["For instance", "However", "Similarly", "Thus"],
    correctIndex: 1,
    explain: "Bike commuting went up, but merchants worried about fewer drivers. That is a contrast, so However works best."
  }
];

export const MATH_SAMPLE_QUESTIONS: SampleQuestionData[] = [
  {
    id: "math-linear-eq",
    section: "math",
    skill: "Linear equations in one variable",
    stem: "If 3x + 7 = 22, what is the value of x?",
    choices: ["3", "5", "7", "15"],
    correctIndex: 1,
    explain: "Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5. Use scratch paper for the steps."
  },
  {
    id: "math-percent",
    section: "math",
    skill: "Percentages",
    stem: "A backpack costs $80. It is on sale for 25% off the original price. What is the sale price, in dollars?",
    choices: ["$20", "$55", "$60", "$75"],
    correctIndex: 2,
    explain: "25% of $80 is $20 off. $80 − $20 = $60. On the real test, Desmos can do the arithmetic too."
  }
];

function SampleQuestionCard({ question }: { question: SampleQuestionData }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = answered && picked === question.correctIndex;

  return (
    <div className="skye-sample-q">
      <div className="skye-sample-q__meta">
        <span className="skye-sample-q__skill">{question.skill}</span>
        <span className="skye-sample-q__tag">Practice only · not scored</span>
      </div>
      {question.passage ? <p className="skye-sample-q__passage">{question.passage}</p> : null}
      <p className="skye-sample-q__stem">{question.stem}</p>
      <div className="skye-bluebook__choices">
        {question.choices.map((choice, i) => {
          let cls = "skye-bluebook__choice";
          if (answered) {
            if (i === question.correctIndex) cls += " is-selected";
            else if (i === picked) cls += " is-wrong-choice";
          } else if (picked === i) {
            cls += " is-selected";
          }
          return (
            <button
              key={choice}
              type="button"
              className={cls}
              disabled={answered}
              onClick={() => setPicked(i)}
            >
              <span className="skye-bluebook__choice-letter">{String.fromCharCode(65 + i)}</span>
              <span>{choice}</span>
            </button>
          );
        })}
      </div>
      {answered ? (
        <p className={`skye-quiz__feedback${correct ? " skye-quiz__feedback--correct" : " skye-quiz__feedback--wrong"}`}>
          {correct ? "Right." : `The answer is ${String.fromCharCode(65 + question.correctIndex)}.`} {question.explain}
        </p>
      ) : (
        <p className="skye-sample-q__hint">Pick an answer. On the real test there is no extra penalty for trying.</p>
      )}
    </div>
  );
}

export function ReadingWritingSamplesSlide() {
  return (
    <>
      <p>
        Reading &amp; Writing questions are short passages or sentence pairs on screen. You read, then pick the
        best answer. Try these two (same style as the diagnostic, but easier).
      </p>
      <div className="skye-sample-q-list">
        {RW_SAMPLE_QUESTIONS.map((q) => (
          <SampleQuestionCard key={q.id} question={q} />
        ))}
      </div>
    </>
  );
}

export function MathSamplesSlide() {
  return (
    <>
      <p>
        Math questions are a problem on screen, often with multiple choice. Use scratch paper for steps and
        Desmos when it helps. Try these two.
      </p>
      <div className="skye-sample-q-list">
        {MATH_SAMPLE_QUESTIONS.map((q) => (
          <SampleQuestionCard key={q.id} question={q} />
        ))}
      </div>
    </>
  );
}
