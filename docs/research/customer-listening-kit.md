# IlluminAIry Listening Kit

A small Python toolkit for ongoing customer-voice listening across Reddit and Hacker News. Output: a frequency-mapped customer voice report you can re-run weekly.

## What this does

1. **Scrapes** public posts/comments from Reddit (JSON endpoints) and Hacker News (Algolia API) matching configured queries across configured subreddits.
2. **Analyzes** each post with Claude (Haiku 4.5) to extract: profession, pain, fear, hope, tried-and-failed alternatives, and gold quotes.
3. **Reports** to markdown: top professions, top pains, top failed alternatives, verbatim gold quotes — all frequency-ranked.

It does NOT scrape LinkedIn (ToS hostile, login-gated). For LinkedIn signal, hand-pull URLs and drop them into the manual loader.

## Setup (one-time)

```bash
cd research
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export ANTHROPIC_API_KEY="sk-ant-..."
```

## Run

```bash
# Scrape Reddit + HN. Outputs: data/raw/reddit.json, data/raw/hn.json
python3 scrape_reddit.py
python3 scrape_hn.py

# Analyze with Claude. Outputs: data/enriched/*.json
python3 analyze.py

# Generate markdown report. Outputs: reports/customer_voice_YYYY-MM-DD.md
python3 report.py
```

End-to-end run takes ~10–20 min and costs ~$1–3 in Claude API spend depending on `LIMIT_PER_QUERY` in `config.py`.

## Tuning what we listen for

Edit `config.py`:
- `SUBREDDITS` — horizontal + vertical communities
- `SEARCH_QUERIES` — the phrases customers actually use
- `HN_QUERIES` — broader AI-application terms (HN audience is more technical)
- `LIMIT_PER_QUERY` — bigger = more signal, slower run, higher API spend
- `TIME_FILTER` — `year` (default) / `month` / `week`

After every weekly run, scan the report. Add new queries based on language you keep seeing. Prune queries that return junk.

## What we explicitly do NOT do here

- No LinkedIn scraping (ToS + login wall)
- No impersonation / fake accounts
- No DM scraping
- No private/closed communities
- No re-publishing of quotes outside our internal brand work without source attribution

## Where outputs go

- `data/raw/` — scraped JSON (untouched)
- `data/enriched/` — Claude-annotated JSON
- `reports/` — dated markdown reports
- `../brand/02_customer_voice.md` — the canonical, hand-curated customer voice report (sourced from `reports/`)
- `../brand/11_customer_language.md` — verbatim phrase file used for landing-page / ad copy
