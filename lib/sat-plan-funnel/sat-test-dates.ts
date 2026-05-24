export type SatTestDateOption = {
  id: string;
  label: string;
  ariaLabel: string;
  examDay?: string;
};

/** Minimum calendar days before an exam date is shown as selectable. */
export const SAT_TEST_DATE_MIN_LEAD_DAYS = 28;

const EXAM_DATES: SatTestDateOption[] = [
  {
    id: "test_date_mar_2026",
    label: "March 2026 SAT",
    ariaLabel: "March 2026 SAT",
    examDay: "2026-03-14"
  },
  {
    id: "test_date_may_2026",
    label: "May 2026 SAT",
    ariaLabel: "May 2026 SAT",
    examDay: "2026-05-02"
  },
  {
    id: "test_date_jun_2026",
    label: "June 2026 SAT",
    ariaLabel: "June 2026 SAT",
    examDay: "2026-06-06"
  },
  {
    id: "test_date_aug_2026",
    label: "August 2026 SAT",
    ariaLabel: "August 2026 SAT",
    examDay: "2026-08-22"
  },
  {
    id: "test_date_oct_2026",
    label: "October 2026 SAT",
    ariaLabel: "October 2026 SAT",
    examDay: "2026-10-03"
  },
  {
    id: "test_date_nov_2026",
    label: "November 2026 SAT",
    ariaLabel: "November 2026 SAT",
    examDay: "2026-11-07"
  },
  {
    id: "test_date_dec_2026",
    label: "December 2026 SAT",
    ariaLabel: "December 2026 SAT",
    examDay: "2026-12-05"
  }
];

const META_OPTIONS: SatTestDateOption[] = [
  {
    id: "test_date_not_sure",
    label: "Not sure yet",
    ariaLabel: "Not sure yet when to take the SAT"
  },
  {
    id: "test_date_not_planning",
    label: "Not planning to retake / take",
    ariaLabel: "Not planning to retake or take the SAT"
  }
];

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysUntil(examDay: string, now: Date): number {
  const exam = parseLocalDate(examDay);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(exam.getFullYear(), exam.getMonth(), exam.getDate());
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/** Upcoming exam rows + meta options for the test-date step. */
export function getSatTestDateOptions(now: Date = new Date()): SatTestDateOption[] {
  const upcoming = EXAM_DATES.filter((row) => {
    if (!row.examDay) return false;
    return daysUntil(row.examDay, now) >= SAT_TEST_DATE_MIN_LEAD_DAYS;
  });
  return [...upcoming, ...META_OPTIONS];
}

export type TestDateId =
  | (typeof EXAM_DATES)[number]["id"]
  | (typeof META_OPTIONS)[number]["id"];
