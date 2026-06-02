# Strategy Call show-up SMS (Klaviyo / Calendly)

**Use with:** [`docs/klaviyo-quiz-funnel-nurture.md`](../docs/klaviyo-quiz-funnel-nurture.md) Flow D · [`lib/quiz-funnel/thank-you-copy.ts`](../lib/quiz-funnel/thank-you-copy.ts) booked screen.

**Compliance:** TCPA opt-in required (s5 checkbox + Calendly phone). Include sender ID, STOP, HELP. Use **calendar invite link** from Calendly — do not invent URLs.

**Merge tags (Klaviyo):** `{{ person.strategy_call_at }}` · first name · Calendly reschedule link from invite.

---

## T-24h

```
Illuminairy: Tomorrow — your free SAT Strategy Call. Check your calendar for time + link. Parent on the call; bring recent scores. Reply STOP to opt out.
```

**Character count:** ~155 (trim if carrier segment limits apply).

---

## T-1h

```
Illuminairy: Your SAT Strategy Call starts in 1 hour. Open your calendar invite for the link. Need to reschedule? Use the link in that invite. Reply STOP to opt out.
```

---

## T-10m (optional — Flow D)

```
Illuminairy: Starting in 10 min — SAT Strategy Call. Calendar invite has your link. Reply STOP to opt out.
```

---

## Setup notes

1. Flow D: trigger on `Quiz Call Booked`; delay relative to `strategy_call_at`.
2. Keep Calendly native SMS ON as backup (`smsReminderNumber` from embed).
3. Test with personal phone before prod send volume.
