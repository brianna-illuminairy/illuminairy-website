"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  COMBINE_SIMPLIFY_PROBLEMS,
  EE_LEVEL_CLEAR_COPY,
  EE_LEVEL_TITLE,
  EE_SECTION_ORDER,
  EE_SECTION_TARGETS,
  EE_TIER_LABELS,
  type EeSectionId,
  type EeSectionBestScore,
  FOIL_BUILDER_PROBLEMS,
  FOIL_ROLE_ORDER,
  FOIL_ROLE_PROMPTS,
  type FoilRole,
  EE_PATTERN_META,
  MISSING_VALUE_PROBLEMS,
  PATTERN_SORT_ITEMS,
  allLevelsMastered,
  allLevelsPassed,
  countLevelsPassed,
  foilChoiceOptions,
  getSectionLevelStatus,
  isSectionUnlocked,
  mergeSectionBest,
  orderExerciseDeck,
  readEeExerciseProgress,
  sectionAccuracy,
  sectionLevelLabel,
  unlockRequirement,
  writeEeExerciseProgress,
  type EePattern,
  type EeTier
} from "@/lib/danielle-ee-exercise";

type SectionId = EeSectionId;

const SECTIONS: { id: SectionId; title: string; detail: string }[] = [
  {
    id: "pattern",
    title: "1 · Pattern spotter",
    detail:
      "20 reps, warm-up to stretch. Spot DOS, perfect squares, and trinomials before you expand (including ones with coefficients)."
  },
  {
    id: "foil",
    title: "2 · FOIL builder",
    detail:
      "20 products (80 steps). Pick F, O, I, and L fast, including negatives and ax + b forms."
  },
  {
    id: "combine",
    title: "3 · Combine & simplify",
    detail:
      "20 reps. Distribute, expand, combine like terms, and simplify. This is the SAT speed block."
  },
  {
    id: "missing",
    title: "4 · Missing values",
    detail:
      "20 reps. Find k, ab, and middle coefficients using O + I and L after you can expand cleanly."
  }
];

function tierProgressLine(index: number, total: number, tier: EeTier, correct: number) {
  return `Rep ${index + 1} of ${total} · ${EE_TIER_LABELS[tier]} · ${correct} correct`;
}

function nextUnlockCopy(section: SectionId) {
  if (section === "pattern") return "FOIL builder is unlocked.";
  if (section === "foil") return "Combine & simplify is unlocked.";
  if (section === "combine") return "Missing values is unlocked.";
  return EE_LEVEL_CLEAR_COPY;
}

function formatPercent(ratio: number) {
  return `${Math.round(ratio * 100)}%`;
}

function MathExpr({ children }: { children: string }) {
  return <span className="danielle-ee-exercise__math">{children}</span>;
}

function SectionCompleteMessage({
  section,
  correct,
  total
}: {
  section: SectionId;
  correct: number;
  total: number;
}) {
  const target = EE_SECTION_TARGETS[section];
  const status = getSectionLevelStatus(correct, section);
  const acc = formatPercent(sectionAccuracy(correct, total));

  if (status === "master") {
    return (
      <div className="danielle-ee-exercise__section-done is-master">
        <p className="danielle-ee-exercise__status-badge is-master">Mastered</p>
        <p>
          {target.levelName}: {correct} of {total} ({acc}). {target.masterLabel} hit.
        </p>
        {section === "pattern" && (
          <p className="danielle-ee-exercise__section-pass">{nextUnlockCopy("pattern")}</p>
        )}
        {section === "foil" && (
          <p className="danielle-ee-exercise__section-pass">{nextUnlockCopy("foil")}</p>
        )}
        {section === "combine" && (
          <p className="danielle-ee-exercise__section-pass">{nextUnlockCopy("combine")}</p>
        )}
        {section === "missing" && (
          <p className="danielle-ee-exercise__section-pass">{nextUnlockCopy("missing")}</p>
        )}
      </div>
    );
  }

  if (status === "pass") {
    return (
      <div className="danielle-ee-exercise__section-done is-pass">
        <p className="danielle-ee-exercise__status-badge is-pass">Passed</p>
        <p>
          {target.levelName}: {correct} of {total} ({acc}). {target.passLabel} cleared.
        </p>
        <p className="danielle-ee-exercise__section-retry">
          Optional: run again for {target.masterLabel.toLowerCase()}.
        </p>
        {section === "pattern" && (
          <p className="danielle-ee-exercise__section-pass">{nextUnlockCopy("pattern")}</p>
        )}
        {section === "foil" && (
          <p className="danielle-ee-exercise__section-pass">{nextUnlockCopy("foil")}</p>
        )}
        {section === "combine" && (
          <p className="danielle-ee-exercise__section-pass">{nextUnlockCopy("combine")}</p>
        )}
        {section === "missing" && (
          <p className="danielle-ee-exercise__section-pass">{nextUnlockCopy("missing")}</p>
        )}
      </div>
    );
  }

  return (
    <div className="danielle-ee-exercise__section-done is-fail">
      <p className="danielle-ee-exercise__status-badge is-fail">Not passed</p>
      <p>
        {target.levelName}: {correct} of {total} ({acc}). You need {target.passCorrect} of{" "}
        {target.total} to pass.
      </p>
      <p className="danielle-ee-exercise__section-retry">Restart this section and try again.</p>
    </div>
  );
}

