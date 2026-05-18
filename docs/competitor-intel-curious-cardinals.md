# Competitor intel — Curious Cardinals

*Internal research document. Snapshot date: **2026-05-18**.*

**Purpose:** Preserve what Curious Cardinals was building before their **FlightPlan** pivot (May 2026), what content and positioning performed best (by public proxy signals), and how Illuminairy should respond in SAT prep, messaging, and future content.

**Related:** [sat-competitor-analysis.md](sat-competitor-analysis.md) (SAT prep market) · [sat-us-vs-competitors.md](sat-us-vs-competitors.md) (comparison tables) · Site archive on branch `archive/curious-cardinals-2026-05-18` · Re-scrape: `npm run cc:analyze-blog`

**Disclaimer:** Observations are from **public** pages, sitemaps, and blog HTML (May 2026). Not legal claims about their business performance. CC is an **adjacent** competitor (mentorship / college outcomes), not a direct SAT-prep SKU — families may still compare “who helps my kid succeed.”

---

## Executive summary

| | Curious Cardinals (pre-pivot) | Illuminairy |
|---|------------------------------|-------------|
| **Core offer** | 1:1 near-peer mentorship: passion projects, research, academic coaching, college positioning | **SAT Accelerator** — 12-week structured program, diagnostics, 6× 1:1, live classes |
| **Price signal** | **~$380/mo** — 4× 1-hour mentor sessions (~$95/hr); consult to enroll | **$1,200** published — 12-week SAT program (6× 1:1 + live classes) |
| **Proof** | 10k+ students, 530+ reviews, case studies (film, TED, entrepreneurship) | 1450+ mentors, weekly reports, no score guarantee |
| **SEO scale** | ~786 marketing URLs, ~2,196 app mentor profiles, 121 blog posts | Focused program pages; mentor page TBD |
| **2026 pivot** | **FlightPlan** — “clearer college strategy” on homepage | SAT live; AI / professional programs planned Q3 2026 |

**Takeaway for Illuminairy:** CC proved that parents buy **mentorship narrative**, **parent-first content**, **outcome stories**, and **mentor visibility in search** — Illuminairy can win on the **same trust levers**, with **SAT-specific proof** (digital test, 12-week plan, weekly reports, published $1,200). Do **not** copy their **product story** (passion projects, FlightPlan, multi-year subscription, scale claims we can’t back yet). You’re behind on **assets** (blog volume, case studies, review count), not on **strategy**.

---

## 1. Site archive (reference)

Full mirror (~658 MB, ~3,100 pages) lives on GitHub only:

| Branch | Contents |
|--------|----------|
| `archive/curious-cardinals-2026-05-18` | `marketing/` (Webflow), `blog/` (HubSpot), `app-mentors/` (Next.js) |

**Restore locally (temporary):**

```bash
git fetch origin archive/curious-cardinals-2026-05-18
git checkout archive/curious-cardinals-2026-05-18 -- archives/curious-cardinals-2026-05-18
npx --yes serve archives/curious-cardinals-2026-05-18/marketing -p 4321
```

**Not captured:** `/dashboard`, checkout, Calendly embeds, live analytics.

### Technical stack

