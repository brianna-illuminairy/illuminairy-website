# Funnel Completeness Baseline (2026-06-08)

Window: last 24 hours (`touch_events`)  
Thresholds: warning <98%, critical <95% (minimum sample: 20)

## Snapshot

- `ALL`: 3,161 events
  - `utm_content`: 20.1%
  - `hero_hook`: 6.6%
  - `qWho`: 77.0%
- `funnel_cta_click` (client, n=56)
  - `utm_content`: 92.9%
  - `hero_hook`: 60.7%
- `parent_confirmed` (client, n=109)
  - `utm_content`: 29.4%
  - `hero_hook`: 21.1%
  - `qWho`: 100.0%
- `quiz_started` (client, n=285)
  - `utm_content`: 17.2%
  - `hero_hook`: 10.5%
- `quiz_step_view` (client, n=2,685)
  - `utm_content`: 17.8%
  - `hero_hook`: 4.2%
  - `qWho`: 86.0%

## Visitor column backfill snapshot (30d)

- `total_visitors`: 554
- `first_utm_content`: 332 (59.9%)
- `first_hero_hook`: 4 (0.7%)
- `quiz_who`: 180 (32.5%)

## Interpretation

- Migration + indexes are live, but historical completeness is still low, especially for `hero_hook`.
- `qWho` appears healthy where it is expected (`parent_confirmed`), and is intentionally absent on early events.
- `funnel_cta_click` has strong `utm_content` coverage, but `hero_hook` still needs improvement.

## Actions queued

1. Continue canonical payload fan-out from attribution to touch payload for `hero_hook` and `landing_page`.
2. Watch `funnel_cta_click` + `parent_confirmed` first; they are the cleanest operational canaries.
3. Use `npm run funnel:completeness` as the release gate for this stream.
