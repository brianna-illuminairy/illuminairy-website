import {
  TYPEFORM_ENROLLMENT_FIELD_TITLES as T,
  TYPEFORM_ENROLLMENT_FORM_ID,
} from "@/lib/crm/typeform-enrollment-fields";

export type TypeformEnrollmentIntake = {
  typeformToken: string;
  formId: string;
  submittedAt?: string;
  parentFirst: string;
  parentLast: string;
  parentEmail: string;
  parentPhone: string;
  secondParent: {
    first: string;
    last: string;
    phone: string;
    email: string;
  } | null;
  studentFirst: string;
  studentLast: string;
  studentGrade: string;
  studentSchool: string;
  studentPhone: string;
  studentEmail: string;
  satTakenBefore: boolean;
  scoreReportUrl: string | null;
  tutoringWindows: string[];
  diagnosticAssessmentTime: string | null;
  diagnosticReviewTime: string | null;
};

type TypeformAnswer = {
  field?: { id?: string; title?: string; type?: string };
  type?: string;
  text?: string;
  email?: string;
  phone_number?: string;
  boolean?: boolean;
  choice?: { label?: string };
  choices?: { labels?: string[] };
  file_url?: string;
};

type TypeformWebhookBody = {
  event_type?: string;
  form_response?: {
    form_id?: string;
    token?: string;
    submitted_at?: string;
    answers?: TypeformAnswer[];
  };
};

function normTitle(title: string | undefined): string {
  return (title ?? "").trim();
}

