# Georgia List Fit Check — product spec

**URL:** `/tools/georgia-list-fit`  
**Data:** [`lib/georgia-flagship-scores.ts`](../../lib/georgia-flagship-scores.ts)  
**Math:** [`lib/list-fit-check.ts`](../../lib/list-fit-check.ts)

## Purpose

Help Georgia parents see where a student's SAT sits vs **published middle-50% bands** for UGA, Georgia Tech, and Emory **submitters** — then drive **Apply for the August program** with honest education (not fake admit %).

## Middle 50% education (required)

- Middle 50% **≠ accepted** — describes submitters who enrolled with scores in that band
- In range often means **blend in** with many applicants
- For typical students (no standout hook): aim **75th percentile+** among submitters for competitive scores
- GPA/rigor largely set junior year; **SAT still movable** before August 22, 2026

## Banned

- "X% chance of admission"
- "Get into Tech/UGA/Emory"
- "We'll add N points" / "close the gap by August"

## Analytics

- `list_fit_started`, `list_fit_completed`, `list_fit_cta_apply`

## CTA

Primary → `/get-started?from=list-fit&sat_score={score}`
