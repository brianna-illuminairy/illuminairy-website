export type PrepOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

export const PREP_OPTIONS: PrepOption[] = [
  {
    id: "prep_khan",
    label: "Khan Academy",
    ariaLabel: "Khan Academy"
  },
  {
    id: "prep_bluebook",
    label: "Bluebook",
    ariaLabel: "College Board Bluebook"
  },
  {
    id: "prep_youtube",
    label: "YouTube",
    ariaLabel: "YouTube"
  },
  {
    id: "prep_class",
    label: "Group class",
    ariaLabel: "Group class in person"
  },
  {
    id: "prep_app",
    label: "Different app or course",
    ariaLabel: "A different app or course"
  },
  {
    id: "prep_little_none",
    label: "Little / none",
    ariaLabel: "Little preparation or not sure how they prepared"
  }
];

export type PrepId = (typeof PREP_OPTIONS)[number]["id"];

const PREP_ID_SET = new Set<string>(PREP_OPTIONS.map((opt) => opt.id));

/** Map retired Step 5 ids from earlier funnel builds. */
const LEGACY_PREP_ID_MAP: Record<string, PrepId> = {
  prep_books: "prep_bluebook",
  prep_app_other: "prep_app",
  prep_own_nothing: "prep_little_none",
  prep_didnt_prepare: "prep_little_none",
  prep_not_sure: "prep_little_none"
};

/** Session may store legacy single-select string — normalize before use. */
export function normalizePrepMethods(value?: string | string[]): PrepId[] {
  const raw = Array.isArray(value) ? value : typeof value === "string" && value.length > 0 ? [value] : [];
  const migrated = raw
    .map((id) => LEGACY_PREP_ID_MAP[id] ?? id)
    .filter((id): id is PrepId => PREP_ID_SET.has(id));
  return Array.from(new Set(migrated));
}

/** Voice-aware labels for Step 5 (self vs parent). */
export function prepOptionsForTaker(testTaker?: string): PrepOption[] {
  const isSelf = testTaker === "test_taker_self";
  return PREP_OPTIONS.map((opt) => {
    if (opt.id === "prep_little_none") {
      return isSelf
        ? {
            ...opt,
            label: "Little / not sure",
            ariaLabel: "I did not prepare much or I am not sure how I prepared"
          }
        : opt;
    }
    return opt;
  });
}

export const PREP_SELF_STUDY_IDS = new Set<PrepId>([
  "prep_khan",
  "prep_bluebook",
  "prep_youtube",
  "prep_app"
]);
