"use client";

import { useEffect, useState } from "react";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents } from "@/lib/analytics-events";
import {
  phase1Metrics,
  type PersonalizedEnrollLead
} from "@/lib/personalized-enroll";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

function buildStripeUrl(stripeLink: string, email: string): string {
  if (!email) return stripeLink;
  const url = new URL(stripeLink);
  url.searchParams.set("prefilled_email", email);
  return url.toString();
}
function TopBar() {
  return (
    <div className="bg-navy">
      <div className="mx-auto flex max-w-content items-center justify-center px-6 py-4">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-ivory">
          Illuminairy
        </span>
      </div>
    </div>
  );
}

function ProgressStrip() {
  const steps = [
    { label: "Free SAT plan", state: "done" as const },
    { label: "Strategy call", state: "done" as const },
    { label: "Enroll", state: "active" as const },
    { label: "Phase 1 begins", state: "next" as const }
  ];
  return (
    <div className="bg-navy-soft">
      <div className="mx-auto flex max-w-content items-center gap-3 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory/60 sm:gap-5">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <span
              className={
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold " +
                (s.state === "done"
                  ? "bg-emerald-400 text-navy"
                  : s.state === "active"
                  ? "bg-ivory text-navy"
                  : "border border-ivory/25 text-ivory/45")
              }
            >
              {s.state === "done" ? "\u2713" : i + 1}
            </span>
            <span
              className={
                s.state === "active"
                  ? "text-ivory"
                  : s.state === "done"
                  ? "text-ivory/75"
                  : "text-ivory/45"
              }
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={
                  "ml-auto hidden h-px flex-1 sm:block " +
                  (s.state === "done" ? "bg-emerald-400/60" : "bg-ivory/15")
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
// SECTION_PROGRESS
function Hero({ lead }: { lead: PersonalizedEnrollLead }) {
  return (
    <section className="mx-auto max-w-content px-6 pt-12 pb-6 sm:pt-14">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
        Phase 1 enrollment for {lead.student.first}
      </p>
      <h1 className="max-w-[24ch] text-balance text-3xl font-bold leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
        {lead.student.first}&apos;s foundation cycle starts when you enroll,{" "}
        <span className="text-emerald-700">{lead.parent.first}</span>.
      </h1>
      {lead.welcomeLeadIn && (
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-soft sm:text-lg">
          {lead.welcomeLeadIn}
        </p>
      )}
      <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft shadow-soft">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-navy to-emerald-600 text-xs font-bold text-white">
          {lead.advisor.first
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
        <span>
          Built by your advisor{" "}
          <b className="font-semibold text-ink">{lead.advisor.full}</b>
        </span>
        <span aria-hidden className="h-4 w-px bg-line" />
        <span className="text-ink-muted">From your call on {lead.call.dateLabel}</span>
      </div>
    </section>
  );
}
function PlanCard({ lead }: { lead: PersonalizedEnrollLead }) {
  const m = phase1Metrics(lead);
  const included = [
    {
      nm: "Proctored full-length digital adaptive Skill Diagnostic",
      ds:
        "2 hours 14 minutes. Watched the whole way by us, under real test-day conditions."
    },
    {
      nm: "Hand-done analysis of every miss",
      ds:
        "Time per question, pacing across both modules, every wrong answer classified by question type and weighted by points cost."
    },
    {
      nm: "Custom 12-week Phase 1 plan",
      ds:
        "Highest-impact gaps ranked first. Week-1 lesson scripts written out before session 1."
    },
    {
      nm: "Two specialized tutors (Math 750+, R&W 750+)",
      ds:
        "You see both profiles before session 1. We re-match if either is not a fit."
    },
    {
      nm: "24 one-hour sessions over 12 weeks",
      ds: "Two sessions per week. 80 to 90 percent are one-on-one."
    },
    {
      nm: "5 mock tests across the cycle",
      ds:
        "Diagnostic + week 4 + week 8 + week 12 + Phase 1 review. We re-baseline every 4 weeks."
    },
    {
      nm: "Personalized homework from 3,500+ practice questions",
      ds: "Mistake-based, mixed easy/medium/hard. Tied to her actual gaps."
    },
    {
      nm: "Weekly parent progress reports",
      ds:
        "Homework completion, accuracy by question type, score trend. You are not left guessing."
    }
  ];
  return (
    <aside className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-card sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
        Phase 1: Foundation cycle ({lead.phase1.weeks} weeks)
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary">
        {lead.student.first}&apos;s SAT plan
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-primary-muted">
        Built around the path you and {lead.advisor.first} mapped on{" "}
        {lead.call.dateLabel}. Phase 1 is the foundation cycle. Phase 2 and Phase
        3 follow once we have her real Phase 1 results.
      </p>

      <div className="mt-5 grid grid-cols-[1fr,auto,1fr,auto] items-center gap-3 rounded-xl border border-emerald-300/50 bg-emerald-50/60 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-primary-muted">
            Starting
          </span>
          <span className="text-3xl font-bold leading-none tracking-tight text-primary-muted sm:text-[34px]">
            {lead.startScore}
          </span>
        </div>
        <span className="self-end pb-1 text-lg text-primary-muted">
          &rarr;
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-primary-muted">
            Phase 1 goal
          </span>
          <span className="text-3xl font-bold leading-none tracking-tight text-emerald-800 sm:text-[34px]">
            {m.goalScore}
          </span>
        </div>
        <span className="self-center whitespace-nowrap rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-bold text-white">
          +{m.gain} pts
        </span>
      </div>

      <div className="mt-px grid grid-cols-3 gap-px overflow-hidden rounded-b-xl border border-t-0 border-border bg-border">
        <div className="flex flex-col items-center gap-1 bg-surface-elevated px-2 py-3 text-center">
          <span className="text-base font-bold leading-none text-primary sm:text-lg">
            {m.days} days
          </span>
          <span className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-primary-muted">
            Phase 1 length
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-surface-elevated px-2 py-3 text-center">
          <span className="text-base font-bold leading-none text-primary sm:text-lg">
            {lead.phase1.reviewDateLabel}
          </span>
          <span className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-primary-muted">
            Phase 1 review
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-surface-elevated px-2 py-3 text-center">
          <span className="text-base font-bold leading-none text-emerald-700 sm:text-lg">
            +{lead.phase1.pacePerWeek}/wk
          </span>
          <span className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-primary-muted">
            Program average pace
          </span>
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-primary-muted">
        Starting score from: {lead.startScoreSource} Pace ({lead.phase1.pacePerWeek}{" "}
        points/week) is our 12-week program average. Results vary by student.
      </p>

      <div className="mt-6 rounded-xl bg-ivory-100 p-5">
        <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-navy to-emerald-600 text-[9.5px] font-bold text-white">
            BZ
          </span>
          From your call &middot; {lead.call.dateLabel}
        </p>
        <p className="text-sm italic leading-relaxed text-primary">
          &ldquo;{lead.call.recapPullQuote}&rdquo;
        </p>
      </div>

      {lead.longerArc && lead.longerArc.length > 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-muted">
            The full arc you and {lead.advisor.first} mapped
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-primary">
            {lead.longerArc.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-7 border-t border-border pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-muted">
          Everything that&apos;s included in Phase 1
        </p>
        <ul className="mt-4 space-y-3">
          {included.map((it) => (
            <li key={it.nm} className="grid grid-cols-[22px_1fr] gap-3">
              <span className="mt-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckIcon className="h-3 w-3" />
              </span>
              <div>
                <span className="block text-[15px] font-semibold leading-snug text-primary">
                  {it.nm}
                </span>
                <span className="mt-1 block text-[13.5px] leading-relaxed text-primary-muted">
                  {it.ds}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
function PayCard({ lead }: { lead: PersonalizedEnrollLead }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState(lead.parent.email ?? "");
  const [tos, setTos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPay() {
    setError(null);
    if (!first.trim() || !last.trim() || !email.trim()) {
      setError("Please complete your billing contact.");
      return;
    }
    if (!tos) {
      setError("Please agree to the terms to continue.");
      return;
    }
    captureAnalytics(AnalyticsEvents.personalizedEnrollPaymentClicked, {
      slug: lead.slug,
      email_provided: Boolean(email)
    });
    window.location.href = buildStripeUrl(lead.pricing.stripeLink, email);
  }

  return (
    <section className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-card lg:sticky lg:top-6 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
        Complete enrollment
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary">
        Secure {lead.student.first}&apos;s spot
      </h2>

      <div className="mt-5 rounded-xl border border-border bg-white p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-[14.5px] font-semibold leading-snug text-primary">
            Diagnostic + analysis + Phase 1 plan
            <span className="mt-1 block text-[12px] font-normal uppercase tracking-[0.06em] text-primary-muted">
              One-time &middot; charged today
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tracking-tight text-primary">
              ${lead.pricing.diagPrice}
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-muted">
              Today
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-border/60 pt-4">
          <div className="text-[14.5px] font-semibold leading-snug text-primary">
            Twice-weekly tutoring
            <span className="mt-1 block text-[12px] font-normal uppercase tracking-[0.06em] text-primary-muted">
              Billed weekly &middot;{" "}
              <span className="font-semibold text-emerald-700">First 7 days free</span>{" "}
              &middot; Cancel anytime
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tracking-tight text-primary">
              ${lead.pricing.weeklyPrice}
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-muted">
              / week
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-border pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Due today
          </span>
          <span className="text-2xl font-bold tracking-tight text-emerald-700">
            ${lead.pricing.diagPrice}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
          Billing contact
        </span>
        <div className="mt-2 overflow-hidden rounded-xl border border-border bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
          <div className="flex">
            <input
              className="flex-1 min-w-0 border-0 bg-transparent px-4 py-3 text-[15px] text-primary outline-none placeholder:text-primary-muted/60"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            />
            <span aria-hidden className="w-px bg-border" />
            <input
              className="flex-1 min-w-0 border-0 bg-transparent px-4 py-3 text-[15px] text-primary outline-none placeholder:text-primary-muted/60"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              value={last}
              onChange={(e) => setLast(e.target.value)}
            />
          </div>
          <div className="border-t border-border">
            <input
              className="w-full border-0 bg-transparent px-4 py-3 text-[15px] text-primary outline-none placeholder:text-primary-muted/60"
              type="email"
              autoComplete="email"
              placeholder="Email for receipt"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-border bg-ivory/60 px-4 py-3 text-[12.5px] leading-relaxed text-primary-muted">
        Card details are collected on the next screen via Stripe&apos;s secure
        checkout. We never see or store your card.
      </p>

      <label
        htmlFor="tos"
        className="mt-5 flex cursor-pointer gap-3 text-[13px] leading-relaxed text-primary-muted"
      >
        <input
          id="tos"
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-emerald-700"
          checked={tos}
          onChange={(e) => setTos(e.target.checked)}
        />
        <span>
          I agree to Illuminairy&apos;s Terms, Refund Policy, and Privacy Policy.
          I authorize the ${lead.pricing.diagPrice} charge today and weekly
          billing of ${lead.pricing.weeklyPrice} starting 7 days from now, which
          I can cancel anytime.
        </span>
      </label>

      <button
        type="button"
        onClick={onPay}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-4 text-base font-bold tracking-tight text-navy shadow-[0_8px_24px_rgba(16,185,129,0.32)] transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        Pay ${lead.pricing.diagPrice} and enroll {lead.student.first}
        <ArrowIcon className="h-5 w-5" />
      </button>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-800"
        >
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-muted">
        <span className="flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-3.5 w-3.5 text-emerald-700"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          256-bit SSL
        </span>
        <span className="flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-3.5 w-3.5 text-emerald-700"
            aria-hidden="true"
          >
            <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
          </svg>
          PCI compliant
        </span>
        <span className="flex items-center gap-1.5">
          <CheckIcon className="h-3.5 w-3.5 text-emerald-700" />
          Secured by Stripe
        </span>
      </div>
    </section>
  );
}
function InvestmentSection({ lead }: { lead: PersonalizedEnrollLead }) {
  const items = [
    {
      hours: "2h 14m",
      title: "Proctored testing",
      body:
        "Someone from our team is on the session with " +
        lead.student.first +
        " for the full duration, watching how she takes the test. Real test-day conditions, real timing data."
    },
    {
      hours: "2\u20133 hrs",
      title: "Hand-done analysis",
      body:
        "After the test, we review her time per question, her pacing across both modules, and every wrong answer by hand. We classify each miss by question type and weight it by how many points it cost on a real digital SAT."
    },
    {
      hours: "1\u20132 hrs",
      title: "Phase 1 plan + week 1 lessons",
      body:
        "Custom 12-week Phase 1 plan with her highest-impact gaps ranked first, plus her first week of session-by-session lesson scripts written out so her tutor walks into session 1 already knowing what to teach."
    }
  ];
  return (
    <section className="mx-auto max-w-content px-6 py-10">
      <div className="rounded-2xl border border-border bg-surface-elevated p-7 shadow-card sm:p-9">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
              What the ${lead.pricing.diagPrice} actually buys
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-[26px]">
              5 to 6 hours of our team&apos;s time, before tutoring even starts.
            </h2>
          </div>
          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
            Per student
          </span>
        </div>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-primary-muted">
          The ${lead.pricing.diagPrice} is not a mock-test fee. A mock by itself
          is free almost anywhere. The analysis and the plan are the product.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-ivory/40 p-5"
            >
              <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-emerald-700 px-2 py-1 text-[11px] font-bold tracking-tight text-white">
                {it.hours}
              </span>
              <h3 className="text-[16px] font-bold tracking-tight text-primary">
                {it.title}
              </h3>
              <p className="text-[13.5px] leading-relaxed text-primary-muted">
                {it.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function WhyProctorSection({ lead }: { lead: PersonalizedEnrollLead }) {
  const captures = [
    "Real timing per question (no pause, no break)",
    "Whether " +
      lead.student.first +
      " actually finished each section, or guessed the last few",
    "Where she pulled up Desmos, and where she tried to solve mentally",
    "Where she hesitated, where she got fidgety, where her accuracy dropped from fatigue",
    "Whether she reached module 2 hard or stayed in module 2 medium because of her module 1 accuracy",
    "Whether she had any unauthorized materials in reach (notes, formula sheets, phone)"
  ];
  return (
    <section className="mx-auto max-w-content px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Why we proctor (and why it matters)
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-[28px]">
            An at-home diagnostic is not the same product.
          </h2>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-primary-muted">
            Most SAT prep companies send a kid a take-home diagnostic with no
            proctor on the line. The kid takes it on a couch with their phone
            next to them, with formula sheets they would not have on test day,
            and with the option to pause whenever they hit a hard question.
          </p>
          <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-primary-muted">
            That is not a planning tool. It is a score with no signal. The two
            Blue Book mocks {lead.student.first} already took were unproctored,
            which is why we cannot use them as our planning data. We need to see
            her take it under the same conditions she will see on test day.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-card sm:p-7">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-primary-muted">
            What 2 hours 14 minutes of proctoring captures that an at-home test
            cannot
          </p>
          <ul className="mt-4 space-y-3">
            {captures.map((c) => (
              <li
                key={c}
                className="grid grid-cols-[20px_1fr] gap-3 text-[14px] leading-relaxed text-primary"
              >
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckIcon className="h-2.5 w-2.5" />
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
function CycleOneSection({ lead }: { lead: PersonalizedEnrollLead }) {
  return (
    <section className="mx-auto max-w-content px-6 py-8">
      <div className="rounded-2xl border border-border bg-surface-elevated p-7 shadow-card sm:p-9">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
          What Phase 1 actually looks like
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-[28px]">
          We do not reteach what {lead.student.first} already knows.
        </h2>
        <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-primary-muted">
          Every session and every reteach is tied directly to a specific SAT
          question type. Phase 1 is mistake-based learning. Each session starts
          by pulling up the SAT-style questions she got wrong on her last
          practice round, ranked by point impact. We work through the easy
          version with her, then medium, then hard, until she can solve that
          question type on her own.
        </p>
        <p className="mt-3 max-w-[64ch] text-[15px] leading-relaxed text-primary-muted">
          The only time we go back to foundational content is when a
          prerequisite is blocking a specific SAT question. Here is exactly what
          that looks like in practice:
        </p>
        <figure className="mt-5 rounded-xl border-l-4 border-emerald-600 bg-ivory/60 p-5">
          <blockquote className="text-[15px] italic leading-relaxed text-primary">
            She gets a quadratic equation wrong on the SAT. We start reviewing
            it with her. She does not understand the step where we factored. We
            explain it. She still does not get it. We pause and reteach
            perfect-square factoring (or the distributive property, whatever the
            blocking concept actually was). Then we go back to the SAT question
            and finish it.
          </blockquote>
        </figure>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-300/60 bg-emerald-50/50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
              We do this
            </p>
            <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-primary">
              <li>Start every session on the SAT questions she missed.</li>
              <li>
                Teach the next prioritized skill at SAT depth, with SAT-style
                questions only.
              </li>
              <li>
                Pause to reteach a foundational concept only when it is blocking
                an SAT question we are working on.
              </li>
              <li>
                Re-baseline every 4 weeks and update her plan with what we just
                learned.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-muted">
              We never do this
            </p>
            <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-primary">
              <li>
                Open an Algebra 1 textbook from page one because she is a
                sophomore.
              </li>
              <li>
                Spend a session reviewing topics the diagnostic shows she
                already has.
              </li>
              <li>
                Run a generic SAT review track that does not change based on her
                actual gaps.
              </li>
              <li>Teach a concept that does not appear on the digital SAT.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
function TutorsSection({ lead }: { lead: PersonalizedEnrollLead }) {
  const items = [
    {
      title: "750+ on the section they teach",
      body:
        "A math tutor scored 750+ on math. A Reading and Writing tutor scored 750+ on R&W. There is no scenario where a 650 to 700 tutor is on " +
        lead.student.first +
        "'s case."
    },
    {
      title: "Digital SAT only",
      body:
        "Every tutor has personally taken the digital SAT. Tutors who only took the paper version are required to retake the digital before they are certified to teach for us."
    },
    {
      title: "Six-week certification + shadowing",
      body:
        "Tutors complete our certification, shadow live sessions before they teach, then are themselves shadowed for their first sessions. They retrain whenever the College Board changes the digital SAT."
    },
    {
      title: "Per-tutor outcomes are tracked",
      body:
        "We measure student accuracy on the question types each tutor taught. If a tutor's students consistently underperform on a topic, that is a signal we act on. That is a more reliable quality measure than retake quotas."
    },
    {
      title: "You see profiles before session 1",
      body:
        "Once " +
        lead.student.first +
        "'s diagnostic is in and she is matched, both her Math tutor's and R&W tutor's profile (school, program, year, section score) is sent to you before session 1 is scheduled. We re-match if either is not a fit."
    },
    {
      title: "Optional 15-min tutor intro call",
      body:
        "If you want a 15-minute introduction call with " +
        lead.student.first +
        "'s matched tutors before session 1, reply to " +
        lead.advisor.first +
        "'s email and we will arrange it."
    }
  ];
  return (
    <section className="mx-auto max-w-content px-6 py-8">
      <div className="rounded-2xl border border-border bg-surface-elevated p-7 shadow-card sm:p-9">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
          About {lead.student.first}&apos;s tutors
        </p>
        <h2 className="mt-2 max-w-[28ch] text-2xl font-bold tracking-tight text-primary sm:text-[28px]">
          Specialized by section. Certified on the digital SAT. Visible before
          week 1.
        </h2>
        <p className="mt-3 max-w-[64ch] text-[15px] leading-relaxed text-primary-muted">
          Our tutors are graduate students from schools like Vanderbilt, Duke,
          Georgia Tech, and Emory. They are not 10-year SAT veterans. Our
          position is that recent high scorers on the digital SAT, paired with
          our curriculum and shadowing, teach the current digital SAT better
          than a paper-SAT veteran teaching it second-hand.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <div
              key={it.title}
              className="grid grid-cols-[26px_1fr] gap-3 rounded-xl border border-border bg-white p-5"
            >
              <span className="mt-0.5 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <div>
                <h3 className="text-[15px] font-bold tracking-tight text-primary">
                  {it.title}
                </h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-primary-muted">
                  {it.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function RiskReversal({ lead }: { lead: PersonalizedEnrollLead }) {
  const items = [
    {
      title: "Diagnostic guarantee",
      body:
        "If the diagnostic and Phase 1 plan miss the mark, tell us within 7 days for a full refund. No tutoring charges begin during that window."
    },
    {
      title: "First tutoring week is free",
      body:
        "The $" +
        lead.pricing.weeklyPrice +
        "/week tutoring does not start billing until 7 days from checkout. Cancel inside that window with $0 weekly charge. No fixed contract after."
    },
    {
      title: "Tutors reserved on enrollment",
      body:
        "The moment you enroll, " +
        lead.student.first +
        "'s Math and R&W tutors are reserved. Her first session is scheduled within 7 days."
    }
  ];
  return (
    <section className="mx-auto max-w-content px-6 py-8">
      <div className="grid gap-5 rounded-2xl border border-border bg-surface-elevated p-6 shadow-card sm:grid-cols-3 sm:p-7">
        {items.map((it) => (
          <div key={it.title} className="grid grid-cols-[42px_1fr] gap-3">
            <span className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[15px] font-bold tracking-tight text-primary">
                {it.title}
              </h3>
              <p className="mt-1 text-[13.5px] leading-relaxed text-primary-muted">
                {it.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function FaqSection({ lead }: { lead: PersonalizedEnrollLead }) {
  const m = phase1Metrics(lead);
  const faqs = [
    {
      q: "What does the $" + lead.pricing.diagPrice + " actually pay for?",
      a: [
        "Five to six hours of our team's time before tutoring even starts: 2 hours 14 minutes proctored on the test with " +
          lead.student.first +
          " under real test-day conditions, 2 to 3 hours of hand-done analysis (time per question, every miss classified by question type and weighted by points cost), and a custom 12-week plan plus her first week of session-by-session lesson scripts written out before session 1.",
        "Tutoring is separate, billed weekly at $" +
          lead.pricing.weeklyPrice +
          "/week. The first week is free. Weekly billing starts 7 days from checkout."
      ]
    },
    {
      q: "Why a paid diagnostic instead of a free trial class?",
      a: [
        "A free trial class is a generic SAT lesson with a tutor who has not seen any of the student's data yet. We have run them. Either the lesson is too easy and wastes the student's time, or it is on a topic the student does not actually need help with. Neither tells a parent anything useful.",
        "So instead, what you pay for upfront is the diagnostic, the analysis, and the plan, and then the first week of weekly tutoring is free. That trade gets you a tutor who walks into session 1 already knowing " +
          lead.student.first +
          "'s exact gaps."
      ]
    },
    {
      q:
        "Can " +
        lead.student.first +
        " skip the diagnostic since she just took two Blue Book mocks?",
      a: [
        "We strongly recommend against it, and there is a middle option if she really does not want to retake right now.",
        "The Blue Book mocks were unproctored, on her own laptop, with no observation of timing, pacing, or which questions she paused on. We get one number out of them: 1070 to 1080. That tells us her band, but not why she is in that band. Without a proctored diagnostic, weeks 1 through 4 of tutoring would be the tutor guessing at what to teach.",
        "The middle option: a shorter 60-minute proctored mini-diagnostic (one math module, one Reading and Writing module). Same $" +
          lead.pricing.diagPrice +
          " because the analysis and plan work is the same. Reply to " +
          lead.advisor.first +
          "'s email and we will set it up."
      ]
    },
    {
      q: "How do we know Phase 1 will not be reteaching things she already knows?",
      a: [
        "Because the diagnostic prevents it. We rank her gaps by score impact and start with the highest-impact one. If the diagnostic shows she is strong on linear equations and weak on systems with quadratics, she will not see a single linear-equation lesson in Phase 1.",
        "The only place foundational reteaching shows up is when a prerequisite is blocking her from solving a specific SAT question (example: needing to reteach perfect-square factoring because it is blocking a quadratic equation question we are working on). Every reteach is tied directly to an SAT question type."
      ]
    },
    {
      q: "What does Phase 1 success look like, and what comes after?",
      a: [
        "Phase 1 (this 12-week cycle) is the foundation. Our program average is +15 points per week. For " +
          lead.student.first +
          ", starting at " +
          lead.startScore +
          ", that is a target of " +
          m.goalScore +
          " by " +
          lead.phase1.reviewDateLabel +
          ". Her highest-impact gaps will be closed and her timing on the digital SAT will be familiar.",
        "After Phase 1, the October sophomore PSAT becomes her first official benchmark. Phase 2 (the summer before junior year) is the National Merit / PSAT-NMSQT push, with her first official SAT in spring 2027 (May 1 target, March 6 or June 5 backup). Phase 3, if needed, is junior-year final optimization to 1500+. Results vary by student."
      ]
    },
    {
      q: "What if 12 weeks is not long enough to hit the Phase 1 goal?",
      a: [
        "Enrollment is week to week with no fixed contract, so there is no penalty for needing more time. If at week 12 she is 50 or 80 points short of the Phase 1 target, " +
          lead.advisor.first +
          " will walk through her actual gaps with you and either extend Phase 1 by a few weeks, increase weekly cadence, or move into the Phase 2 framing. The decision is based on her real data, not a fixed schedule."
      ]
    }
  ];

  return (
    <section className="mx-auto max-w-content px-6 py-8">
      <div className="rounded-2xl border border-border bg-surface-elevated p-7 shadow-card sm:p-9">
        <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-[28px]">
          Your questions, answered
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-primary-muted">
          Pulled from your June 9 call and your June 10 reply. If anything is
          still unclear, {lead.advisor.first} is one message away.
        </p>
        <div className="mt-5 divide-y divide-border/70">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              className="group py-4"
              {...(i === 0 ? { open: true } : {})}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-semibold leading-snug text-primary marker:hidden [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <span className="relative h-5 w-5 shrink-0 transition-transform group-open:rotate-45">
                  <span className="absolute left-0.5 top-2 h-0.5 w-4 rounded bg-emerald-700" />
                  <span className="absolute left-2 top-0.5 h-4 w-0.5 rounded bg-emerald-700" />
                </span>
              </summary>
              <div className="mt-3 space-y-3 pb-2 pr-7 text-[14.5px] leading-relaxed text-primary-muted">
                {f.a.map((p, pi) => (
                  <p key={pi}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
function NeedHelp({ lead }: { lead: PersonalizedEnrollLead }) {
  const mailto = "mailto:" + lead.advisor.email;
  return (
    <section className="mx-auto max-w-content px-6 py-8">
      <div className="grid items-center gap-5 rounded-2xl bg-navy p-7 text-ivory shadow-card sm:grid-cols-[1fr_auto] sm:p-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight">
            Anything still on your mind, {lead.parent.first}?
          </h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ivory/70">
            {lead.advisor.full} is your direct advisor. Reply to her email or
            book another call if you want to walk through anything together
            before you decide.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={mailto}
            className="inline-flex items-center gap-2 rounded-full border border-ivory/20 bg-ivory/5 px-4 py-2.5 text-[13.5px] font-semibold text-ivory transition hover:border-ivory/40 hover:bg-ivory/10"
          >
            Email {lead.advisor.first}
          </a>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-ivory/20 bg-ivory/5 px-4 py-2.5 text-[13.5px] font-semibold text-ivory transition hover:border-ivory/40 hover:bg-ivory/10"
          >
            Book another call
          </a>
        </div>
      </div>
    </section>
  );
}
function PageFooter() {
  return (
    <footer className="bg-navy-deep py-10 text-ivory/45">
      <div className="mx-auto flex max-w-content flex-col items-center gap-3 px-6 text-center">
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10.5px] font-semibold uppercase tracking-[0.18em]">
          <li><a href="/terms" className="hover:text-emerald-400">Terms</a></li>
          <li><a href="/privacy" className="hover:text-emerald-400">Privacy</a></li>
          <li><a href="/refund-policy" className="hover:text-emerald-400">Refund policy</a></li>
          <li><a href="/contact" className="hover:text-emerald-400">Contact</a></li>
        </ul>
        <p className="max-w-[64ch] text-[10.5px] leading-relaxed">
          {new Date().getFullYear()} Illuminairy. Tutoring services billed
          weekly, cancel anytime. Results vary by student. SAT and PSAT are
          trademarks of the College Board, which is not affiliated with this
          page.
        </p>
      </div>
    </footer>
  );
}

function MobilePayBar({ lead }: { lead: PersonalizedEnrollLead }) {
  return (
    <a
      href={lead.pricing.stripeLink}
      onClick={() =>
        captureAnalytics(AnalyticsEvents.personalizedEnrollPaymentClicked, {
          slug: lead.slug,
          source: "mobile_paybar"
        })
      }
      className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-full border border-emerald-300 bg-emerald-500 px-5 py-3 text-navy shadow-[0_12px_32px_rgba(16,185,129,0.35)] lg:hidden"
    >
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[15.5px] font-bold">
          Pay ${lead.pricing.diagPrice} and enroll
        </span>
        <span className="text-[11px] font-semibold opacity-80">
          First tutoring week free &middot; cancel anytime
        </span>
      </span>
      <ArrowIcon className="h-5 w-5" />
    </a>
  );
}
// SECTION_MAIN

type Props = { lead: PersonalizedEnrollLead };

export function PersonalizedEnrollPage({ lead }: Props) {
  useEffect(() => {
    captureAnalytics(AnalyticsEvents.personalizedEnrollPageViewed, {
      slug: lead.slug
    });
  }, [lead.slug]);

  return (
    <>
      <TopBar />
      <ProgressStrip />
      <main className="bg-ivory pb-24 text-ink lg:pb-12">
        <Hero lead={lead} />
        <section className="mx-auto max-w-content px-6 pb-2 pt-2">
          <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-7">
            <PlanCard lead={lead} />
            <PayCard lead={lead} />
          </div>
        </section>
        <InvestmentSection lead={lead} />
        <WhyProctorSection lead={lead} />
        <CycleOneSection lead={lead} />
        <TutorsSection lead={lead} />
        <RiskReversal lead={lead} />
        <FaqSection lead={lead} />
        <NeedHelp lead={lead} />
      </main>
      <PageFooter />
      <MobilePayBar lead={lead} />
    </>
  );
}
