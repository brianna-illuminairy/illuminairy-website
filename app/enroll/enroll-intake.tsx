"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TYPEFORM_ENROLLMENT_FIELD_TITLES as T } from "@/lib/crm/typeform-enrollment-fields";

const TUTORING_KEYS = [
  T.tutoringWindow1,
  T.tutoringWindow2,
  T.tutoringWindow3,
  T.tutoringWindow4
] as const;

type FormState = {
  parentFirst: string;
  parentLast: string;
  parentPhone: string;
  parentEmail: string;
  studentFirst: string;
  studentLast: string;
  studentGrade: string;
  studentSchool: string;
  studentPhone: string;
  studentEmail: string;
  satTakenBefore: boolean;
  tutoring1: string;
  tutoring2: string;
  tutoring3: string;
  tutoring4: string;
  diagnosticAssessment: string;
  diagnosticReview: string;
};

export default function EnrollIntakePage() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const missingSession = !sessionId;
  const [loading, setLoading] = useState(!missingSession);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(
    missingSession
      ? "Missing payment session. Use the enrollment link we sent after checkout."
      : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState<FormState>({
    parentFirst: "",
    parentLast: "",
    parentPhone: "",
    parentEmail: "",
    studentFirst: "",
    studentLast: "",
    studentGrade: "",
    studentSchool: "",
    studentPhone: "",
    studentEmail: "",
    satTakenBefore: false,
    tutoring1: "",
    tutoring2: "",
    tutoring3: "",
    tutoring4: "",
    diagnosticAssessment: "",
    diagnosticReview: ""
  });

  useEffect(() => {
    if (!sessionId) return;
    void fetch(`/api/enroll/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Payment session not verified.");
        return res.json() as Promise<{ ok: boolean; prefill?: Partial<FormState> }>;
      })
      .then((json) => {
        setVerified(true);
        if (json.prefill) {
          setForm((prev) => ({ ...prev, ...json.prefill }));
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionId) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/enroll/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, ...form })
    });
    setSubmitting(false);
    if (!res.ok) {
      const json = (await res.json()) as { error?: string };
      setError(json.error ?? "Could not save intake.");
      return;
    }
    setDone(true);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16 text-sm text-muted-foreground">
        Verifying payment…
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-2xl font-semibold">You are all set</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We saved your scheduling preferences. Watch for email with diagnostic booking
          and next steps within 24–48 hours.
        </p>
      </main>
    );
  }

  if (!verified) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-xl font-semibold">Enrollment intake</h1>
        <p className="mt-3 text-sm text-red-600">{error ?? "Could not verify payment."}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Complete enrollment intake</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Payment received. Tell us about scheduling so we can confirm diagnostic and tutoring
        windows.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        <fieldset className="space-y-3">
          <legend className="font-medium">Parent / guardian</legend>
          {(
            [
              ["parentFirst", "First name"],
              ["parentLast", "Last name"],
              ["parentPhone", "Phone"],
              ["parentEmail", "Email"]
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="text-muted-foreground">{label}</span>
              <input
                required={key !== "parentPhone"}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-medium">Student</legend>
          {(
            [
              ["studentFirst", "First name"],
              ["studentLast", "Last name"],
              ["studentGrade", "Grade"],
              ["studentSchool", "School"],
              ["studentPhone", "Phone"],
              ["studentEmail", "Email"]
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="text-muted-foreground">{label}</span>
              <input
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.satTakenBefore}
              onChange={(e) => setForm({ ...form, satTakenBefore: e.target.checked })}
            />
            Student has taken the SAT or PSAT before
          </label>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-medium">Scheduling preferences</legend>
          {TUTORING_KEYS.map((label, i) => {
            const key = `tutoring${i + 1}` as keyof FormState;
            return (
              <label key={label} className="block text-sm">
                <span className="text-muted-foreground">{label}</span>
                <input
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form[key] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            );
          })}
          <label className="block text-sm">
            <span className="text-muted-foreground">{T.diagnosticAssessment}</span>
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              value={form.diagnosticAssessment}
              onChange={(e) => setForm({ ...form, diagnosticAssessment: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">{T.diagnosticReview}</span>
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              value={form.diagnosticReview}
              onChange={(e) => setForm({ ...form, diagnosticReview: e.target.value })}
            />
          </label>
        </fieldset>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Submit intake"}
        </button>
      </form>
    </main>
  );
}
