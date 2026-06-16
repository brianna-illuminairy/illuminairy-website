"use client";

import { useCallback, useMemo, useState } from "react";
import type { TransitionCategory } from "@/lib/danielle-transitions-cheat-sheet";
import { TRANSITION_CATEGORY_ORDER } from "@/lib/danielle-transitions-cheat-sheet";
import {
  allFlashcardIds,
  flashcardAccuracy,
  type FlashcardRoundRecord,
  getFlashcardExplain,
  getFlashcardExample,
  hasMetFlashcardGoal,
  shuffleFlashcardIds,
  TRANSITION_CATEGORY_META,
  TRANSITION_FLASHCARD_GOAL_ACCURACY,
  TRANSITION_FLASHCARD_MIN_ATTEMPTS,
  TRANSITION_FLASHCARDS
} from "@/lib/danielle-transitions-flashcards";

const STORAGE_KEY_V3 = "danielle-transitions-flashcard-stats-v3";
const STORAGE_KEY_V2 = "danielle-transitions-flashcard-stats-v2";
const STORAGE_KEY_V1 = "danielle-transitions-flashcard-stats-v1";

type PersistedStats = {
  correct: number;
  attempts: number;
  roundsCompleted: number;
  roundHistory: FlashcardRoundRecord[];
};

type RoundFeedback = {
  picked: TransitionCategory;
  actual: TransitionCategory;
  correct: boolean;
};

type HelpMode = "explain" | "example" | null;

const EMPTY_STATS: PersistedStats = {
  correct: 0,
  attempts: 0,
  roundsCompleted: 0,
  roundHistory: []
};

const CATEGORY_ORDER = TRANSITION_CATEGORY_ORDER;

function readStats(): PersistedStats {
  if (typeof window === "undefined") return EMPTY_STATS;
  try {
    const v3Raw = window.localStorage.getItem(STORAGE_KEY_V3);
    if (v3Raw) {
      const parsed = JSON.parse(v3Raw) as PersistedStats;
      return normalizeStats(parsed);
    }

    const v2Raw = window.localStorage.getItem(STORAGE_KEY_V2);
    if (v2Raw) {
      const parsed = JSON.parse(v2Raw) as PersistedStats;
      return normalizeStats(parsed);
    }

    const v1Raw = window.localStorage.getItem(STORAGE_KEY_V1);
    if (v1Raw) {
      const parsed = JSON.parse(v1Raw) as Partial<PersistedStats>;
      return normalizeStats({
        correct: Number(parsed.correct) || 0,
        attempts: Number(parsed.attempts) || 0,
        roundsCompleted: Number(parsed.roundsCompleted) || 0,
        roundHistory: []
      });
    }
  } catch {
    return EMPTY_STATS;
  }
  return EMPTY_STATS;
}

function normalizeStats(parsed: Partial<PersistedStats>): PersistedStats {
  const roundHistory = Array.isArray(parsed.roundHistory)
    ? parsed.roundHistory
        .map((row) => ({
          round: Number(row.round) || 0,
          correct: Number(row.correct) || 0,
          total: Number(row.total) || 0,
          accuracy: Number(row.accuracy) || 0,
          completedAt: String(row.completedAt || "")
        }))
        .filter((row) => row.round > 0 && row.total > 0)
    : [];

  return {
    correct: Number(parsed.correct) || 0,
    attempts: Number(parsed.attempts) || 0,
    roundsCompleted: Number(parsed.roundsCompleted) || 0,
    roundHistory
  };
}

function writeStats(stats: PersistedStats) {
  window.localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(stats));
}

function formatPercent(ratio: number) {
  return `${Math.round(ratio * 100)}%`;
}

function formatRoundDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  } catch {
    return "";
  }
}

