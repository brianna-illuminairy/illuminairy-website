import {
  FUNNEL_CONTRAST_PANEL_PX,
  type PrepContrastPairImageSpec
} from "@/lib/sat-plan-funnel/prep-path-images";

const INT12_FORMAT_CONTRAST_SRC = "/satplan/int12/digital-vs-paper-prep.png";
const INT12_FORMAT_PAPER_SRC = "/satplan/int12/sat-paper-1979.png";
const INT12_FORMAT_DIGITAL_SRC = "/satplan/int12/sat-digital-2026.png";

/** Flip on when panel PNGs exist in public/satplan/int12/. */
export const INT12_FORMAT_CONTRAST_SHIPPED = true;

const INT12_FORMAT_CONTRAST_ALT =
  "Side-by-side comparison: 1979 paper SAT with pencil and test booklet versus today's digital SAT on a laptop with the Bluebook interface and embedded Desmos calculator.";

export type Int12FormatPanelSpec = {
  id: "paper" | "digital";
  src: string;
  label: string;
  width: number;
  height: number;
};

export function int12FormatContrastImageSpec(): PrepContrastPairImageSpec | null {
  if (!INT12_FORMAT_CONTRAST_SHIPPED) return null;
  return {
    src: INT12_FORMAT_CONTRAST_SRC,
    width: FUNNEL_CONTRAST_PANEL_PX.width,
    height: FUNNEL_CONTRAST_PANEL_PX.height,
    alt: INT12_FORMAT_CONTRAST_ALT
  };
}

export function int12FormatPanelSpecs(): Int12FormatPanelSpec[] | null {
  if (!INT12_FORMAT_CONTRAST_SHIPPED) return null;
  const { width, height } = FUNNEL_CONTRAST_PANEL_PX;
  const panelWidth = width / 2;
  return [
    {
      id: "paper",
      src: INT12_FORMAT_PAPER_SRC,
      label: "SAT · 1979",
      width: panelWidth,
      height
    },
    {
      id: "digital",
      src: INT12_FORMAT_DIGITAL_SRC,
      label: "SAT · 2026",
      width: panelWidth,
      height
    }
  ];
}

/** Preload on prior funnel steps (~2 screens before sat-changed). */
export function int12FormatPanelImageSrcs(): readonly string[] {
  const panels = int12FormatPanelSpecs();
  if (!panels) return [];
  return panels.map((panel) => panel.src);
}
