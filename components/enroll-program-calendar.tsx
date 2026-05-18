import { site } from "@/lib/site";

const totalWeeks = 12;
const groupPerWeek = 2;
const oneOnOneWeeks = [2, 4, 6, 8, 10, 12];

const weeks = Array.from({ length: totalWeeks }, (_, i) => {
  const week = i + 1;
  return {
    week,
    groupSessions: groupPerWeek,
    hasOneOnOne: oneOnOneWeeks.includes(week)
  };
});

const summaryStats = [
  { value: "12", label: "Weeks of live instruction" },
  { value: "30", label: "Live sessions total" },
  { value: "10", label: "Max per small group" },
  { value: "6", label: "Private 1:1 sessions" }
];

export function EnrollProgramCalendar() {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-line bg-ivory px-3 py-3 text-center sm:px-4"
          >
            <p className="text-[1.5rem] font-light tracking-[-0.03em] text-ink">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-navy" aria-hidden="true" />
          Live cohort (×2 / week)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-gold" aria-hidden="true" />
          Private 1:1
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-sm border border-dashed border-ink/25 bg-ivory-200" aria-hidden="true" />
          Assigned practice
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-gold-deep bg-gold/20" aria-hidden="true" />
          Weekly report
        </span>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
        Georgia Tech mentors (1450+ SAT). Your cohort&apos;s exact days and times are
        set at onboarding — below is the full 12-week rhythm every family receives.
      </p>

      <div
        className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
        role="img"
        aria-label="Twelve week SAT Accelerator schedule: two live cohort sessions per week, six private sessions across the program, practice between sessions, and a weekly progress report every week"
      >
        {weeks.map((w) => (
          <div
            key={w.week}
            className="flex flex-col rounded-xl border border-line bg-ivory-50 p-2.5 sm:p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-gold-deep">
                Wk {w.week}
              </span>
              <span
                className="h-2 w-2 shrink-0 rounded-full border-2 border-gold-deep bg-gold/25"
                title="Weekly report to student and parents"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="grid grid-cols-2 gap-1">
                <SessionBlock label="Cohort" tone="navy" />
                <SessionBlock label="Cohort" tone="navy" />
              </div>
              {w.hasOneOnOne ? (
                <SessionBlock label="1:1 mentor" tone="gold" wide />
              ) : (
                <div className="h-[22px]" aria-hidden="true" />
              )}
              <div
                className="mt-auto min-h-[20px] rounded-md border border-dashed border-ink/20 bg-ivory-200/80 px-1.5 py-1 text-center text-[9px] font-medium leading-tight text-ink-muted"
                title="Assigned practice with review in the next live session"
              >
                Practice
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-xl border border-marigold/20 bg-marigold/10 px-4 py-3 text-[13px] font-medium leading-relaxed text-marigold-ink">
        1:1 mentors and small groups fill up fast — payment holds your spot for the{" "}
        {site.satDate} SAT.
      </p>
    </div>
  );
}

function SessionBlock({
  label,
  tone,
  wide
}: {
  label: string;
  tone: "navy" | "gold";
  wide?: boolean;
}) {
  const bg = tone === "navy" ? "bg-navy text-ivory" : "bg-gold text-ink";
  return (
    <div
      className={`flex min-h-[22px] items-center justify-center rounded-md px-1 text-center text-[9px] font-semibold leading-tight ${bg} ${wide ? "col-span-2" : ""}`}
    >
      {label}
    </div>
  );
}
