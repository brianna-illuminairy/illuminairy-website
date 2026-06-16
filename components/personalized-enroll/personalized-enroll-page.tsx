/**
 * LOCKED — Sohail Yousaf custom enrollment page component (sent Jun 2026).
 *
 * Serves `/enroll/sohail-shermeen` only. Do not import from this file in
 * new pages, and do not edit it without an explicit owner unlock — the
 * page link was already sent and must remain stable. Build new enrollment
 * pages on the standard stack: `components/standard-enroll/*`.
 *
 * See: app/enroll/sohail-shermeen/LOCK.md
 */
"use client";

import { useEffect, useState } from "react";
import { loadStripe, type Stripe as StripeJs } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import {
  trackEnrollCheckoutViewed,
  trackEnrollPaymentClicked,
  trackEnrollPaymentCompleted,
  trackEnrollPaymentFailed
} from "@/lib/enroll-checkout-analytics";
import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";
import { type PersonalizedEnrollLead } from "@/lib/personalized-enroll";
import "./personalized-enroll.css";

function personalizedEnrollAnalyticsProps(lead: PersonalizedEnrollLead) {
  return {
    program: "personalized_enroll" as const,
    slug: lead.slug,
    diagPrice: lead.pricing.diagPrice,
    weeklyPrice: lead.pricing.weeklyPrice
  };
}

// Load Stripe.js once per module load. The publishable key is read at module
// init time on the client; if it is missing we render an error state below
// instead of throwing during the load.
const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise: Promise<StripeJs | null> = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

/** Shared style for all three split card elements so they look like one
 *  field rather than three Stripe-default inputs. The wrapper divs supply
 *  border / padding / brand badges. */
const CARD_ELEMENT_STYLE = {
  showIcon: false,
  style: {
    base: {
      fontFamily:
        "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif",
      fontSize: "15px",
      fontWeight: "400",
      color: "#121A2B",
      "::placeholder": { color: "rgba(18,26,43,0.42)" }
    },
    invalid: { color: "#a92929" }
  }
} as const;

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
    <header className="lp-chrome">
      <div className="lp-container lp-topbar">
        <IlluminairyLogoV7 tone="on-dark" height={34} />
      </div>
    </header>
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
  const included = [
    {
      nm: (
        <>
          Proctored Full-Length Adaptive SAT Diagnostic
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
      ds: "Timed under real test conditions, results in 24 to 48 hours"
    },
    {
      nm: "Personalized SAT Improvement Plan",
      ds: "Built from your diagnostic results"
    },
    {
      nm: "Twice-Weekly SAT Tutoring",
      ds: "At least 3 of every 4 sessions are one-on-one"
    },
    {
      nm: "Personalized Lesson Plans",
      ds: "Built around your student's specific gaps"
    },
    {
      nm: "Homework from 3,500+ SAT Practice Questions",
      ds: "That match the style and difficulty of the real SAT"
    },
    {
      nm: "11 Full-Length Digital SAT Practice Tests",
      ds: "One proctored every 4 weeks to measure progress"
    },
    {
      nm: "Weekly Progress Tracking",
      ds: "Reports sent to you and your student every week"
    },
    {
      nm: "Aurora, Our AI SAT Study Companion",
      ds: "24/7 answers, hints, and what-went-wrong explanations"
    },
    {
      nm: "SAT Vocabulary Lists",
      ds: "With context-based exercises"
    },
    {
      nm: "SAT Learning Library",
      ds: "Lessons, examples, and strategy guides"
    },
    {
      nm: "Built-in Desmos Calculator",
      ds: "The same graphing calculator as the real Math section"
    }
  ];

  return (
    <aside className="co-plan co-plan--dark">
      <h2 className="co-plan-title">
        SAT Diagnostic Evaluation &amp; Weekly Tutoring Program
      </h2>

      <p className="co-incl-head">What&apos;s included</p>
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
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);

  useEffect(() => {
    if (!STRIPE_PUBLISHABLE_KEY) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/personalized-enroll/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: lead.slug,
            first: lead.parent.first,
            last:
              lead.parent.last ??
              lead.parent.full.replace(lead.parent.first, "").trim(),
            email: lead.parent.email ?? "",
            tos: false
          })
        });
        const data = (await res.json().catch(() => ({}))) as {
          clientSecret?: string;
          paymentIntentId?: string;
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok || !data.clientSecret) {
          setIntentError(
            data.error ??
              "Could not initialize checkout. Please refresh, or email " +
                lead.advisor.email +
                "."
          );
          return;
        }
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId ?? null);
      } catch (err) {
        if (!cancelled) {
          console.error("personalized-enroll: failed to init PaymentIntent", err);
          setIntentError(
            "Could not reach the checkout service. Please refresh."
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lead.slug, lead.parent.first, lead.parent.last, lead.parent.full, lead.parent.email, lead.advisor.email]);

  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      <section className="co-pay">
        <h2 className="co-pay-title">Purchase Diagnostic &amp; Enroll</h2>
        <p
          role="alert"
          style={{
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 10,
            background: "rgba(176,40,40,0.06)",
            border: "1px solid rgba(176,40,40,0.22)",
            color: "#a92929",
            fontSize: 14
          }}
        >
          Checkout is not configured. Please email {lead.advisor.email} to
          enroll.
        </p>
      </section>
    );
  }

  if (intentError) {
    return (
      <section className="co-pay">
        <h2 className="co-pay-title">Purchase Diagnostic &amp; Enroll</h2>
        <p
          role="alert"
          style={{
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 10,
            background: "rgba(176,40,40,0.06)",
            border: "1px solid rgba(176,40,40,0.22)",
            color: "#a92929",
            fontSize: 14
          }}
        >
          {intentError}
        </p>
      </section>
    );
  }

  if (!clientSecret) {
    return (
      <section className="co-pay">
        <h2 className="co-pay-title">Purchase Diagnostic &amp; Enroll</h2>
        <p
          style={{
            marginTop: 16,
            fontSize: 14,
            color: "var(--fg-mute)"
          }}
        >
          Loading secure checkout&hellip;
        </p>
      </section>
    );
  }

  // PaymentIntent already exists on the server with payment_method_types =
  // ["card"], so when Elements mounts bound to this clientSecret it will
  // only ever render card. No Bank, Klarna, Cash App, Link, etc.
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        // Hide Stripe Link's Autofill prompt — we want the form to look
        // like our own checkout, not Stripe's.
        loader: "never",
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#2f7d46",
            colorText: "#121A2B",
            colorBackground: "#FFFFFF",
            fontFamily:
              "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif",
            borderRadius: "10px"
          },
          rules: {
            ".Input": { border: "none", boxShadow: "none", padding: "0" }
          }
        }
      }}
    >
      <PayCardInner
        lead={lead}
        clientSecret={clientSecret}
        paymentIntentId={paymentIntentId}
      />
    </Elements>
  );
}

