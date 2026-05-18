---
name: illuminairy-review
description: Code and copy review for Illuminairy before merge. Checks AGENTS.md rules, brand, secrets, and product facts.
---

# Illuminairy review

## When to use

- Before opening or merging a PR
- User asks for code review

## Checklist

1. **Secrets** — no `TUTOR_CALENDLY_URL` or Stripe secrets in client/`NEXT_PUBLIC_*`
2. **Facts** — tuition, dates, structure match `lib/site.ts`
3. **Brand** — voice docs; no SAT score guarantees; banned phrases rule
4. **API routes** — validation, safe errors, no stack traces to client
5. **Scope** — matches active spec if `specs/ACTIVE.md` is set

## Output format

- **Blockers** — must fix
- **Suggestions** — optional
- **Verified** — what looks good

## References

- `AGENTS.md`
- `.cursor/rules/banned-copy-phrases.mdc`
- `docs/agentic-development/vibecoding-checklist.md`
