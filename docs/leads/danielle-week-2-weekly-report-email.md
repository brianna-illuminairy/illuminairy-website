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

Completed 2 one-hour tutoring sessions on Reading and Writing — study plan #7 Transitions (+22 modeled pts).
Diagnostic: missed 3 transitions (easy, medium, hard). Practice now: 96% set 1, 96% flashcards, 88% hard untimed.
Week 1: factoring and equivalent expressions (foundation for #4/#5 Advanced Math) plus study plan #5 Nonlinear equations (+24): 2 diagnostic misses; 8 equation items on the test (13 with #4).
Equivalent expressions homework: 95% easy, 72% medium — same algebra runs on most quadratics and nonlinear items, not just the one EE question type.
Overall practice: 67% on June 6 diagnostic (66/98) → 89% week 1 → 91% week 2.
Module routing: harder Module 2 in both sections; RW 19/27 and Math 16/22 in Module 1 (1 question above cutoff each).
On her own: started #3 Command of evidence practice (3 diagnostic misses; not taught in sessions yet).
Estimated score ~1200–1225 today vs 1100–1150 diagnostic. Goal 1400 on August 22.

This week:

Finish #7 Transitions timed homework (30 questions, due June 28).
Two Math sessions: #4 Nonlinear functions + continue #5 Nonlinear equations (quadratic formula, discriminant; review both diagnostic misses in #5).
Keep equivalent expressions medium sets until 95%.
First full-length practice test at end of week — real score vs June 6 baseline (first-month checkpoint: about +100 pts, roughly 1225+).
Sessions stay hands-on: live problems and drills.

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
