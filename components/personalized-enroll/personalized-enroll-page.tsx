"use client";

import { useEffect, useState } from "react";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents } from "@/lib/analytics-events";
import {
  phase1Metrics,
  type PersonalizedEnrollLead
} from "@/lib/personalized-enroll";
import "./personalized-enroll.css";

function CheckIcon(props: { width?: number; height?: number }) {
  const w = props.width ?? 13;
  const h = props.height ?? 13;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      width={w}
      height={h}
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

function TopBar() {
  return (
    <div className="lp-chrome">
      <div className="lp-container lp-topbar">
        <span className="lp-wordmark">Illuminairy</span>
      </div>
    </div>
  );
}

function ProgressStrip() {
  const steps: Array<{ label: string; state: "done" | "active" | "next" }> = [
    { label: "Free SAT plan", state: "done" },
    { label: "Strategy call", state: "done" },
    { label: "Enroll", state: "active" },
    { label: "Phase 1 begins", state: "next" }
  ];
  return (
    <div className="co-progress">
      <div className="lp-container co-progress-inner">
        {steps.map((s, i) => (
          <div
            key={s.label}
            className={
              "co-progress-step" +
              (s.state === "done" ? " done" : "") +
              (s.state === "active" ? " active" : "")
            }
          >
            <span className="dot">{s.state === "done" ? "\u2713" : i + 1}</span>
            <span className="lbl">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// SECTION_PROGRESS
function PlanCard({ lead }: { lead: PersonalizedEnrollLead }) {
  const m = phase1Metrics(lead);
  const included = [
    {
      nm: (
        <>
          Proctored full-length digital adaptive Skill Diagnostic
          <span
            className="co-tip"
            tabIndex={0}
            role="img"
            aria-label="Optional 60-minute single-module version available"
            data-tip={
              "Prefer a shorter version? We can build a custom 60-minute proctored exam (1 Reading and Writing module + 1 Math module). Same $" +
              lead.pricing.diagPrice +
              ". Reply to " +
              lead.advisor.first +
              "'s email to set it up."
            }
          >
            i
          </span>
        </>
      ),
      ds:
        "2 hours 14 minutes. Watched the whole way by us, under real test-day conditions."
    },
    {
      nm: "Expert tutor review and analysis of her diagnostic",
      ds:
        "A tutor walks through her timing, her pacing, and every wrong answer, scoring each miss by how often that question type appears on the SAT and how hard it was. The output is her ranked gaps, biggest losses first."
    },
    {
      nm: "Her first 2 lessons built in detail before week 1",
      ds:
        "Plus her high-level 12-week plan, both starting with the gap costing her the most points. The plan flexes as she progresses and as her every-4-week practice tests come in."
    },
    {
      nm: "Two specialized tutors (Math 750+, R&W 750+)",
      ds: "You see both profiles before session 1. Re-match if either is not a fit."
    },
    {
      nm: "24 one-hour sessions over 12 weeks",
      ds: "Two sessions per week. 80 to 90 percent are one-on-one."
    },
    {
      nm: "5 full-length practice tests across the cycle",
      ds:
        "Diagnostic plus weeks 4, 8, 12, and Phase 1 review. Every 4 weeks she takes a fresh full-length practice test so we can see her real current score and update her plan."
    },
    {
      nm: "Personalized homework from 3,500+ practice questions",
      ds: "Mistake-based, mixed easy/medium/hard. Tied to her actual gaps."
    },
    {
      nm: "Weekly parent progress reports",
      ds:
        "Homework completion, accuracy by question type, score trend. Never left guessing."
    }
  ];

  return (
    <aside className="co-plan">
      <p className="co-plan-eyebrow">Phase 1: Foundation cycle ({lead.phase1.weeks} weeks)</p>
      <h2 className="co-plan-title">{lead.student.first}&apos;s SAT plan</h2>

      <div className="co-target">
        <div className="seg">
          <span className="k">Starting</span>
          <span className="v">{lead.startScore}</span>
        </div>
        <span className="arrow">&rarr;</span>
        <div className="seg">
          <span className="k">Phase 1 goal</span>
          <span className="v hot">{m.goalScore}</span>
        </div>
        <span className="gain">+{m.gain} pts</span>
      </div>
      <div className="co-target-foot">
        <div className="m">
          <span className="v">{m.days} days</span>
          <span className="k">Phase 1 length</span>
        </div>
        <div className="m">
          <span className="v">{lead.phase1.reviewDateLabel}</span>
          <span className="k">Phase 1 review</span>
        </div>
        <div className="m">
          <span className="v">+{lead.phase1.pacePerWeek}/wk</span>
          <span className="k">Program avg pace</span>
        </div>
      </div>

      <p className="co-incl-head">Everything that&apos;s included in Phase 1</p>
      <ul className="co-incl">
        {included.map((it, i) => (
          <li key={i}>
            <span className="check">
              <CheckIcon width={12} height={12} />
            </span>
            <div>
              <span className="nm">{it.nm}</span>
              <span className="ds">{it.ds}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
function PayCard({ lead }: { lead: PersonalizedEnrollLead }) {
  const derivedLast =
    lead.parent.last ??
    lead.parent.full.replace(lead.parent.first, "").trim();
  const [first, setFirst] = useState(lead.parent.first ?? "");
  const [last, setLast] = useState(derivedLast);
  const [email, setEmail] = useState(lead.parent.email ?? "");
  const [tos, setTos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPay() {
    setError(null);
    const trimmedFirst = first.trim();
    const trimmedLast = last.trim();
    const trimmedEmail = email.trim();
    if (!trimmedFirst || !trimmedLast || !trimmedEmail) {
      setError("Please complete your billing contact.");
      return;
    }
    if (!tos) {
      setError("Please agree to the terms to continue.");
      return;
    }
    setSubmitting(true);
    captureAnalytics(AnalyticsEvents.personalizedEnrollPaymentClicked, {
      slug: lead.slug,
      source: "main_form"
    });
    try {
      const res = await fetch("/api/personalized-enroll/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: lead.slug,
          first: trimmedFirst,
          last: trimmedLast,
          email: trimmedEmail,
          tos: true
        })
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        setError(
          data.error ??
            "Could not start checkout. Please try again or email " +
              lead.advisor.email +
              "."
        );
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      console.error("personalized-enroll checkout client error:", err);
      setError(
        "Could not reach the checkout service. Please try again, or email " +
          lead.advisor.email +
          " and we will enroll you directly."
      );
      setSubmitting(false);
    }
  }

  return (
    <section className="co-pay">
      <p className="co-pay-eyebrow">Complete enrollment</p>
      <h2 className="co-pay-title">Secure {lead.student.first}&apos;s spot</h2>

      <div className="co-price">
        <div className="co-price-row">
          <div className="co-price-name">
            Diagnostic + analysis + Phase 1 plan
            <span className="sub">One-time &middot; charged today</span>
          </div>
          <div className="co-price-amt">
            ${lead.pricing.diagPrice}
            <span className="per">Today</span>
          </div>
        </div>
        <div className="co-price-row">
          <div className="co-price-name">
            Twice-weekly tutoring
            <span className="sub">
              Weekly billing starts 7 days from today &middot; cancel anytime
            </span>
          </div>
          <div className="co-price-amt">
            ${lead.pricing.weeklyPrice}
            <span className="per">/ week</span>
          </div>
        </div>
        <div className="co-price-due">
          <span className="lbl">Due today</span>
          <span className="amt">${lead.pricing.diagPrice}</span>
        </div>
      </div>

      <span className="co-field-label">Billing contact</span>
      <div className="co-input-group">
        <div className="co-input-row">
          <input
            className="co-input"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
          <input
            className="co-input"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            value={last}
            onChange={(e) => setLast(e.target.value)}
          />
        </div>
        <div className="co-input-row">
          <input
            className="co-input"
            type="email"
            autoComplete="email"
            placeholder="Email for receipt"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <span className="co-field-label mt">Card details</span>
      <div className="co-card-fallback" aria-hidden="true">
        <div className="co-cf-num">
          <span className="co-cf-ph">1234 1234 1234 1234</span>
          <span className="co-brands">
            <span className="co-brand mc">
              <i className="r" />
              <i className="y" />
            </span>
            <span className="co-brand visa">VISA</span>
            <span className="co-brand amex">AMEX</span>
            <span className="co-brand disc">DISC</span>
          </span>
        </div>
        <div className="co-cf-row">
          <div className="co-cf-cell">
            <span className="co-cf-ph">MM / YY</span>
          </div>
          <div className="co-cf-cell">
            <span className="co-cf-ph">CVC</span>
            <svg
              className="co-cf-icon"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              stroke="currentColor"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        </div>
      </div>

      <div className="co-tos">
        <input
          type="checkbox"
          id="tos"
          checked={tos}
          onChange={(e) => setTos(e.target.checked)}
        />
        <label htmlFor="tos">
          I agree to Illuminairy&apos;s Terms, Refund Policy, and Privacy Policy. I
          authorize the ${lead.pricing.diagPrice} charge today and weekly billing
          of ${lead.pricing.weeklyPrice} starting 7 days from now, which I can
          cancel anytime.
        </label>
      </div>

      <button
        type="button"
        className="co-paybtn"
        onClick={onPay}
        disabled={submitting}
      >
        <span>
          {submitting
            ? "Starting secure checkout\u2026"
            : `Pay $${lead.pricing.diagPrice} and enroll ${lead.student.first}`}
        </span>
        {!submitting && (
          <span className="arrow">
            <ArrowIcon />
          </span>
        )}
      </button>

      {error && (
        <p
          role="alert"
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(176,40,40,0.06)",
            border: "1px solid rgba(176,40,40,0.22)",
            color: "#a92929",
            fontSize: 13.5
          }}
        >
          {error}
        </p>
      )}

      <div className="co-trust-row">
        <span>
          <svg viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          256-bit SSL
        </span>
        <span>
          <svg viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor">
            <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
          </svg>
          PCI compliant
        </span>
        <span>
          <CheckIcon width={13} height={13} />
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
      title: "Expert tutor reviews her results",
      body:
        "A tutor walks through her test in detail: her time per question, her pacing across both modules, and every wrong answer. For each miss, they note how often that question type appears on the digital SAT and whether it was easy, medium, or hard, and use those two factors to estimate how many points the gap is costing her overall. Those numbers become her ranked gaps, biggest losses first."
    },
    {
      hours: "1\u20132 hrs",
      title: "Tutor-built plan and first 2 lessons",
      body:
        "Using her ranked gaps, an expert tutor drafts her high-level 12-week plan starting with the gap costing her the most points, then builds her first 2 lessons in detail before week 1. The plan flexes as she progresses and as her every-4-week practice tests come in."
    }
  ];
  return (
    <section
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: 16,
        padding: "32px 32px 28px",
        marginBottom: 28,
        boxShadow: "0 14px 40px rgba(18,26,43,0.06)"
      }}
    >
      <p
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          fontWeight: 500,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--em)",
          margin: 0
        }}
      >
        What the ${lead.pricing.diagPrice} actually buys
      </p>
      <h2
        style={{
          fontFamily: "var(--display)",
          fontWeight: 700,
          fontSize: "clamp(22px,3.4vw,28px)",
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          margin: "8px 0 0",
          color: "var(--page-fg)"
        }}
      >
        5 to 6 hours of our team&apos;s time, before tutoring even starts.
      </h2>
      <p
        style={{
          margin: "12px 0 0",
          maxWidth: "60ch",
          fontSize: 15,
          lineHeight: 1.6,
          color: "var(--fg-soft)"
        }}
      >
        Concretely, here is the time you are paying for: a proctored
        evaluation under real test-day conditions, an expert tutor&apos;s
        review and analysis of her results, and the custom plan and first
        lessons built from that analysis.
      </p>
      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20
        }}
      >
        {items.map((it) => (
          <div
            key={it.title}
            style={{
              border: "1px solid var(--hairline)",
              background: "rgba(247,250,252,0.7)",
              borderRadius: 12,
              padding: 20
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--display)",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.02em",
                background: "var(--em)",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: 6,
                marginBottom: 12
              }}
            >
              {it.hours}
            </span>
            <h3
              style={{
                fontFamily: "var(--display)",
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: "-0.01em",
                margin: "0 0 6px",
                color: "var(--page-fg)"
              }}
            >
              {it.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--fg-soft)"
              }}
            >
              {it.body}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: "20px 22px",
          borderRadius: 12,
          background: "var(--surface-2)"
        }}
      >
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--fg-mute)",
            margin: 0,
            fontWeight: 500
          }}
        >
          What the proctored 2 hours 14 minutes captures that a practice test
          on her own cannot
        </p>
        <p
          style={{
            margin: "10px 0 0",
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--fg-soft)"
          }}
        >
          The two Blue Book practice tests {lead.student.first} already took
          were unproctored. They give us her score band, but not the signal
          we need to plan against. With proctoring, an expert tutor sees:
        </p>
        <ul
          style={{
            margin: "12px 0 0",
            padding: 0,
            listStyle: "none",
            display: "grid",
            gap: 10
          }}
        >
          {[
            "Real timing per question, with no pause and no break",
            "Whether " +
              lead.student.first +
              " actually finished each section or guessed the last few",
            "Where she used Desmos and where she tried to solve mentally",
            "Where she hesitated, where she rushed, and where her accuracy dropped from fatigue",
            "Whether she reached module 2 hard, or stayed in module 2 medium because of her module 1 accuracy"
          ].map((c) => (
            <li
              key={c}
              style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr",
                gap: 12,
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--page-fg)"
              }}
            >
              <span
                style={{
                  marginTop: 2,
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: "rgba(47,110,71,0.12)",
                  color: "var(--em)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <CheckIcon width={11} height={11} />
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
const sectionShellStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--hairline)",
  borderRadius: 16,
  padding: "32px 32px 28px",
  marginBottom: 28,
  boxShadow: "0 14px 40px rgba(18,26,43,0.06)"
};

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10.5,
  fontWeight: 500,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "var(--em)",
  margin: 0
};

