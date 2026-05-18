# Parent voice & social listening — Georgia SAT funnel (May 2026)

**Research date:** 2026-05-18  
**Use for:** SAT conversion funnel ads, landing pages, intake, email (`specs/2026-05-sat-funnel/` when written)  
**Implementation mirror (on build):** `funnel/copy/parent-voice.ts`, `funnel/copy/aspiration.ts`, `funnel/copy/fear-relievers.ts`  
**Plan source:** Cursor plan `sat_conversion_funnel_799ee72e` (SAT Conversion Funnel); PRD on execute: `specs/2026-05-sat-funnel/`

**Related:** [sat-messaging-positioning.md](../sat-messaging-positioning.md), [brand-voice-and-positioning.md](../brand-voice-and-positioning.md), [cc-get-started-funnel.md](cc-get-started-funnel.md), product facts in [`lib/site.ts`](../../lib/site.ts)

---

## Research sources

| Source | URL / note | Role |
|--------|------------|------|
| College Confidential Parents Forum | [“daughter’s SAT score was lower than she expected”](https://talk.collegeconfidential.com/t/new-here-daughters-sat-score-was-lower-than-she-expected/2044038) | Primary parent language — high achievers |
| DC Urban Moms | [“Struggling junior & SAT wake-up call”](https://www.dcurbanmom.com/jforum/posts/list/1274596.page) | Vocabulary contrast — not primary ICP |
| Sparkl parent guides | Micromanaging, test morning | Nagging / accountability framing |
| GA school threads | GT / UGA / Emory chance-me, in-state vs OOS | Georgia mental layer |

---

## ICP filter (who we listen to)

| Listen to | Ignore for cold ads |
|-----------|---------------------|
| **A/B student**, 5 APs, strong GPA, “well-rounded,” aiming **selective / T20-ish** | Under 1000, “bombed,” parent threatening **community college** unless SAT improves |
| Parent invested in **May → August** retake timeline | “He won’t prepare — don’t waste money on SAT prep” (different product) |
| **Georgia** families naming **Tech, UGA, Emory** on list | Generic national rant threads with no school stakes |

**Primary avatar:** Georgia parent of an **11th grader**; student **self-studied** (Khan, Bluebook); **first May official score** disappointing; targeting **August 22, 2026**; schools in mind: **Georgia Tech, UGA, Emory**.

**Buyer archetype:** CC-style mom who did the “right” self-study → May score → mental math vs Tech/UGA/Emory → **still ~100+ points short** of what they believe those schools need. **Betrayal + panic**, not laziness.

---

## Signature pain (lead creative)

### “All those hours — and still not enough for Tech / UGA / Emory”

| Layer | Parent mental math |
|-------|-------------------|
| **Effort** | “We put in the time.” · “She’s been on **Khan Academy** and **Bluebook** for months.” · “We did what everyone said to do.” |
| **Outcome** | “The **May score** came back.” · “It’s **lower than she expected**.” · “It’s still **not close** to what she needs.” |
| **Stakes** | “She needs **Georgia Tech** / **UGA** / **Emory**.” · “She’s **100+ points short**.” (parent’s number — never promise to “close the gap” in ads) |
| **Emotion** | **Baffled** + **angry at the apps** (not the kid) + **urgent** (August redo) |

**Forum echo:** Practice scores higher than official; PSAT confidence then SAT disappointment; “didn’t prepare as much as she should have” even when hours were high — parents conflate **time on app** with **effective prep**.

**Illuminairy position:**

- Validate: official material wasn’t wrong — families need a **plan and a human** who turns hours into the *right* work.
- Don’t blame Khan/Bluebook in ads — blame **no roadmap / no mistake loop / no accountability**.
- Reliever: **diagnostics → targeted plan → weekly report to parent** — not “study more on Khan.”

**Lead campaign kit:** `trigger-may-score` — fear variants **`hours-no-payoff`** (primary) + **`doors-closing`** (A/B).

---

## Emotional jobs (what she’s buying)

She is **not** buying tutoring hours. She’s buying **relief from being the project manager** of a high-stakes summer — with enough visibility to sleep at night.

**Fears:** hours on Khan/Bluebook still short of GT/UGA/Emory · score blocks list · behind vs peers · summer wasted · flying blind · becoming SAT police · should have started sooner.

**Hopes:** August-ready student · score matches GPA/effort · 4-year path alive · trust without nagging · clear plan so she stops managing Khan links.

---

## Verbatim / near-verbatim phrases

*Forum parents; paraphrased only where noted. Prefer exact phrasing in copy tests.*

### Hours invested — score still short of target schools (hero)

- “We’ve been on **Khan Academy** and **Bluebook** all year.”
- “She put in the time — and the **May score still wasn’t enough**.”
- “It’s **100 points below** what she needs for **Georgia Tech**.” (parent’s math — cite as *their* goal, not our guarantee)
- “**Practice tests looked better** than the real thing.”
- “We did what we were supposed to do — so **why didn’t it work?**”

### After a disappointing score

- “Her SAT score was **lower than she expected**.” (CC thread title)
- “She’s **devastated** — **over-confident after the PSAT** and **didn’t prepare as much as she should have**.”
- “It’s a **wake-up call**.”
- “**Think of it as a good lesson** on preparation / not getting over-confident.”

### Mantras (email / LP)

- *I wish I had done better* → “**I need to practice more.**”
- *I was expecting better* → “**I have a lot more work to do.**”
- “**Step back. Evaluate the goals. Make a plan.**”
- Proud of **effort**, not just scores.

### Timeline & August

- “**August date is a good one**” — less stressed (CC advice)
- “**Plenty of time** to bring the score up.”
- “**Summer is nearly here**” — busy kid still had time over break.

### GPA vs test

- “**A+ student** … 1460 PSAT … **1370** first SAT.”
- “**Smart and able to do better**.”
- “**Math is not an issue** — verbal / RW was off.”

### College list (Georgia)

- “**UGA, Emory, or Tech?**” · “**Top GA schools**”
- In-state flagship + Tech + selective private = dinner-table triangle
- **Do not quote acceptance rates** in ads

### Nagging / micromanaging

- “**Accountability partner, not supervisor**”
- “**What did you learn from the last practice test?**”
- “**Validate effort, not just scores.**”
- “**Check in weekly — not hourly.**”

### When self-study failed (structured program vocabulary)

- “**Structured** SAT prep program” · “**2 hours a day**, 5 days a week” · “**weekly practice tests**”
- “**Better test-taking strategies**” · “**tutor if you can afford one**” OR “**workbook + scheduled time**”
- Illuminairy: structured **without** parent as scheduler — mentor assigns, report every week

### Avoid in brand tone (forum anger)

- “**Forcing** him into something **you** want”
- “Don’t waste money on SAT prep” when student won’t engage
- SAT-only ultimatums for paying for college

---

## Fear ID map (ads + LP + analytics)

| `fear_id` | Parent theme | Fear-hook (validate) | Reliever | Proof |
|-----------|--------------|---------------------|----------|-------|
| **`hours-no-payoff`** ⭐ | Khan/Bluebook hours, May still short of Tech/UGA/Emory | “Spent the year on Khan and Bluebook — and May still wasn’t enough for the schools on their list?” | Diagnostics + plan — not more solo apps | Diagnostics, 1:1s |
| `doors-closing` | Score limits options | “Worried their score will limit college options?” | Stronger August score keeps doors open | Georgia proof |
| `started-late` | Should’ve started sooner | “Wish you’d started earlier? August 22 is still the test.” | Twelve weeks from May 27 | `lib/site.ts` |
| `summer-repeat` | Another wasted summer | “Afraid of studying all summer with nothing to show?” | Diagnostics-first plan | Diagnostics + 1:1s |
| `no-visibility` | Flying blind | “Flying blind on SAT progress all summer?” | Weekly parent report | Weekly report |
| `nagging` | SAT police | “Tired of nagging them to study?” | Mentor assigns practice | Assigned work |
| `gpa-mismatch` | GPA doesn’t match SAT | “Strong GPA, SAT that doesn’t match?” | Week-one gap find | Diagnostics |
| `wasted-summer` | AP/IB/sports in fall | “One summer before the busy fall.” | Fixed May–August schedule | Classes + practice |
| `may-disappointment` | Lower than expected | (supporting) | Plan for August | Diagnostics |
| `practice-gap` | Practice > real test | (supporting) | Timed work, real conditions | Program structure |
| `target-range` | In range for list | Consultation-only promises | Map target honestly on consult | Consultation |

---

## Example ad hooks (Meta + Google)

| Theme | Aspiration hero | Fear → reliever |
|-------|-----------------|-----------------|
| **Hours + school gap** | Work ethic is there — August turns effort into a score their list needs, with weekly visibility | “**Months on Khan and Bluebook** — and May still wasn’t enough for the schools on their list?” |
| Behind | Future ahead — August **opens doors** | Feel **behind**? August 22 isn’t gone — needs a **real plan** |
| Options | Right August score **keeps options open** | Score **limits their college list**? |
| GPA mismatch | **Good GPA deserves matching SAT** | **Great student, SAT that doesn’t match?** |
| Summer | **One summer** before senior chaos | **Can’t waste this summer** — structure, not “study more” |
| Nagging | Support without being SAT police | **Tired of nagging?** Weekly report to you |
| Target range | August **competitive for Tech, UGA, Emory** | **In range for their schools** — mapped on consultation |

### Sample RSA — `trigger-may-score` · `fear-hours-no-payoff`

| Field | Copy |
|-------|------|
| Meta primary | “**Months on Khan Academy and Bluebook** — and the May score still isn’t in range for the schools on their list? More app time isn’t the answer. Apply for a twelve-week August program: diagnostics, GT mentors (1450+), weekly reports to you.” |
| Meta headline | “Hours in. Score still short?” |
| Google H1 | “Khan & Bluebook Not Enough?” |
| Google H2 | “May Score Below Their List?” |

---

## Middle 50% education (List Fit Check + consults)

**Parent misconception:** “Their score is in UGA’s / Tech’s published range, so they’re fine.”

**What we teach (honest):**

- **Middle 50% ≠ accepted.** It describes **submitters** who enrolled with scores in that band — not everyone admitted, and many applicants cluster there.
- **In range often means “blend in”** with other strong applicants unless something else is exceptional.
- **For typical students** (no recruited-athlete / national-level hook): aim for **upper 25% of submitters (75th percentile+)** on SAT to be **truly competitive** on test scores — still not a guarantee.
- **Hooks matter:** recruited athlete, standout portfolio/award, etc. can change how much the score alone must carry — we ask optionally on the tool, never promise sports = in.

**Tool:** `/tools/georgia-list-fit` — see funnel plan §3F.

---

## Georgia-specific layer

| Topic | What GA parents circulate | Funnel use |
|-------|---------------------------|------------|
| **Georgia Tech** | “Is 1430 enough?” in chance-me | **GT mentors 1450+** — credibility, not admission; teach **75th+ for typical apps** |
| **UGA** | In-state default, HOPE culture | “Georgia families” — **no HOPE promises in ads** |
| **Emory** | Selective private, Atlanta | “Competitive for selective schools” |
| **HOPE / Zell** | Often cited ~1200 SAT (verify annually) | FAQ / consultation only |
| **In-state vs OOS** | GT acceptance anxiety | Consultation only |

---

## Copy rules (banned + guardrails)

### Banned in all funnel + ads

| Banned | Why | Write instead |
|--------|-----|---------------|
| score jump, big jump | Tutoring jargon | “competitive for their list,” “in line with their GPA” |
| boost score, score boost | App-ad tone | “stronger August score,” “improve on the August test” |
| bump their score | Same | “do better on the August test” |
| close the gap, add 100 points | Implied guarantee | “map target on consultation” |
| supercharge / skyrocket | Hype | Program mechanics or drop |

**Also:** no admission promises (“get into Tech”), no point guarantees (“+150”), no guarantee language per brand docs.

### “100 points” guardrail

- **OK** in fear ads as *parent mental math*: “still 100+ points short of what Tech families need.”
- **Never:** “we’ll add 100 points” or “close the gap by August.”
- Consultation sets **their** target from diagnostics.

### Funnel CTA language

- **Apply for the August program** → application → **Schedule your free consultation** → enroll.
- **Not** “fit call.”
- **Do not advertise** online/in-person/hybrid delivery — outcomes only (plan, diagnostics, 1:1s, classes, weekly reports).

---

## Intake fields (recommended)

Tie ads to data the founder sees before consultation:

- Roughly how much time per week on Khan / Bluebook before May? (`<5h` / `5–10h` / `10+h`)
- What score range does their list need? (free text or bands — **consultation**, not ad promise)
- Checkboxes: Khan · Bluebook · Question Bank · book · prior tutor
- Which schools on their list? (Tech / UGA / Emory / other)
- Student willingness to do weekly assigned work (disqualify “forced prep” gently)

---

## Copy implications (checklist)

1. **Lead with recognition** — “Score lower than you expected?” / hours-on-apps beat generic “SAT prep Georgia.”
2. **Plan + weekly visibility** — answers nagging and summer-repeat without “boost.”
3. **Name Tech, UGA, Emory** as **aims**, not outcomes.
4. **GT mentors 1450+** — local trust (from `lib/site.ts`).
5. **August 22 + application timeline** — concrete urgency.
6. **Intake mirrors home conversation** — tools used + school list.
7. **Disqualify** students who won’t engage — no miracle promises.

---

## Campaign kits (v1 reference)

| Kit ID | Lead `fear_id`s | Notes |
|--------|-----------------|-------|
| `trigger-may-score` ⭐ | `hours-no-payoff`, `doors-closing` | Timed May score release window |
| `trigger-gpa-mismatch` | `gpa-mismatch` | |
| `trigger-no-nag` | `nagging`, `no-visibility` | |
| `trigger-post-finals` | `wasted-summer` | |
| `trigger-target-range` | `target-range` | Consultation-only score talk |
| `control` | aspiration + bundle | |

Each kit: `tone/aspiration/` and `tone/fear-{id}/` with `ads/meta.md`, `ads/google.md`, `landing-hero.ts`.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-18 | Initial export from SAT conversion funnel plan (social listening + parent voice library + `hours-no-payoff` signature pain). |
