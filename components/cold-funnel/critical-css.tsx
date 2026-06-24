import { readFileSync } from "node:fs";
import { join } from "node:path";

function readCriticalCss(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

export function PlanBCriticalCss() {
  const css = readCriticalCss("app/quiz-b/quiz-b-critical.css");
  return <style dangerouslySetInnerHTML={{ __html: css }} data-perf="plan-b-critical" />;
}

export function AdLpCriticalCss() {
  const css = readCriticalCss("app/sat-plan-builder/landing-critical.css");
  return <style dangerouslySetInnerHTML={{ __html: css }} data-perf="ad-lp-critical" />;
}
