/** Plan B only — inline at SSR. Layout shell/column: funnel-responsive.css (sync). */
export const PLAN_B_CRITICAL_CSS_FILES = [
  "app/aurora-brand.css",
  "app/quiz-globals.css",
  "app/quiz-b/quiz-b-core-chrome.css",
  "app/quiz-b/quiz-b-entry-critical.css",
] as const;

/** Never inline layout CSS — always sync-import funnel-responsive.css in funnel layouts. */
export const FUNNEL_LAYOUT_CSS_FORBIDDEN_IN_CRITICAL = [
  "app/funnel-shell.css",
  "app/funnel-column.css",
  "app/funnel-entry-ssr.css",
  "app/funnel-responsive.css",
] as const;
