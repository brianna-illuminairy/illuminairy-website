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

Danielle's weekly SAT progress report for June 16–23, 2026 is ready on her private Illuminairy portal:
https://illuminairy.com/danielle/week-2/report

Overview:

Danielle is on track for her goal of 1400 on the August 22 test.
We estimate her score at about 1210 today, up about 35 points from about 1175 last week (85 points total since her June 6 practice test at 1125).
She completed 2 tutoring sessions and 116 practice problems this week (71 on Transitions, 45 on equivalent expressions).
Both sessions were Reading and Writing on Transitions. She also kept working week-one Math homework on nonlinear equations and equivalent expressions.
Transitions accuracy moved from missing all three on the June 6 test to 96% on flashcards and 87% across transition problem sets; overall homework accuracy rose from 89% to 91%.
Next week: two Math sessions on nonlinear functions and nonlinear equations, her first full-length practice test, and finishing the timed Transitions homework set.

The full report has session summaries, homework breakdown, and her score chart at the link above.

This week:

Finish Transitions timed homework (30 questions, due June 28).
Two Math sessions on nonlinear functions and nonlinear equations, with special factoring cases (difference of squares, squared binomials, and similar patterns).
Keep reviewing medium equivalent expression miss types until 95% accuracy (assignment already complete).
First full-length practice test at end of week.

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
