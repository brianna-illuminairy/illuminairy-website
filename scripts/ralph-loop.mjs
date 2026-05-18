#!/usr/bin/env node
/**
 * Ralph loop helper — parse PLAN.md and print next-task prompts.
 * See docs/agentic-development/ralph-loop.md
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const planPath = join(root, "specs/ralph/PLAN.md");
const activePath = join(root, "specs/ACTIVE.md");

const TASK_RE = /^- \[([ xX])\] (.+)$/;

function readPlan() {
  return readFileSync(planPath, "utf8");
}

function readActive() {
  try {
    const raw = readFileSync(activePath, "utf8").trim();
    if (!raw || raw === "(none)") {
      return null;
    }
    return raw;
  } catch {
    return null;
  }
}

function parseTasks(content) {
  const tasks = [];
  for (const line of content.split("\n")) {
    const m = line.match(TASK_RE);
    if (m) {
      tasks.push({
        done: m[1].toLowerCase() === "x",
        title: m[2].trim()
      });
    }
  }
  return tasks;
}

function cmdStatus() {
  const tasks = parseTasks(readPlan());
  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  console.log(`Ralph PLAN: ${done.length} done, ${open.length} open\n`);

  if (open.length === 0) {
    console.log("No open tasks. Add `- [ ] …` lines to specs/ralph/PLAN.md");
    return;
  }

  console.log("Next task:");
  console.log(`  ${open[0].title}\n`);

  for (const t of open) {
    console.log(`  [ ] ${t.title}`);
  }
}

function cmdNext() {
  const tasks = parseTasks(readPlan());
  const next = tasks.find((t) => !t.done);

  if (!next) {
    console.log("RALPH_DONE — no open tasks in specs/ralph/PLAN.md");
    return;
  }

  const active = readActive();
  const activeLine = active
    ? `Active spec: ${active}\n`
    : "Active spec: (none) — set specs/ACTIVE.md if needed.\n";

  const prompt = `${activeLine}
Ralph iteration — ONE task only:

**Task:** ${next.title}

**Instructions:**
1. Read AGENTS.md, memory-bank/activeContext.md, and the active spec if set.
2. Implement only this task. No drive-by refactors.
3. Run: npm run agent:verify
4. If pass: mark this task \`- [x]\` in specs/ralph/PLAN.md, update memory-bank if meaningful.
5. Reply with RALPH_DONE or RALPH_BLOCKED (with reason in PLAN).

Do not start the next PLAN task in this session.
`;

  console.log(prompt);
}

const sub = process.argv[2] ?? "status";

if (sub === "status") {
  cmdStatus();
} else if (sub === "next") {
  cmdNext();
} else {
  console.error("Usage: node scripts/ralph-loop.mjs [status|next]");
  process.exit(1);
}
