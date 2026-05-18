"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getAttributionPayload } from "@/components/attribution-provider";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents } from "@/lib/analytics-events";
import {
  defaultStudentGrade,
  INTAKE_LEAD_ID_KEY,
  INTAKE_SESSION_KEY,
  mainGoalOptions,
  programInvestmentHint,
  programInvestmentOptions,
  programInvestmentQuestion,
  qualificationIntake,
  satBaselineOptions,
  targetExamOptions,
  type QualificationIntakePayload
} from "@/lib/sat-qualification";
const inputClass =
  "h-12 w-full rounded-xl border border-line bg-ivory px-4 text-[14.5px] text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

const labelClass =
  "grid gap-2 text-[13px] font-semibold tracking-[-0.005em] text-ink";

const cardOptionClass =
  "flex min-h-12 cursor-pointer items-center rounded-xl border border-line bg-ivory px-4 text-[14.5px] has-[:checked]:border-gold has-[:checked]:ring-2 has-[:checked]:ring-gold/20";

const stepIds = qualificationIntake.steps.map((s) => s.id);

export function GetStartedForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { visitorId, attribution } = getAttributionPayload();
    void fetch("/api/attribution/touch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        eventType: "intake_started",
        path: window.location.pathname,
        fullUrl: window.location.href,
        attribution
      }),
      keepalive: true
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < stepIds.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const extraContext = [
      String(data.get("additionalContext") ?? "").trim(),
      data.get("latestScore")
        ? `Latest SAT/PSAT score: ${String(data.get("latestScore"))}`
        : ""
    ]
      .filter(Boolean)
      .join("\n\n");

    const payload: QualificationIntakePayload = {
      parentEmail: String(data.get("parentEmail") ?? "").trim(),
      parentFirst: String(data.get("parentFirst") ?? "").trim(),
      parentLast: String(data.get("parentLast") ?? "").trim(),
      parentPhone: String(data.get("parentPhone") ?? "").trim(),
      studentFirst: String(data.get("studentFirst") ?? "").trim(),
      studentGrade: defaultStudentGrade,
      studentSchool: String(data.get("studentSchool") ?? "").trim(),
      targetExam: String(data.get("targetExam") ?? "") as QualificationIntakePayload["targetExam"],
      satBaseline: String(data.get("satBaseline") ?? "") as QualificationIntakePayload["satBaseline"],
      scoreRange: "",
      mainGoal: String(data.get("mainGoal") ?? "") as QualificationIntakePayload["mainGoal"],
      programInvestment: String(
        data.get("programInvestment") ?? ""
      ) as QualificationIntakePayload["programInvestment"],
      additionalContext: extraContext,
      confirmParentOnCall: data.get("confirmParentOnCall") === "on",
      confirmNoGuarantee: data.get("confirmNoGuarantee") === "on",
      company: String(data.get("company") ?? "")
    };

    try {
      const { visitorId, attribution } = getAttributionPayload();
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, visitorId, attribution })
      });
      const result = (await response.json()) as {
        error?: string;
        leadId?: string;
        qualified?: boolean;
      };
      if (!response.ok) {
        setStatus("error");
        setErrorMessage(result.error ?? "Could not save your answers.");
        return;
      }

      if (result.qualified === false) {
        captureAnalytics(AnalyticsEvents.intakeCompleted, { qualified: false });
        router.push("/get-started/not-a-fit");
        return;
      }

      sessionStorage.setItem(
        INTAKE_SESSION_KEY,
        JSON.stringify({
          parentFirst: payload.parentFirst,
          parentLast: payload.parentLast,
          parentEmail: payload.parentEmail,
          parentPhone: payload.parentPhone,
          studentFirst: payload.studentFirst
        })
      );
      if (result.leadId) {
        sessionStorage.setItem(INTAKE_LEAD_ID_KEY, result.leadId);
      }

      void fetch("/api/attribution/touch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          leadId: result.leadId,
          eventType: "internal_redirect",
          path: qualificationIntake.schedulePath,
          fullUrl: window.location.origin + qualificationIntake.schedulePath,
          attribution
        }),
        keepalive: true
      });

      captureAnalytics(AnalyticsEvents.getStartedIntakeSubmitted);
      router.push(qualificationIntake.schedulePath);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  const currentStep = qualificationIntake.steps[step];

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex gap-2">
        {qualificationIntake.steps.map((s, i) => (
          <div
            key={s.id}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gold" : "bg-line"}`}
            aria-hidden
          />
        ))}
      </div>
      <p className="text-[13px] font-medium text-gold-deep">
        Step {step + 1} of {qualificationIntake.steps.length} · {currentStep.label}
      </p>

      <div className={step === 0 ? "grid gap-5" : "hidden"}>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelClass}>
              First name
              <input
                name="parentFirst"
                required={step === 0}
                autoComplete="given-name"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Last name
              <input
                name="parentLast"
                required={step === 0}
                autoComplete="family-name"
                className={inputClass}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelClass}>
              Email
              <input
                name="parentEmail"
                type="email"
                inputMode="email"
                autoComplete="email"
                required={step === 0}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Phone
              <input
                name="parentPhone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required={step === 0}
                className={inputClass}
              />
            </label>
          </div>
      </div>

      <div className={step === 1 ? "grid gap-5" : "hidden"}>
          <label className={labelClass}>
            Child&apos;s first name
            <input name="studentFirst" required={step === 1} className={inputClass} />
          </label>
          <label className={labelClass}>
            School (optional)
            <input name="studentSchool" className={inputClass} />
          </label>
          <label className={labelClass}>
            Target exam
            <select name="targetExam" required={step === 1} className={inputClass}>
              <option value="">Select…</option>
              {targetExamOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
      </div>

      <div className={step === 2 ? "grid gap-5" : "hidden"}>
          <fieldset className="grid gap-3">
            <legend className="text-[13px] font-semibold tracking-[-0.005em] text-ink">
              {programInvestmentQuestion}
            </legend>
            <p className="text-[13px] leading-relaxed text-ink-soft">
              {programInvestmentHint}
            </p>
            {programInvestmentOptions.map((option) => (
              <label key={option} className={cardOptionClass}>
                <input
                  type="radio"
                  name="programInvestment"
                  value={option}
                  required={step === 2}
                  className="mr-3 h-5 w-5 shrink-0 accent-gold"
                />
                <span className="text-[13px] leading-relaxed text-ink-soft">
                  {option}
                </span>
              </label>
            ))}
          </fieldset>
          <label className={labelClass}>
            What score are we starting from?
            <select name="satBaseline" required={step === 2} className={inputClass}>
              <option value="">Select…</option>
              {satBaselineOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Latest SAT or PSAT score (optional)
            <input
              name="latestScore"
              inputMode="numeric"
              placeholder="e.g. 1180 SAT or 1120 PSAT"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Main goal
            <select name="mainGoal" required={step === 2} className={inputClass}>
              <option value="">Select…</option>
              {mainGoalOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Anything else we should know?
            <textarea
              name="additionalContext"
              rows={4}
              className={`${inputClass} min-h-[100px] py-3`}
            />
          </label>
          <label className="flex gap-3 text-[13px] leading-relaxed text-ink-soft">
            <input
              type="checkbox"
              name="confirmParentOnCall"
              required={step === 2}
              className="mt-1"
            />
            A parent or guardian will join the consultation call.
          </label>
          <label className="flex gap-3 text-[13px] leading-relaxed text-ink-soft">
            <input
              type="checkbox"
              name="confirmNoGuarantee"
              required={step === 2}
              className="mt-1"
            />
            I understand Illuminairy does not guarantee SAT scores or admission outcomes.
          </label>
      </div>

      {errorMessage && (
        <p className="text-[13px] text-terracotta" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-lg border border-line-strong px-5 py-3 text-[13.5px] font-semibold text-ink"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg border border-ink bg-ink px-5 py-3 text-[13.5px] font-semibold text-ivory disabled:opacity-60"
        >
          {status === "loading"
            ? "Saving…"
            : step < stepIds.length - 1
              ? "Continue"
              : "Continue to scheduling"}
        </button>
      </div>
    </form>
  );
}