const h2Style: React.CSSProperties = {
  fontFamily: "var(--display)",
  fontWeight: 700,
  fontSize: "clamp(22px,3.4vw,28px)",
  letterSpacing: "-0.025em",
  lineHeight: 1.1,
  margin: "8px 0 0",
  color: "var(--page-fg)"
};

const bodyStyle: React.CSSProperties = {
  margin: "14px 0 0",
  maxWidth: "62ch",
  fontSize: 15,
  lineHeight: 1.65,
  color: "var(--fg-soft)"
};

function CycleOneSection({ lead }: { lead: PersonalizedEnrollLead }) {
  return (
    <section style={sectionShellStyle}>
      <p style={eyebrowStyle}>What Phase 1 actually looks like</p>
      <h2 style={h2Style}>
        We do not reteach what {lead.student.first} already knows.
      </h2>
      <p style={bodyStyle}>
        Each session we&apos;ll start by pulling up an SAT problem that she
        got incorrect. We&apos;ll walk through how to solve that problem with
        her step by step. We only stop and go back over a foundational topic
        if it&apos;s blocking her from understanding and being able to solve
        that problem on her own.
      </p>
      <p style={{ ...bodyStyle, margin: "12px 0 0" }}>
        Here&apos;s what that would look like in practice:
      </p>
      <figure
        style={{
          margin: "20px 0 0",
          padding: "18px 22px",
          background: "var(--surface-2)",
          borderLeft: "4px solid var(--em)",
          borderRadius: 10
        }}
      >
        <blockquote
          style={{
            margin: 0,
            fontStyle: "italic",
            fontSize: 15,
            lineHeight: 1.65,
            color: "var(--page-fg)"
          }}
        >
          She gets a quadratic equation wrong on the SAT. We start reviewing it
          with her. She does not understand the step where we factored. We
          explain it. She still does not get it. We pause and reteach
          perfect-square factoring (or the distributive property, whatever the
          blocking concept actually was). Then we go back to the SAT question
          and finish it.
        </blockquote>
      </figure>
      <div
        style={{
          marginTop: 24,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
        }}
      >
        <div
          style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(119,200,154,0.10)",
            border: "1px solid rgba(47,110,71,0.32)"
          }}
        >
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--em)",
              margin: 0,
              fontWeight: 600
            }}
          >
            We do this
          </p>
          <ul
            style={{
              margin: "12px 0 0",
              paddingLeft: 18,
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--page-fg)"
            }}
          >
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
        <div
          style={{
            padding: 20,
            borderRadius: 12,
            background: "var(--surface)",
            border: "1px solid var(--hairline)"
          }}
        >
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--fg-mute)",
              margin: 0,
              fontWeight: 600
            }}
          >
            We never do this
          </p>
          <ul
            style={{
              margin: "12px 0 0",
              paddingLeft: 18,
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--page-fg)"
            }}
          >
            <li>
              Open an Algebra 1 textbook from page one because she is a
              sophomore.
            </li>
            <li>
              Spend a session reviewing topics the diagnostic shows she already
              has.
            </li>
            <li>
              Run a generic SAT review track that does not change based on her
              actual gaps.
            </li>
            <li>Teach a concept that does not appear on the digital SAT.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
