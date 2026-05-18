# Curious Cardinals — Content Performance Analysis

**Date:** 2026-05-18  
**Scope:** 121 blog posts + marketing site messaging (public data only)

## Important limitation

**Actual traffic (pageviews, sessions) is not publicly available.** HubSpot does not expose view counts on blog posts, and we do not have access to their Google Analytics or Search Console.

The rankings below use **proxy signals** you can verify without their internal dashboards:

| Signal | What it indicates |
|--------|-------------------|
| Word count | SEO / pillar investment |
| CTA links to curiouscardinals.com | Marketing prioritized conversion |
| Tag frequency | Editorial focus over time |
| Homepage / reviews placement | What they believe converts |
| Media & partnership posts | Credibility spikes (PR, not necessarily SEO) |

For **real traffic by URL**, use [Ahrefs](https://ahrefs.com) or [Semrush](https://semrush.com) on `blog.curiouscardinals.com` (free trials available).

---

## Blog: likely highest-performing content (by proxy)

### Tier 1 — Pillar / SEO investments (longest, deepest)

These are the posts Curious Cardinals invested the most writing effort in — typical of content meant to rank and nurture parents over months:

| Words | Post | URL |
|------:|------|-----|
| 6,955 | Ivy League Students Q&A | https://blog.curiouscardinals.com/harvard-stanford-yale |
| 2,933 | How to Set Your 9th Grader Up for Success | https://blog.curiouscardinals.com/how-parents-can-set-up-9th-graders-for-success |
| 2,534 | The Pursuit of Passion: A Manifesto | https://blog.curiouscardinals.com/the-pursuit-of-passion-a-manifesto |
| 2,094 | How High School Students Should Approach Summer | https://blog.curiouscardinals.com/how-high-school-students-should-approach-summer |
| 1,732 | Subscription FAQs | https://blog.curiouscardinals.com/subscription-faqs |

The **Passion Manifesto** is also linked from the main marketing site (`/blog/the-pursuit-of-passion-a-manifesto`), signaling it’s core brand narrative content.

### Tier 2 — Conversion-optimized posts (most CTAs)

High CTA density usually means the post was built to drive consult bookings, not just inform:

| CTAs | Post |
|-----:|------|
| 19 | Announcing Summer 2025: Timeless Skills, Real Impact |
| 18 | The Time I Got a C+ and Dropped out of Honors Math |
| 17 | 10 Top Tips for Writing Your College Essay from Harvard, Stanford… |
| 17 | Meet the Mentors: Comedy Writing with Freddie Shanel |
| 16 | What Our Mentors Wish They Knew Before High School |
| 16 | The Summer I Finally Ended My Relationship With Procrastination |
| 15 | How Cardinals Became Curious (origin story) |
| 14 | Audrey's Thoughts on Toxic Achievement Culture |
| 14 | Why Having a Mentor Who Looks Like You Changes Lives |

**Pattern:** Parent pain points (achievement culture, procrastination, math struggles) + mentor relatability + seasonal pushes (summer, back-to-school).

### Tier 3 — Credibility / PR spikes

Likely drove bursts of traffic or brand trust rather than steady organic search:

- [Curious Cardinals on The TODAY Show](https://blog.curiouscardinals.com/curious-cardinals-on-the-today-show)
- [Curious Cardinals Turns 3!](https://blog.curiouscardinals.com/curious-cardinals-turns-3) (CNN mention)
- [2025 College Admits](https://blog.curiouscardinals.com/2025-college-admits)
- [Curious Cardinals Partners with Uncommon Schools](https://blog.curiouscardinals.com/curious-cardinals-partners-with-uncommon-schools)

### Tier 4 — Recent homepage-featured (2025–2026)

What they’re promoting *now* on the blog index (recency ≠ traffic, but shows current strategy):

- Introducing The FlightPlan (May 2026 — **current pivot**)
- How Podcasts Can Spark Your Teen's Next Passion
- How to Create a Standout High School Resume
- How to Land Your Dream High School Summer Internship

---

## Blog: editorial themes (121 posts)

| Theme | ~Posts | Avg CTAs | Insight |
|-------|-------:|---------:|---------|
| Parent advice | 46 tags | — | Dominant audience: **parents**, not students |
| Mentorship / tutors | 28 titles | — | Core positioning vs traditional tutoring |
| Summer / internships | 8+ | High on seasonal posts | Seasonal acquisition play |
| College admissions | Few titles, high CTA on essay post | Conversion-focused |
| Mental health / pressure | 7+ tags | Audrey’s voice posts | Differentiation from “tutor” brands |
| Product announcements | FlightPlan, Lightbulb, AI session notes | Funnel support content |

**Top tags:** `advice for parents` (46), `student confidence` (15), `experiential learning` (11), `passion journey` (11), `mental health` (7).

---

## Marketing site: what they treat as “winning” proof

### Homepage (May 2026 pivot)

- **FlightPlan** — new flagship offer (“clearer college strategy”)
- Outcomes: published researcher, national awards, straight A’s, college apps
- Social proof: 10,000+ students, 530+ reviews (5.0), press logos

### Reviews / case studies (featured success stories)

| Student | Outcome | Track |
|---------|---------|-------|
| Brandon | Award-worthy horror film → festival | Film / Theater |
| Silver | AI passion project → TED Talk, Diller finalist | ML / AI |
| Carson | Financial literacy summit, Scholastic Silver Key | Entrepreneurship |

These three are the **hero narratives** on `/reviews` — strong signal of what outcomes they sell best.

### Product tracks (sitemap)

- Passion project (`/passion-project`)
- Research (`/research`)
- Academic mentorship (`/academic-mentorship`)
- Organization / content creation / portfolio (passion sub-tracks)

### Mentor directory scale

- ~474 Webflow `/our-mentors/*` pages
- ~2,196 app `/mentors/*` profiles  
→ **Supply-side SEO** was a major growth lever (long-tail “mentor near me” / topic pages).

---

## What “successful” looked like for them (synthesis)

1. **Parent-first content marketing** — anxiety, achievement culture, executive function, college prep  
2. **Mentor ≠ tutor** — repeated thought leadership (manifesto, TODAY Show, toxic achievement culture)  
3. **Outcome stories** — film festivals, TED talks, published research, college admits  
4. **Seasonal campaigns** — summer programs, back-to-school, New Year goals  
5. **Long-tail mentor SEO** — hundreds of profile pages  
6. **Pivot (2026)** — FlightPlan / college strategy productization on top of passion-project brand  

---

## How to get actual traffic numbers

If you need definitive rankings:

1. **Ahrefs Site Explorer** → `blog.curiouscardinals.com` → Top pages by organic traffic  
2. **Google Search Console** — only if you have (or had) admin access  
3. **HubSpot analytics export** — only with internal access  
4. **Wayback + press** — rough timeline of PR spikes, not page-level traffic  

---

## Raw data

Scrape of all 121 posts (title, word count, CTA count, tags) was run 2026-05-18. Re-run:

```bash
curl -sL https://blog.curiouscardinals.com/sitemap.xml | tr '<' '\n' | grep '^loc>' | sed 's/^loc>//' > urls.txt
# then scrape each URL (see conversation / scripts)
```
