# Post-Call Sales Routing Playbook

Two separate post-call sales pages are live:

- Diagnostic only: `/post-call/diagnostic-only`
- Diagnostic + weekly baseline: `/post-call/diagnostic-plus-weekly`

Both pages keep the same structure:

1. Payment module
2. What is included
3. Testimonials and ratings

## Stripe Links

- Diagnostic only:
  - `https://buy.stripe.com/cNi3co9LS315apScBjc7u03`
- Diagnostic + weekly baseline:
  - `https://buy.stripe.com/7sYcMY7DK1X19lO7gZc7u01`

## Manual Routing Rules

Send the **diagnostic + weekly** page when:

- Parent is ready to start immediately.
- Student appears like a standard baseline fit.
- No unresolved fit uncertainty came up on the call.

Send the **diagnostic-only** page when:

- Score gap or timeline appears aggressive.
- Parent asks for diagnostic evidence before weekly billing.
- You expect cadence could be 3 or 4 sessions each week.
- Parent wants to compare options and needs a lower-friction first yes.

## Follow-Up Sequence Templates

Use one CTA per touch: complete payment on the page you selected.

### Touch 1 (same day, ideally within 2 hours)

`Thanks again for the call today. Here is the next step we discussed: [PAGE_LINK]. This secures your student's Skill Diagnostic so we can confirm the right weekly plan.`

### Touch 2 (24 hours)

`Quick follow-up from yesterday. Based on what you shared about [insert call-specific goal], this link is still the fastest next step: [PAGE_LINK].`

### Touch 3 (72 hours)

`Wanted to close the loop. If you want to move forward, here is the link: [PAGE_LINK]. If timing changed, reply and I will adjust the plan with you.`

## Tracking Events

Client events on the pages:

- `post_call_sales_page_viewed`
- `post_call_payment_clicked`

Reserved events for CRM/webhook pipeline:

- `post_call_payment_completed`
- `post_call_link_sent`

## Metrics To Review Weekly

- `call_attended -> paid` conversion rate by page type
- `page_view -> payment_click` by page type
- Time from call end to payment
- Diagnostic attendance rate after payment

## QA Checklist

- Payment module is first and dominant on mobile and desktop.
- Pricing and fit-clarity lines are clear and match checkout behavior.
- No parent-facing calculator or 2/3/4 selector appears.
- Both Stripe links open the intended checkout pages.
