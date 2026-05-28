export type WrongOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

/**
 * Six-tile multiselect on `?step=wrong` — 2×3 grid order (row-major):
 * Math | Reading & Writing
 * Ran out of time | Test Anxiety
 * Focus or Stamina | Lack of preparation
 */
export const WRONG_TILE_OPTIONS: WrongOption[] = [
  {
    id: "wrong_cat_math",
    label: "Math",
    ariaLabel: "Struggled with math"
  },
  {
    id: "wrong_cat_reading",
    label: "Reading & Writing",
    ariaLabel: "Struggled with reading and writing"
  },
  {
    id: "wrong_cat_time",
    label: "Ran out of time",
    ariaLabel: "Ran out of time on the test"
  },
  {
    id: "wrong_cat_anxiety",
    label: "Test Anxiety",
    ariaLabel: "Test anxiety"
  },
  {
    id: "wrong_cat_focus",
    label: "Focus or Stamina",
    ariaLabel: "Focus or stamina during the test"
  },
  {
    id: "wrong_cat_prep",
    label: "Lack of preparation",
    ariaLabel: "Lack of preparation or practice"
  }
];

export type WrongCategory = {
  id: string;
  label: string;
  options: WrongOption[];
};

export const WRONG_CATEGORIES: WrongCategory[] = [
  {
    id: "time",
    label: "Time",
    options: [
      {
        id: "wrong_time_ran_out",
        label: "Ran out of time",
        ariaLabel: "Ran out of time on the test"
      },
      {
        id: "wrong_time_rushed",
        label: "Rushed and guessed at the end",
        ariaLabel: "Rushed and guessed at the end"
      },
      {
        id: "wrong_time_stuck",
        label: "Got stuck on hard questions too long",
        ariaLabel: "Got stuck on hard questions too long"
      }
    ]
  },
  {
    id: "focus",
    label: "Focus",
    options: [
      {
        id: "wrong_focus_lost",
        label: "Lost focus during the test",
        ariaLabel: "Lost focus during the test"
      },
      {
        id: "wrong_focus_exhausted",
        label: "Mentally exhausted before it was over",
        ariaLabel: "Mentally exhausted before it was over"
      }
    ]
  },
  {
    id: "anxiety",
    label: "Anxiety",
    options: [
      {
        id: "wrong_anxiety_froze",
        label: "Froze or panicked",
        ariaLabel: "Froze or panicked on test day"
      },
      {
        id: "wrong_anxiety_second_guess",
        label: "Second-guessed answers",
        ariaLabel: "Second-guessed answers"
      },
      {
        id: "wrong_anxiety_couldnt_perform",
        label: "Knows the material but couldn't perform",
        ariaLabel: "Knows the material but could not perform on test day"
      }
    ]
  },
  {
    id: "content",
    label: "Content",
    options: [
      {
        id: "wrong_content_math",
        label: "Struggled with math topics",
        ariaLabel: "Struggled with math topics"
      },
      {
        id: "wrong_content_reading",
        label: "Struggled with reading passages",
        ariaLabel: "Struggled with reading passages"
      },
      {
        id: "wrong_content_grammar",
        label: "Struggled with grammar questions",
        ariaLabel: "Struggled with grammar questions"
      },
      {
        id: "wrong_content_wording",
        label: "Questions worded differently than school",
        ariaLabel: "Questions worded differently than school"
      }
    ]
  },
  {
    id: "prep",
    label: "Prep",
    options: [
      {
        id: "wrong_prep_no_full_tests",
        label: "Didn't take full-length practice tests",
        ariaLabel: "Did not take full-length practice tests"
      },
      {
        id: "wrong_prep_cramming",
        label: "Only studied a few days/weekends",
        ariaLabel: "Only studied a few days or weekends"
      },
      {
        id: "wrong_prep_unprepared",
        label: "Didn't know what to expect",
        ariaLabel: "Did not know what to expect on test day"
      }
    ]
  }
];

export const ALL_WRONG_OPTION_IDS = WRONG_CATEGORIES.flatMap((cat) =>
  cat.options.map((opt) => opt.id)
);

const WRONG_LABEL_MAP = new Map<string, string>([
  ...WRONG_TILE_OPTIONS.map((row) => [row.id, row.label] as const),
  ...WRONG_CATEGORIES.flatMap((cat) =>
    cat.options.map((opt) => [opt.id, opt.label] as const)
  )
]);

export function wrongReasonLabels(ids?: string[]): string | null {
  if (!ids?.length) return null;
  return ids.map((id) => WRONG_LABEL_MAP.get(id)).filter(Boolean).join(", ") || null;
}

/** INT7 / interstitials — coarse tile id or legacy granular id. */
export function wrongReasonMatches(
  ids: string[] | undefined,
  prefix: "time" | "focus" | "anxiety" | "math" | "reading" | "prep" | "content"
): boolean {
  if (!ids?.length) return false;
  if (prefix === "content") {
    return ids.some(
      (id) =>
        id.startsWith("wrong_content_") ||
        id === "wrong_cat_math" ||
        id === "wrong_cat_reading"
    );
  }
  return ids.some(
    (id) => id.startsWith(`wrong_${prefix}_`) || id === `wrong_cat_${prefix}`
  );
}

/** Tile order for INT8 intro — pacing and mindset before content buckets. */
const STRUGGLE_TILE_PRIORITY = [
  "wrong_cat_anxiety",
  "wrong_cat_time",
  "wrong_cat_prep",
  "wrong_cat_math",
  "wrong_cat_reading",
  "wrong_cat_focus"
] as const;

/** Mid-sentence phrasing — not UI tile title case (e.g. "running out of time", not "Ran out of time"). */
const STRUGGLE_PROSE_PHRASE: Record<(typeof STRUGGLE_TILE_PRIORITY)[number], string> = {
  wrong_cat_anxiety: "test anxiety",
  wrong_cat_time: "running out of time",
  wrong_cat_prep: "preparation",
  wrong_cat_math: "math",
  wrong_cat_reading: "reading and writing",
  wrong_cat_focus: "focus and stamina"
};

function joinStruggleLabels(labels: string[]): string {
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

function struggleTileMatches(
  ids: string[],
  tileId: (typeof STRUGGLE_TILE_PRIORITY)[number]
): boolean {
  switch (tileId) {
    case "wrong_cat_math":
      return (
        ids.includes("wrong_cat_math") || ids.includes("wrong_content_math")
      );
    case "wrong_cat_reading":
      return (
        ids.includes("wrong_cat_reading") ||
        ids.some(
          (id) =>
            id === "wrong_content_reading" ||
            id === "wrong_content_grammar" ||
            id === "wrong_content_wording"
        )
      );
    default: {
      const prefix = tileId.replace("wrong_cat_", "") as
        | "time"
        | "focus"
        | "anxiety"
        | "prep";
      return wrongReasonMatches(ids, prefix);
    }
  }
}

/**
 * Human-readable struggle list from `wrong` step — prose phrases for mid-sentence use.
 * Caps at `maxItems` and appends ", and more" when truncated.
 */
export function formatWrongStruggleLabels(
  ids?: string[],
  maxItems = 3
): string | null {
  if (!ids?.length) return null;

  const labels: string[] = [];
  for (const tileId of STRUGGLE_TILE_PRIORITY) {
    if (!struggleTileMatches(ids, tileId)) continue;
    labels.push(STRUGGLE_PROSE_PHRASE[tileId]);
  }

  if (!labels.length) return null;

  const capped = labels.slice(0, maxItems);
  const list = joinStruggleLabels(capped);
  if (labels.length > maxItems) {
    return `${list}, and more`;
  }
  return list;
}
