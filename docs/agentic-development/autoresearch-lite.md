# Engineering autoresearch (lite)

Adapted from [Karpathy’s autoresearch](https://github.com/karpathy/autoresearch): a fixed **evaluation gate** and a human **program** file, without an autonomous overnight runner.

## Immutable layer (do not let agents edit)

| File | Role |
|------|------|
| [`scripts/agent-verify.mjs`](../../scripts/agent-verify.mjs) | Runs `lint` + `build`; exit code is pass/fail |
| [`lib/analytics-events.ts`](../../lib/analytics-events.ts) | Event name constants for growth experiments |

## Sandbox (agents may edit with spec approval)

- `app/`, `components/`, most of `lib/` — except product facts in `lib/site.ts` unless the human changes them.

## Human program

[`agent/program.md`](../../agent/program.md) lists engineering research directions (e.g. “add contact rate limiting”). Agents **read** it; they do not edit it without explicit human approval.

## Metric

**Primary metric for engineering work:** `npm run agent:verify` passes.

Do not confuse this with growth funnel metrics — see [growth-autoresearch.md](growth-autoresearch.md).

## Loop (manual)

1. Human updates `agent/program.md` or a spec with a hypothesis.
2. Agent implements one change.
3. Agent runs `npm run agent:verify`.
4. If pass → commit / mark PLAN task done. If fail → revert or fix.

We explicitly **do not** run unattended multi-hour agent loops in this repo.
