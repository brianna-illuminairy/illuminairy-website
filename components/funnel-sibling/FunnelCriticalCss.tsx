import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PLAN_B_CRITICAL_CSS_FILES } from "@/lib/funnel-sibling/critical-css-files";

function readCriticalCssConcat(files: readonly string[]): string {
  return files
    .map((relativePath) => readFileSync(join(process.cwd(), relativePath), "utf8"))
    .join("\n");
}

/** Plan B only — entry chrome inlined at SSR. Layout: funnel-responsive.css (sync). */
export function FunnelCriticalCss() {
  const css = readCriticalCssConcat(PLAN_B_CRITICAL_CSS_FILES);
  return <style dangerouslySetInnerHTML={{ __html: css }} data-perf="plan-b-critical" />;
}

/** @deprecated Use FunnelCriticalCss — kept for cold-funnel imports. */
export function PlanBCriticalCss() {
  return <FunnelCriticalCss />;
}
