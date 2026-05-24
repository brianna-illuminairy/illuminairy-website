"use client";

import { useCallback, useState, type PointerEvent } from "react";
import {
  famousMentorshipPairs,
  mentorshipRevealCopy
} from "@/lib/sat-plan-funnel/mentorship-pairs";

type Int8MentorshipSplashProps = {
  onRevealedChange?: (revealed: boolean) => void;
};

export function Int8MentorshipSplash({ onRevealedChange }: Int8MentorshipSplashProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const pair = famousMentorshipPairs[index];
  const atLastPair = index === famousMentorshipPairs.length - 1;

  const markRevealed = useCallback(() => {
    setRevealed(true);
    onRevealedChange?.(true);
  }, [onRevealedChange]);

  const handleAdvance = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (revealed) return;
    if (atLastPair) {
      markRevealed();
      return;
    }
    setIndex((current) => current + 1);
  };

  const handleDotSelect = (dotIndex: number) => {
    if (revealed) return;
    setIndex(dotIndex);
  };

  if (revealed) {
    return (
      <div className="int8-mentorship-splash int8-mentorship-splash--revealed">
        <div className="quiz-step-trust-card int8-mentorship-splash__reveal">
          <p className="int8-mentorship-splash__question">
            {mentorshipRevealCopy.question}
          </p>
          <p className="int8-mentorship-splash__answer">
            {mentorshipRevealCopy.answer}
          </p>
          <p className="int8-mentorship-splash__bridge">
            {mentorshipRevealCopy.bridge}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="int8-mentorship-splash">
      <p className="quiz-step-eyebrow">Famous pairs</p>

      <button
        type="button"
        className="int8-mentorship-splash__card quiz-step-trust-card"
        onPointerUp={handleAdvance}
        aria-label={
          atLastPair
            ? `Pair ${index + 1} of ${famousMentorshipPairs.length}. Tap to reveal what they have in common.`
            : `Pair ${index + 1} of ${famousMentorshipPairs.length}. Tap for next pair.`
        }
      >
        <div className="int8-mentorship-splash__names">
          <span className="int8-mentorship-splash__name">{pair.mentor}</span>
          <span className="int8-mentorship-splash__amp" aria-hidden>
            &
          </span>
          <span className="int8-mentorship-splash__name int8-mentorship-splash__name--mentee">
            {pair.mentee}
          </span>
        </div>
        <p className="int8-mentorship-splash__detail">{pair.detail}</p>
        <p className="int8-mentorship-splash__tap">
          {atLastPair ? "Tap to reveal the pattern" : "Tap for next pair"}
        </p>
      </button>

      <div
        className="int8-mentorship-splash__dots"
        role="tablist"
        aria-label="Mentorship pairs"
      >
        {famousMentorshipPairs.map((item, dotIndex) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={dotIndex === index}
            aria-label={`Pair ${dotIndex + 1} of ${famousMentorshipPairs.length}`}
            className={[
              "int8-mentorship-splash__dot",
              dotIndex === index ? "int8-mentorship-splash__dot--active" : "",
              dotIndex < index ? "int8-mentorship-splash__dot--seen" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            onPointerUp={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleDotSelect(dotIndex);
            }}
          />
        ))}
      </div>
    </div>
  );
}
