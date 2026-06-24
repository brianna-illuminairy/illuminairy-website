# Weekly progress report — writing style

**Audience:** Parent reading on phone after a busy day.  
**Exemplar:** [`content/danielle/weekly-report-week-2.html`](../content/danielle/weekly-report-week-2.html)  
**Email mirror:** [`lib/danielle-weekly-report-email.ts`](../lib/danielle-weekly-report-email.ts) + [`docs/leads/*weekly-report*.md`](leads/)

Also follow [`messaging-guide.md`](messaging-guide.md) and [`.cursor/rules/banned-copy-phrases.mdc`](../.cursor/rules/banned-copy-phrases.mdc).

---

## Report formula (every week)

### Overview (six sentences, top of report)

1. Is she **on track** or **off track** for her goal score?
2. **Estimated score today** and **estimated points gained since last week** (not only since baseline).
3. **Sessions** and **practice problems** completed that week (counts).
4. **Topics covered** that week.
5. **How skills and accuracy improved** (plain before/after).
6. **What we are working on next week.**

Then the sections below, in order.

### Sections (headings = short labels, not the six sentences pasted as questions)

| Order | Heading | Content |
|------|---------|---------|
| 1 | **Overview** | Six sentences above |
| 2 | **Score Progression** | Trajectory chart (1125 → WK1 → WK2 → goal). Point labels on chart; WK labels on x-axis |
| 3 | **Weekly Summary** | What happened in **each session** and what topic we covered (Session 1 / Session 2). Use owner copy when provided |
| 4 | **Aha Moments** | What clicked in sessions — skill names, not internal passage titles |
| 5 | **Practice & Homework** | Assignments completed, **X of Y correct**, accuracy % — **complete ≠ accuracy** |
| 6 | **Skills & Accuracy** | Skill-by-skill improvement + week-over-week accuracy chart if useful |
| 7 | **What's Next** | Next week's sessions, homework, milestones |

Do not add extra sections unless the owner asks.

---

## Voice

- Short sentences. Plain words. Full sentences a parent can read once and understand.
- **Owner copy is verbatim** when Brianna provides it — fix obvious typos only.
- No tutor shorthand, passage codenames, or meta disclaimers parents did not ask for.
- Session 2: reviewed **X mistakes from practice problems**, went deeper on transitions for **medium and hard** accuracy.

---

## Session write-ups

**Session 1:** pattern → categories → flashcards → assign practice.

**Session 2:** review **X** homework mistakes → go deeper (medium/hard) → she answered **Y** of **X** correctly by end of lesson when walked through together.

---

## Words and terms

| Use | Avoid |
|-----|--------|
| practice test, June 6 test | diagnostic (in parent copy) |
| transition | linking word |
| homework, Homework Portal | prep, prep plan |
| estimated score ~1210 | modeled points, rank #7 |

**Aha moments:** name the relationship or skill — not Cosmic Canvas, Billy Joel, etc. OK to reference **June 6 practice test** (parents know that baseline).

---

## Numbers

- **Score:** headline estimate + **gain since last week** + total since baseline when relevant.
- **Homework:** X of Y correct, accuracy %, complete vs not started — separate fields.
- **Sessions / problems:** counts in overview sentence 3.

Facts: [`lib/danielle/diagnostic-plan-data.ts`](../lib/danielle/diagnostic-plan-data.ts). Program stats: [`lib/site.ts`](../lib/site.ts) only.

---

## Checklist before send

1. Overview has all six sentences?
2. Sections in order: Overview → Score Progression → Weekly Summary → Aha → Practice → Skills → What's Next?
3. Each session summarized under Weekly Summary?
4. Complete vs accuracy labeled correctly?
5. Email highlights match report facts and tone?