function normPhone(raw: string | undefined): string {
  const v = (raw ?? "").trim().replace(/^'/, "");
  return v || "";
}

function normEmail(raw: string | undefined): string {
  return (raw ?? "").trim().toLowerCase();
}

function answerText(answer: TypeformAnswer | undefined): string {
  if (!answer) return "";
  if (typeof answer.text === "string") return answer.text.trim();
  if (typeof answer.email === "string") return answer.email.trim();
  if (typeof answer.phone_number === "string") return answer.phone_number.trim();
  if (answer.choice?.label) return answer.choice.label.trim();
  if (answer.choices?.labels?.length) return answer.choices.labels.join(", ").trim();
  if (typeof answer.file_url === "string") return answer.file_url.trim();
  if (typeof answer.boolean === "boolean") return answer.boolean ? "1" : "0";
  return "";
}

function answerBoolean(answer: TypeformAnswer | undefined): boolean {
  if (!answer) return false;
  if (typeof answer.boolean === "boolean") return answer.boolean;
  const t = answerText(answer).toLowerCase();
  return t === "1" || t === "true" || t === "yes";
}

function answersByTitle(answers: TypeformAnswer[]): Map<string, TypeformAnswer> {
  const map = new Map<string, TypeformAnswer>();
  for (const a of answers) {
    const title = normTitle(a.field?.title);
    if (title) map.set(title, a);
  }
  return map;
}

function rowGet(row: Record<string, string>, title: string): string {
  return (row[title] ?? "").trim();
}

function parseSecondParent(row: Record<string, string>, addSecond: boolean) {
  if (!addSecond) return null;
  const first = rowGet(row, T.secondParentFirst);
  const last = rowGet(row, T.secondParentLast);
  const phone = normPhone(rowGet(row, T.secondParentPhone));
  const email = normEmail(rowGet(row, T.secondParentEmail));
  if (!first && !last && !phone && !email) return null;
  return { first, last, phone, email };
}

function tutoringWindowsFromRow(row: Record<string, string>): string[] {
  return [
    T.tutoringWindow1,
    T.tutoringWindow2,
    T.tutoringWindow3,
    T.tutoringWindow4,
  ]
    .map((key) => rowGet(row, key))
    .filter(Boolean);
}

function tutoringWindowsFromAnswers(map: Map<string, TypeformAnswer>): string[] {
  return [
    T.tutoringWindow1,
    T.tutoringWindow2,
    T.tutoringWindow3,
    T.tutoringWindow4,
  ]
    .map((title) => answerText(map.get(title)))
    .filter(Boolean);
}

function buildIntake(
  token: string,
  formId: string,
  submittedAt: string | undefined,
  get: (title: string) => string,
  getBool: (title: string) => boolean,
  windows: string[],
  scoreReport: string
): TypeformEnrollmentIntake | { error: string } {
  const parentEmail = normEmail(get(T.parentEmail));
  const parentFirst = get(T.parentFirst);
  const parentLast = get(T.parentLast);
  const parentPhone = normPhone(get(T.parentPhone));
  const studentFirst = get(T.studentFirst);
  const studentLast = get(T.studentLast);

  if (!parentEmail || !parentFirst || !studentFirst) {
    return { error: "missing_required_fields" };
  }

  const addSecond = getBool(T.addSecondParent);
  const secondFirst = get(T.secondParentFirst);
  const secondLast = get(T.secondParentLast);
  const secondPhone = normPhone(get(T.secondParentPhone));
  const secondEmail = normEmail(get(T.secondParentEmail));
  const secondParent =
    addSecond && (secondFirst || secondLast || secondPhone || secondEmail)
      ? {
          first: secondFirst,
          last: secondLast,
          phone: secondPhone,
          email: secondEmail,
        }
      : null;

  return {
    typeformToken: token,
    formId,
    submittedAt,
    parentFirst,
    parentLast,
    parentEmail,
    parentPhone,
    secondParent,
    studentFirst,
    studentLast,
    studentGrade: get(T.studentGrade),
    studentSchool: get(T.studentSchool),
    studentPhone: normPhone(get(T.studentPhone)),
    studentEmail: normEmail(get(T.studentEmail)),
    satTakenBefore: getBool(T.satTakenBefore),
    scoreReportUrl: scoreReport || null,
    tutoringWindows: windows,
    diagnosticAssessmentTime: get(T.diagnosticAssessment) || null,
    diagnosticReviewTime: get(T.diagnosticReview) || null,
  };
}

/** Parse Typeform `form_response` webhook payload. */
export function parseTypeformEnrollmentWebhook(
  body: TypeformWebhookBody
): TypeformEnrollmentIntake | { error: string } {
  if (body.event_type !== "form_response") {
    return { error: "unsupported_event_type" };
  }
  const fr = body.form_response;
  if (!fr?.token) return { error: "missing_token" };

  const formId = fr.form_id ?? TYPEFORM_ENROLLMENT_FORM_ID;
  const expected = process.env.TYPEFORM_ENROLLMENT_FORM_ID?.trim();
  if (expected && formId !== expected) {
    return { error: "wrong_form_id" };
  }

  const map = answersByTitle(fr.answers ?? []);
  const get = (title: string) => answerText(map.get(title));
  const getBool = (title: string) => answerBoolean(map.get(title));
  const scoreReport = answerText(map.get(T.scoreReportUpload));
  const windows = tutoringWindowsFromAnswers(map);

  return buildIntake(
    fr.token,
    formId,
    fr.submitted_at,
    get,
    getBool,
    windows,
    scoreReport
  );
}

/** Parse one CSV export row (Typeform responses download). */
export function parseTypeformEnrollmentCsvRow(
  row: Record<string, string>
): TypeformEnrollmentIntake | { error: string } {
  const token =
    rowGet(row, "#") ||
    rowGet(row, "token") ||
    rowGet(row, "Response Token") ||
    `csv_${rowGet(row, "Submit Date (UTC)")}_${normEmail(rowGet(row, T.parentEmail))}`;

  const addSecondRaw = rowGet(row, T.addSecondParent);
  const addSecond =
    addSecondRaw === "1" ||
    addSecondRaw.toLowerCase() === "true" ||
    addSecondRaw.toLowerCase() === "yes";

  const get = (title: string) => rowGet(row, title);
  const getBool = (title: string) => {
    const v = rowGet(row, title);
    return v === "1" || v.toLowerCase() === "true" || v.toLowerCase() === "yes";
  };

  return buildIntake(
    token,
    TYPEFORM_ENROLLMENT_FORM_ID,
    rowGet(row, "Submit Date (UTC)") || undefined,
    get,
    getBool,
    tutoringWindowsFromRow(row),
    rowGet(row, T.scoreReportUpload)
  );
}

export function enrollmentIntakeDetails(intake: TypeformEnrollmentIntake) {
  return {
    source: "typeform_enrollment" as const,
    form_id: intake.formId,
    typeform_url: `https://form.typeform.com/to/${intake.formId}`,
    submitted_at: intake.submittedAt ?? null,
    second_parent: intake.secondParent,
    sat_taken_before: intake.satTakenBefore,
    score_report_url: intake.scoreReportUrl,
    tutoring_windows: intake.tutoringWindows,
    diagnostic_assessment_time: intake.diagnosticAssessmentTime,
    diagnostic_review_time: intake.diagnosticReviewTime,
  };
}
