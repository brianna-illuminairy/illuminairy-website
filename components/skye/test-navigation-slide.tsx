"use client";

import { useState } from "react";

const NAV_TACTICS = [
  {
    id: "skip",
    title: "Skip ahead",
    short: "Jump to any question number.",
    detail:
      "Use the question bar at the bottom (1, 2, 3…). You are not stuck in order. Do easier questions first if a hard one is eating your time.",
    example: "Stuck on Q8 for a minute? Click Q9, keep moving, and come back to Q8 later."
  },
  {
    id: "mark",
    title: "Mark for Review",
    short: "Bluebook's bookmark button (we call it Flag in the demo).",
    detail:
      "Click Mark for Review on any question you want to revisit. The timer keeps running. At the end of the module, Bluebook shows a review screen with your flagged questions.",
    example: "Flag it, pick a temporary guess if you want, move on, then fix it on the review screen before you submit the module."
  },
  {
    id: "eliminate",
    title: "Eliminate wrong answers",
    short: "Cross off choices on scratch paper.",
    detail:
      "There is no eliminate button on the test. On scratch paper, write A B C D and cross out answers you know are wrong. Debate only what is left.",
    example: "RW: two choices sound almost right? Cross off the one the passage does not support. Math: plug in a choice and cross it off if it fails."
  },
  {
    id: "review",
    title: "End-of-module review",
    short: "Last chance before the module locks.",
    detail:
      "When time is almost up, or when you have hit every question once, open the review screen. Check flagged questions and any you left blank. Submit an answer for every number.",
    example: "The review screen is where you turn a blank into a guess and double-check flagged ones."
  }
] as const;

const WORKFLOW_STEPS = [
  "Read the question.",
  "Try it for about 60 seconds.",
  "Eliminate what you can on scratch paper.",
  "Pick a guess, Mark for Review if still unsure, skip ahead.",
  "Come back on the review screen before the module ends."
] as const;

export function TestNavigationSlide() {
  const [active, setActive] = useState<(typeof NAV_TACTICS)[number]["id"]>("skip");
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const tactic = NAV_TACTICS.find((t) => t.id === active)!;

  function toggleStep(index: number) {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <>
      <p>
        Bluebook lets you <strong>move around</strong>, <strong>bookmark questions</strong>, and{" "}
        <strong>eliminate choices on paper</strong>. None of these pause the timer. Tap each tactic below.
      </p>

      <div className="skye-nav__tabs" role="tablist" aria-label="Test navigation tactics">
        {NAV_TACTICS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            className={`skye-nav__tab${active === t.id ? " is-active" : ""}`}
            onClick={() => setActive(t.id)}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="skye-nav__panel" role="tabpanel">
        <p className="skye-nav__panel-short">{tactic.short}</p>
        <p>{tactic.detail}</p>
        <p className="skye-nav__panel-example">
          <strong>Example:</strong> {tactic.example}
        </p>
      </div>

      <p className="skye-scoring__rule">
        <strong>Mark for Review is not skipping forever.</strong> You still need an answer on every question
        before the module ends. Flagging just helps you find the ones to fix on the review screen.
      </p>

      <div className="skye-nav__workflow">
        <p className="skye-nav__workflow-title">When a question feels hard</p>
        {WORKFLOW_STEPS.map((step, i) => (
          <button
            key={step}
            type="button"
            className={`skye-checklist__item skye-nav__workflow-step${checkedSteps.has(i) ? " is-checked" : ""}`}
            onClick={() => toggleStep(i)}
            aria-pressed={checkedSteps.has(i)}
          >
            <span className="skye-checklist__box">{checkedSteps.has(i) ? "✓" : i + 1}</span>
            <span>{step}</span>
          </button>
        ))}
      </div>
    </>
  );
}
