# Klaviyo: lead magnet nurture sequence

*Copy for manual setup in Klaviyo. Trigger: profile subscribes with `custom_source` containing `lead_magnet:` or property `lead_magnet_slug` is set.*

## Segments (recommended)

| Segment | Definition |
|---------|------------|
| `Magnet · UGA SAT` | `lead_magnet_slug` equals `uga-sat-score` |
| `Magnet · Georgia Tech SAT` | `lead_magnet_slug` equals `georgia-tech-sat-score` |
| `Magnet · Emory SAT` | `lead_magnet_slug` equals `emory-sat-score` |
| `Magnet · Summer timeline` | `lead_magnet_slug` equals `rising-junior-summer-timeline` |
| `Magnet · Module 2 pacing` | `lead_magnet_slug` equals `module-2-pacing-check` |
| `Get started intake` | `custom_source` equals `get_started_intake` |

## Flow: Lead magnet nurture (5 emails, 10 days)

**Trigger:** Joined list via site subscription API with `custom_source` starting with `lead_magnet:`

| Day | Subject | Body focus | CTA |
|-----|---------|------------|-----|
| 0 | Your guide is ready | Link to `{{ person|lookup:'lead_magnet_download_url' }}` or fallback `https://illuminairy.com/guides/{{ person|lookup:'lead_magnet_slug' }}/download` | Open guide |
| 2 | August timeline for rising juniors | Tease summer timeline guide; link `/guides/rising-junior-summer-timeline` | Get timeline |
| 4 | Why we do not guarantee a score | Honest fit voice; link `/sat-accelerator` + refund policy | View program |
| 7 | What week-one diagnostics actually show | Explain mentor focus; link `/get-started` | Tell us about your student |
| 10 | Book a free consultation | Calendly `{{ organization.url }}` or `https://illuminairy.com/contact#schedule` | Book a call |

## Email 0 — template copy

**Subject:** Your Georgia SAT parent guide from Illuminairy

**Preview:** Open your guide and save it as a PDF anytime.

---

Hi there,

Thanks for downloading from Illuminairy. Your guide is ready:

**[Open your guide →]** *(use profile property `lead_magnet_download_url`)*

If the button does not work, go to illuminairy.com/guides and choose the guide again.

We are based in Atlanta and run the twelve-week SAT Accelerator for the August 22, 2026 SAT — Georgia Tech mentors who scored 1450+, week-one diagnostics, six private 1:1s, and a progress report every week. We do not guarantee scores.

— Brianna  
Illuminairy

## Email 4 — why no guarantee (short)

We do not promise a number on the SAT because guarantees measure compliance, not learning. We commit to the program as described: diagnostics in week one, live classes, six 1:1s, assigned practice, and weekly visibility for parents. If we are not the right fit, we would rather say so on a consultation call than collect tuition we cannot justify.

## PostHog events (instrumented on site)

| Event | When |
|-------|------|
| `lead_magnet_submitted` | Email submitted on guide landing |
| `lead_magnet_download_viewed` | Download / print page opened with access |
| `get_started_intake_submitted` | `/get-started` form completed |
| `get_started_schedule_viewed` | `/get-started/schedule` loaded |

## Setup checklist

1. Confirm `NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY` and `NEXT_PUBLIC_KLAVIYO_LIST_ID` in Vercel production.
2. Create flow above; set trigger on list join.
3. Map profile properties: `lead_magnet_slug`, `lead_magnet_download_url` (sent from site on subscribe).
4. Test with a personal email on each guide URL.
5. Optional: separate flow for `get_started_intake` → schedule reminder after 24h if no Calendly booking (manual for now).
