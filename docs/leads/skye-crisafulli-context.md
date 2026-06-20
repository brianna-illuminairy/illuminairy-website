# Skye Crisafulli — lead context + diagnostic portal

*Last updated: 2026-06-19*

## Contact

| Field | Value |
|-------|--------|
| Student | **Skye** Crisafulli |
| Parent | **Sara** Crisafulli |
| Parent email | sara_crisafulli@hotmail.com |
| Student email | skyelacrosse13@gmail.com |
| Phone | (908) 797-4875 |
| CRM lead ID | `10492d9c-1d19-4294-a796-adcfd436064b` |
| Strategy Call | 2026-06-11 — attended |
| Skill Diagnostic | 2026-06-18 (Calendly booked as skyelacrosse13@gmail.com) |

## Quiz / goals (Jun 10)

- Baseline band: 1100–1200 (PSAT only prior)
- Target: 1400
- Next test interest: Sept 12 (quiz); diagnostic taken ahead of Oct 3 planning
- GPA: 4.0+
- Blockers: math, reading, self-study, no plan

## Diagnostic scores (Jun 18 full-length)

| | Range |
|---|------|
| Total | 1090–1140 |
| Reading & Writing | 540–560 |
| Math | 550–580 |

35 missed questions across RW (19) + Math (15). Full write-up in portal.

## Portal access

**Env (Production + local):** `SKYE_ACCESS_ALLOWLIST`

```
sara_crisafulli@hotmail.com,skyelacrosse13@gmail.com,brianna@illuminairy.com
```

Login: enter allowed email at `/skye/login` (no password).

| Page | URL |
|------|-----|
| Login | https://illuminairy.com/skye/login |
| Profile | https://illuminairy.com/skye/profile |
| Diagnostic analysis | https://illuminairy.com/skye/diagnostic |
| Improvement plan | https://illuminairy.com/skye/plan |
| Full PDF | https://illuminairy.com/skye/diagnostic/full |
| Tabular PDF | https://illuminairy.com/skye/diagnostic/tabular |

**Deploy note:** Diagnostic analysis + plan pages ship with the Skye portal branch. After merge to `main`, set `SKYE_ACCESS_ALLOWLIST` in Vercel → Production and redeploy.

## Follow-up email

Draft: [`skye-crisafulli-diagnostic-email.md`](./skye-crisafulli-diagnostic-email.md)
