# Checkout truth — Stripe payment link strings

This file logs what the parent sees on the **Stripe payment link** before they hit Pay.
The `/enroll` receipt zone must echo these strings verbatim. Drift = scam-anxiety
re-introduction (PRD principle 9, "Echo, don't introduce").

- **Owner of this file:** Brianna (commercial truth) + implementation engineer (code-side
  reconciliation).
- **Status:** working capture from owner statements 2026-06-11. Live string verification
  happens during implementation by reading
  `stripe.checkout.sessions.retrieve(id, { expand: ['line_items', 'subscription'] })`
  and comparing each `line_item.description` / `subscription.items.data[].price.nickname`
  against this file. If they don't match, **the file is wrong** — Stripe is the source of
  truth. Update this file before shipping.

## Products (two on the same payment link)

| # | Product display name | Charge | Cadence | Stripe object expected |
|---|---|---|---|---|
| 1 | **Skill Diagnostic + Plan** | $249 USD | One-time, upfront, paid at checkout | `line_items[]` with `price.type === "one_time"` |
| 2 | **Weekly Tutoring** | $99 USD/week | Recurring, **free 7-day trial**, ends automatically on SAT test day | `subscription` with `items.data[].price.recurring.interval === "week"`, `trial_end` set |

## Trial + recurring schedule strings (parent-facing)

These are the de-anxiety strings the receipt zone displays. The dynamic dates pull live
from the Stripe Subscription / Checkout Session.

- **"Free 7-day trial."** Pulled from `subscription.trial_end` (Stripe).
- **"First weekly charge: [trial end date]."** Pulled from `subscription.trial_end`.
- **"Billed every [weekday] until your SAT on [exam day]."** Weekday from
  `subscription.billing_cycle_anchor` (Stripe), exam day from
  [`lib/site.ts`](../../lib/site.ts) `satProgram.examDayLabel`.
- **"Cancel anytime."** Static string — implementation must verify the cancel path
  (parent portal v1 doesn't exist; the SPEC routes to "reply to your Stripe receipt" or
  the support email).

## Entity / merchant strings

- **Customer-facing merchant name on the receipt zone:** `Illuminairy SAT Prep`.
- **Fine-print legal entity:** "Illuminairy SAT Prep is a service of Zytech Development
  LLC, [`site.location`](../../lib/site.ts) (currently Evans, Georgia)."
- **Stripe statement descriptor (bank statement):** must be aligned in the Stripe
  dashboard to read `ILLUMINAIRY SAT PREP` (currently `site.descriptor === "ILLUMINAIRY"`
  per `lib/site.ts`). **This is an ops action item flagged in the SPEC.** If the bank
  statement says anything else, the parent's "did I get scammed" anxiety returns the next
  morning when they see their card alert.

## Implementation contract

The `/enroll` page receives `?session_id=cs_…` and must, server-side:

1. Retrieve the Checkout Session with `expand: ['line_items', 'line_items.data.price',
   'subscription', 'subscription.items.data.price']`.
2. Extract the **one-time line item** (`price.type === "one_time"`) → display name,
   `amount_total`, `created` → "Today's payment" block.
3. Extract the **subscription** → `trial_end`, `items.data[].price.unit_amount`,
   `items.data[].price.recurring.interval` → "Weekly Tutoring trial + recurring schedule"
   block.
4. Compute the human dates: trial-end (= `new Date(trial_end * 1000)`), exam-day (=
   `satProgram.examDayLabel`).
5. Render. **No hardcoded dollar amounts on the page.** All numbers come from Stripe.
   `lib/site.ts` only carries program facts (weeks, classes, sessions), not pricing —
   pricing lives in Stripe.

## Verification checklist (run before merging the implementation PR)

- [ ] Open the live Stripe payment link. Take a screenshot. Save under
      `specs/2026-06-enroll-onboarding/payment-link-screenshot.png`.
- [ ] Confirm Product 1 reads exactly **"Skill Diagnostic + Plan"** and the price is
      **$249.00** (one-time).
- [ ] Confirm Product 2 reads exactly **"Weekly Tutoring"** and the price is
      **$99.00 / week** with a **7-day free trial**.
- [ ] If Stripe says anything else (different product names, different prices, no trial,
      different cadence), update this file, the PRD, and the SPEC before shipping.
- [ ] Confirm the Stripe dashboard "Statement descriptor" reads `ILLUMINAIRY SAT PREP` (or
      `ILLUMINAIRY-SAT-PREP`, whichever Stripe accepts at the byte limit). Update if not.
- [ ] Run the receipt zone through preview mode (`?preview=1`) once with a real Stripe
      checkout session ID forwarded server-side, and confirm dollar amounts, dates, and
      product names render without hardcoded fallbacks.

## Known drift to fix during implementation

- [`lib/site.ts`](../../lib/site.ts) carries `tuitionCents: 120_000` and
  `tuitionDisplay: "$1,200"` — these are from the previous one-time SAT Accelerator
  pricing model and **do not match** the live $249 + $99/wk model. Either remove them or
  comment them out; neither value should appear on `/enroll`.
- The brand doc's `$1,500` reference (per the comment on `tuitionCents`) is also stale.
