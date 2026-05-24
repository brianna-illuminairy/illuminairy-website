import {
  FUNNEL_CONTRAST_PANEL_PX,
  type PrepContrastPairImageSpec
} from "@/lib/sat-plan-funnel/prep-path-images";

const INT12_FORMAT_CONTRAST_SRC = "/satplan/int12/digital-vs-paper-prep.png";

/** Flip on when digital-vs-paper-prep.png exists in public/satplan/int12/. */
export const INT12_FORMAT_CONTRAST_SHIPPED = true;

const INT12_FORMAT_CONTRAST_ALT =
  "Side-by-side comparison: SAT in 1979 with pencil, bubble sheet, and calculator versus SAT in 2026 on a laptop with the digital Bluebook test interface.";

export function int12FormatContrastImageSpec(): PrepContrastPairImageSpec | null {
  if (!INT12_FORMAT_CONTRAST_SHIPPED) return null;
  return {
    src: INT12_FORMAT_CONTRAST_SRC,
    width: FUNNEL_CONTRAST_PANEL_PX.width,
    height: FUNNEL_CONTRAST_PANEL_PX.height,
    alt: INT12_FORMAT_CONTRAST_ALT
  };
}