| Property | URL | Stack |
|----------|-----|--------|
| Marketing | curiouscardinals.com | **Webflow** (`cdn.prod.website-files.com`) |
| Blog | blog.curiouscardinals.com | **HubSpot CMS** |
| App (public mentors) | app.curiouscardinals.com/mentors/* | **Next.js** on Vercel; mentor data in `__NEXT_DATA__` |
| App (private) | app.curiouscardinals.com/dashboard | Auth-only |

### Archive verification (2026-05-18)

| Section | Sitemap URLs | HTML saved | Total files |
|---------|-------------:|-----------:|------------:|
| Marketing | 786 | 564 | 2,087 |
| Blog | 121 | 121 | 2,148 |
| App mentors | 2,196 | 2,196 | 2,376 |

Marketing wget exited with code 8 (some server errors); coverage still strong. Zero-byte files: 0.

### Spot-check: URLs you asked about

| URL | Archived? | Where / notes |
|-----|-----------|----------------|
| [curiouscardinals.com/pricing](https://www.curiouscardinals.com/pricing) | **Yes** | `marketing/curiouscardinals.com/pricing.html` — includes **$380/mo**, 4 sessions, 2-week evaluation, money-back guarantee, CTA → `/get-started/contact-info` |
| [curiouscardinals.com/reviews](https://www.curiouscardinals.com/reviews) | **Yes** | `marketing/curiouscardinals.com/reviews.html` |
| [curiouscardinals.com/mentors](https://www.curiouscardinals.com/mentors) | **Yes** | `marketing/curiouscardinals.com/mentors.html` (Webflow directory). Separate app profiles: `app-mentors/app.curiouscardinals.com/mentors/*.html` (~2,196) |
| [curiouscardinals.com/case-study](https://www.curiouscardinals.com/case-study) | **Yes** | `marketing/curiouscardinals.com/case-study.html` + individual `/case-study/*` pages |
| [curiouscardinals.com/case-studies/elise-l](https://www.curiouscardinals.com/case-studies/elise-l) | **Yes** | `marketing/curiouscardinals.com/case-studies/elise-l.html` |
| [lu.ma/.../cal-LvLbx6gS0ChhPQz](https://luma.com/calendar/cal-LvLbx6gS0ChhPQz?utm_source=website) | **No (external)** | **Link only** in archived nav (“Upcoming Events” on pricing and other pages). Luma was **not** in wget domain allowlist — webinar/event pages live on Luma, not in our mirror |

`www.` vs non-`www`: sitemap uses `curiouscardinals.com`; files are saved under `marketing/curiouscardinals.com/`. Open locally via archive branch paths above (not live URLs when offline).

---

## 2. Business model & positioning (May 2026 snapshot)

### Homepage messaging

- Hero: *“Watch your child's interests become extraordinary achievements.”*
- Outcomes: published researcher, national awards, straight A's, college apps
- Social proof: **10,000+ students**, **530+ reviews (5.0)**, press logos
- Flagship launch: **FlightPlan** — “A clearer college strategy starts here”
- Tracks: Portfolio, Organization, **Research**, Content creation
- Academic mentorship positioned as **“Better than tutoring”**
- Post-click funnel: **Typeform intake** → book a call (not a bare Calendly link on the homepage)

### Lead funnel (Typeform → call or webinar)

**Full field-by-field capture:** [docs/research/cc-get-started-funnel.md](research/cc-get-started-funnel.md) (Typeform API + live pages, May 2026).

CC’s primary path was **qualify first, then schedule** — not “pick a time” on the first click.

```text
Ad / SEO / homepage CTA → /get-started/contact-info
        ↓
   Typeform P5h8CCfR — parent email + contact
        ↓
   /get-started/student-info (Typeform ALTmLSan)
   program fit, subjects, passion areas, student grade, goals
   + $380/mo commitment statement
        ↓
    ┌───┴────────────────────────┐
    ↓                            ↓
Schedule a call (default)    Attend virtual event
    ↓                            ↓
/book-a-consultation-call    lu.ma/calendar/cal-LvLbx6gS0ChhPQz
HubSpot: Alec Katz consult
    ↓
Personalized plan → mentor match → $380/mo subscription
```

**Legacy parallel path** (still in sitemap): `/get-started/basic-info` → HubSpot form → `student-insights` → `add-another-student` — not the redirect from the live contact-info Typeform.

| Step | What CC did | Why it matters |
|------|-------------|----------------|
| **Typeform (2 steps)** | Parent contact, then student/program detail + **$380/mo** acknowledgment | Filters tire-kickers; gives reps context; spam traps on known emails |
| **Book a call** | Default path → HubSpot Meetings (`meetings.hubspot.com/alec-katz/curious-cardinals-consultation-call`) | High-intent families talk to admissions |
| **Webinar / events** | **In-form choice** “Attend a virtual event” → **Luma** ([calendar](https://lu.ma/calendar/cal-LvLbx6gS0ChhPQz?utm_source=getstarted)); also in nav as “Upcoming Events” | Off-ramp without a live sales call; **not archived** |

**Illuminairy contrast:** Public **Calendly** on `/contact#schedule` (and SAT pages) — lower friction, faster to conversation; optional `NEXT_PUBLIC_TYPEFORM_URL` exists in `lib/site.ts` but is not the primary SAT funnel. CC traded speed for **qualification + nurture**.

**Takeaway:** If Illuminairy adds a blog or paid traffic, a short Typeform *before* Calendly can improve consult quality; a **recorded webinar** (program walkthrough, “week one diagnostics”) is a useful middle step for parents who won’t book yet.

### Product tracks (marketing sitemap)

- `/passion-project`, `/research`, `/academic-mentorship`, `/organization`, `/content-creation`
- `/how-it-works`, `/pricing`, `/reviews`, `/faq`
- `/get-started/*` — Typeform-led funnel (basic info, book-a-consultation-call, confirmation, async match request)
- `/our-mentors/*` (~474 Webflow profiles)
- Case studies: `/case-studies/*`, `/case-study/*`
- Past projects & holiday workshops (long-tail SEO)

### Hero case studies (`/reviews`)

| Student | Outcome | Track |
|---------|---------|--------|
| Brandon | Horror film → festival success | Film / Theater |
| Silver | AI project → TED Talk, Diller finalist | ML / AI |
| Carson | Financial literacy summit, Scholastic Silver Key | Entrepreneurship |

These three are the **canonical proof stories** CC puts in front of families.

### Pricing (subscription model)

**Confirmed on archived `/pricing` page** (May 2026 snapshot) and consult:

| | Curious Cardinals | Illuminairy SAT Accelerator |
|---|-------------------|----------------------------|
| **List price** | **$380/month** | **$1,200** (one program tuition) |
| **Included** | 4× 1-hour mentor sessions per month | 12 weeks · 2 live classes/week · **6× 1:1** · diagnostics · assigned practice |
| **Effective hourly** | ~**$95/hr** ($380 ÷ 4) | 1:1 time alone ≈ **$200/hr** if priced only on six 1:1s — but tuition also covers ~24 live class hours |
| **12-week cost** | ~**$1,140** (3 months × $380) for 12 mentor hours | **$1,200** fixed |
| **Annual run rate** | ~**$4,560/year** if retained 12 months (48 mentor hours) | Cohort-based; not a rolling subscription |

**Enrollment path:** After Typeform + consult (or webinar nurture), pricing (**$380/mo**) was confirmed on the call — not always on the marketing homepage.

**Comparison note for families:** CC is cheaper **per mentor hour** in isolation but is **ongoing** and does not include structured SAT classes, diagnostics, pacing work, or digital-test practice. Illuminairy is a **bounded** exam-prep program at similar total cost for a single summer.

### Mentor supply

- Marketing: ~474 Webflow mentor pages
- App: ~2,196 public `/mentors/[slug]` profiles (Uploadcare photos, Apollo state in HTML)
- Homepage claim: 650+ mentors from top schools; matchmaking narrative

---

## 3. Content performance (blog)

### Limitation

**No public pageview or traffic data.** HubSpot does not show view counts. Rankings below use **proxy signals** from a full scrape of 121 sitemap URLs (2026-05-18):

| Signal | Meaning |
|--------|---------|
| **Word count** | SEO / pillar investment |
| **CTA links** to curiouscardinals.com | Conversion-optimized posts |
| **Tags** | Editorial focus |
| **Homepage / reviews** | What they believe sells |

For real traffic: Ahrefs/Semrush on `blog.curiouscardinals.com`. Re-run: `npm run cc:analyze-blog` → `archives/cc-blog-scrape-latest.json`.

### Tier 1 — Pillar content (longest posts)

| Words | Title | URL |
|------:|-------|-----|
| 6,955 | Ivy League Students Q&A | https://blog.curiouscardinals.com/harvard-stanford-yale |
| 2,933 | How to Set Your 9th Grader Up for Success | https://blog.curiouscardinals.com/how-parents-can-set-up-9th-graders-for-success |
| 2,534 | The Pursuit of Passion: A Manifesto | https://blog.curiouscardinals.com/the-pursuit-of-passion-a-manifesto |
| 2,094 | How High School Students Should Approach Summer | https://blog.curiouscardinals.com/how-high-school-students-should-approach-summer |
| 1,732 | Subscription FAQs | https://blog.curiouscardinals.com/subscription-faqs |

Manifesto also linked from main marketing site — **core brand narrative**.

### Tier 2 — Conversion-optimized (most CTAs)

| CTAs | Title |
|-----:|-------|
| 19 | Announcing Summer 2025: Timeless Skills, Real Impact |
| 18 | The Time I Got a C+ and Dropped out of Honors Math |
| 17 | 10 Top Tips for Writing Your College Essay from Harvard, Stanford… |
| 17 | Meet the Mentors: Comedy Writing with Freddie Shanel |
| 16 | What Our Mentors Wish They Knew Before High School |
| 16 | The Summer I Finally Ended My Relationship With Procrastination |
| 15 | How Cardinals Became Curious |
| 14 | Audrey's Thoughts on Toxic Achievement Culture |
| 14 | Why Having a Mentor Who Looks Like You Changes Lives |

**Pattern:** Parent pain (achievement culture, procrastination, grades) + near-peer mentor relatability + seasonal pushes.

### Tier 3 — PR / credibility spikes

- [TODAY Show](https://blog.curiouscardinals.com/curious-cardinals-on-the-today-show)
- [Turns 3 / CNN](https://blog.curiouscardinals.com/curious-cardinals-turns-3)
- [2025 College Admits](https://blog.curiouscardinals.com/2025-college-admits)
- [Uncommon Schools partnership](https://blog.curiouscardinals.com/curious-cardinals-partners-with-uncommon-schools)

### Tier 4 — Homepage-featured (recency = current strategy)

- Introducing The FlightPlan (May 2026)
- How Podcasts Can Spark Your Teen's Next Passion
- Standout High School Resume / Summer Internship guides

### Editorial themes (121 posts)

| Theme | ~Posts | Avg CTAs | Notes |
|-------|-------:|---------:|-------|
| Mentorship / tutors | 28 | 12.5 | Core positioning vs tutoring |
| Student stories | 18 | 12.6 | Case study / spotlight format |
| Summer / internships | 9 | 12.8 | Seasonal acquisition |
| College admissions | 4 | 12.8 | High word count when present |
| Mental health / pressure | 5 | 12.4 | Founder (Audrey) voice |
| Product / company | 8 | 12.4 | FlightPlan, AI features, FAQs |

**Top tags:** `advice for parents` (46), `student confidence` (15), `experiential learning` (11), `passion journey` (11), `mental health` (7).

### What “worked” for them (synthesis)

1. **Parent-first content marketing** — not student TikTok; blog is for moms/dads  
2. **Mentor ≠ tutor** — manifesto, TODAY Show, achievement-culture posts  
3. **Outcome stories** — film, TED, entrepreneurship (not SAT point gains)  
4. **Seasonal campaigns** — summer, back-to-school, New Year goals  
5. **Long-tail mentor SEO** — thousands of profile URLs  
6. **2026 pivot** — FlightPlan / college strategy layered on passion-project brand  

---

## 4. Illuminairy vs Curious Cardinals

### When families compare us

- “We want a mentor, not a factory prep class.” → CC and Illuminairy both say yes; **we add SAT structure and digital test fluency**.  
- “We want passion projects / research for college.” → **CC wins**; not our live offer.  
- “We need a score by August with a clear plan.” → **Illuminairy wins**.  
- “We want the cheapest option.” → Khan/UWorld win on price; CC at **$380/mo** exceeds our **$1,200** program after ~3.2 months and delivers a different product (mentor hours only).  

### Comparison (internal — do not publish CC name on site without legal review)

| Dimension | Curious Cardinals | Illuminairy |
|-----------|-------------------|-------------|
| Primary outcome | Passion projects, research, college narrative | **SAT score + skills** (August 2026) |
| Program shape | Ongoing mentorship, subscription | **12-week fixed** cohort |
| 1:1 | Weekly mentor sessions | **6 included** + diagnostics-driven |
| Group instruction | Not central | **2×/week live** R&W + Math |
| Test alignment | Generic academic / college | **Digital SAT** (pacing, Desmos, modules) |
| Pricing | **$380/mo** (4× 1-hr sessions); ~$1,140 / 12 weeks | **$1,200** published (full program) |
| Guarantee | Not emphasized same way | **Explicit no score guarantee** |
| Parent visibility | Session notes, roadmaps | **Weekly progress reports** |
| Proof | 10k students, passion outcomes | Cohort outcomes (post–Aug 2026) |
| SEO moat | 2k+ mentor pages | Program + mentor quality over volume |

### Consultation talk track (when CC comes up)

> “Curious Cardinals is built around long-term mentorship and passion projects — great if that's the goal. Their subscription is about **$380 a month for four one-hour mentor sessions** — ongoing, open-ended. We're built for one thing: the August SAT, with a twelve-week plan, diagnostics, six 1:1s, and live classes, for **$1,200 total**. If your student needs a published research project or a multi-year mentor relationship, they're a better fit. If you need structured SAT prep with weekly accountability and digital-test practice, that's us.”

### Messaging to **steal** (adapted, not copied)

Same categories CC used for trust; different job-to-be-done and proof.

| CC trust lever | Illuminairy adaptation |
|----------------|------------------------|
| Mentorship narrative | Near-peer GT mentors (1450+), path illumination, continuity — tied to **August SAT**, not open-ended college narrative |
| Parent-first blog | SAT parent pains (pacing, guarantees, when to start); weekly reports; fit-first consult — see §5 content calendar |
| “Not tutoring” | “Not a marketplace, not self-study” (`programDifferentiation`) |
| Founder authenticity | Brianna voice on guarantees, digital SAT, honest fit |
| Outcome stories | Post–Aug 2026 cohort: score band, study habits, parent quote — **one honest SAT story beats vague passion outcomes** for our ICP |
| Mentor visibility (SEO) | **Curated** mentor pages (quality + program link), not 2k+ thin profiles — target “SAT mentor” + university/geo, not CC’s marketplace scale |
| FAQ / pricing clarity | SAT Accelerator FAQ (tuition, refund, schedule) — published price vs consult-only |

### Messaging to **avoid**

- Passion projects, published research, FlightPlan / college strategy (their **product**, not their trust mechanics)  
- 10k students / 530 reviews scale claims we can't match yet  
- Chasing mentor URL volume without real profiles and program tie-in  

---

## 5. Content strategy for Illuminairy

Full calendar and titles are in **§5** below.

### Priority posts (from CC’s best proxies)

1. SAT Q&A from GT mentors (↔ their Ivy League Q&A pillar)  
2. When to start SAT prep by grade (↔ 9th grader post)  
3. Why we don’t guarantee a score (↔ toxic achievement / founder voice)  
4. SAT Accelerator FAQ (↔ subscription FAQs)  
5. Digital SAT vs paper prep (↔ our moat; they were weak here)  

### Eight-week editorial calendar

| Week | Topic | CTA |
|------|--------|-----|
| 1 | Why we don’t guarantee a score | Consultation |
| 2 | Digital SAT vs paper prep | `/sat-accelerator` |
| 3 | Week-one diagnostics explained | Contact / enroll |
| 4 | When should a freshman think about the SAT? | Calendly |
| 5 | Big class vs 1:1 vs Illuminairy | Home differentiation |
| 6 | Pacing mistakes that cost points | SAT Accelerator |
| 7 | FAQ: tuition, refund, schedule | Enroll |
| 8 | What 1450+ mentors do in 1:1s | `/mentors` |

---

## 6. Research sources & maintenance

| Source | Date |
|--------|------|
| Live site + sitemap scrape | 2026-05-18 |
| Full wget archive | 2026-05-18 |
| Blog analyzer script | `scripts/analyze-curious-cardinals-blog.mjs` |

**Refresh when:** CC changes homepage positioning again; before Illuminairy launches a blog; if considering mentor marketplace expansion.

**Update checklist:**

1. `npm run cc:analyze-blog`  
2. Revise §3 tiers if top posts shift  
3. Update §2 if pivot messaging changes  
4. Sync [sat-competitor-analysis.md](sat-competitor-analysis.md) adjacent-competitor summary  

---

*Contact for archive access: see [archives/README.md](../archives/README.md).*
