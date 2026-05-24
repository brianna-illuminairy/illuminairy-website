"use client";

import { useCallback, useRef, useState } from "react";
import { buildSlotSpinSequence, getSlotStepDelayMs } from "@/lib/hero-search-outcomes";

const SLOT_IN_MS = 520;
const MATCH_HOLD_MS = 1400;

export type SlotSpinState = {
  phrase: string;
  spinning: boolean;
  /** Brief moment when the reel clicks into the final symbol */
  slotIn: boolean;
  /** Persistent winner glow until the next spin */
  won: boolean;
};

const idleState = (phrase: string): SlotSpinState => ({
  phrase,
  spinning: false,
  slotIn: false,
  won: false
});

export async function runSlotSpinAnimation(params: {
  items: readonly string[];
  targetIndex: number;
  mismatchPool: readonly string[];
  animate: boolean;
  onUpdate: (state: SlotSpinState) => void;
  runIdRef: { current: number };
}): Promise<void> {
  const { items, targetIndex, mismatchPool, animate, onUpdate, runIdRef } = params;
  const target = items[targetIndex] ?? items[0] ?? "";
  const runId = ++runIdRef.current;

  if (!animate) {
    onUpdate({ phrase: target, spinning: false, slotIn: true, won: false });
    await new Promise((r) => setTimeout(r, SLOT_IN_MS));
    onUpdate({ phrase: target, spinning: false, slotIn: false, won: true });
    return;
  }

  const sequence = buildSlotSpinSequence({
    outcomes: items,
    target,
    mismatchPool
  });

  onUpdate({ phrase: sequence[0] ?? target, spinning: true, slotIn: false, won: false });

  await new Promise<void>((resolve) => {
    let step = 0;
    const timeouts: number[] = [];

    const clearTimeouts = () => {
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.length = 0;
    };

    const tick = () => {
      if (runIdRef.current !== runId) {
        clearTimeouts();
        resolve();
        return;
      }

      if (step >= sequence.length) {
        onUpdate({ phrase: target, spinning: false, slotIn: true, won: false });
        timeouts.push(
          window.setTimeout(() => {
            if (runIdRef.current !== runId) {
              resolve();
              return;
            }
            onUpdate({ phrase: target, spinning: false, slotIn: false, won: true });
            timeouts.push(
              window.setTimeout(() => {
                resolve();
              }, MATCH_HOLD_MS)
            );
          }, SLOT_IN_MS)
        );
        return;
      }

      onUpdate({
        phrase: sequence[step] ?? target,
        spinning: step < sequence.length - 1,
        slotIn: false,
        won: false
      });
      const delay = getSlotStepDelayMs(step, sequence.length);
      step += 1;
      timeouts.push(window.setTimeout(tick, delay));
    };

    tick();
  });
}

export function useSlotSpin(
  items: readonly string[],
  mismatchPool: readonly string[],
  animate: boolean
) {
  const [phrase, setPhrase] = useState(items[0] ?? "");
  const [spinning, setSpinning] = useState(false);
  const [slotIn, setSlotIn] = useState(false);
  const [won, setWon] = useState(false);
  const runIdRef = useRef(0);

  const applyState = useCallback((state: SlotSpinState) => {
    setPhrase(state.phrase);
    setSpinning(state.spinning);
    setSlotIn(state.slotIn);
    setWon(state.won);
  }, []);

  const spinToIndex = useCallback(
    (targetIndex: number) =>
      runSlotSpinAnimation({
        items,
        targetIndex,
        mismatchPool,
        animate,
        onUpdate: applyState,
        runIdRef
      }),
    [animate, applyState, items, mismatchPool]
  );

  const cancel = useCallback(() => {
    runIdRef.current += 1;
    const phraseNow = items[0] ?? "";
    setSpinning(false);
    setSlotIn(false);
    setWon(false);
    setPhrase(phraseNow);
  }, [items]);

  const applySpinState = useCallback((state: SlotSpinState) => {
    setPhrase(state.phrase);
    setSpinning(state.spinning);
    setSlotIn(state.slotIn);
    setWon(state.won);
  }, []);

  const resetDisplay = useCallback(
    (nextPhrase: string) => {
      applyState(idleState(nextPhrase));
    },
    [applyState]
  );

  return {
    phrase,
    spinning,
    slotIn,
    won,
    spinToIndex,
    cancel,
    resetDisplay,
    applySpinState
  };
}