function SectionTargetLine({ section }: { section: SectionId }) {
  const target = EE_SECTION_TARGETS[section];
  return (
    <p className="danielle-ee-exercise__target">
      <strong>{target.levelName} targets:</strong> {target.passLabel}. {target.masterLabel}.
    </p>
  );
}

function PatternSortSection({
  onComplete
}: {
  onComplete: (correct: number, total: number) => void;
}) {
  const [deck] = useState(() => orderExerciseDeck(PATTERN_SORT_ITEMS));
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ picked: EePattern; ok: boolean } | null>(null);
  const [done, setDone] = useState(false);

  const item = deck[index];

  function handlePick(pattern: EePattern) {
    if (!item || feedback || done) return;
    const ok = pattern === item.pattern;
    const nextCorrect = correctCount + (ok ? 1 : 0);
    setFeedback({ picked: pattern, ok });
    setCorrectCount(nextCorrect);
  }

  function handleNext() {
    if (!feedback) return;
    const next = index + 1;
    if (next >= deck.length) {
      setDone(true);
      onComplete(correctCount + (feedback.ok ? 0 : 0), deck.length);
      return;
    }
    setIndex(next);
    setFeedback(null);
  }

  if (done) {
    return <SectionCompleteMessage section="pattern" correct={correctCount} total={deck.length} />;
  }

  if (!item) return null;

  return (
    <>
      <SectionTargetLine section="pattern" />
      <p className="danielle-ee-exercise__progress">
        {tierProgressLine(index, deck.length, item.tier, correctCount)}
      </p>
      <div className="danielle-ee-exercise__prompt-card">
        <p className="danielle-ee-exercise__prompt-label">Which pattern fits?</p>
        <p className="danielle-ee-exercise__expression">
          <MathExpr>{item.expression}</MathExpr>
        </p>
      </div>
      <div className="danielle-ee-exercise__choices">
        {(Object.keys(EE_PATTERN_META) as EePattern[]).map((pattern) => {
          const meta = EE_PATTERN_META[pattern];
          const isPicked = feedback?.picked === pattern;
          const isAnswer = item.pattern === pattern;
          let state = "";
          if (feedback) {
            if (isAnswer) state = " is-correct";
            else if (isPicked) state = " is-wrong";
            else state = " is-dim";
          }
          return (
            <button
              key={pattern}
              type="button"
              className={`danielle-ee-exercise__choice${state}`}
              disabled={Boolean(feedback)}
              onClick={() => handlePick(pattern)}
            >
              <span className="danielle-ee-exercise__choice-title">{meta.label}</span>
              <span className="danielle-ee-exercise__choice-hint">{meta.hint}</span>
            </button>
          );
        })}
      </div>
      {feedback && (
        <div
          className={`danielle-ee-exercise__feedback${feedback.ok ? " is-correct" : " is-wrong"}`}
        >
          <p>{feedback.ok ? "Correct." : "Not quite."} {item.explain}</p>
          <button type="button" className="danielle-flashcards__primary" onClick={handleNext}>
            {index + 1 >= deck.length ? "Finish section" : "Next"}
          </button>
        </div>
      )}
    </>
  );
}

