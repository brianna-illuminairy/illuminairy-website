"use client";

import { useCallback, useMemo, useState } from "react";
import { AdaptiveModulesSlide } from "@/components/skye/adaptive-modules-slide";
import {
  SkillTaxonomyExplorerSlide,
  SkillTaxonomyHierarchySlide
} from "@/components/skye/skill-taxonomy-explorer";
import { MathSamplesSlide, ReadingWritingSamplesSlide } from "@/components/skye/sample-questions";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const SLIDE_COUNT = 17;

const STRATEGY_ITEMS = [
  "No wrong-answer penalty: a guess and a blank both count as a miss, but a guess might be right.",
  "Answer every question before time runs out. Never leave bubbles empty on purpose.",
  "This is a baseline, not a grade. Wrong answers tell us what to work on.",
  "On Math, open Desmos early and use it freely.",
  "If you are stuck for more than 60 seconds, flag it, pick your best guess, and move on.",
  "Read the full question and every answer choice before picking.",
  "Scratch paper and a pencil or pen are allowed. Use them for Math work, underlining, and crossing out wrong choices.",
  "No phone, textbooks, or formula sheets. Scratch paper is fine; study notes are not.",
  "Take the break between sections. Stand up and stretch."
] as const;

const SCORING_MYTHS = [
  {
    myth: "Wrong answers cost more than leaving a question blank.",
    fact: "False. The digital SAT has no wrong-answer penalty. A blank and a wrong answer both count as a miss. Always pick an answer."
  },
  {
    myth: "You have to do everything in your head because the test is on a computer.",
    fact: "False. You get scratch paper and a pencil or pen. On test day the center provides them; for today, grab blank paper before you start."
  },
  {
    myth: "You have to get every question right.",
    fact: "No one does. Your job is to attempt every question, not to be perfect."
  },
  {
    myth: "Skipping a question is fine if you come back later.",
    fact: "Flag it and move on, but submit an answer before the module timer ends. An empty question is still a miss."
  },
  {
    myth: "Random guessing will hurt your score.",
    fact: "A blank gives you 0% on that question. A guess on a 4-choice question gives you a 25% chance. When stuck, guess."
  }
] as const;

const SCORING_QUIZ = {
  question: "On the digital SAT, a wrong answer compared to a blank:",
  options: [
    { label: "Costs extra points (penalty)", correct: false },
    { label: "Counts the same — both are a miss", correct: true },
    { label: "Is better than a blank", correct: false },
    { label: "Does not count at all", correct: false }
  ],
  explain: "There is no guessing penalty. Wrong and blank are both incorrect. The only difference: a guess can be right."
} as const;

type QuizOption = {
  label: string;
  correct: boolean;
};

const QUIZ: { question: string; options: QuizOption[]; explain: string } = {
  question: "About how long is the full digital SAT?",
  options: [
    { label: "About 1 hour", correct: false },
    { label: "About 2 hours 15 minutes", correct: true },
    { label: "About 4 hours", correct: false },
    { label: "All day with breaks", correct: false }
  ],
  explain:
    "The digital SAT runs about 2 hours and 14 minutes of testing, plus a 10-minute break between Reading & Writing and Math."
};

function SatStructureDiagram() {
  return (
    <div className="skye-structure" aria-label="SAT section structure">
      <div className="skye-structure__section">
        <div className="skye-structure__section-head skye-structure__section-head--rw">
          <span>Reading &amp; Writing</span>
          <span>64 min · 54 questions</span>
        </div>
        <div className="skye-structure__modules">
          <div className="skye-structure__module">
            <b>Module 1</b>
            <span>32 min · 27 questions</span>
          </div>
          <div className="skye-structure__module">
            <b>Module 2</b>
            <span>32 min · 27 questions · adaptive</span>
          </div>
        </div>
      </div>

      <div className="skye-structure__break">10-minute break</div>

      <div className="skye-structure__section">
        <div className="skye-structure__section-head skye-structure__section-head--math">
          <span>Math</span>
          <span>70 min · 44 questions</span>
        </div>
        <div className="skye-structure__modules">
          <div className="skye-structure__module">
            <b>Module 1</b>
            <span>35 min · 22 questions</span>
          </div>
          <div className="skye-structure__module">
            <b>Module 2</b>
            <span>35 min · 22 questions · adaptive</span>
          </div>
        </div>
      </div>

      <div className="skye-structure__total">
        Total: <strong>98 questions</strong> across 4 modules · scored <strong>400–1600</strong>
      </div>
    </div>
  );
}

