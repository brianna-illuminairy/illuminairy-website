# Google Ads — Georgia SAT funnel

## Account structure (v1)

| Campaign | Purpose |
|----------|---------|
| `GA-Search-Brand` | Brand — optional aspiration + fear RSAs |
| `GA-Search-MayScore` | `trigger-may-score` kit — ad groups per tone |
| `GA-Search-Intent` | `control` kit |
| `GA-Search-Schools` | GT/UGA/Emory keywords — aspiration only |
| `GA-Search-NoNag` | `trigger-no-nag` |
| `GA-Retarget` | LP abandoners |

## Ad group naming

`{Kit}-Aspiration` · `{Kit}-Fear-{fearId}`

Each ad group: unique `utm_content`, RSA in `funnel/campaigns/{kit}/tone/.../ads/google.md`, final URL from `destination.buildUrl()`.

## Geo

**Georgia (state)** only for v1. Optional +20% bid Atlanta DMA.

## Negatives (starter)

`free`, `practice test pdf`, `jobs`, `teacher certification`, `college board login`, `reddit`

## Conversions

Primary: `intake_completed` · Secondary: `schedule_page_view`
