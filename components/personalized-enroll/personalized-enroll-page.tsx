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
function FaqSection({ lead }: { lead: PersonalizedEnrollLead }) {
  const diag = lead.pricing.diagPrice;
  const wk = lead.pricing.weeklyPrice;
  const student = lead.student.first;
  const advisor = lead.advisor.first;

  const faqs: Array<{ q: string; a: string[] }> = [
    {
      q:
        "Why are we paying $" +
        diag +
        " upfront, and why don't you offer a free trial class?",
      a: [
        "The $" +
          diag +
          " covers 5 to 6 hours of our team's time before tutoring starts: 2 hours 14 minutes proctored on the test with " +
          student +
          " under real test-day conditions, 2 to 3 hours of expert tutor review and analysis (each miss scored by how often that question type appears on the digital SAT and whether it was easy, medium, or hard, then converted into how many points that gap is costing her overall), and 1 to 2 hours of plan-building: an expert tutor drafts her high-level 12-week plan starting with her highest-impact gap and writes her first 2 lessons in detail before week 1.",
        "Tutoring is separate, billed weekly at $" +
          wk +
          " per week. The 7 days right after enrollment are setup time used to run her diagnostic, analyze the results, build her plan, match her with the right tutors, and schedule her first sessions. Weekly billing starts on day 7, when tutoring begins.",
        "We do not offer free trial classes for two reasons. First, a free trial is a generic SAT lesson with a tutor who has not seen the student's data yet, and we have found that does not tell a parent anything useful. Second, our sessions are one-on-one. A group SAT prep company can offer a free trial because adding one more student to a group lesson costs them nothing; a 1:1 trial would cost us the hours of preparation plus the hour of tutoring.",
        "We have also found that students and tutors often do not find their groove until a few sessions in, when the student is more comfortable opening up and the tutor has adjusted their approach to what the student is responding to. There is no way to capture that in a single trial lesson. Rapport and personalization take time. To handle that adjustment period, every session has quality flags: if " +
          student +
          " and her tutor are not connecting, we can flag the session for review, investigate, provide an additional lesson if warranted, or rematch her with a different tutor, case by case."
      ]
    },
    {
      q:
        "Can " +
        student +
        " skip the diagnostic since she just took two Blue Book practice tests?",
      a: [
        "Our program works backwards from the diagnostic results, and we cannot develop her personalized lessons without it. The Blue Book practice tests she already took were unproctored. They give us her score band, but not the signal we need to build her plan around.",
        "What an expert tutor sees during a proctored 2 hours 14 minutes that an unproctored practice test cannot show: real timing per question (no pause, no break); whether " +
          student +
          " actually finished each section or guessed the last few; where she used Desmos and where she tried to solve mentally; where she hesitated, where she rushed, and where her accuracy dropped from fatigue; and whether she reached module 2 hard, or stayed in module 2 medium because of her module 1 accuracy.",
        "If she would rather not take the full 2 hour 14 minute proctored exam, we can develop a custom 60-minute version (1 Reading and Writing module and 1 Math module, instead of 2 each). The cost would be the same $" +
          diag +
          " because we would need to create a custom diagnostic that does not currently exist in our system. Reply to " +
          advisor +
          "'s email if you would prefer to move forward this way and we will set it up."
      ]
    },
    {
      q: "How do we know Phase 1 will not be reteaching things she already knows?",
      a: [
        "Because the diagnostic prevents it. We do not teach the SAT curriculum from A to Z. We diagnose where she is struggling and only teach those concepts. We rank the questions she misses on the diagnostic by score impact and start with the highest-impact one. If the diagnostic shows she is strong on linear equations and weak on systems with quadratics, she will not see a single linear-equation lesson.",
        "Each session opens by pulling up an SAT problem she got incorrect, and we walk through how to solve it with her step by step. The only time we go back to a foundational topic is when a prerequisite is blocking her from solving the SAT question we are working on. Example: if she gets a quadratic equation wrong, we start reviewing it with her, and if she does not understand the step where we factored, we pause and reteach perfect-square factoring (or whatever the blocking concept is). Then we go back to the SAT question and finish it.",
        "We never open an Algebra 1 textbook from page one because she is a sophomore, never spend a session reviewing topics the diagnostic shows she already has, and never run a generic SAT review track that does not change based on her actual gaps. Every reteach is tied directly to an SAT question type."
      ]
    },
    {
      q:
        "Who will be tutoring " +
        student +
        ", and how do we know they're qualified?",
      a: [
        "Every tutor has a verified digital SAT score of 750 or higher on the section they teach. A math tutor scored 750+ on math, a Reading and Writing tutor scored 750+ on R&W. There is no scenario where a 650 to 700 tutor is on " +
          student +
          "'s case.",
        "Every tutor has personally taken the digital SAT and is trained specifically on its current format: the Desmos calculator, the built-in formula reference, and the adaptive module 1 / module 2 structure. Tutors who only took the paper version are required to retake the digital before certification, and they retrain whenever the College Board changes the test.",
        "We intentionally prefer tutors who have personally taken the digital SAT. Because the digital SAT only launched recently, our tutors are most often current college students at schools like Vanderbilt, Duke, Georgia Tech, and Emory. That is a deliberate choice, different from hiring an older paper-SAT tutor and training them on the new digital format. In practice, very few experienced tutors are willing to retake something as demanding as the SAT for a part-time tutoring role, especially since long-time tutors have no shortage of clients without retaking the digital format and so are not incentivized to do so.",
        "Beyond the credential, students also tend to respond better to near-peer tutors. When we previously used teachers or more mature tutors, students did not build rapport as quickly, and score improvement was not as strong. Many of those teachers had also never taken the digital SAT themselves, which made it harder to coach from direct experience. Over time we intentionally transitioned toward near-peer tutors because students connected with them better and performed better.",
        "Subject-matter expertise alone does not make a great teacher. Every tutor is shadowed before approval and given feedback on their teaching style during certification. After they start teaching, we track each tutor's students' accuracy on the question types they teach, and we act on that data.",
        "Before session 1 is scheduled, you and " +
          student +
          " will receive an introduction email from her Math tutor and her R&W tutor with their school, program, year, section score, and tutoring background. A 15-minute intro call before session 1 is also available on request, just reply to " +
          advisor +
          "'s email.",
        "If you have a specific preference for someone with more years of tutoring or teaching experience, " +
          advisor +
          " can reach out to our older tutors. The trade-off is that we may not be able to guarantee they have a verified digital SAT score, since most experienced tutors took the paper version and few are willing to retake the digital for a part-time role. Reply if you would like to go that route."
      ]
    },
    {
      q: "Is the first week of weekly classes free?",
      a: [
        "Yes, in the sense that no $" +
          wk +
          " weekly charge hits during the first 7 days. Those 7 days are setup time, not tutoring time. Here is the full timeline:",
        "Today (day 0): you pay $" +
          diag +
          " for the diagnostic, the analysis, and Phase 1 plan. No weekly charge yet.",
        "Days 0 to 7: setup window. We run her proctored diagnostic, build her plan, match her with her tutors, and schedule her first sessions. No tutoring billing yet.",
        "Day 7: the first $" +
          wk +
          " charge hits. That covers her 2 tutoring sessions during days 7 to 14.",
        "Day 14: the next $" +
          wk +
          " charge. That covers her 2 sessions during days 14 to 21. And so on, week by week.",
        "Weekly billing is in advance, so each $" +
          wk +
          " charge covers the upcoming 7 days. To stop future charges, cancel before the next billing date. The diagnostic ($" +
          diag +
          ") is non-refundable once delivered, and unused sessions in an already-billed week are not refunded. Full terms: Refund and Cancellation Policy."
      ]
    }
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
