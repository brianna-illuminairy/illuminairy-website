#!/usr/bin/env node
/**
 * Import SAT enrollment Typeform CSV export into Supabase CRM.
 *
 * Usage:
 *   npm run crm:backfill-typeform -- /path/to/responses.csv
 *   npm run crm:backfill-typeform -- --dry-run /path/to/responses.csv
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const EXAM_LABEL = "August 22, 2026 SAT";

const T = {
  parentFirst: "Parent's First Name",
  parentLast: "Parent's Last Name",
  parentPhone: "Parent's Phone Number",
  parentEmail: "Parent's Email Address",
  addSecondParent:
    "Would you like to add a second parent or guardian to receive weekly progress updates?",
  secondParentFirst: "Second Parent/Guardian First Name",
  secondParentLast: "Second Parent/Guardian Last Name",
  secondParentPhone: "Second Parent/Guardian Phone Number",
  secondParentEmail: "Second Parent/Guardian Email Address",
  studentFirst: "Student's First Name",
  studentLast: "Student's Last Name",
  studentGrade: "What grade is the student currently in?",
  studentSchool: "What school does the student attend?",
  studentPhone: "Student's Phone Number",
  studentEmail: "Student's Email Address",
  satTakenBefore: "Has the student previously taken the SAT or PSAT?",
  scoreReportUpload:
    "If you answered yes, please upload your most recent and/or highest SAT or PSAT score report.",
  tutoringWindow1: "Please select your first available 2-hour window for tutoring.",
  tutoringWindow2: "Please select your second available 2-hour window for tutoring.",
  tutoringWindow3: "Please select your third available 2-hour window for tutoring.",
  tutoringWindow4: "Please select your fourth available 2-hour window for tutoring.",
  diagnosticAssessment:
    "Please pick your preferred time for the student's diagnostic assessment",
  diagnosticReview:
    "Please select your preferred time for the student’s diagnostic review session (Fridays after 12:00 PM)",
};

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    if (process.env[key]) continue;
    let val = trimmed.slice(eq + 1);
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.length > 0);
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = cols[j] ?? "";
    }
    rows.push(row);
  }
  return rows;
}

function rowGet(row, key) {
  return (row[key] ?? "").trim();
}

function normPhone(raw) {
  return (raw ?? "").trim().replace(/^'/, "");
}

function normEmail(raw) {
  return (raw ?? "").trim().toLowerCase();
}

function truthyCell(v) {
  const t = (v ?? "").trim().toLowerCase();
  return t === "1" || t === "true" || t === "yes";
}

function parseRow(row) {
  const token =
    rowGet(row, "#") ||
    rowGet(row, "token") ||
    `csv_${rowGet(row, "Submit Date (UTC)")}_${normEmail(rowGet(row, T.parentEmail))}`;

  const parentEmail = normEmail(rowGet(row, T.parentEmail));
  const parentFirst = rowGet(row, T.parentFirst);
  const studentFirst = rowGet(row, T.studentFirst);
  if (!parentEmail || !parentFirst || !studentFirst) {
    return { error: "missing_required_fields" };
  }

  const addSecond = truthyCell(rowGet(row, T.addSecondParent));
  let secondParent = null;
  if (addSecond) {
    const first = rowGet(row, T.secondParentFirst);
    const last = rowGet(row, T.secondParentLast);
    const phone = normPhone(rowGet(row, T.secondParentPhone));
    const email = normEmail(rowGet(row, T.secondParentEmail));
    if (first || last || phone || email) {
      secondParent = { first, last, phone, email };
    }
  }

  const tutoringWindows = [
    T.tutoringWindow1,
    T.tutoringWindow2,
    T.tutoringWindow3,
    T.tutoringWindow4,
  ]
    .map((k) => rowGet(row, k))
    .filter(Boolean);

  return {
    typeformToken: token,
    formId: "oWevli6O",
    submittedAt: rowGet(row, "Submit Date (UTC)") || null,
    parentFirst,
    parentLast: rowGet(row, T.parentLast),
    parentEmail,
    parentPhone: normPhone(rowGet(row, T.parentPhone)),
    secondParent,
    studentFirst,
    studentLast: rowGet(row, T.studentLast),
    studentGrade: rowGet(row, T.studentGrade),
    studentSchool: rowGet(row, T.studentSchool),
    studentPhone: normPhone(rowGet(row, T.studentPhone)),
    studentEmail: normEmail(rowGet(row, T.studentEmail)),
    satTakenBefore: truthyCell(rowGet(row, T.satTakenBefore)),
    scoreReportUrl: rowGet(row, T.scoreReportUpload) || null,
    tutoringWindows,
    diagnosticAssessmentTime: rowGet(row, T.diagnosticAssessment) || null,
    diagnosticReviewTime: rowGet(row, T.diagnosticReview) || null,
  };
}

function intakeDetails(intake) {
  return {
    source: "typeform_enrollment",
    form_id: intake.formId,
    typeform_url: `https://form.typeform.com/to/${intake.formId}`,
    submitted_at: intake.submittedAt,
    second_parent: intake.secondParent,
    sat_taken_before: intake.satTakenBefore,
    score_report_url: intake.scoreReportUrl,
    tutoring_windows: intake.tutoringWindows,
    diagnostic_assessment_time: intake.diagnosticAssessmentTime,
    diagnostic_review_time: intake.diagnosticReviewTime,
  };
}

async function recordEnrollment(supabase, intake) {
  const parentEmail = intake.parentEmail;
  const details = intakeDetails(intake);
  const enrolledAt = intake.submittedAt
    ? new Date(intake.submittedAt).toISOString()
    : new Date().toISOString();

  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("id, client_id, student_id, lead_id")
    .eq("typeform_response_token", intake.typeformToken)
    .maybeSingle();

  if (existingEnrollment) {
    await supabase
      .from("enrollments")
      .update({ intake_details: details, updated_at: new Date().toISOString() })
      .eq("id", existingEnrollment.id);
    return { duplicate: true, ...existingEnrollment, parentEmail };
  }

  const { data: existingLead } = await supabase
    .from("leads")
    .select("id")
    .eq("parent_email", parentEmail)
    .maybeSingle();

  let leadId = existingLead?.id ?? null;
  const leadPatch = {
    parent_first: intake.parentFirst,
    parent_last: intake.parentLast,
    parent_phone: intake.parentPhone || null,
    student_first: intake.studentFirst,
    student_grade: intake.studentGrade || null,
    student_school: intake.studentSchool || null,
    sat_baseline: intake.satTakenBefore ? "Official SAT or PSAT score on file" : null,
    funnel: "enrollment_typeform",
    stage: "won",
    converted_at: enrolledAt,
    updated_at: new Date().toISOString(),
    additional_context: [
      intake.tutoringWindows.length
        ? `Tutoring windows: ${intake.tutoringWindows.join("; ")}`
        : null,
      intake.diagnosticAssessmentTime
        ? `Diagnostic: ${intake.diagnosticAssessmentTime}`
        : null,
      intake.diagnosticReviewTime
        ? `Diagnostic review: ${intake.diagnosticReviewTime}`
        : null,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  if (leadId) {
    await supabase.from("leads").update(leadPatch).eq("id", leadId);
  } else {
    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        ...leadPatch,
        parent_email: parentEmail,
        lead_source: "organic",
        first_touch_at: enrolledAt,
      })
      .select("id")
      .single();
    if (error) throw new Error(`lead: ${error.message}`);
    leadId = lead.id;
  }

  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("parent_email", parentEmail)
    .maybeSingle();

  let clientId = existingClient?.id;
  if (!clientId) {
    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        lead_id: leadId,
        parent_email: parentEmail,
        parent_first: intake.parentFirst,
        parent_last: intake.parentLast,
        parent_phone: intake.parentPhone || null,
        status: "active",
      })
      .select("id")
      .single();
    if (error) throw new Error(`client: ${error.message}`);
    clientId = client.id;
  }

  await supabase
    .from("leads")
    .update({ converted_client_id: clientId })
    .eq("id", leadId);

  let studentId = null;
  if (intake.studentEmail) {
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id")
      .eq("client_id", clientId)
      .eq("student_email", intake.studentEmail)
      .maybeSingle();
    studentId = existingStudent?.id ?? null;
  }

  if (!studentId) {
    const { data: student, error } = await supabase
      .from("students")
      .insert({
        client_id: clientId,
        first_name: intake.studentFirst,
        last_name: intake.studentLast || null,
        grade: intake.studentGrade || null,
        school: intake.studentSchool || null,
        student_email: intake.studentEmail || null,
        student_phone: intake.studentPhone || null,
      })
      .select("id")
      .single();
    if (error) throw new Error(`student: ${error.message}`);
    studentId = student.id;
  }

  const { data: enrollment, error: enrollErr } = await supabase
    .from("enrollments")
    .insert({
      client_id: clientId,
      student_id: studentId,
      lead_id: leadId,
      program: "sat-accelerator",
      program_label: `SAT Accelerator · ${EXAM_LABEL}`,
      status: "active",
      typeform_response_token: intake.typeformToken,
      intake_details: details,
      paid_at: enrolledAt,
    })
    .select("id")
    .single();

  if (enrollErr) throw new Error(`enrollment: ${enrollErr.message}`);

  return {
    duplicate: false,
    enrollmentId: enrollment.id,
    clientId,
    leadId,
    parentEmail,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const csvPath = args.find((a) => !a.startsWith("--"));
  if (!csvPath) {
    console.error("Usage: npm run crm:backfill-typeform -- [--dry-run] <responses.csv>");
    process.exit(1);
  }

  const rows = parseCsv(readFileSync(resolve(csvPath), "utf8"));
  console.log(`Rows: ${rows.length}`);

  if (dryRun) {
    let ok = 0;
    for (const row of rows) {
      const intake = parseRow(row);
      if (intake.error) {
        console.error("parse:", intake.error);
        continue;
      }
      ok++;
      console.log(
        `→ ${intake.parentEmail} / ${intake.studentFirst} ${intake.studentLast} (${intake.typeformToken})`
      );
    }
    console.log(`\n${ok} ok (dry run, no Supabase writes)`);
    process.exit(0);
  }

  loadEnvLocal();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Need SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let ok = 0;
  let fail = 0;

  for (const row of rows) {
    const intake = parseRow(row);
    if (intake.error) {
      fail++;
      console.error("parse:", intake.error);
      continue;
    }

    console.log(
      `→ ${intake.parentEmail} / ${intake.studentFirst} ${intake.studentLast}`
    );

    if (dryRun) {
      ok++;
      continue;
    }

    try {
      const result = await recordEnrollment(supabase, intake);
      ok++;
      console.log(
        `  ${result.duplicate ? "existing" : "created"} enrollment ${result.enrollmentId}`
      );
    } catch (err) {
      fail++;
      console.error(" ", err.message);
    }
  }

  console.log(`\n${ok} ok, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main();
