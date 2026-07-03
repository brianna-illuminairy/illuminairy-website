# Danielle Week 3 weekly report email

**Send when:** Week 3 report is live at `/danielle/week-3/report`  
**To:** Danielle + Amma (same thread as prior weeks)

## Subject

```
Danielle's Weekly SAT Progress Report | June 23–30, 2026
```

## Body (plain text)

```
Hi Danielle & Amma,

Danielle's weekly SAT progress report for June 23–30, 2026 is ready on her private Illuminairy portal:
https://illuminairy.com/danielle/week-3/report

Overview:

Danielle is on track for her goal of 1400 on the August 22 test.
We estimate her score at about 1220 today, up about 10 points from about 1210 last week (95 points total since her June 6 practice test at 1125).
She completed 2 tutoring sessions and 119 practice problems this week at 73% average accuracy.
Both sessions were Math on equivalent expressions. She has moved onto advanced or hard transition questions for Reading and Writing and hard equivalent-expression questions for Math.
She is showing a much stronger command of factoring and is starting to internalize our work on quadratics; she scored 87.5% on hard transitions untimed and 84.3% on her timed equivalent-expressions quiz (100% on easy).
Next week: 3 sessions (one moved from this week), command of evidence in Reading and Writing, nonlinear functions, equations, and systems in Math, and a full-length timed practice test at the end of the week to re-baseline her score.

The full report has session summaries, homework breakdown, and her score chart at the link above.

This week:

Three tutoring sessions (one moved from last week).
Reading and Writing: command of evidence.
Math: nonlinear functions, equations, and systems — builds on equivalent expressions.
Finish reviewing remaining Equivalent Expressions 3 misses independently.
Full-length timed practice test at end of week to re-baseline score vs June 6.

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

Defaults to Week 3. For Week 2: `REPORT_WEEK=2`. For Week 1: `REPORT_WEEK=1`.
