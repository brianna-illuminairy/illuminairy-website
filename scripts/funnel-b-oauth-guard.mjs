#!/usr/bin/env node
/**
 * Plan Builder B OAuth guard — prevent fragile patterns from regressing.
 * Run: npm run funnel:b-oauth-guard
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const failures = [];

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function fail(msg) {
  failures.push(msg);
}

const page = read("app/quiz-b/page.tsx");
if (page.includes("handlePlanBuilderOAuthReturn")) {
  fail("app/quiz-b/page.tsx must not call handlePlanBuilderOAuthReturn (use route handler only)");
}
if (/cookies\(\)[\s\S]*?\.set\(/.test(page)) {
  fail("app/quiz-b/page.tsx must not set cookies in a Server Component");
}

const completeRoute = read("app/api/funnel-b/oauth/complete/route.ts");
if (!completeRoute.includes("export async function GET")) {
  fail("missing GET handler at app/api/funnel-b/oauth/complete/route.ts");
}
if (!completeRoute.includes("try {")) {
  fail("oauth/complete route must wrap logic in try/catch (never throw to error page)");
}

const oauthComplete = read("lib/quiz-funnel-b/oauth-complete.ts");
if (!oauthComplete.includes("/api/funnel-b/oauth/complete")) {
  fail("lib/quiz-funnel-b/oauth-complete.ts must define OAUTH_COMPLETE_PATH");
}

const clientRoot = read("app/quiz-b/QuizClientRoot.tsx");
if (!clientRoot.includes("useSyncOAuthEmail")) {
  fail("QuizClientRoot must mount useSyncOAuthEmail for session fallback");
}

const sync = read("lib/quiz-funnel-b/oauth-email-sync.ts");
if (!sync.includes("fetchOAuthSessionEmail")) {
  fail("oauth-email-sync.ts must fetch session email as SSOT fallback");
}

if (failures.length) {
  console.error("funnel:b-oauth-guard FAILED\n");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("funnel:b-oauth-guard OK");
