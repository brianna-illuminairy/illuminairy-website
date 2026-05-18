# Consult → enroll playbook

*Human funnel after `intake_completed`. Marketing owns booked consult rate; founder owns close rate.*

## Pre-consult (automated)

| When | Action |
|------|--------|
| Immediate | Flow 01 — application received + schedule CTA |
| T-24h | Flow 02 — reminder; parent on call; bring recent score |

## On consult

1. Confirm fit using intake (grade, baseline, goals, study tools used)
2. Pillar B if they ask about guarantees ([sat-messaging-positioning.md](../../docs/sat-messaging-positioning.md))
3. List fit / school bands — honest: middle 50% ≠ accepted; 75th+ for typical apps
4. Only send `/enroll` after the call (Flow 03)

## Post-consult segments

| Outcome | Klaviyo tag | Action |
|---------|-------------|--------|
| Enrolled | `customer` | Stripe webhook; welcome (future) |
| Thinking | `opportunity` | Flow 03 + 48h tuition recap |
| Not a fit | `disqualified` | Kind close; no nurture spam |

## Disqualify signals

- Wrong exam window
- Parent won't join consult
- Won't acknowledge tuition + no score guarantee
- Student won't do weekly assigned work