function RevealCards() {
  const cards = [
    { prompt: "Tap: Reading & Writing time", value: "64 minutes", hint: "2 modules × 32 min" },
    { prompt: "Tap: Math time", value: "70 minutes", hint: "2 modules × 35 min" },
    { prompt: "Tap: Total questions", value: "98", hint: "54 RW + 44 Math" },
    { prompt: "Tap: Full test length", value: "~2 hr 14 min", hint: "Plus a 10-min break" }
  ];
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="skye-reveal-grid">
      {cards.map((card, i) => (
        <button
          key={card.prompt}
          type="button"
          className={`skye-reveal-card${open.has(i) ? " is-open" : ""}`}
          onClick={() => toggle(i)}
          aria-expanded={open.has(i)}
        >
          {open.has(i) ? (
            <>
              <span className="skye-reveal-card__value">{card.value}</span>
              <span className="skye-reveal-card__hint">{card.hint}</span>
            </>
          ) : (
            <span className="skye-reveal-card__prompt">{card.prompt}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function QuickQuiz() {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = answered && QUIZ.options[picked].correct;

  return (
    <div className="skye-quiz">
      <p className="skye-quiz__question">{QUIZ.question}</p>
      <div className="skye-quiz__options">
        {QUIZ.options.map((opt, i) => {
          let cls = "skye-quiz__option";
          if (answered) {
            if (opt.correct) cls += " is-correct";
            else if (i === picked) cls += " is-wrong";
          }
          return (
            <button
              key={opt.label}
              type="button"
              className={cls}
              disabled={answered}
              onClick={() => setPicked(i)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {answered ? (
        <p className={`skye-quiz__feedback${correct ? " skye-quiz__feedback--correct" : " skye-quiz__feedback--wrong"}`}>
          {correct ? "Right." : "Not quite."} {QUIZ.explain}
        </p>
      ) : null}
    </div>
  );
}

function ScoringMythCards() {
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="skye-myth-list">
      {SCORING_MYTHS.map((item, i) => (
        <button
          key={item.myth}
          type="button"
          className={`skye-myth-card${open.has(i) ? " is-open" : ""}`}
          onClick={() => toggle(i)}
          aria-expanded={open.has(i)}
        >
          <span className="skye-myth-card__tag">{open.has(i) ? "Fact" : "Myth?"}</span>
          <span className="skye-myth-card__text">{open.has(i) ? item.fact : item.myth}</span>
          {!open.has(i) ? <span className="skye-myth-card__cta">Tap to check</span> : null}
        </button>
      ))}
    </div>
  );
}

function ScoringQuiz() {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = answered && SCORING_QUIZ.options[picked].correct;

  return (
    <div className="skye-quiz">
      <p className="skye-quiz__question">{SCORING_QUIZ.question}</p>
      <div className="skye-quiz__options">
        {SCORING_QUIZ.options.map((opt, i) => {
          let cls = "skye-quiz__option";
          if (answered) {
            if (opt.correct) cls += " is-correct";
            else if (i === picked) cls += " is-wrong";
          }
          return (
            <button
              key={opt.label}
              type="button"
              className={cls}
              disabled={answered}
              onClick={() => setPicked(i)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {answered ? (
        <p className={`skye-quiz__feedback${correct ? " skye-quiz__feedback--correct" : " skye-quiz__feedback--wrong"}`}>
          {correct ? "Right." : "Not quite."} {SCORING_QUIZ.explain}
        </p>
      ) : null}
    </div>
  );
}

function ScoringRulesSlide() {
  return (
    <>
      <p>
        Biggest rookie mistake: leaving questions blank because you are afraid a wrong answer will hurt
        you extra. On the <strong>digital SAT, that is not true.</strong>
      </p>
      <ScoringMythCards />
      <p className="skye-scoring__rule">
        <strong>Rule to remember:</strong> wrong = miss. blank = miss. guess = might be right. Always answer.
      </p>
      <ScoringQuiz />
    </>
  );
}

function BluebookMockup() {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(3);
  const [flagged, setFlagged] = useState<Set<number>>(new Set([7]));
  const [calcOpen, setCalcOpen] = useState(false);

  const questions = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div>
      <div className="skye-bluebook" role="group" aria-label="Bluebook interface demo">
        <div className="skye-bluebook__topbar">
          <span>Section 2 · Math · Module 1</span>
          <span className="skye-bluebook__timer">28:14</span>
        </div>
        <div className="skye-bluebook__body">
          <p style={{ fontWeight: 600, marginBottom: 10 }}>
            If <code style={{ fontFamily: "var(--aurora-mono)" }}>3x + 7 = 22</code>, what is the value of <code style={{ fontFamily: "var(--aurora-mono)" }}>x</code>?
          </p>
          <div className="skye-bluebook__choices">
            {["3", "5", "7", "15"].map((val, i) => (
              <button
                key={val}
                type="button"
                className={`skye-bluebook__choice${selectedChoice === i ? " is-selected" : ""}`}
                onClick={() => setSelectedChoice(i)}
              >
                <span className="skye-bluebook__choice-letter">{String.fromCharCode(65 + i)}</span>
                <span>{val}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="skye-bluebook__footer">
          <div className="skye-bluebook__dots">
            {questions.map((q) => (
              <button
                key={q}
                type="button"
                className={`skye-bluebook__dot${q === currentQ ? " is-current" : ""}${flagged.has(q) ? " is-flagged" : ""}`}
                onClick={() => setCurrentQ(q)}
                aria-label={`Question ${q}`}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="skye-bluebook__tools">
            <button
              type="button"
              className={`skye-bluebook__tool${flagged.has(currentQ) ? " is-active" : ""}`}
              onClick={() =>
                setFlagged((prev) => {
                  const next = new Set(prev);
                  if (next.has(currentQ)) next.delete(currentQ);
                  else next.add(currentQ);
                  return next;
                })
              }
            >
              Flag
            </button>
            <button
              type="button"
              className={`skye-bluebook__tool${calcOpen ? " is-active" : ""}`}
              onClick={() => setCalcOpen((v) => !v)}
            >
              Calculator
            </button>
          </div>
        </div>
      </div>

      {calcOpen ? (
        <iframe
          title="Desmos calculator preview"
          className="skye-desmos-frame"
          src="https://www.desmos.com/calculator"
          loading="lazy"
        />
      ) : null}

      <div className="skye-bluebook__callouts">
        <div className="skye-bluebook__callout">
          <span className="skye-bluebook__callout-num">1</span>
          <span>Timer counts down per module. When it hits zero, the module ends.</span>
        </div>
        <div className="skye-bluebook__callout">
          <span className="skye-bluebook__callout-num">2</span>
          <span>Click a letter to select an answer. You can change it until time runs out.</span>
        </div>
        <div className="skye-bluebook__callout">
          <span className="skye-bluebook__callout-num">3</span>
          <span>Number bar jumps between questions. Flag ones you want to revisit.</span>
        </div>
        <div className="skye-bluebook__callout">
          <span className="skye-bluebook__callout-num">4</span>
          <span>Calculator opens Desmos on Math. Try the button above.</span>
        </div>
      </div>
    </div>
  );
}

function DesmosTips() {
  return (
    <div className="skye-desmos-tips">
      <div className="skye-desmos-tip">
        <span className="skye-desmos-tip__icon">1</span>
        <span>
          Type an equation on a new line, like <code>y = 2x + 3</code>. Desmos draws the graph instantly.
        </span>
      </div>
      <div className="skye-desmos-tip">
        <span className="skye-desmos-tip__icon">2</span>
        <span>
          Click any point on the graph to read coordinates. Useful for intersections and solutions.
        </span>
      </div>
      <div className="skye-desmos-tip">
        <span className="skye-desmos-tip__icon">3</span>
        <span>
          For systems, graph both lines: <code>y = x + 1</code> and <code>y = -x + 5</code>. The crossing point is the answer.
        </span>
      </div>
      <div className="skye-desmos-tip">
        <span className="skye-desmos-tip__icon">4</span>
        <span>
          Use the + table for number patterns, or type <code>y = x^2 - 4</code> to see where the graph hits the x-axis.
        </span>
      </div>
    </div>
  );
}

function StrategyChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="skye-checklist">
      {STRATEGY_ITEMS.map((item, i) => (
        <button
          key={item}
          type="button"
          className={`skye-checklist__item${checked.has(i) ? " is-checked" : ""}`}
          onClick={() => toggle(i)}
          aria-pressed={checked.has(i)}
        >
          <span className="skye-checklist__box">{checked.has(i) ? "✓" : ""}</span>
          <span>{item}</span>
        </button>
      ))}
    </div>
  );
}

export function PreDiagnosticLesson() {
  const [slide, setSlide] = useState(0);

  const progress = useMemo(() => ((slide + 1) / SLIDE_COUNT) * 100, [slide]);

  const goNext = useCallback(() => setSlide((s) => Math.min(s + 1, SLIDE_COUNT - 1)), []);
  const goBack = useCallback(() => setSlide((s) => Math.max(s - 1, 0)), []);

  const slides = [
    {
      eyebrow: `Slide 1 of ${SLIDE_COUNT}`,
      title: "Before your Skill Diagnostic",
      body: (
        <>
          <span className="skye-lesson__time-badge">~10–15 min lesson</span>
          <p>
            Hi Skye. Today you will take a <strong>Skill Diagnostic</strong>: a full-length digital SAT that
            shows us where you are right now and which skills to focus on first.
          </p>
          <p>
            This short walkthrough covers what the test looks like, which skills it tests, the on-screen tools
            (including Desmos), and the strategy that gives us the most useful baseline.
          </p>
          <p>Click <strong>Next</strong> when you are ready.</p>
        </>
      )
    },
    {
      eyebrow: `Slide 2 of ${SLIDE_COUNT}`,
      title: "The SAT is fully digital now",
      body: (
        <>
          <p>
            You take the SAT on a laptop using the <strong>Bluebook</strong> app from College Board.
            No paper booklet, no bubble sheet.
          </p>
          <p>
            Your Skill Diagnostic uses the same format as the real August test: same timing, same question
            types, same on-screen calculator.
          </p>
          <p>
            The score runs <strong>400 to 1600</strong> (200–800 Reading &amp; Writing, 200–800 Math). Today
            we are not chasing a target score. We want an honest starting point.
          </p>
        </>
      )
    },
    {
      eyebrow: `Slide 3 of ${SLIDE_COUNT}`,
      title: "Two sections, four modules",
      body: (
        <>
          <p>The test has two big sections. Each section splits into two timed modules.</p>
          <SatStructureDiagram />
          <p style={{ fontSize: 14, color: "var(--aurora-muted)" }}>
            Next slide explains how Module 2 changes based on Module 1.
          </p>
        </>
      )
    },
    {
      eyebrow: `Slide 4 of ${SLIDE_COUNT}`,
      title: "How adaptive modules work",
      body: <AdaptiveModulesSlide />
    },
    {
      eyebrow: `Slide 5 of ${SLIDE_COUNT}`,
      title: "How your report labels every question",
      body: <SkillTaxonomyHierarchySlide />
    },
    {
      eyebrow: `Slide 6 of ${SLIDE_COUNT}`,
      title: "Reading & Writing skills on the diagnostic",
      body: <SkillTaxonomyExplorerSlide initialSection="rw" />
    },
    {
      eyebrow: `Slide 7 of ${SLIDE_COUNT}`,
      title: "Math skills on the diagnostic",
      body: <SkillTaxonomyExplorerSlide initialSection="math" />
    },
    {
      eyebrow: `Slide 8 of ${SLIDE_COUNT}`,
      title: "Example Reading & Writing questions",
      body: <ReadingWritingSamplesSlide />
    },
    {
      eyebrow: `Slide 9 of ${SLIDE_COUNT}`,
      title: "Example Math questions",
      body: <MathSamplesSlide />
    },
    {
      eyebrow: `Slide 10 of ${SLIDE_COUNT}`,
      title: "Timing and question counts",
      body: (
        <>
          <p>Tap each card to reveal the number. Try to remember the big picture: about 2 hours of testing, 98 questions.</p>
          <RevealCards />
        </>
      )
    },
    {
      eyebrow: `Slide 11 of ${SLIDE_COUNT}`,
      title: "Quick check",
      body: (
        <>
          <p>One question to make sure the timing stuck.</p>
          <QuickQuiz />
        </>
      )
    },
    {
      eyebrow: `Slide 12 of ${SLIDE_COUNT}`,
      title: "The Bluebook screen",
      body: (
        <>
          <p>
            This is a simplified version of what you will see. Click around: pick an answer, jump to
            another question number, flag a question, and open the calculator.
          </p>
          <p className="skye-scoring__rule">
            <strong>Scratch paper is allowed.</strong> The test is on screen, but you can write on paper:
            show Math steps, sketch diagrams, underline in passages. Have blank paper and a pencil ready
            before you start today.
          </p>
          <BluebookMockup />
        </>
      )
    },
    {
      eyebrow: `Slide 13 of ${SLIDE_COUNT}`,
      title: "Desmos: your Math calculator",
      body: (
        <>
          <p>
            On every Math question, Bluebook gives you <strong>Desmos</strong>, a graphing calculator built
            into the test. You do not need your own calculator.
          </p>
          <DesmosTips />
          <p style={{ fontSize: 14, color: "var(--aurora-muted)" }}>
            On the real test, Desmos opens in a panel on the right. Practice clicking the Calculator button
            on the previous slide so it feels familiar.
          </p>
        </>
      )
    },
    {
      eyebrow: `Slide 14 of ${SLIDE_COUNT}`,
      title: "What a diagnostic is (and is not)",
      body: (
        <>
          <p>
            <strong>It is:</strong> a snapshot of your current skills. We use it to rank the 5–6 skills that
            will move your score the most, then build your personalized weekly plan.
          </p>
          <p>
            <strong>It is not:</strong> a grade, a judgment, or something you need to study for tonight.
            You have never taken the SAT before, so whatever you score is exactly the data we need.
          </p>
          <p>
            Questions you miss are the most valuable part. They tell us what to teach first.
          </p>
        </>
      )
    },
    {
      eyebrow: `Slide 15 of ${SLIDE_COUNT}`,
      title: "Scoring rules (no guessing penalty)",
      body: <ScoringRulesSlide />
    },
    {
      eyebrow: `Slide 16 of ${SLIDE_COUNT}`,
      title: "Your strategy today",
      body: (
        <>
          <p>Tap each line when it makes sense to you. Brianna will walk through these on the call.</p>
          <StrategyChecklist />
        </>
      )
    },
    {
      eyebrow: `Slide 17 of ${SLIDE_COUNT}`,
      title: "You are ready",
      body: (
        <>
          <p>
            When this lesson is done, open the <strong>Homework Portal</strong> to start your Skill
            Diagnostic. Log in with the account we set up for you.
          </p>
          <p>
            The diagnostic takes about <strong>2 hours and 14 minutes</strong>. Before you start: quiet spot,
            charged laptop, and <strong>blank scratch paper plus a pencil or pen</strong>.
          </p>
          <div className="skye-ready-cta">
            <a
              href={homeworkPortalLoginUrl}
              className="skye-ready-cta__button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Homework Portal →
            </a>
            <p className="skye-ready-cta__note">
              my.illuminairy.com · same link as the header button
            </p>
          </div>
        </>
      )
    }
  ];

  const current = slides[slide];

  return (
    <div className="skye-lesson">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Skye&apos;s SAT Portal</p>
        <h1 className="aurora-portal__title">Pre-Diagnostic Lesson</h1>
        <p className="aurora-portal__lede">
          Walk through this together before the Skill Diagnostic. About 10–15 minutes.
        </p>
      </header>

      <div className="skye-lesson__progress" aria-label="Lesson progress">
        <div className="skye-lesson__progress-track">
          <div className="skye-lesson__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="skye-lesson__progress-label">
          {slide + 1} / {SLIDE_COUNT}
        </span>
      </div>

      <article className="skye-lesson__slide" aria-live="polite">
        <p className="skye-lesson__slide-eyebrow">{current.eyebrow}</p>
        <h2 className="skye-lesson__slide-title">{current.title}</h2>
        <div className="skye-lesson__slide-body">{current.body}</div>

        <div className="skye-lesson__nav">
          <button
            type="button"
            className="skye-lesson__nav-btn"
            onClick={goBack}
            disabled={slide === 0}
          >
            Back
          </button>
          {slide < SLIDE_COUNT - 1 ? (
            <button type="button" className="skye-lesson__nav-btn skye-lesson__nav-btn--primary" onClick={goNext}>
              Next
            </button>
          ) : (
            <a
              href={homeworkPortalLoginUrl}
              className="skye-lesson__nav-btn skye-lesson__nav-btn--primary"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              Start diagnostic
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
