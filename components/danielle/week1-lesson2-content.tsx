import { AgendaTable, SlideEmbed } from "@/components/danielle/week1-shared";

const LESSON2_AGENDA = [
  {
    time: "6:00 to 6:10",
    segment: "Live whiteboard warm-up",
    detail:
      "Quick recap of Session 1 wins, then shared-expression factoring reps (including the y minus c pattern from Module 1)."
  },
  {
    time: "6:10 to 6:40",
    segment: "Factoring quadratics (live)",
    detail:
      "Work through the deck below on the whiteboard: spotting quadratics, GCF, trinomials, AC method, special patterns, and the invisible 1."
  },
  {
    time: "6:40 to 6:55",
    segment: "Apply to your misses",
    detail:
      "Module 1 Q4 again with the new tools. Start Module 2 Q11 setup (radicals and quadratic formula if time)."
  },
  {
    time: "6:55 to 7:00",
    segment: "Wrap + homework",
    detail: "Assign next practice set in the Homework Portal. Note anything still slow for Sunday."
  }
] as const;

export function DanielleWeek1Lesson2Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head" id="lesson-2">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 1 · Lesson 2</p>
        <h1>Factoring quadratics · depth session</h1>
        <p className="danielle-portal__lede">
          Thursday, June 11, 6:00 to 7:00 PM CT · Math. We go deeper on factoring and shared-expression
          recognition — the skills holding the most points back on your diagnostic.
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__lesson">
        <div className="danielle-week1__note-card">
          <p className="danielle-week1__note-label">Thursday session format</p>
          <h3 className="danielle-week1__note-title">Live whiteboard session</h3>
          <p className="danielle-week1__focus">
            Lesson 2 runs on a shared whiteboard so we can work problems together step by step, not
            just click through slides. Review the deck below before Thursday if you want a head
            start — we will rebuild the same ideas live on the board.
          </p>
        </div>

        <p className="danielle-week1__goal-line">
          <strong>Session goal:</strong> shared-expression factoring feels clearer, and you can
          factor a standard trinomial without hesitating on the AC method or the invisible 1.
        </p>

        <AgendaTable rows={LESSON2_AGENDA} />

        <h3 className="danielle-week1__slides-heading">Lesson 2 reference deck</h3>
        <p className="danielle-week1__focus">
          This is the full factoring-and-quadratics deck for Thursday. We will work through it live
          on the whiteboard; use it here to preview or review after class.
        </p>
        <SlideEmbed
          title="Factoring quadratics for the SAT · Lesson 2"
          src="/danielle/files/lesson-2-slides"
        />
      </section>
    </div>
  );
}
