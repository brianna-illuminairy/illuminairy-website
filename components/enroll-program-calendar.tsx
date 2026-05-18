import { satProgram, site } from "@/lib/site";
import {
  getSatExamFinale,
  getSatProgramWeeks,
  SAT_EXAM_DAY,
  SAT_PROGRAM_START
} from "@/lib/sat-program-schedule";

const weeks = getSatProgramWeeks();
const examFinale = getSatExamFinale();

const summaryStats = [
  { value: String(satProgram.weeks), label: "Weeks of live instruction" },
  { value: "2", label: "Classes per week (R&W + Math)" },
  { value: String(satProgram.privateSessions), label: "Private 1:1 sessions" },
  { value: "4", label: "Full-length timed practice SATs" }
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
          Live class
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-marigold-ink/40 bg-marigold/25" aria-hidden="true" />
          Diagnostic (week 1)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-gold" aria-hidden="true" />
          Private 1:1
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm border border-dashed border-ink/25 bg-ivory-200" aria-hidden="true" />
          Practice set
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-sm border border-navy/30 bg-navy/15" aria-hidden="true" />
          Full-length timed SAT
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-gold-deep bg-gold/20" aria-hidden="true" />
          Weekly report
        </span>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
        Georgia Tech mentors (1450+ SAT). Your class days and times are set at
        onboarding — below is the full schedule from {satProgram.programStartLabel} through the{" "}
        {site.satDate} exam.
      </p>

      <div
        className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
        role="img"
        aria-label={`Twelve week SAT Accelerator from ${SAT_PROGRAM_START} through ${SAT_EXAM_DAY}: diagnostics in week one, live classes, three to five practice sets per week, full-length timed practice tests every three weeks, six private sessions, weekly progress reports, and the August 22 SAT exam`}
      >
        {weeks.map((w) => (
          <div
            key={w.week}
            className="flex flex-col rounded-xl border border-line bg-ivory-50 p-2.5 sm:p-3"
          >
            <div className="mb-2 flex items-start justify-between gap-1">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gold-deep">
                  Week {w.week}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold leading-snug text-ink">
                  {w.dateLabel}
                </p>
              </div>
              <span
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full border-2 border-gold-deep bg-gold/25"
                title="Weekly report to student and parents"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="grid grid-cols-2 gap-1">
                {w.isDiagnosticWeek ? (
                  <>
                    <SessionBlock label="R&W diag" tone="diagnostic" />
                    <SessionBlock label="Math diag" tone="diagnostic" />
                  </>
                ) : (
                  <>
                    <SessionBlock label="R&W" tone="navy" />
                    <SessionBlock label="Math" tone="navy" />
                  </>
                )}
              </div>
              {w.hasOneOnOne ? (
                <SessionBlock label="1:1 mentor" tone="gold" wide />
              ) : (
                <div className="h-[22px]" aria-hidden="true" />
              )}
              <PracticeSets count={w.practiceCount} />
              {w.hasFullLengthTest ? (
                <FullLengthTestBlock />
              ) : null}
            </div>
          </div>
        ))}

        <div className="flex flex-col rounded-xl border-2 border-gold-deep/40 bg-gradient-to-b from-gold/15 to-marigold/10 p-2.5 sm:col-span-2 sm:p-3 lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gold-deep">
            Grand finale
          </p>
          <p className="mt-1 text-[13px] font-semibold leading-snug text-ink">
            {examFinale.dateLabel}
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-ink-muted">
            {examFinale.weekday} · SAT exam day
          </p>
          <div className="mt-3 flex min-h-[52px] flex-1 items-center justify-center rounded-lg border border-gold-deep/30 bg-ivory/90 px-3 py-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-marigold-ink">
              Official SAT
            </p>
          </div>
        </div>
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
  tone: "navy" | "gold" | "diagnostic";
  wide?: boolean;
}) {
  const styles =
    tone === "navy"
      ? "bg-navy text-ivory"
      : tone === "gold"
        ? "bg-gold text-ink"
        : "border border-marigold-ink/35 bg-marigold/20 text-marigold-ink";
  return (
    <div
      className={`flex min-h-[22px] items-center justify-center rounded-md px-0.5 text-center text-[8px] font-semibold leading-tight sm:text-[9px] ${styles} ${wide ? "col-span-2" : ""}`}
    >
      {label}
    </div>
  );
}

function PracticeSets({ count }: { count: number }) {
  return (
    <div
      className="mt-auto flex flex-wrap justify-center gap-0.5 pt-0.5"
      title={`${count} practice problem sets this week`}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex h-[14px] w-[14px] items-center justify-center rounded-[3px] border border-dashed border-ink/25 bg-ivory-200/90 text-[7px] font-bold text-ink-muted"
          aria-hidden="true"
        >
          P
        </div>
      ))}
    </div>
  );
}

function FullLengthTestBlock() {
  return (
    <div
      className="rounded-md border border-navy/25 bg-navy/10 px-1 py-1 text-center text-[8px] font-bold uppercase leading-tight tracking-[0.06em] text-navy"
      title="Full-length timed practice SAT"
    >
      Full-length timed SAT
    </div>
  );
}
