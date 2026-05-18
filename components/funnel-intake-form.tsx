"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { getAttributionPayload } from "@/components/attribution-provider";
import { FunnelBudgetBandConfirm } from "@/components/funnel-budget-band-confirm";
import { AnalyticsEvents } from "@/lib/analytics-events";
import {
  defaultStudentGrade,
  INTAKE_LEAD_ID_KEY,
  INTAKE_SESSION_KEY,
  investmentBudgetBandOptions,
  investmentBudgetHint,
  investmentBudgetQuestion,
  mainGoalOptions,
  needsInvestmentBudgetConfirmation,
  qualificationIntake,
  satBaselineOptions,
  targetSchoolOptions,
  targetExamOptions,
  type QualificationIntakePayload
} from "@/lib/sat-qualification";
import { trackFunnelEvent } from "@/funnel/lib/track";

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-ivory px-4 text-base text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

const labelClass =
  "grid gap-2 text-[13px] font-semibold tracking-[-0.005em] text-ink";

const cardOptionClass =
  "flex min-h-12 cursor-pointer items-center rounded-xl border border-line bg-ivory px-4 text-[14.5px] has-[:checked]:border-gold has-[:checked]:ring-2 has-[:checked]:ring-gold/20";

const stepIds = qualificationIntake.steps.map((s) => s.id);

const studyToolOptions = [
  "Khan Academy",
  "Bluebook / College Board",
  "Acely or another SAT app",
  "Prep book",
  "Prior tutor or class",
  "School-provided SAT prep"
] as const;

