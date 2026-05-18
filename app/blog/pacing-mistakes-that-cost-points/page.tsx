import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Eyebrow, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "When Practice Scores Look Good but Test Day Does Not",
  description:
    "What Georgia parents can notice at home on the digital SAT — time on the second half, Desmos and formula use, recognizing math problem types.",
  alternates: {
    canonical: "/blog/pacing-mistakes-that-cost-points"
  }
};

export default function PacingMistakesPostPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog · Digital SAT"
        title="When practice scores look good but test day does not"
        text="Content is not enough — patterns, tools, and pace are what the SAT actually tests."
      />

      <article className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <p className="text-[12px] text-ink-soft">May 18, 2026</p>

        <div className="prose prose-ink mt-8 max-w-none text-[1.0625rem] leading-[1.75] [&_h2]:mt-12 [&_h2]:text-[1.5rem] [&_h2]:font-light [&_h2]:text-ink [&_p]:mt-5 [&_p]:text-ink-soft">
          <p>
            Parents tell us the same story: strong scores on Bluebook at home, then a lower
            score on the official SAT. We see it all the time — students who know the content
            but cannot finish without running out of time. The SAT is not just a content test.
            It also tests the ability to <strong>spot question patterns quickly</strong>, use{" "}
            <strong>Desmos and on-screen tools</strong> to work fast and accurately, and keep an{" "}
            <strong>intensive pace</strong> across a long exam. School rarely trains those three;
            they can be taught.
          </p>

          <h2>Math: tools and approach (what parents can watch)</h2>
          <p>
            On test day they can use built-in Desmos and a formula reference sheet. At home,
            watch one timed math module: do they open those tools at all? Can they say
            what type of problem it was (percent, systems, slope, plug-in answers)? If
            not, “pacing” on Module 2 is often a symptom — not the root cause.
          </p>

          <h2>Why the second timed block feels brutal</h2>
          <p>
            Each section has two parts; the second is harder if the first went well.
            At home you may hear frustration rise on the second module or see them avoid
            full-length timed practice — signs they are not trained for pace and length yet,
            not that you need to analyze how scores changed question by question.
          </p>

          <h2>Length and stamina vs. school</h2>
          <p>
            Classroom tests are often 30, 40, or 50 minutes — one subject, designed to be
            finished in the period, and usually the same difficulty start to finish. The
            digital SAT is about two hours and fourteen minutes of testing, switches between
            Reading &amp; Writing and Math, and the second module in each section is often
            harder. Students who have only practiced the school format can burn out before
            the last questions — even when they do well on homework and class tests.
          </p>

          <h2>One week before you add another resource</h2>
          <p>
            One timed math module on Bluebook (laptop). Note Desmos and reference-sheet
            use, stalls, and whether they can name three miss types. Pick one rule for the
            next session — for example, open Desmos on every equation question, or name the
            problem type before solving. Then add Reading &amp; Writing, then a full test.
          </p>

          <h2>When a twelve-week program helps</h2>
          <p>
            The SAT Accelerator builds in timed section work every week, full-length tests
            on a schedule, and six private 1:1s focused on what your student misses — plus
            a report to you every week so you can see effort and direction, not guess.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-gold/25 bg-gold/5 p-7">
          <Eyebrow tone="gold">Free guide</Eyebrow>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            Download our parent checklist — what to notice at home, questions to ask after
            Bluebook practice, and a one-week plan.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/go/guide">
              Get the pacing check
            </ButtonLink>
            <ButtonLink href="/sat-accelerator" variant="secondary">
              SAT Accelerator
            </ButtonLink>
          </div>
        </div>

        <p className="mt-12 text-[14px] text-ink-soft">
          <Link href="/blog" className="text-gold-deep hover:underline">
            ← All posts
          </Link>
          {" · "}
          <Link href="/guides" className="text-gold-deep hover:underline">
            Parent guides
          </Link>
        </p>
      </article>
    </>
  );
}
