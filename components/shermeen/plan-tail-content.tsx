import Link from "next/link";

export function ShermeenPlanTailContent() {
  return (
    <section>
      <div className="eyebrow">The Plan</div>

      <p className="subh">Check-ins</p>
      <ul className="checks">
        <li>
          <b>Week 1.</b> Review every miss from the June 23 diagnostic (math session, then Reading and
          Writing).
        </li>
        <li>
          <b>Week 5.</b> Full-length timed practice test after the Week 4 skill block.
        </li>
        <li>
          <b>Week 9.</b> Second full-length timed practice test after the Week 8 skill block.
        </li>
        <li>
          <b>Week 11.</b> Third full-length timed practice test under test conditions.
        </li>
        <li>
          <b>Week 12.</b> Review every miss from the week 11 test and build her next-step SAT plan
          together.
        </li>
      </ul>

      <p className="note">
        Question-level misses and teaching notes live on the{" "}
        <Link href="/shermeen/diagnostic">diagnostic analysis</Link> page.
      </p>
    </section>
  );
}
