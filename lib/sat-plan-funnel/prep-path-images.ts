import type { Int8PrepPathTriptychFocus } from "@/lib/sat-plan-funnel/int8-prep-comparison-copy";

/** Display column is 360px; card padding ≈ 20px → ~340px wide on screen. */
export const FUNNEL_CONTRAST_DISPLAY_WIDTH = 340;

/**
 * Recommended export size @2x for a single contrast panel (4:3).
 * One PNG per beat — drop in public/satplan/int8/ with the filenames below.
 */
export const FUNNEL_CONTRAST_PANEL_PX = {
  width: 680,
  height: 510
} as const;

/**
 * Recommended export size @2x for the full three-panel strip (only used on combined stub).
 */
export const FUNNEL_CONTRAST_TRIPTYCH_PX = {
  width: 1020,
  height: 680
} as const;

const TRIPTYCH_SRC_DEFAULT = "/satplan/int8/prep-paths-triptych.png";
const TRIPTYCH_SRC_DAUGHTER = "/satplan/int8/prep-paths-triptych-daughter.png";

const PANEL_SRC: Record<
  Exclude<Int8PrepPathTriptychFocus, "full">,
  string
> = {
  home: "/satplan/int8/prep-path-home.png",
  crowd: "/satplan/int8/prep-path-crowd.png",
  mentorship: "/satplan/int8/prep-path-mentorship.png"
};

const PANEL_SRC_DAUGHTER: Record<
  Exclude<Int8PrepPathTriptychFocus, "full">,
  string
> = {
  home: "/satplan/int8/prep-path-home-daughter.png",
  crowd: "/satplan/int8/prep-path-crowd-daughter.png",
  mentorship: "/satplan/int8/prep-path-mentorship-daughter.png"
};

function usesGirlPrepPathVisual(testTaker?: string): boolean {
  // Daughter + student self ("Me") — most SAT tutoring demand skews female.
  return (
    testTaker === "test_taker_daughter" || testTaker === "test_taker_self"
  );
}

function triptychSrc(testTaker?: string): string {
  if (usesGirlPrepPathVisual(testTaker)) {
    return TRIPTYCH_SRC_DAUGHTER;
  }
  return TRIPTYCH_SRC_DEFAULT;
}

function panelSrc(
  focus: Exclude<Int8PrepPathTriptychFocus, "full">,
  testTaker?: string
): string {
  if (usesGirlPrepPathVisual(testTaker)) {
    return PANEL_SRC_DAUGHTER[focus];
  }
  return PANEL_SRC[focus];
}

/**
 * When true, each focus loads its own PNG (recommended).
 * When false, crops the shared triptych strip (legacy fallback).
 */
export const USE_DEDICATED_PREP_PATH_PANELS = false;

export type PrepPathImageSpec = {
  src: string;
  width: number;
  height: number;
  cropFromTriptych: boolean;
  objectPosition: string;
};

export function prepPathImageSpec(
  focus: Int8PrepPathTriptychFocus,
  testTaker?: string
): PrepPathImageSpec {
  const triptych = triptychSrc(testTaker);

  if (focus === "full") {
    return {
      src: triptych,
      width: FUNNEL_CONTRAST_TRIPTYCH_PX.width,
      height: FUNNEL_CONTRAST_TRIPTYCH_PX.height,
      cropFromTriptych: false,
      objectPosition: "center"
    };
  }

  if (USE_DEDICATED_PREP_PATH_PANELS) {
    return {
      src: panelSrc(focus, testTaker),
      width: FUNNEL_CONTRAST_PANEL_PX.width,
      height: FUNNEL_CONTRAST_PANEL_PX.height,
      cropFromTriptych: false,
      objectPosition: "center"
    };
  }

  const objectPosition: Record<
    Exclude<Int8PrepPathTriptychFocus, "full">,
    string
  > = {
    home: "16.67% center",
    crowd: "50% center",
    mentorship: "83.33% center"
  };

  return {
    src: triptych,
    width: FUNNEL_CONTRAST_TRIPTYCH_PX.width,
    height: FUNNEL_CONTRAST_TRIPTYCH_PX.height,
    cropFromTriptych: true,
    objectPosition: objectPosition[focus]
  };
}
