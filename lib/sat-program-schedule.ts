import { satProgram } from "@/lib/site";

/** First instructional week — Wednesday of the week after launch (May 27, 2026). */
export const SAT_PROGRAM_START = "2026-05-27";

/** Official exam day — shown as the final calendar block. */
export const SAT_EXAM_DAY = "2026-08-22";

const oneOnOneWeeks = new Set([2, 4, 6, 8, 10, 12]);
/** Practice problem sets per week — repeats 3, 4, 5. */
const practiceCycle = [3, 4, 5] as const;

function parseLocalDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

function formatWeekRange(start: Date, end: Date) {
  const month = new Intl.DateTimeFormat("en-US", { month: "short" });
  const sm = month.format(start);
  const em = month.format(end);
  const sd = start.getDate();
  const ed = end.getDate();
  if (sm === em) return `${sm} ${sd}–${ed}`;
  return `${sm} ${sd} – ${em} ${ed}`;
}

function formatExamDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export type SatProgramWeek = {
  week: number;
  dateLabel: string;
  hasOneOnOne: boolean;
  /** Week 1 — baseline diagnostics in R&W and Math. */
  isDiagnosticWeek: boolean;
  practiceCount: number;
  /** Weeks 3, 6, 9, 12 — full-length timed practice SAT. */
  hasFullLengthTest: boolean;
};

export function getPracticeCountForWeek(week: number) {
  return practiceCycle[(week - 1) % practiceCycle.length];
}

export type SatExamFinale = {
  dateLabel: string;
  weekday: string;
};

export function getSatProgramWeeks(): SatProgramWeek[] {
  const start = parseLocalDate(SAT_PROGRAM_START);
  const weeks: SatProgramWeek[] = [];

  for (let i = 0; i < satProgram.weeks; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekNum = i + 1;
    weeks.push({
      week: weekNum,
      dateLabel: formatWeekRange(weekStart, weekEnd),
      hasOneOnOne: oneOnOneWeeks.has(weekNum),
      isDiagnosticWeek: weekNum === 1,
      practiceCount: getPracticeCountForWeek(weekNum),
      hasFullLengthTest: weekNum % 3 === 0
    });
  }

  return weeks;
}

export function getSatExamFinale(): SatExamFinale {
  const exam = parseLocalDate(SAT_EXAM_DAY);
  return {
    dateLabel: formatExamDay(exam),
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(exam)
  };
}
