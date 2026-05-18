#!/usr/bin/env node
/**
 * Immutable engineering gate for agent work.
 * Agents must not edit this file. See docs/agentic-development/autoresearch-lite.md
 */

import { spawnSync } from "node:child_process";

const json = process.argv.includes("--json");

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    stdio: json ? "pipe" : "inherit",
    shell: false,
    encoding: "utf8"
  });
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? ""
  };
}

const steps = [
  { name: "lint", ...run("npm", ["run", "lint"]) },
  { name: "build", ...run("npm", ["run", "build"]) }
];

const passed = steps.every((s) => s.ok);

if (json) {
  console.log(
    JSON.stringify({
      passed,
      steps: steps.map(({ name, ok, status }) => ({ name, ok, status }))
    })
  );
} else {
  if (passed) {
    console.log("agent:verify passed (lint + build)");
  } else {
    console.error("agent:verify failed");
    for (const step of steps) {
      if (!step.ok) {
        console.error(`  ✗ ${step.name}`);
      }
    }
  }
}

process.exit(passed ? 0 : 1);
