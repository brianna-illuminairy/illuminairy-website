"use client";

import { useCallback, useEffect, useState } from "react";

/** True when primary input is touch / no fine hover (phones, most tablets). */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return coarse;
}

export type ChartHoverState<T extends string> = {
  /** Active item id (hover on desktop, pinned on touch). */
  activeId: T | null;
  activate: (id: T | null) => void;
  clear: () => void;
  isActive: (id: T) => boolean;
  isDimmed: (id: T) => boolean;
  coarse: boolean;
};

/**
 * Desktop: hover sets active, mouse leave clears.
 * Touch: tap toggles pin; tap same item or container leave clears pin.
 */
export function useChartHover<T extends string>(): ChartHoverState<T> {
  const coarse = useCoarsePointer();
  const [hoverId, setHoverId] = useState<T | null>(null);
  const [pinnedId, setPinnedId] = useState<T | null>(null);

  const activeId = coarse ? pinnedId : hoverId;

  const activate = useCallback(
    (id: T | null) => {
      if (coarse) {
        setPinnedId((prev) => (id != null && prev === id ? null : id));
        setHoverId(null);
        return;
      }
      setHoverId(id);
    },
    [coarse]
  );

  const clear = useCallback(() => {
    if (coarse) {
      setPinnedId(null);
    } else {
      setHoverId(null);
    }
  }, [coarse]);

  const isActive = useCallback((id: T) => activeId === id, [activeId]);
  const isDimmed = useCallback(
    (id: T) => activeId != null && activeId !== id,
    [activeId]
  );

  return { activeId, activate, clear, isActive, isDimmed, coarse };
}

export function dimOpacity(dimmed: boolean): number {
  return dimmed ? 0.34 : 1;
}