function FoilBuilderSection({
  onComplete
}: {
  onComplete: (correct: number, total: number) => void;
}) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [correctSteps, setCorrectSteps] = useState(0);
  const [feedback, setFeedback] = useState<{ picked: string; ok: boolean; explain: string } | null>(
    null
  );
  const [done, setDone] = useState(false);

  const problem = FOIL_BUILDER_PROBLEMS[problemIndex];
  const role = FOIL_ROLE_ORDER[roleIndex];
  const totalSteps = FOIL_BUILDER_PROBLEMS.length * FOIL_ROLE_ORDER.length;

  const options = useMemo(() => {
    if (!problem || !role) return [];
    return foilChoiceOptions(problem, role);
  }, [problem, role]);

  function handlePick(term: string) {
    if (!problem || !role || feedback || done) return;
    const expected = problem.steps[role].term;
    const ok = term === expected;
    setFeedback({
      picked: term,
      ok,
      explain: problem.steps[role].explain
    });
    if (ok) setCorrectSteps((n) => n + 1);
  }

  function handleNext() {
    if (!feedback) return;
    const nextRole = roleIndex + 1;
    if (nextRole >= FOIL_ROLE_ORDER.length) {
      const nextProblem = problemIndex + 1;
      if (nextProblem >= FOIL_BUILDER_PROBLEMS.length) {
        setDone(true);
        onComplete(correctSteps + (feedback.ok ? 0 : 0), totalSteps);
        return;
      }
      setProblemIndex(nextProblem);
      setRoleIndex(0);
    } else {
      setRoleIndex(nextRole);
    }
    setFeedback(null);
  }

  if (done) {
    return (
      <SectionCompleteMessage section="foil" correct={correctSteps} total={totalSteps} />
    );
  }

  if (!problem || !role) return null;

  return (
    <>
      <SectionTargetLine section="foil" />
      <p className="danielle-ee-exercise__progress">
        Problem {problemIndex + 1} of {FOIL_BUILDER_PROBLEMS.length} ·{" "}
        {EE_TIER_LABELS[problem.tier]} · Step {roleIndex + 1} of 4 · {correctSteps} correct steps
      </p>
      <div className="danielle-ee-exercise__prompt-card">
        <p className="danielle-ee-exercise__prompt-label">{FOIL_ROLE_PROMPTS[role]}</p>
        <p className="danielle-ee-exercise__expression">
          <MathExpr>{problem.product}</MathExpr>
        </p>
        <p className="danielle-ee-exercise__subhint">
          Expands to <MathExpr>{problem.expanded}</MathExpr>
        </p>
      </div>
      <div className="danielle-ee-exercise__term-grid">
        {options.map((term) => {
          const isPicked = feedback?.picked === term;
          const isAnswer = problem.steps[role].term === term;
          let state = "";
          if (feedback) {
            if (isAnswer) state = " is-correct";
            else if (isPicked) state = " is-wrong";
            else state = " is-dim";
          }
          return (
            <button
              key={`${role}-${term}`}
              type="button"
              className={`danielle-ee-exercise__term${state}`}
              disabled={Boolean(feedback)}
              onClick={() => handlePick(term)}
            >
              <MathExpr>{term}</MathExpr>
            </button>
          );
        })}
      </div>
      {feedback && (
        <div
          className={`danielle-ee-exercise__feedback${feedback.ok ? " is-correct" : " is-wrong"}`}
        >
          <p>{feedback.explain}</p>
          <button type="button" className="danielle-flashcards__primary" onClick={handleNext}>
            Continue
          </button>
        </div>
      )}
    </>
  );
}

