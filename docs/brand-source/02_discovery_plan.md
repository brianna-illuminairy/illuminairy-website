# Customer Discovery Plan

> Status: **v2 — locked 2026-05-19**
> Methodology: **listening primary, interviews validation**
> Owner: Brianna

---

## Why this methodology

The classic Mom Test play is 15 phone calls in 14 days. We're not doing that as the primary mode for three reasons:

1. **Volume.** 15 voices on a problem this widespread is a thin sample. Online listening captures hundreds to thousands of unprompted voices in the same time.
2. **Bias.** People you call know you. They want to be nice to you. Strangers complaining on Reddit don't.
3. **Latency.** Calls take days to book. Listening starts now.

So listening leads. Interviews validate the themes that listening surfaces, with the specific people we want as design partners.

---

## Two parallel tracks

### Track A — Online listening (primary, weekly cadence)

**Tooling:** `research/` Python kit (Reddit JSON API + HN Algolia API + Claude analyzer + frequency-mapped markdown reports).

**Targets:**
- Reddit horizontal subs: r/Entrepreneur, r/smallbusiness, r/SaaS, r/marketing, r/sales, r/freelance, r/agency, etc.
- Reddit vertical subs: r/Dentistry, r/LawFirm, r/RealEstate, r/Accounting, r/Plumbing, r/Etsy, r/Shopify, r/ecommerce, etc.
- Hacker News (via Algolia search API, free + unauthenticated)
- *Excluded:* LinkedIn (ToS hostile, login-gated). For LinkedIn signal, hand-drop URLs into a manual loader if/when needed.

**Output:** `brand/02_customer_voice.md` (curated, hand-edited from raw `research/reports/customer_voice_YYYY-MM-DD.md` weekly runs).

**Cadence:** Weekly run for the first 8 weeks of company building. Diff weekly to spot emerging themes.

### Track B — Validation interviews (secondary, on-demand)

Once listening surfaces a candidate beachhead (Module 4) and a sharp pain pattern, we run **5–10 targeted interviews** with people who fit that ICP exactly — not 15 generic interviews.

**Tooling:** `brand/02_discovery_interview_script.md` (Mom Test 6-question script — unchanged, still valid).

**Targets:** specific people who match the listening-derived beachhead. Pulled from `brand/02_call_list.md`.

**Purpose:** confirm or kill the hypothesis the listening generated. If the listening shows "AI lead-gen for dental practices is hair-on-fire," we need 5 dentists to confirm before we commit. If listening shows "agency owners are stuck on AI service-line creation," we interview 5 agency owners.

**Cadence:** triggered by listening signal, not calendar.

---

## What "done" looks like for Phase 1 discovery

We've completed discovery when we can answer all of these from real data (not hunches):

1. The top 3 verticals where AI-application pain shows up most often, ranked by frequency.
2. The top 5 verbatim phrases customers actually use to describe the pain. (→ `brand/11_customer_language.md`)
3. The top 3 alternatives customers have tried that failed — and the specific failure modes in their words.
4. At least 5 named candidate design partners (real people, from one of the top-3 verticals, with budget evidence).
5. The "switch" trigger — what specific event makes them go looking for help.

If listening alone can't answer all 5, we run the interview track to fill the gaps.

---

## Anti-patterns to avoid

- **Treating listening data as proof.** Reddit posters skew certain ways (younger, more vocal, more skeptical). Listening generates hypotheses; interviews confirm.
- **Cherry-picking quotes.** Frequency matters more than the most-dramatic single post. Use the frequency-counter columns of the report.
- **Listening forever to avoid talking to humans.** Once the report has clear winners, schedule the validation calls.
- **Scraping LinkedIn.** Don't. Hand-drop URLs into the manual loader if you want LinkedIn signal.

---

## Linked artifacts

- `research/README.md` — how to run the listening kit
- `research/config.py` — what we listen for (edit between weekly runs)
- `brand/02_discovery_interview_script.md` — 6-question Mom Test script for Track B
- `brand/02_call_list.md` — named-people target list for Track B
- `brand/02_log_template.md` — interview log format for Track B
- `brand/02_customer_voice.md` — curated customer voice (output of Track A, written next)
- `brand/11_customer_language.md` — verbatim phrase file (downstream artifact)
