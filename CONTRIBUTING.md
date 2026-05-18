# Contributing

Thanks for helping with Illuminairy. This repo is primarily maintained by Brianna with AI assistance; these notes keep changes safe and on-brand.

## Quick start

```bash
git clone <repo-url>
cd illuminairy
npm install
cp .env.example .env.local
# fill in keys — see README.md
npm run dev
```

## Before you open a PR

1. Run `npm run lint` and `npm run build`.
2. If you changed product facts, update **`lib/site.ts`** and relevant **`docs/`** files.
3. Update **`memory-bank/activeContext.md`** and **`memory-bank/progress.md`** for non-trivial work.
4. Add an **ADR** in `docs/decisions/` for architectural or integration choices (use `0000-template.md`).

## AI assistants

Read **[`AGENTS.md`](AGENTS.md)** and skim **`memory-bank/activeContext.md`** at session start.

## Copy & brand

- Voice: [`docs/brand-voice-and-positioning.md`](docs/brand-voice-and-positioning.md)
- SAT messaging: [`docs/sat-messaging-positioning.md`](docs/sat-messaging-positioning.md)
- No score guarantees; no public tutor interview Calendly link

## Commits

Use clear, present-tense messages. Examples:

- `fix contact form validation for empty phone`
- `update SAT tuition display to match Stripe price`
- `docs: add ADR for newsletter provider`

## Secrets

Never commit `.env.local`, Stripe keys, or webhook secrets. If leaked, rotate in the provider dashboard and Vercel immediately.

## Questions

`brianna@illuminairy.com`