function PayCardInner({
  lead,
  clientSecret
}: {
  lead: PersonalizedEnrollLead;
  clientSecret: string;
  paymentIntentId: string | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const derivedLast =
    lead.parent.last ??
    lead.parent.full.replace(lead.parent.first, "").trim();
  const [first, setFirst] = useState(lead.parent.first ?? "");
  const [last, setLast] = useState(derivedLast);
  const [email, setEmail] = useState(lead.parent.email ?? "");
  const [tos, setTos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState<string>(
    `Pay $${lead.pricing.diagPrice} to Enroll`
  );
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState<{
    paymentIntentId: string;
    subscriptionStatus: string;
  } | null>(null);

  async function onPay() {
    setError(null);
    if (!stripe || !elements) {
      setError("Payment is still loading, give it a moment and try again.");
      return;
    }
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
    trackEnrollPaymentClicked({
      ...personalizedEnrollAnalyticsProps(lead),
      source: "main_form"
    });

    try {
      const cardEl = elements.getElement(CardNumberElement);
      if (!cardEl) {
        setError("Payment form is not ready, please try again.");
        setSubmitting(false);
        setSubmitLabel(`Pay $${lead.pricing.diagPrice} to Enroll`);
        return;
      }

      // Confirm the card payment with the PaymentIntent client secret.
      // Stripe handles 3DS challenges inline.
      setSubmitLabel(`Charging $${lead.pricing.diagPrice}\u2026`);
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardEl,
            billing_details: {
              name: `${trimmedFirst} ${trimmedLast}`.trim(),
              email: trimmedEmail
            }
          }
        });

      if (confirmError) {
        trackEnrollPaymentFailed({
          ...personalizedEnrollAnalyticsProps(lead),
          step: "confirm_card",
          errorCode: confirmError.code ?? confirmError.type ?? "confirm_failed"
        });
        setError(
          confirmError.message ??
            "Your card was not accepted. Please try a different card."
        );
        setSubmitting(false);
        setSubmitLabel(`Pay $${lead.pricing.diagPrice} to Enroll`);
        return;
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        setError(
          "Payment is processing. We will follow up by email once it confirms."
        );
        setSubmitting(false);
        setSubmitLabel(`Pay $${lead.pricing.diagPrice} to Enroll`);
        return;
      }

      // 4. Create the weekly subscription with the saved card + 7-day trial.
      setSubmitLabel("Setting up weekly tutoring\u2026");
      const finalizeRes = await fetch(
        "/api/personalized-enroll/finalize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id })
        }
      );
      const finalizeData = (await finalizeRes
        .json()
        .catch(() => ({}))) as {
        subscriptionId?: string;
        status?: string;
        error?: string;
      };

      if (!finalizeRes.ok) {
        trackEnrollPaymentFailed({
          ...personalizedEnrollAnalyticsProps(lead),
          step: "finalize_subscription",
          errorCode: finalizeData.error ?? "finalize_failed"
        });
        setError(
          finalizeData.error ??
            "We charged the diagnostic. Please email " +
              lead.advisor.email +
              " and we will finish your weekly enrollment within 1 business day."
        );
        setSubmitting(false);
        setSubmitLabel(`Pay $${lead.pricing.diagPrice} to Enroll`);
        return;
      }

      trackEnrollPaymentCompleted({
        ...personalizedEnrollAnalyticsProps(lead),
        paymentIntentId: paymentIntent.id,
        subscriptionStatus: finalizeData.status ?? "trialing"
      });
      setSucceeded({
        paymentIntentId: paymentIntent.id,
        subscriptionStatus: finalizeData.status ?? "trialing"
      });
      setSubmitting(false);
    } catch (err) {
      console.error("personalized-enroll on-page checkout client error:", err);
      trackEnrollPaymentFailed({
        ...personalizedEnrollAnalyticsProps(lead),
        step: "client",
        errorCode: err instanceof Error ? err.message : "client_error"
      });
      setError(
        "Something went wrong. Please try again, or email " +
          lead.advisor.email +
          " and we will enroll you directly."
      );
      setSubmitting(false);
      setSubmitLabel(`Pay $${lead.pricing.diagPrice} to Enroll`);
    }
  }

  if (succeeded) {
    return (
      <section className="co-pay">
        <h2 className="co-pay-title">You&apos;re enrolled.</h2>
        <p
          style={{
            margin: "16px 0 0",
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--page-fg)"
          }}
        >
          Thank you, {first}. We charged ${lead.pricing.diagPrice} for{" "}
          {lead.student.first}&apos;s diagnostic and Phase 1 plan, and her
          weekly tutoring is queued up to begin 7 days from now.
        </p>
        <p
          style={{
            margin: "12px 0 0",
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--fg-soft)"
          }}
        >
          {lead.advisor.first} will email you within 1 business day with
          links to schedule {lead.student.first}&apos;s diagnostic and her
          first tutor introduction. Receipt is on its way to {email}.
        </p>
        <p
          style={{
            margin: "16px 0 0",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--fg-mute)"
          }}
        >
          Reference: {succeeded.paymentIntentId}
        </p>
      </section>
    );
  }

  return (
    <section className="co-pay">
      <h2 className="co-pay-title">Purchase Diagnostic &amp; Enroll</h2>

      <div className="co-price">
        <div className="co-price-row">
          <div className="co-price-amt-row">
            <span className="co-price-amt-num">${lead.pricing.diagPrice}</span>
            <span className="co-price-amt-cadence">one time</span>
          </div>
          <p className="co-price-desc">
            Diagnostic, Diagnostic Analysis &amp; Personalized SAT Plan
          </p>
        </div>
        <div className="co-price-row">
          <div className="co-price-amt-row">
            <span className="co-price-amt-num">${lead.pricing.weeklyPrice}</span>
            <span className="co-price-amt-cadence">per week</span>
          </div>
          <p className="co-price-desc">
            For twice weekly tutoring. Billing starts 7 days from checkout.
          </p>
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
      <div className="co-card-fallback">
        <div className="co-cf-num">
          <div className="co-cf-stripe">
            <CardNumberElement options={CARD_ELEMENT_STYLE} />
          </div>
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
            <div className="co-cf-stripe">
              <CardExpiryElement options={CARD_ELEMENT_STYLE} />
            </div>
          </div>
          <div className="co-cf-cell">
            <div className="co-cf-stripe">
              <CardCvcElement options={CARD_ELEMENT_STYLE} />
            </div>
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

      <div className="co-tos">
        <input
          type="checkbox"
          id="tos"
          checked={tos}
          onChange={(e) => setTos(e.target.checked)}
        />
        <label htmlFor="tos">
          I agree to Illuminairy&apos;s Terms, Refund Policy, and Privacy
          Policy. I authorize the ${lead.pricing.diagPrice} charge today and
          weekly billing of ${lead.pricing.weeklyPrice} starting 7 days from
          now.
        </label>
      </div>

      <button
        type="button"
        className="co-paybtn"
        onClick={onPay}
        disabled={submitting || !stripe || !elements}
      >
        <span>{submitLabel}</span>
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
        " upfront, and do you offer a free trial class?",
      a: [
        "The $" +
          diag +
          " covers the work we do before tutoring starts. That includes " +
          student +
          "'s full proctored digital SAT diagnostic, expert review of every missed question, and a custom 12-week tutoring plan.",
        "The diagnostic takes 2 hours and 14 minutes and is run under real test-day conditions. After that, an expert tutor reviews her results and identifies which gaps are costing her the most points. We do not just count missed questions. We look at the question type, difficulty level, and how often that skill appears on the digital SAT. Then we use that analysis to build her plan.",
        "Before week 1, we draft her high-level 12-week plan and write her first two lessons in detail. This lets tutoring start with her highest-impact gaps instead of a generic SAT lesson.",
        "Tutoring is separate and is billed weekly at $" +
          wk +
          " per week. The first 7 days after enrollment are setup time. We use that week to run the diagnostic, analyze the results, build her plan, match her with the right tutor, and schedule her first sessions. Weekly billing starts on day 7, when tutoring begins.",
        "We do not offer free trial classes. A trial class is usually a generic SAT lesson with a tutor who knows nothing about " +
          student +
          " or where she is struggling. That means the tutor may spend the session teaching content she does not need.",
        "Our tutoring is one-on-one, so a trial class has a real cost. A group SAT prep company can offer a free trial because adding one more student to a group lesson does not change their cost. For us, a one-on-one trial would require prep time plus the tutoring hour.",
        "Most SAT prep companies that offer free trials also require a long-term contract or full upfront payment, often $2,500 to $5,000 or more. We do not. Our model is week to week, with no long-term contract. That keeps the program more affordable, but it also means we cannot absorb unpaid one-on-one trial lessons the same way a company collecting thousands of dollars upfront can.",
        "A single trial lesson also does not show the full value of one-on-one tutoring. Students and tutors usually need a few sessions to build rapport. The tutor also needs time to adjust to how the student learns best.",
        "Instead, we monitor session quality. If " +
          student +
          " and her tutor are not connecting, we can review the session, adjust the plan, provide an additional lesson if warranted, or rematch her with a different tutor."
      ]
    },
    {
      q:
        "Can " +
        student +
        " skip the diagnostic since she just took two Bluebook practice tests?",
      a: [
        "Our program works backwards from the diagnostic results, so we need " +
          student +
          " to take our diagnostic before we can build her personalized lessons.",
        "The Bluebook practice tests are useful for getting a general score, but they do not give us enough detail to build her tutoring plan. They show broad results, like her Reading and Writing score, Math score, and some general skill areas. Our diagnostic goes several layers deeper.",
        "For example, we do not just see that geometry is a weakness. We look at which parts of geometry are weak. " +
          student +
          " may understand right triangles but struggle with equilateral triangles. She may understand volume in circle-related problems but miss area questions. That level of detail changes what we teach first.",
        "The same is true for Reading and Writing. We do not just see that grammar is a weakness. We look at the exact grammar skills causing missed points. For example, she may be strong on punctuation overall but struggle with transitions or semicolons. That lets us target the specific skill instead of reteaching content she already knows.",
        "We also need to understand how she performs under real test conditions. The Bluebook practice tests she took were unproctored. We do not know how much time she spent per question, whether she paused, whether she guessed at the end, or whether she ran out of time.",
        "Our diagnostic shows us the pattern behind the score. We can see if she gets central idea questions correct but spends twice as much time as she should, leaving too little time for later questions. We can also see if she missed the final questions because she did not know the content or because she ran out of time.",
        "During the 2-hour and 14-minute proctored diagnostic, we also look at how she works. We can see where she uses Desmos, where she tries to solve mentally, where she hesitates, where she rushes, and where accuracy drops from fatigue. We also see whether she reaches the harder second module or stays in the medium second module because of her module 1 accuracy.",
        "She may get a similar overall score on our diagnostic as she did on Bluebook, but the score is not the main point. We need the question-by-question detail so we can build a plan that starts with the highest-impact gaps.",
        "If she would rather not take the full 2-hour and 14-minute diagnostic, we can build a custom 60-minute version with one Reading and Writing module and one Math module instead of two each. The cost would still be $" +
          diag +
          " because we would need to create a custom diagnostic that does not currently exist in our system.",
        "Just let us know if you would prefer the 60-minute version, and we will set it up."
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
        "Every tutor has personally taken the digital SAT and is trained specifically on its current format: the Desmos calculator, the built-in formula reference, and the adaptive module 1 / module 2 structure. Tutors who only took the paper version are required to retake the digital before they finish our training, and they retrain whenever the College Board changes the test.",
        "We intentionally prefer tutors who have personally taken the digital SAT. Because the digital SAT only launched recently, our tutors are most often current college students at schools like Vanderbilt, Duke, Georgia Tech, and Emory. That is a deliberate choice, different from hiring an older paper-SAT tutor and training them on the new digital format. In practice, very few experienced tutors are willing to retake something as demanding as the SAT for a part-time tutoring role, especially since long-time tutors have no shortage of clients without retaking the digital format and so are not incentivized to do so.",
        "Beyond the credential, students also tend to respond better to near-peer tutors. When we previously used teachers or more mature tutors, students did not build rapport as quickly, and score improvement was not as strong. Many of those teachers had also never taken the digital SAT themselves, which made it harder to coach from direct experience. Over time we intentionally transitioned toward near-peer tutors because students connected with them better and performed better.",
        "Subject-matter expertise alone does not make a great teacher. Every tutor is shadowed before approval and given feedback on their teaching style during training. After they start teaching, we track each tutor's students' accuracy on the question types they teach, and we act on that data.",
        "We do not require tutors to retake the SAT on a fixed schedule. It is not industry-wide or standard practice for tutors to retest. Per-tutor outcome tracking is a more reliable currency check than a retake quota, and we hold company-wide trainings any time anything changes on the SAT.",
        "Before session 1 is scheduled, you and " +
          student +
          " will receive an introduction email from the tutor teaching her first week's lesson, with their school, program, year, section score, and background.",
        "If you have a specific preference for someone with more years of tutoring or teaching experience, " +
          advisor +
          " can reach out to our older tutors. The trade-off is that we may not be able to guarantee they have a verified digital SAT score, since most experienced tutors took the paper version and few are willing to retake the digital for a part-time role. Let me know if you would like to go that route.",
        "If you would prefer the most experienced option, I can also teach " +
          student +
          " personally. I have more years of tutoring experience than most of our tutors, I scored a perfect SAT on the paper version, I have worked as a graduate-level teaching assistant in math-heavy coursework, I hold an MSCS from Georgia Tech and an MBA from Duke, and I am trained on the digital SAT format. The honest trade-off is the same as our older tutors: I have not personally taken the digital SAT, but am well versed in it. Let me know if you would like me to take " +
          student +
          " on directly."
      ]
    },
    {
      q: "Is the first week of weekly classes free?",
      a: [
        "Not exactly, and we want to be clear about it. The first 7 days after enrollment are not classes at all. They are setup time we need to schedule her proctored diagnostic, analyze the results by hand, develop her personalized plan, build her initial lessons, and match her with the right tutor. Personalized tutoring sessions do not begin until day 7, which is also when weekly billing begins. Here is the full timeline:",
        "Today (day 0): you pay $" +
          diag +
          " for the diagnostic, the analysis, and personalized plan. No weekly charge yet.",
        "Days 0 to 7: setup window. We schedule and run her proctored diagnostic, build her plan, develop her initial lessons, and match her with her tutor. No tutoring sessions yet, no weekly billing yet.",
        "Day 7: the first $" +
          wk +
          " charge hits. That covers her 2 personalized tutoring sessions during days 7 to 14.",
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
      {faqs.map((f) => (
        <details key={f.q}>
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
    trackEnrollPaymentClicked({
      ...personalizedEnrollAnalyticsProps(lead),
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
          Pay ${lead.pricing.diagPrice} to Enroll
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
    trackEnrollCheckoutViewed(personalizedEnrollAnalyticsProps(lead));
  }, [lead]);

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
          </div>
        </div>
      </div>

      <PageFooter />
      <MobilePayBar lead={lead} />
    </div>
  );
}
