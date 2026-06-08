# Funnel Mobile UX and Responsiveness

## Purpose

Define operational mobile QA for high-volume anonymous ad traffic.

## Device matrix

Run QA on:

- iOS Safari
- iOS in-app browser (Facebook/Instagram)
- Android Chrome
- Android in-app browser (Facebook/Instagram)

## Visitor-state matrix

Run each flow for:

- New visitor
- Return visitor with in-progress state
- Return visitor with changed campaign params

## Core UX checks

1. Above-fold CTA visible and tappable
2. No blocked scrolling due to viewport shell issues
3. Step transitions preserve input and expected routing
4. Resume returns to correct step on revisit
5. Booking step validates and recovers from slot errors

## Responsiveness checks

- Narrow-width layout integrity (text wrap, buttons, legal strip)
- Keyboard interactions on name/email/phone fields
- Tap target sizing for critical controls (especially consent controls)

## Analytics checks (mobile)

Confirm event continuity on-device for:

- landing view
- CTA click
- quiz step progression
- lead submit
- booking confirmed

Confirm canonical dimensions present:

- `first_utm_content`
- `first_hero_hook`
- `quiz_who`

## Release checklist tie-in

Before deploy sign-off:

1. `npm run funnel:e2e`
2. `npm run funnel:analytics-smoke`
3. `FUNNEL_LAYOUT_UNLOCK=1 npm run agent:verify`
4. Spot QA at least one iOS and one Android real device path