function TutorsSection({ lead }: { lead: PersonalizedEnrollLead }) {
  const items = [
    {
      title: "750+ on the section they teach, no recent grads",
      body:
        "Every tutor scored 750 or higher on the section they teach. A math tutor scored 750+ on math, a Reading and Writing tutor scored 750+ on R&W. There is no scenario where a 650 to 700 tutor is on " +
        lead.student.first +
        "'s case. None of our tutors are recent high school graduates or college freshmen, and we explicitly screen against that when matching her."
    },
    {
      title: "Trained on the digital SAT, not the paper version",
      body:
        "Every tutor has personally taken the digital SAT and is trained specifically on its current format: the Desmos calculator, the built-in formula reference, and the adaptive module 1 / module 2 structure. Tutors who only took the paper version are required to retake the digital before certification, and they retrain whenever the College Board changes the test."
    },
    {
      title: "Shadowed for teaching style, not just the score",
      body:
        "Subject-matter expertise alone does not make a great teacher. Every tutor is shadowed before approval and given feedback on their teaching style during certification. After they start, we track their students' accuracy on the question types they taught, and act on that data."
    },
    {
      title: "Introduction email before session 1",
      body:
        "Once " +
        lead.student.first +
        " is matched, you and " +
        lead.student.first +
        " receive an introduction email from her Math tutor and her R&W tutor with their school, program, year, section score, and tutoring background, all before session 1 is scheduled. A 15-minute intro call before session 1 is also available on request, just reply to " +
        lead.advisor.first +
        "'s email."
    }
  ];
  return (
    <section style={sectionShellStyle}>
      <p style={eyebrowStyle}>About {lead.student.first}&apos;s tutors</p>
      <h2 style={{ ...h2Style, maxWidth: "30ch" }}>
        Specialized by section. Trained on the digital SAT. Visible before
        week 1.
      </h2>
      <p style={bodyStyle}>
        Our tutors are graduate students from schools like Vanderbilt, Duke,
        Georgia Tech, and Emory. We use near-peer tutors on purpose. Research
        on near-peer mentorship shows it consistently outperforms
        authority-based teaching (i.e. teachers who teach the SAT) for SAT
        prep, and we have seen the same in our own outcomes: students learn
        faster from someone who recently sat the same digital SAT than they
        do from a teacher who never has. They&apos;re also more likely to
        connect on their long-term college ambitions with someone who&apos;s
        in the same place they hope to be, and to ask questions, than they
        are with a teacher who&apos;s never been in their shoes.
      </p>
      <div
        style={{
          marginTop: 22,
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
        }}
      >
        {items.map((it) => (
          <div
            key={it.title}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr",
              gap: 14,
              padding: 18,
              borderRadius: 12,
              border: "1px solid var(--hairline)",
              background: "var(--surface)"
            }}
          >
            <span
              style={{
                marginTop: 1,
                width: 28,
                height: 28,
                borderRadius: 999,
                background: "rgba(47,110,71,0.10)",
                color: "var(--em)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CheckIcon width={14} height={14} />
            </span>
            <div>
              <h3
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 700,
                  fontSize: 15.5,
                  letterSpacing: "-0.01em",
                  margin: 0,
                  color: "var(--page-fg)"
                }}
              >
                {it.title}
              </h3>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "var(--fg-soft)"
                }}
              >
                {it.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function RiskReversal({ lead }: { lead: PersonalizedEnrollLead }) {
  const items = [
    {
      title: "Diagnostic and plan first, then billing",
      body:
        "The 7 days after enrollment are setup: we run her diagnostic, deliver her Phase 1 plan, and schedule her first session. The first $" +
        lead.pricing.weeklyPrice +
        " weekly charge does not hit until day 7."
    },
    {
      title: "Week-to-week, no fixed contract",
      body:
        "Each $" +
        lead.pricing.weeklyPrice +
        " charge is billed in advance and covers her next 7 days and next 2 tutoring sessions. Cancel before any future billing date to stop further charges."
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
    <div className="co-reversal">
      {items.map((it) => (
        <div className="co-rev-item" key={it.title}>
          <span className="co-rev-icon">
            <svg
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <div>
            <h4>{it.title}</h4>
            <p>{it.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
function FaqSection({ lead }: { lead: PersonalizedEnrollLead }) {
  const faqs: Array<{ q: string; a: string[] }> = [
    {
      q: "What does the $" + lead.pricing.diagPrice + " actually pay for?",
      a: [
        "Five to six hours of our team's time before tutoring even starts: 2 hours 14 minutes proctored on the test with " +
          lead.student.first +
          " under real test-day conditions, 2 to 3 hours of expert tutor review and analysis (each miss scored by how often that question type appears on the SAT and whether it was easy, medium, or hard, then converted into how many points that gap is costing her overall), and 1 to 2 hours of plan-building: an expert tutor drafts her high-level 12-week plan starting with the gap costing her the most points, and builds her first 2 lessons in detail before week 1.",
        "Tutoring is separate, billed weekly at $" +
          lead.pricing.weeklyPrice +
          "/week. The first week is free. Weekly billing starts 7 days from checkout."
      ]
    },
    {
      q: "How does the weekly $" + lead.pricing.weeklyPrice + " billing work?",
      a: [
        "Weekly tutoring is billed in advance: each $" +
          lead.pricing.weeklyPrice +
          " charge covers the next 7 days and " +
          lead.student.first +
          "'s next 2 tutoring sessions. The 7 days right after enrollment are setup, not tutoring. Here is the timeline:",
        "Today (day 0): you pay $" +
          lead.pricing.diagPrice +
          " for the diagnostic, the analysis, and Phase 1 plan. No weekly charge yet.",
        "Days 0 to 7: setup window. We run her proctored diagnostic, build her plan, and schedule her first session. No tutoring billing yet.",
        "Day 7: the first $" +
          lead.pricing.weeklyPrice +
          " charge hits. That covers her 2 tutoring sessions during days 7 to 14.",
        "Day 14: the next $" +
          lead.pricing.weeklyPrice +
          " charge hits. That covers her 2 sessions during days 14 to 21. And so on, week by week.",
        "To stop future charges, cancel before the next billing date. The diagnostic ($" +
          lead.pricing.diagPrice +
          ") is non-refundable once delivered, and unused sessions in an already-billed week are not refunded. Full terms: Refund and Cancellation Policy."
      ]
    },
    {
      q: "Why a paid diagnostic instead of a free trial class?",
      a: [
        "Our tutors' time is costly, and we pay them a fair wage. Each tutor invests 5 to 6 hours upfront on " +
          lead.student.first +
          "'s diagnostic, her personalized plan, and her initial lesson customization, all before her first session. We start with the diagnostic specifically so we can ensure a successful first session.",
        "We do not offer trial lessons, but we do ensure a personalized experience with a high-quality tutor from session 1. Every session has quality flags. If " +
          lead.student.first +
          " and her tutor are not connecting, or if learning is not happening, we can flag it for review. In those cases we typically investigate the session, provide an additional lesson if warranted, or rematch her with a different tutor, case by case.",
        "Group SAT prep companies can give a free trial class because adding one more student to a group lesson costs them nothing. Our sessions are one-on-one, so a single trial would cost us the hours of preparation plus the hour of tutoring."
      ]
    },
    {
      q:
        "Can " +
        lead.student.first +
        " skip the diagnostic since she just took two Blue Book practice tests?",
      a: [
        "Our program works backwards from the diagnostic results, and we simply cannot develop her personalized lessons without it.",
        "If she would rather not take the full 2 hour 14 minute proctored exam, we can develop a custom 60-minute version (1 Reading and Writing module and 1 Math module, instead of 2 each). The cost would be the same $" +
          lead.pricing.diagPrice +
          " because we would need to create a custom diagnostic that does not currently exist in our system. Reply to " +
          lead.advisor.first +
          "'s email if you'd prefer to move forward this way and we'd be happy to set it up."
      ]
    },
    {
      q: "How do we know Phase 1 will not be reteaching things she already knows?",
      a: [
        "Because the diagnostic prevents it. We do not teach the SAT curriculum from A to Z. We diagnose where she is struggling and only teach those concepts. We rank the questions she misses on the diagnostic by score impact and start with the highest-impact one. If the diagnostic shows she is strong on linear equations and weak on systems with quadratics, she will not see a single linear-equation lesson.",
        "The only place foundational reteaching shows up is when a prerequisite is blocking her from solving a specific SAT question (example: needing to reteach perfect-square factoring because it is blocking a quadratic equation question we are working on). Every reteach is tied directly to an SAT question type."
      ]
    },
  ];

  return (
    <div className="co-faq">
      <h3>Frequently asked questions</h3>
      {faqs.map((f, i) => (
        <details key={f.q} {...(i === 0 ? { open: true } : {})}>
          <summary>
            {f.q}
            <span className="plus" />
          </summary>
          <div className="answer">
            {f.a.map((p, pi) => (
              <p key={pi}>{p}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
function NeedHelp({ lead }: { lead: PersonalizedEnrollLead }) {
  return (
    <div className="co-help">
      <div className="co-help-text">
        <h4>Anything still on your mind, {lead.parent.first}?</h4>
        <p>
          {lead.advisor.full} is your direct advisor. Reply to her email or
          book another call if you want to walk through anything together
          before you decide.
        </p>
      </div>
      <div className="co-help-actions">
        <a className="co-help-btn" href={"mailto:" + lead.advisor.email}>
          Email {lead.advisor.first}
        </a>
        <a className="co-help-btn" href="/contact">
          Book another call
        </a>
      </div>
    </div>
  );
}
function PageFooter() {
  return (
    <footer className="co-footer">
      <div className="lp-container">
        <ul className="links">
          <li>
            <a href="/terms">Terms</a>
          </li>
          <li>
            <a href="/privacy">Privacy</a>
          </li>
          <li>
            <a href="/refund-policy">Refund policy</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
        <p className="legal">
          © {new Date().getFullYear()} Illuminairy. Tutoring services billed
          weekly, cancel anytime. Results vary by student. SAT and PSAT are
          trademarks of the College Board, which is not affiliated with this
          page.
        </p>
      </div>
    </footer>
  );
}
function MobilePayBar({ lead }: { lead: PersonalizedEnrollLead }) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    captureAnalytics(AnalyticsEvents.personalizedEnrollPaymentClicked, {
      slug: lead.slug,
      source: "mobile_paybar"
    });
    // Scroll the user to the inline form. The form is the functional checkout;
    // the mobile bar is just a sticky reminder, not a separate checkout path.
    const target = document.querySelector(".co-pay");
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  return (
    <a
      href="#enroll-form"
      onClick={handleClick}
      className="co-mobile-paybar"
    >
      <span className="co-mobile-paybar-text">
        <span className="lbl">
          Pay ${lead.pricing.diagPrice} and enroll
        </span>
        <span className="sub">
          First tutoring week free &middot; cancel anytime
        </span>
      </span>
      <span className="co-mobile-paybar-arrow">
        <ArrowIcon />
      </span>
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
    <div className="lp co">
      <TopBar />
      <ProgressStrip />

      <div className="lp-container" style={{ paddingTop: 28 }}>
        <div className="co-grid">
          <PlanCard lead={lead} />
          <PayCard lead={lead} />
          <div className="co-grid-content">
            <InvestmentSection lead={lead} />
            <CycleOneSection lead={lead} />
            <TutorsSection lead={lead} />
            <RiskReversal lead={lead} />
            <FaqSection lead={lead} />
            <NeedHelp lead={lead} />
          </div>
        </div>
      </div>

      <PageFooter />
      <MobilePayBar lead={lead} />
    </div>
  );
}