function ChoiceDrillSection({
  section,
  deck,
  onComplete
}: {
  section: "missing" | "combine";
  deck: typeof MISSING_VALUE_PROBLEMS | typeof COMBINE_SIMPLIFY_PROBLEMS;
  onComplete: (correct: number, total: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ picked: string; ok: boolean } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);

  const item = deck[index];

  function handlePick(choiceId: string) {
    if (!item || feedback || done) return;
    const ok = choiceId === item.correctId;
    setFeedback({ picked: choiceId, ok });
    if (ok) setCorrectCount((n) => n + 1);
  }

  function handleNext() {
    if (!feedback) return;
    const next = index + 1;
    if (next >= deck.length) {
      setDone(true);
      onComplete(correctCount, deck.length);
      return;
    }
    setIndex(next);
    setFeedback(null);
    setShowHint(false);
  }

  if (done) {
    return <SectionCompleteMessage section={section} correct={correctCount} total={deck.length} />;
  }

  if (!item) return null;

  return (
    <>
      <SectionTargetLine section={section} />
      <p className="danielle-ee-exercise__progress">
        {tierProgressLine(index, deck.length, item.tier, correctCount)}
      </p>
      <div className="danielle-ee-exercise__prompt-card">
        <p className="danielle-ee-exercise__prompt-label">{item.question}</p>
        <p className="danielle-ee-exercise__expression">
          <MathExpr>{item.expression}</MathExpr>
        </p>
        <button
          type="button"
          className="danielle-flashcards__help-btn"
          onClick={() => setShowHint((open) => !open)}
        >
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        {showHint && <p className="danielle-ee-exercise__hint">{item.hint}</p>}
      </div>
      <div className="danielle-ee-exercise__term-grid">
        {item.choices.map((choice) => {
          const isPicked = feedback?.picked === choice.id;
          const isAnswer = item.correctId === choice.id;
          let state = "";
          if (feedback) {
            if (isAnswer) state = " is-correct";
            else if (isPicked) state = " is-wrong";
            else state = " is-dim";
          }
          return (
            <button
              key={choice.id}
              type="button"
              className={`danielle-ee-exercise__term${state}`}
              disabled={Boolean(feedback)}
              onClick={() => handlePick(choice.id)}
            >
              <MathExpr>{choice.label}</MathExpr>
            </button>
          );
        })}
      </div>
      {feedback && (
        <div
          className={`danielle-ee-exercise__feedback${feedback.ok ? " is-correct" : " is-wrong"}`}
        >
          <p>{item.explain}</p>
          <button type="button" className="danielle-flashcards__primary" onClick={handleNext}>
            {index + 1 >= deck.length ? "Finish section" : "Next"}
          </button>
        </div>
      )}
    </>
  );
}

function MissingValueSection({
  onComplete
}: {
  onComplete: (correct: number, total: number) => void;
}) {
  const [deck] = useState(() => orderExerciseDeck(MISSING_VALUE_PROBLEMS));
  return <ChoiceDrillSection section="missing" deck={deck} onComplete={onComplete} />;
}

function CombineSimplifySection({
  onComplete
}: {
  onComplete: (correct: number, total: number) => void;
}) {
  const [deck] = useState(() => orderExerciseDeck(COMBINE_SIMPLIFY_PROBLEMS));
  return <ChoiceDrillSection section="combine" deck={deck} onComplete={onComplete} />;
}

function readInitialEeProgress() {
  if (typeof window === "undefined") return {};
  return readEeExerciseProgress();
}

