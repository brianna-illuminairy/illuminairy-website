import { readFileSync } from "node:fs";
import { join } from "node:path";

const PLAN_B_CRITICAL_FILES = [
  "app/aurora-brand.css",
  "app/quiz-globals.css",
  "app/funnel-shell.css",
  "app/quiz-b/quiz-b-core-chrome.css",
  "app/quiz-b/quiz-b-entry-critical.css",
] as const;

function readCriticalCssConcat(files: readonly string[]): string {
  return files
    .map((relativePath) => readFileSync(join(process.cwd(), relativePath), "utf8"))
    .join("\n");
}

export function PlanBCriticalCss() {
  const css = readCriticalCssConcat(PLAN_B_CRITICAL_FILES);
  return <style dangerouslySetInnerHTML={{ __html: css }} data-perf="plan-b-critical" />;
}