export function TransitionsFlashcardDeck() {
  const [stats, setStats] = useState<PersistedStats>(() => readStats());
  const [deck, setDeck] = useState<string[]>(() => shuffleFlashcardIds(allFlashcardIds()));
  const [index, setIndex] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [feedback, setFeedback] = useState<RoundFeedback | null>(null);
  const [roundDoneMessage, setRoundDoneMessage] = useState<string | null>(null);
  const [helpMode, setHelpMode] = useState<HelpMode>(null);
  const [showRoundLog, setShowRoundLog] = useState(false);

  const cardMap = useMemo(
    () => new Map(TRANSITION_FLASHCARDS.map((card) => [card.id, card])),
    []
  );

  const currentId = deck[index];
  const currentCard = currentId ? cardMap.get(currentId) : undefined;

  const startRound = useCallback(() => {
    setDeck(shuffleFlashcardIds(allFlashcardIds()));
    setIndex(0);
    setRoundCorrect(0);
    setFeedback(null);
    setRoundDoneMessage(null);
    setHelpMode(null);
  }, []);

  const cumulativeAccuracy = flashcardAccuracy(stats.correct, stats.attempts);
  const goalMet = hasMetFlashcardGoal(stats.correct, stats.attempts);
  const roundTotal = deck.length;
  const roundProgress = roundTotal > 0 ? index + (feedback ? 1 : 0) : 0;
  const roundHistoryDisplay = [...stats.roundHistory].reverse();

  function persistAnswer(correct: boolean) {
    setStats((prev) => {
      const next = {
        ...prev,
        correct: prev.correct + (correct ? 1 : 0),
        attempts: prev.attempts + 1
      };
      writeStats(next);
      return next;
    });
    if (correct) setRoundCorrect((n) => n + 1);
  }

  function finishRound() {
    const roundAccuracy = roundTotal > 0 ? roundCorrect / roundTotal : 0;
    const roundNumber = stats.roundsCompleted + 1;

    setStats((prev) => {
      const record: FlashcardRoundRecord = {
        round: roundNumber,
        correct: roundCorrect,
        total: roundTotal,
        accuracy: roundAccuracy,
        completedAt: new Date().toISOString()
      };
      const next = {
        ...prev,
        roundsCompleted: roundNumber,
        roundHistory: [...prev.roundHistory, record]
      };
      writeStats(next);
      return next;
    });

    setRoundDoneMessage(
      `Round ${roundNumber} complete: ${roundCorrect} of ${roundTotal} correct (${formatPercent(roundAccuracy)}).`
    );
    setFeedback(null);
    setHelpMode(null);
    setIndex(roundTotal);
  }

  function handlePick(category: TransitionCategory) {
    if (!currentCard || feedback) return;

    const correct = category === currentCard.category;
    setFeedback({
      picked: category,
      actual: currentCard.category,
      correct
    });
    persistAnswer(correct);
  }

  function handleContinue() {
    if (!feedback) return;

    const nextIndex = index + 1;
    if (nextIndex >= deck.length) {
      finishRound();
      return;
    }

    setIndex(nextIndex);
    setFeedback(null);
    setHelpMode(null);
  }

  function handleResetStats() {
    setStats(EMPTY_STATS);
    writeStats(EMPTY_STATS);
    startRound();
    setShowRoundLog(false);
  }

  function toggleHelp(mode: HelpMode) {
    setHelpMode((prev) => (prev === mode ? null : mode));
  }

  return (
    <div className="danielle-flashcards">
      <div className="danielle-flashcards__stats">
        <div className="danielle-flashcards__stat">
          <span className="danielle-flashcards__stat-label">Overall accuracy</span>
          <strong className="danielle-flashcards__stat-value">
            {stats.attempts === 0 ? "—" : formatPercent(cumulativeAccuracy)}
          </strong>
          <span className="danielle-flashcards__stat-sub">
            {stats.correct} of {stats.attempts} attempts
          </span>
        </div>
        <div className="danielle-flashcards__stat">
          <span className="danielle-flashcards__stat-label">Rounds completed</span>
          <strong className="danielle-flashcards__stat-value">{stats.roundsCompleted}</strong>
          <span className="danielle-flashcards__stat-sub">
            {stats.roundHistory.length > 0
              ? `Last round: ${formatPercent(stats.roundHistory[stats.roundHistory.length - 1].accuracy)}`
              : "No full rounds yet"}
          </span>
        </div>
        <div className="danielle-flashcards__stat">
          <span className="danielle-flashcards__stat-label">This round</span>
          <strong className="danielle-flashcards__stat-value">
            {roundDoneMessage ? "Done" : `${roundProgress} / ${roundTotal}`}
          </strong>
          <span className="danielle-flashcards__stat-sub">
            {roundDoneMessage ? `${roundCorrect} correct` : `${roundCorrect} correct so far`}
          </span>
        </div>
      </div>

      {stats.roundHistory.length > 0 && (
        <div className="danielle-flashcards__round-log">
          <button
            type="button"
            className="danielle-flashcards__round-log-toggle"
            onClick={() => setShowRoundLog((open) => !open)}
            aria-expanded={showRoundLog}
          >
            {showRoundLog ? "Hide round history" : "Show round history"}
            <span className="danielle-flashcards__round-log-count">
              {stats.roundHistory.length} rounds
            </span>
          </button>
          {showRoundLog && (
            <div className="danielle-flashcards__round-table-wrap">
              <table className="danielle-flashcards__round-table">
                <thead>
                  <tr>
                    <th>Round</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {roundHistoryDisplay.map((row) => (
                    <tr key={`${row.round}-${row.completedAt}`}>
                      <td>#{row.round}</td>
                      <td>{row.correct} / {row.total}</td>
                      <td>{formatPercent(row.accuracy)}</td>
                      <td>{formatRoundDate(row.completedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {goalMet ? (
        <div className="danielle-flashcards__goal-banner" role="status">
          You hit {formatPercent(TRANSITION_FLASHCARD_GOAL_ACCURACY)} accuracy across{" "}
          {stats.attempts} cards. Keep a few rounds going if you want, or move on to Homework
          Portal practice.
        </div>
      ) : (
        <p className="danielle-flashcards__goal-line">
          Pick the category for each transition. Goal: {formatPercent(TRANSITION_FLASHCARD_GOAL_ACCURACY)}{" "}
          overall accuracy after {TRANSITION_FLASHCARD_MIN_ATTEMPTS} attempts.
        </p>
      )}

      {roundDoneMessage && !currentCard ? (
        <div className="danielle-flashcards__round-done">
          <p>{roundDoneMessage}</p>
          <p className="danielle-flashcards__round-done-sub">
            Overall: {formatPercent(cumulativeAccuracy)} ({stats.correct} of {stats.attempts}).
          </p>
          <div className="danielle-flashcards__actions">
            <button type="button" className="danielle-flashcards__primary" onClick={startRound}>
              New round
            </button>
            <button type="button" className="danielle-flashcards__ghost" onClick={handleResetStats}>
              Reset all stats
            </button>
          </div>
        </div>
      ) : currentCard ? (
        <>
          <div className="danielle-flashcards__card">
            <p className="danielle-flashcards__card-label">What relationship does this signal?</p>
            <p className="danielle-flashcards__phrase">{currentCard.phrase}</p>
            <div className="danielle-flashcards__help-actions">
              <button
                type="button"
                className={`danielle-flashcards__help-btn${helpMode === "explain" ? " is-active" : ""}`}
                onClick={() => toggleHelp("explain")}
              >
                Explain
              </button>
              <button
                type="button"
                className={`danielle-flashcards__help-btn${helpMode === "example" ? " is-active" : ""}`}
                onClick={() => toggleHelp("example")}
              >
                Show me an example
              </button>
            </div>
          </div>

          {helpMode && (
            <div className="danielle-flashcards__help-panel">
              <p className="danielle-flashcards__help-label">
                {helpMode === "explain" ? "Why this category" : "Example in context"}
              </p>
              <p className="danielle-flashcards__help-text">
                {helpMode === "explain"
                  ? getFlashcardExplain(currentCard)
                  : getFlashcardExample(currentCard)}
              </p>
              {helpMode === "explain" && (
                <p className="danielle-flashcards__help-meta">
                  Category: {TRANSITION_CATEGORY_META[currentCard.category].label}
                </p>
              )}
            </div>
          )}

          <div className="danielle-flashcards__choices" role="group" aria-label="Transition categories">
            {CATEGORY_ORDER.map((category) => {
              const meta = TRANSITION_CATEGORY_META[category];
              const isPicked = feedback?.picked === category;
              const isAnswer = feedback?.actual === category;
              let stateClass = "";
              if (feedback) {
                if (isAnswer) stateClass = " is-correct";
                else if (isPicked) stateClass = " is-wrong";
                else stateClass = " is-dim";
              }

              return (
                <button
                  key={category}
                  type="button"
                  className={`danielle-flashcards__choice${stateClass}`}
                  onClick={() => handlePick(category)}
                  disabled={Boolean(feedback)}
                >
                  <span className="danielle-flashcards__choice-label">{meta.label}</span>
                  <span className="danielle-flashcards__choice-hint">{meta.hint}</span>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`danielle-flashcards__feedback${feedback.correct ? " is-correct" : " is-wrong"}`}
              role="status"
            >
              {feedback.correct ? (
                <p>
                  Correct. <strong>{currentCard.phrase}</strong> is{" "}
                  <strong>{TRANSITION_CATEGORY_META[feedback.actual].label}</strong>.
                </p>
              ) : (
                <p>
                  Not quite. <strong>{currentCard.phrase}</strong> is{" "}
                  <strong>{TRANSITION_CATEGORY_META[feedback.actual].label}</strong>, not{" "}
                  {TRANSITION_CATEGORY_META[feedback.picked].label}.
                </p>
              )}
              <div className="danielle-flashcards__feedback-help">
                <button
                  type="button"
                  className="danielle-flashcards__help-btn"
                  onClick={() => toggleHelp("explain")}
                >
                  Explain
                </button>
                <button
                  type="button"
                  className="danielle-flashcards__help-btn"
                  onClick={() => toggleHelp("example")}
                >
                  Show me an example
                </button>
              </div>
              <button type="button" className="danielle-flashcards__primary" onClick={handleContinue}>
                {index + 1 >= deck.length ? "Finish round" : "Next card"}
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