export function EeExerciseHub() {
  const [activeSection, setActiveSection] = useState<SectionId>("pattern");
  const [bestScores, setBestScores] =
    useState<Partial<Record<SectionId, EeSectionBestScore>>>(readInitialEeProgress);
  const [lastRun, setLastRun] = useState<Partial<Record<SectionId, EeSectionBestScore>>>({});
  const [sectionKey, setSectionKey] = useState(0);

  function markSectionComplete(section: SectionId, correct: number, total: number) {
    const merged = mergeSectionBest(section, bestScores[section], correct, total);
    setLastRun((prev) => ({ ...prev, [section]: { correct, total, status: getSectionLevelStatus(correct, section) } }));
    setBestScores((prev) => {
      const next = { ...prev, [section]: merged };
      writeEeExerciseProgress(next);
      return next;
    });
  }

  function restartSection(section: SectionId) {
    setSectionKey((k) => k + 1);
    setLastRun((prev) => {
      const next = { ...prev };
      delete next[section];
      return next;
    });
    setActiveSection(section);
  }

  const levelsPassed = countLevelsPassed(bestScores);
  const levelCleared = allLevelsPassed(bestScores);
  const levelMastered = allLevelsMastered(bestScores);
  const activeUnlocked = isSectionUnlocked(activeSection, bestScores);

  const activeBest = bestScores[activeSection];
  const activeLast = lastRun[activeSection];

  return (
    <div className="danielle-ee-exercise">
      <div className="danielle-ee-exercise__level-card">
        <p className="danielle-ee-exercise__level-eyebrow">{EE_LEVEL_TITLE}</p>
        <h3 className="danielle-ee-exercise__level-title">
          Level progress: {levelsPassed} of 4 passed
        </h3>
        <p className="danielle-ee-exercise__level-detail">
          20 reps per section, ramping difficulty. Pass each block to unlock the next. Clear all four
          before Homework Portal set 3.
        </p>
        <ol className="danielle-ee-exercise__level-list">
          {EE_SECTION_ORDER.map((section) => {
            const best = bestScores[section];
            const target = EE_SECTION_TARGETS[section];
            const unlocked = isSectionUnlocked(section, bestScores);
            return (
              <li key={section} className={unlocked ? "" : " is-locked"}>
                <strong>{target.levelName}</strong>
                {best ? (
                  <>
                    {" · "}
                    {sectionLevelLabel(best.status)} ({best.correct}/{best.total})
                  </>
                ) : unlocked ? (
                  " · Not started"
                ) : (
                  " · Locked"
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="danielle-ee-exercise__nav">
        {SECTIONS.map((section) => {
          const best = bestScores[section.id];
          const unlocked = isSectionUnlocked(section.id, bestScores);
          const passed = best && best.status !== "fail" ? " is-passed" : "";
          const mastered = best?.status === "master" ? " is-mastered" : "";
          const isActive = activeSection === section.id ? " is-active" : "";
          const locked = unlocked ? "" : " is-locked";
          return (
            <button
              key={section.id}
              type="button"
              className={`danielle-ee-exercise__nav-btn${isActive}${passed}${mastered}${locked}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.title}
              {best && (
                <span className="danielle-ee-exercise__nav-score">
                  {sectionLevelLabel(best.status)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="danielle-ee-exercise__panel">
        <h3 className="danielle-ee-exercise__panel-title">
          {SECTIONS.find((s) => s.id === activeSection)?.title}
        </h3>
        <p className="danielle-ee-exercise__panel-detail">
          {SECTIONS.find((s) => s.id === activeSection)?.detail}
        </p>

        {!activeUnlocked ? (
          <div className="danielle-ee-exercise__locked-panel">
            <p className="danielle-ee-exercise__status-badge is-fail">Locked</p>
            <p>{unlockRequirement(activeSection)}</p>
          </div>
        ) : (
          <>
            {activeBest && (
              <p className="danielle-ee-exercise__best-line">
                Best this level: {sectionLevelLabel(activeBest.status)} ({activeBest.correct}/
                {activeBest.total})
              </p>
            )}

            {activeSection === "pattern" && (
              <PatternSortSection
                key={`pattern-${sectionKey}`}
                onComplete={(correct, total) => markSectionComplete("pattern", correct, total)}
              />
            )}
            {activeSection === "foil" && (
              <FoilBuilderSection
                key={`foil-${sectionKey}`}
                onComplete={(correct, total) => markSectionComplete("foil", correct, total)}
              />
            )}
            {activeSection === "combine" && (
              <CombineSimplifySection
                key={`combine-${sectionKey}`}
                onComplete={(correct, total) => markSectionComplete("combine", correct, total)}
              />
            )}
            {activeSection === "missing" && (
              <MissingValueSection
                key={`missing-${sectionKey}`}
                onComplete={(correct, total) => markSectionComplete("missing", correct, total)}
              />
            )}

            {(activeLast || activeBest) && (
              <p className="danielle-ee-exercise__retry">
                <button
                  type="button"
                  className="danielle-flashcards__ghost"
                  onClick={() => restartSection(activeSection)}
                >
                  Restart this section
                </button>
              </p>
            )}
          </>
        )}
      </div>

      {levelCleared && (
        <div className="danielle-flashcards__goal-banner" role="status">
          {levelMastered
            ? "Level 1 mastered on all four sections. Homework Portal set 3 and the quiz are next."
            : EE_LEVEL_CLEAR_COPY}
        </div>
      )}

      <p className="danielle-ee-exercise__footer">
        <Link href="/danielle/week-3/formula-sheet" className="danielle-week1__inline-link">
          Formula sheet
        </Link>
        {" · "}
        <Link href="/danielle/week-3/lesson-2#post-session-resources" className="danielle-week1__inline-link">
          Post-session resources
        </Link>
      </p>
    </div>
  );
}
