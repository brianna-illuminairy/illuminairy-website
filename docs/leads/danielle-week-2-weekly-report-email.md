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

Completed 2 one-hour tutoring sessions on Reading and Writing (4 total sessions so far), both focused on Transitions.
Completed 93 practice questions at 91% accuracy, which is a 24-point increase versus her diagnostic baseline of 67% accuracy.
Transitions 1: 26/27 correct (96%). After we reviewed her medium misses in session 2, she scored 96% on portal flashcards.
Equivalent Expressions: 19/20 on easy (95%, goal met). Medium set: 18/25 (72%). She should keep running medium sets until she hits 95% on her own.
Transitions 2: 22/28 (reviewed live in session 2). Transitions 3 untimed (hard): 14/16. Transitions 3 timed (30 hard) due June 28.
On her own she has also been working through Command of Evidence and Right Triangles practice (not yet assigned in sessions).
She remains on track for her 1400 goal on the August 22 test. We estimate she is around 1200–1225 today.

This week:

Finish Transitions 3 · Timed: 30 hard questions in one sitting, due June 28.
Two Math sessions on advanced algebra: perfect squares, exponentials, the quadratic formula, and the discriminant.
Continue medium Equivalent Expressions until she hits 95% independently.
First full-length practice test at the end of the week (June 23 to 30) under real test conditions. This shows score improvement since her June 6 diagnostic and whether she is on track for 1400 (first-month checkpoint: about +100 points, roughly 1225+).
We will keep sessions interactive: live problems and drills, not long slide lectures.

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
