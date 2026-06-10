# Marketing skills (Cursor) — Illuminairy

Installed from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) via:

```bash
npx skills add coreyhaines31/marketingskills --skill product-marketing copywriting copy-editing cro signup emails sms ads ad-creative analytics ab-testing
```

**Location:** `.agents/skills/<name>/SKILL.md` (Cursor loads these automatically).

**Foundation file:** [`.agents/product-marketing.md`](../.agents/product-marketing.md) — read first on every marketing task.

**Illuminairy overrides (always):** [`docs/messaging-guide.md`](../docs/messaging-guide.md) · [`growth/funnel-strategy.md`](./funnel-strategy.md) · `.cursor/rules/banned-copy-phrases.mdc`

---

## Which skill when

| You want to… | Skill | Example prompt |
|--------------|-------|----------------|
| Refresh positioning doc | `product-marketing` | “Update product-marketing.md from funnel-strategy” |
| LP / hero / section copy | `copywriting` | “Rewrite B3 hero using staged disclosure — use copywriting skill” |
| Polish existing strings | `copy-editing` | “copy-edit `lib/landing/content.ts` against messaging guide” |
| Funnel conversion audit | `cro` | “CRO audit `/quiz` reveal → s5 → s9” |
| Lead form / s5 booking | `signup` | “Optimize quiz lead form for Strategy Call booking” |
| Klaviyo sequences | `emails` | “Draft Flow B emails per klaviyo-quiz-funnel-nurture.md” |
| Show-up SMS | `sms` | “SMS for T-1h Strategy Call reminder” |
| Meta/UGC ad angles | `ads` + `ad-creative` | “ad-creative variants for Icon script 1 — no free quiz” |
| PostHog / GA4 plan | `analytics` | “Analytics audit for quiz funnel events” |
| LP A/B tests | `ab-testing` | “Hypothesis for b3a vs b3b hero” |

---

## Add more skills later

```bash
cd /Users/briannazajicek/Documents/Illuminairy
npx skills add coreyhaines31/marketingskills --list
npx skills add coreyhaines31/marketingskills --skill seo-audit onboarding
```

**Avoid installing all 43** in this repo — increases Cursor skill catalog noise. Add only what you use.

---

## Upgrade / remove

```bash
# Re-install subset after upstream update
npx skills add coreyhaines31/marketingskills --skill copywriting cro

# Remove v1 stale folders if you ever installed full pack — see upstream README rename map
```

---

## How to invoke in Cursor

1. Start chat in this repo (skills must be enabled in Cursor Settings → Rules / Skills).
2. Say the task + skill name, e.g. “Using the **copywriting** skill, draft a new b3a hero with staged disclosure.”
3. Agent should read `.agents/product-marketing.md` then `docs/messaging-guide.md` before writing.

**Do not** let generic marketing skills override locked names (Improvement Plan, Strategy Call, Skill Diagnostic) or banned phrases.
