# Trust bar — suburban high school sourcing (strategic)

**Purpose:** Pick schools where your *actual* families cluster so the ticker feels like “kids like mine” — not to invent rows without permission.

**Rule:** Every ticker row in `lib/landing/trust-scores.ts` needs permissioned **name · high school · before · after · college**. Do not pair a real school name with a made-up student or score.

---

## Why recognizable suburbs work (cold DR)

- Parent thinks: *That’s our school / our feeder pattern.*
- Works when the row is **true** or clearly labeled parent-reported with permission.
- Fails when a Plano mom knows no one at that school got 1180 → 1410 through you — instant scam signal.

**Safer than fake HS names:**

| Approach | Use when |
|----------|----------|
| Verified rows only (best) | You have CRM / case study / parent OK |
| Metro label, no HS | `Plano · 1180 → 1410 · UT Austin` — still need real scores |
| “Schools like yours” in **ads**, not on LP | Ad calls out “Frisco / Alpharetta parents” — LP stays honest |

---

## Atlanta metro (outer suburbs, UMC public)

**LP featured strip (live):** Milton · Johns Creek · Alpharetta · Roswell · Lassiter — see `lib/landing/trust-atlanta-schools.ts`.

| School | Area |
|--------|------|
| **Milton HS** | Milton |
| **Johns Creek HS** | Johns Creek |
| **Alpharetta HS** | Alpharetta |
| **Roswell HS** | Roswell |
| **Lassiter HS** | Marietta / East Cobb |
| Chattahoochee HS | Cumming / Forsyth |
| Lambert HS | Suwanee |
| Northview HS | Duluth |
| Walton HS | East Cobb |
| Pope HS | Marietta |
| Mill Creek HS | Hoschton |
| Dunwoody HS | Dunwoody |
| Cambridge HS | Milton |

**Verified in product today:** Ethan · Alpharetta area · 1170 → 1410 · **UGA** — add his real HS name when you have it on file.

---

## Dallas–Fort Worth

| School | Area |
|--------|------|
| Highland Park HS | Highland Park |
| Plano West Senior HS | Plano |
| Plano Senior HS | Plano |
| Frisco Liberty HS | Frisco |
| Wakeland HS (Frisco) | Frisco |
| Coppell HS | Coppell |
| Carroll HS | Southlake |
| Allen HS | Allen |
| Lovejoy HS | Lucas |
| Hebron HS (Coppell cluster) | Carrollton |

---

## Houston

| School | Area |
|--------|------|
| Cinco Ranch HS | Katy |
| Taylor HS | Katy |
| Seven Lakes HS | Katy |
| Memorial HS | Spring Branch |
| Bellaire HS | Bellaire |
| The Woodlands HS | The Woodlands |
| Stratford HS | Galleria / private UMC |

---

## Miami–Fort Lauderdale

| School | Area |
|--------|------|
| Palmetto Senior HS | Pinecrest |
| Coral Gables Senior HS | Coral Gables |
| Columbus HS | Miami |
| Ransom Everglades | Coconut Grove (private) |
| Pine Crest | Broward / Miami (private) |
| St. Thomas Aquinas | Fort Lauderdale area |

---

## How to fill the ticker (operational)

1. Export last **95** completers / Strategy Call leads by **student school** field (intake, CRM).
2. Sort by count — top 6–10 schools with **signed outcome** or parent email OK.
3. For each row, confirm: first name or initial, HS, official before/after, college (enrolled or primary target they shared).
4. Paste into `lib/landing/trust-scores.ts`.
5. Mix metros if traffic is national; weight **Atlanta** if Meta geo is GA.

**Minimum viable:** 3 verified + 3 parent-reported with written OK beats 10 invented “Highland Park” rows.

---

## Ad ↔ LP alignment (without lying)

- **Ad:** “If your child is at a competitive public in Alpharetta, Plano, or Katy…”
- **LP ticker:** Only schools you actually have on the list above from step 2–3.

---

## Compliance copy (keep on bar)

`Outcomes shared by families with permission. Individual results vary.`

Do not use “got accepted to” unless that college is verified for that student.
