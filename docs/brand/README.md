# Brand source docs

Canonical locked copy for Illuminairy positioning (synced from founder workspace).

| File | Use on site |
|------|-------------|
| [01_problem_statement.md](01_problem_statement.md) | Hero subhead, problem section |
| [00_beliefs.md](00_beliefs.md) | Beliefs / manifesto section |
| [00_founder_market_fit.md](00_founder_market_fit.md) | Founder story section |
| [logo-v2.md](logo-v2.md) | v2 path mark + file index |
| `02_*` | Discovery interviews (internal; not on public site) |

Site implementation reads distilled strings from [`lib/site.ts`](../../lib/site.ts) `homePlatform`. When brand docs change, update `homePlatform` and run `npm run agent:verify`.
