/** SSOT for funnel-css-contract-guard.mjs */

export const FUNNEL_LAYOUT_FILES = [
  "app/quiz/layout.tsx",
  "app/quiz-b/layout.tsx",
  "app/quiz-c/layout.tsx",
];

export const FUNNEL_DEFERRED_CSS_GLOBS = [
  "app/quiz-b/quiz-b-deferred.css",
];

export const LAYOUT_CSS_IMPORT = "funnel-responsive.css";

export const FORBIDDEN_IN_DEFERRED = [
  "funnel-responsive.css",
  "funnel-shell.css",
  "funnel-column.css",
  "funnel-entry-ssr.css",
  "FUNNEL-MOBILE-SHELL-START",
];

export const FUNNEL_RESPONSIVE_IMPORTS = ["./funnel-shell.css", "./funnel-column.css"];

export const FORBIDDEN_IN_CRITICAL = [
  "app/funnel-shell.css",
  "app/funnel-column.css",
  "app/funnel-entry-ssr.css",
  "app/funnel-responsive.css",
];
