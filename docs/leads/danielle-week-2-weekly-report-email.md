# Danielle Week 2 weekly report email

**Send when:** Week 2 report is live at `/danielle/week-2/report`  
**To:** Danielle + Amma (same thread as Week 1)

## Subject

```
Danielle's Weekly SAT Progress Report | June 16–23, 2026
```

## Body (plain text)

```
Hi Danielle & Amma,

Danielle's weekly SAT progress report for June 16–23, 2026 is ready on her private Illuminairy portal, https://illuminairy.com/danielle/week-2/report

Highlights from last week:

Completed 2 one-hour tutoring sessions on Reading and Writing (4 total sessions so far), both on transitions (linking-word questions).
Overall practice accuracy: 67% on the diagnostic, 89% in week 1, 91% this week (93 questions).
Transitions: missed all 3 on the diagnostic; this week scored 96% on practice set 1 (26/27), 96% on flashcards after review, and 88% on the harder untimed set (14/16).
Equivalent Expressions (Math, from week 1): 95% on easy (goal met), 72% on medium (still working toward 95%).
Homework still due: Transitions 3 timed set (30 questions, due June 28).
On her own she started Command of Evidence and Right Triangles practice (not yet taught in sessions).
Study plan: 2 of 11 priority skills taught in sessions so far (equivalent expressions and transitions).
She remains on track for her 1400 goal on the August 22 test. We estimate she is around 1200–1225 today.

This week:

Finish Transitions 3 timed set: 30 hard questions in one sitting, due June 28.
Two Math sessions continuing in the advanced Math section (~35% of SAT Math): perfect squares, exponentials, quadratic formula, and discriminant.
Review 5 diagnostic misses in nonlinear equations and systems; continue medium equivalent expressions until she hits 95% on her own.
First full-length practice test at the end of the week (June 23 to 30) under real test conditions. This shows score improvement since her June 6 diagnostic and whether she is on track for 1400 (first-month checkpoint: about +100 points, roughly 1225+).
Sessions stay hands-on: live problems and drills, not long lectures.

Thanks,

Brianna Zajicek

Illuminairy SAT Tutoring
brianna@illuminairy.com
```

## Send via script (after deploy)

```bash
ADMIN_SECRET=... \
PARENT_EMAIL=... \
STUDENT_EMAIL=... \
PARENT_FIRST=Amma \
npm run danielle:send-weekly-report
```

Defaults to Week 2. For Week 1: `REPORT_WEEK=1`.