export function FunnelIntakeForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showBudgetConfirm, setShowBudgetConfirm] = useState(false);
  const [budgetGapAcknowledged, setBudgetGapAcknowledged] = useState(false);

  useEffect(() => {
    trackFunnelEvent(AnalyticsEvents.intakeStepView, {
      step: stepIds[0]
    });
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

  function goStep(next: number) {
    setStep(next);
    trackFunnelEvent(AnalyticsEvents.intakeStepView, {
      step: stepIds[next]
    });
  }

  async function submitIntake(
    form: HTMLFormElement,
    options: { confirmBudgetGap?: boolean } = {}
  ) {
    setStatus("loading");
    setErrorMessage("");

    const data = new FormData(form);

    const studyTools = studyToolOptions.filter(
      (t) => data.get(`study_${t}`) === "on"
    );
    const targetSchools = targetSchoolOptions.filter(
      (school) => data.get(`school_${school}`) === "on"
    );
    const funnelNotes = [
      studyTools.length ? `Study tools: ${studyTools.join(", ")}` : "",
      targetSchools.length ? `Target schools: ${targetSchools.join(", ")}` : "",
      data.get("studyDuration")
        ? `SAT/PSAT study history: ${String(data.get("studyDuration"))}`
        : "",
      data.get("latestScore")
        ? `Latest SAT/PSAT score: ${String(data.get("latestScore"))}`
        : ""
    ]
      .filter(Boolean)
      .join("\n");

    const baseContext = String(data.get("additionalContext") ?? "").trim();
    const additionalContext = [baseContext, funnelNotes]
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
      targetExam: String(
        data.get("targetExam") ?? ""
      ) as QualificationIntakePayload["targetExam"],
      satBaseline: String(
        data.get("satBaseline") ?? ""
      ) as QualificationIntakePayload["satBaseline"],
      scoreRange: "",
      mainGoal: String(
        data.get("mainGoal") ?? ""
      ) as QualificationIntakePayload["mainGoal"],
      programInvestment: String(
        data.get("programInvestment") ?? ""
      ) as QualificationIntakePayload["programInvestment"],
      confirmBudgetGap: options.confirmBudgetGap,
      additionalContext,
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
        trackFunnelEvent(AnalyticsEvents.intakeCompleted, { qualified: false });
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

      trackFunnelEvent(AnalyticsEvents.intakeCompleted);
      trackFunnelEvent(AnalyticsEvents.getStartedIntakeSubmitted);
      router.push(qualificationIntake.schedulePath);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < stepIds.length - 1) {
      goStep(step + 1);
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const investmentBand = String(
      data.get("programInvestment") ?? ""
    ) as QualificationIntakePayload["programInvestment"];

    if (
      needsInvestmentBudgetConfirmation(investmentBand) &&
      !budgetGapAcknowledged
    ) {
      setShowBudgetConfirm(true);
      return;
    }

    await submitIntake(form, {
      confirmBudgetGap: budgetGapAcknowledged ? true : undefined
    });
  }

  const currentStep = qualificationIntake.steps[step];

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-5 pb-28 md:pb-8"
    >
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex gap-2" aria-hidden>
        {qualificationIntake.steps.map((s, i) => (
          <div
            key={s.id}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gold" : "bg-line"}`}
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
        <fieldset className="grid gap-2">
          <legend className={labelClass.replace("grid ", "")}>
            What has your child used to study? (optional)
          </legend>
          {studyToolOptions.map((tool) => (
            <label key={tool} className={cardOptionClass}>
              <input
                type="checkbox"
                name={`study_${tool}`}
                className="mr-3 h-5 w-5 accent-gold"
              />
              {tool}
            </label>
          ))}
        </fieldset>
        <label className={labelClass}>
          How long have they been studying for the SAT or PSAT? (optional)
          <select name="studyDuration" className={inputClass}>
            <option value="">Not sure</option>
            <option value="Has not really started yet">Has not really started yet</option>
            <option value="1–2 weeks">1–2 weeks</option>
            <option value="3–5 weeks">3–5 weeks</option>
            <option value="6–8 weeks">6–8 weeks</option>
            <option value="More than 8 weeks">More than 8 weeks</option>
          </select>
        </label>
        <fieldset className="grid gap-2">
          <legend className={labelClass.replace("grid ", "")}>
            Schools on their list (optional)
          </legend>
          {targetSchoolOptions.map((school) => (
            <label key={school} className={cardOptionClass}>
              <input
                type="checkbox"
                name={`school_${school}`}
                className="mr-3 h-5 w-5 accent-gold"
              />
              {school}
            </label>
          ))}
        </fieldset>
      </div>

      <div className={step === 2 ? "grid gap-5" : "hidden"}>
        <fieldset className="grid gap-3">
          <legend className="text-[13px] font-semibold tracking-[-0.005em] text-ink">
            {investmentBudgetQuestion}
          </legend>
          <p className="text-[13px] leading-relaxed text-ink-soft">
            {investmentBudgetHint}
          </p>
          {investmentBudgetBandOptions.map((option) => (
            <label key={option} className={cardOptionClass}>
              <input
                type="radio"
                name="programInvestment"
                value={option}
                required={step === 2}
                onChange={() => {
                  setBudgetGapAcknowledged(false);
                  setShowBudgetConfirm(false);
                }}
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
            rows={3}
            className={`${inputClass} min-h-[88px] py-3`}
          />
        </label>
        <label className={cardOptionClass}>
          <input
            type="checkbox"
            name="confirmParentOnCall"
            required={step === 2}
            className="mr-3 h-5 w-5 accent-gold"
          />
          <span className="text-[13px] leading-relaxed text-ink-soft">
            A parent or guardian will join the consultation call.
          </span>
        </label>
        <label className={cardOptionClass}>
          <input
            type="checkbox"
            name="confirmNoGuarantee"
            required={step === 2}
            className="mr-3 h-5 w-5 accent-gold"
          />
          <span className="text-[13px] leading-relaxed text-ink-soft">
            I understand Illuminairy does not guarantee SAT scores or admission
            outcomes.
          </span>
        </label>
      </div>

      {showBudgetConfirm && (
        <FunnelBudgetBandConfirm
          disabled={status === "loading"}
          onContinue={async () => {
            if (!formRef.current) return;
            setBudgetGapAcknowledged(true);
            setShowBudgetConfirm(false);
            await submitIntake(formRef.current, { confirmBudgetGap: true });
          }}
          onDecline={() => router.push("/get-started/not-a-fit")}
        />
      )}

      {errorMessage && (
        <p className="text-[13px] text-terracotta" role="alert">
          {errorMessage}
        </p>
      )}

      <div
        className={
          showBudgetConfirm
            ? "hidden"
            : "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md md:static md:border-0 md:bg-transparent md:p-0"
        }
      >
        <div className="mx-auto flex max-w-xl gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => goStep(step - 1)}
              className="min-h-12 flex-1 rounded-xl border border-line-strong px-4 text-[14px] font-semibold text-ink"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="min-h-12 flex-[2] rounded-xl border border-ink bg-ink px-4 text-[14px] font-semibold text-ivory disabled:opacity-60"
          >
            {status === "loading"
              ? "Saving…"
              : step < stepIds.length - 1
                ? "Continue"
                : "Continue to scheduling"}
          </button>
        </div>
      </div>
    </form>
  );
}
