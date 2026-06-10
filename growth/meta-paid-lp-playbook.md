# Meta paid → illuminairy.com (primary traffic)

**Most ad sets are national/broad** — not geo. Personalization comes from **creative angle** (`utm_content`), not `?metro=`.

All prospecting lands on **`https://illuminairy.com/sat-plan-builder`** (hero + trust bar + `/plan` CTA).

Live per-creative URLs: `npm run marketing:ad-urls` (SSOT: `lib/marketing/meta-live-creatives.ts`).

Organic / brand traffic may still use **`https://illuminairy.com/`** — do not point paid cold ads at `/plan?step=…`.

---

## LP behavior (code)

| Signal | Effect |
|--------|--------|
| `fbclid` or `utm_source=facebook` | Hero-only layout immediately (no PostHog wait) |
| `utm_content=script_5` | Hero headline matches Icon script angle |
| `?hook=gpa` | Explicit headline override (wins over UTM) |
| `?metro=atlanta` | **Optional** — local schools first + geo trust layout |
| No metro | **National** — score ticker first, school marquee, default hero |

---

## Default ad URL (national — live v4 creatives)

Use per-creative URLs from `npm run marketing:ad-urls`. Example (ad1 / script_5):

```
https://illuminairy.com/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_concerned_mom_cold_test&utm_content=script_5&utm_term=broad_moms_35_58&hook=gap
```

| Creative | `utm_content` | LP hero hook |
|----------|---------------|--------------|
| Script 1 · GPA + AP | `script_1` | `gpa` |
| Script 2 · AP surprise | `script_2` | `gpa` |
| Script 3 · 2+ SATs, apps | `script_3` | `nov1` |
| Script 4 · studied, stuck | `script_4` | `khan` |
| Script 5 · gap + fall | `script_5` | `gap` (same as default headline) |
| Script 6 · June → fall | `script_6` | `june` |

Optional explicit hook: `&hook=khan` (overrides slug inference).

Helper: `metaLandingUrl({ content: "script_5", campaign: "fall_sat_national" })` in `lib/landing/meta-traffic.ts`.

---

## Optional geo ad sets only

If you run a **location-targeted** ad set, add `metro=`:

```
…&metro=atlanta
```

| Metro | `metro` value |
|-------|---------------|
| Atlanta | `atlanta` |
| Dallas–Fort Worth | `dallas` |
| Houston | `houston` |
| Miami | `miami` |
| Charlotte | `charlotte` |
| Phoenix | `phoenix` |
| DC / NoVA | `dc` |
| Nashville | `nashville` |
| Boston | `boston` |
| NJ / NYC suburbs | `nj` |

Geo is **never inferred** from campaign name or IP for Meta traffic.

---

## Message match (national)

**Ad promise:** why stuck · realistic score · what to study · 1100s/1200s → 1400s.

**LP delivers:** matching hero (from `utm_content`) + score proof first + nationwide school marquee + same CTA.

Default hero (no slug): *1100s/1200s · colleges expect ~1400 · what's realistic before fall test.*

---

## Pixel / optimization

See [`meta-lp-events.md`](meta-lp-events.md):

1. Prospecting optimizes **`FunnelCTA`**
2. PostHog: `traffic_channel = meta_paid`, breakdown `hero_hook` + `hero_hook_source`

---

## Creative checklist (national)

- [ ] `utm_content` matches Icon script slug (`script_1` … `script_6`)
- [ ] First 3 seconds of video = same situation as LP H1 for that script
- [ ] CTA verbal = “free SAT Improvement Plan” / “two minutes” / “parent only”
- [ ] Results vary on any numeric claim (+182 only with n=95 / 12 weeks)
- [ ] Do **not** require `metro=` on broad campaigns

---

## What we are not doing

- Metro on every ad URL (national default)
- PostHog hero A/B on Meta (test angles in **ads**, match via `utm_content`)
- IP geo personalization
- Long full LP scroll (`?lp_layout=full` for QA only)
