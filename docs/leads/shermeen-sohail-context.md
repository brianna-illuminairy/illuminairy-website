# Shermeen Sohail — lead context + diagnostic portal

*Last updated: 2026-06-25*

## Contact

| Field | Value |
|-------|--------|
| Student | **Shermeen** Yousaf (legal name on diagnostic: Shermeen Sohail) |
| Parent | **Sohail** Yousaf |
| Parent email | sohailft@gmail.com |
| Student email | shermeen.sohail2010@gmail.com |
| Grade | Rising sophomore |
| Strategy Call | 2026-06-09 — attended |
| Skill Diagnostic | 2026-06-23 (full-length proctored) |
| Enrollment | Phase 1 via `/enroll/sohail-shermeen` (paid Jun 2026) |

## Baseline and goals

- Blue Book practice average: ~1080 (unproctored)
- Longer arc: Phase 1 foundation (Jun–Sep 2026), PSAT sophomore year, SAT May 2027 target with National Merit push in Phase 2
- Context: [`lib/personalized-enroll.ts`](../../lib/personalized-enroll.ts) (`sohail-shermeen` slug)

## Diagnostic scores (Jun 23 full-length)

| | Range |
|---|------|
| Total | 1100–1150 |
| Reading & Writing | 540–560 |
| Math | 560–590 |

64 correct of 98 total. 20 Reading and Writing wrong answers, 14 Math wrong answers. Full mentor write-up in portal.

## Portal access

**Env (Production + local):** `SHERMEEN_ACCESS_ALLOWLIST`

```
sohailft@gmail.com,shermeen.sohail2010@gmail.com,brianna@illuminairy.com
```

Optional staff QA: `SHERMEEN_OWNER_QA_SECRET` (same pattern as Skye/Soha).

Login: enter allowed email at `/shermeen/login` (no password).

| Page | URL |
|------|-----|
| Login | https://illuminairy.com/shermeen/login |
| Profile | https://illuminairy.com/shermeen/profile |
| Diagnostic analysis | https://illuminairy.com/shermeen/diagnostic |
| Full PDF | https://illuminairy.com/shermeen/diagnostic/full |
| Tabular PDF | https://illuminairy.com/shermeen/diagnostic/tabular |

**Deploy note:** After merge to `main`, set `SHERMEEN_ACCESS_ALLOWLIST` in Vercel → Production and redeploy.

## PDF assets (repo)

- `content/shermeen/diagnostic-full.pdf`
- `content/shermeen/diagnostic-tabular.pdf`

## Follow-up email

Draft: [`shermeen-sohail-diagnostic-email.md`](./shermeen-sohail-diagnostic-email.md)
