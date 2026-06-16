"use client";

/**
 * Standard post-Strategy Call enrollment page.
 *
 * Built directly from `~/Downloads/illuminairy-checkout (4).html` and
 * `SAT Checkout (standalone).html`. Does not import from
 * `components/personalized-enroll/*` or `lib/personalized-enroll.ts` —
 * Sohail's stack is locked.
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { loadStripe, type Stripe as StripeJs } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents } from "@/lib/analytics-events";
import {
  STANDARD_INCLUDED,
  STANDARD_POST_CALL_STEPS,
  STANDARD_TESTIMONIALS,
  buildStandardFaq,
  type StandardEnrollLead
} from "@/lib/standard-enroll";
import type { StandardEnrollInit } from "@/lib/standard-enroll-server";
import "./standard-enroll.css";

const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise: Promise<StripeJs | null> = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

const CARD_ELEMENT_STYLE = {
  showIcon: false,
  style: {
    base: {
      fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
      fontSize: "15px",
      fontWeight: "400",
      color: "#11212b",
      "::placeholder": { color: "#9aa29a" }
    },
    invalid: { color: "#9a2b2b" }
  }
} as const;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
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
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

function StarSymbol() {
  return (
    <svg viewBox="0 0 24 24" width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="std-star6" viewBox="0 0 24 24">
        <path d="M12,0 L14.1,8.36 L22.39,6 L16.2,12 L22.39,18 L14.1,15.64 L12,24 L9.9,15.64 L1.61,18 L7.8,12 L1.61,6 L9.9,8.36 Z" />
      </symbol>
    </svg>
  );
}

// Brand lockup ratio (matches /brand/logo-horizontal.png at 581 x 221).
const LOGO_W = 581;
const LOGO_H = 221;

function TopBar() {
  return (
    <div className="std-topbar">
      <div className="std-topbar-inner">
        <Image
          src="/brand/logo-horizontal.png"
          alt="Illuminairy"
          width={LOGO_W}
          height={LOGO_H}
          priority
          style={{ height: 36, width: "auto" }}
        />
      </div>
    </div>
  );
}

function ProgressStrip() {
  return (
    <div className="std-progress">
      <div className="std-progress-inner">
        {STANDARD_POST_CALL_STEPS.map((s, i) => (
          <div
            key={s.label}
            className={
              "std-progress-step" +
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

function PlanCard() {
  return (
    <aside className="std-summary">
      <h2>
        SAT Diagnostic Evaluation
        <br />
        &amp; Weekly Tutoring Program
      </h2>
      <p className="std-incl-label">What&apos;s included</p>
      <ul className="std-incl">
        {STANDARD_INCLUDED.map((it) => (
          <li key={it.nm}>
            <span className="check">
              <CheckIcon />
            </span>
            <div>
              <b>{it.nm}</b>
              <span>{it.ds}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function PayCard({
  lead,
  init
}: {
  lead: StandardEnrollLead;
  init: StandardEnrollInit;
}) {
  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      <section className="std-pay">
        <div className="std-formnote err" role="alert">
          Checkout is not configured. Please email {lead.advisor.email} to enroll.
        </div>
      </section>
    );
  }

  if (!init.ok) {
    return (
      <section className="std-pay">
        <div className="std-formnote err" role="alert">
          {init.error}
        </div>
      </section>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: init.clientSecret,
        loader: "never",
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#2f7d46",
            colorText: "#11212b",
            colorBackground: "#ffffff",
            fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
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
        clientSecret={init.clientSecret}
        paymentIntentId={init.paymentIntentId}
      />
    </Elements>
  );
}

function PayCardInner({
  lead,
  clientSecret
}: {
  lead: StandardEnrollLead;
  clientSecret: string;
  paymentIntentId: string | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const derivedLast =
    lead.parent.last ?? lead.parent.full.replace(lead.parent.first, "").trim();
  const [first, setFirst] = useState(lead.parent.first ?? "");
  const [last, setLast] = useState(derivedLast);
  const [email, setEmail] = useState(lead.parent.email ?? "");
  const [tos, setTos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState<string>(
    `Purchase Diagnostic & Enroll $${lead.pricing.diagPrice}`
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
    captureAnalytics(AnalyticsEvents.standardEnrollPaymentClicked, {
      slug: lead.slug,
      source: "main_form"
    });

    try {
      const cardEl = elements.getElement(CardNumberElement);
      if (!cardEl) {
        setError("Payment form is not ready, please try again.");
        setSubmitting(false);
        setSubmitLabel(`Purchase Diagnostic & Enroll $${lead.pricing.diagPrice}`);
        return;
      }

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
        setError(
          confirmError.message ??
            "Your card was not accepted. Please try a different card."
        );
        setSubmitting(false);
        setSubmitLabel(`Purchase Diagnostic & Enroll $${lead.pricing.diagPrice}`);
        return;
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        setError(
          "Payment is processing. We will follow up by email once it confirms."
        );
        setSubmitting(false);
        setSubmitLabel(`Purchase Diagnostic & Enroll $${lead.pricing.diagPrice}`);
        return;
      }

      setSubmitLabel("Setting up weekly tutoring\u2026");
      const finalizeRes = await fetch("/api/standard-enroll/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id })
      });
      const finalizeData = (await finalizeRes.json().catch(() => ({}))) as {
        subscriptionId?: string;
        status?: string;
        error?: string;
      };

      if (!finalizeRes.ok) {
        setError(
          finalizeData.error ??
            "We charged the diagnostic. Please email " +
              lead.advisor.email +
              " and we will finish your weekly enrollment within 1 business day."
        );
        setSubmitting(false);
        setSubmitLabel(`Purchase Diagnostic & Enroll $${lead.pricing.diagPrice}`);
        return;
      }

      setSucceeded({
        paymentIntentId: paymentIntent.id,
        subscriptionStatus: finalizeData.status ?? "trialing"
      });
      setSubmitting(false);
    } catch (err) {
      console.error("standard-enroll on-page checkout client error:", err);
      setError(
        "Something went wrong. Please try again, or email " +
          lead.advisor.email +
          " and we will enroll you directly."
      );
      setSubmitting(false);
      setSubmitLabel(`Purchase Diagnostic & Enroll $${lead.pricing.diagPrice}`);
    }
  }

  if (succeeded) {
    return (
      <section className="std-pay">
        <h2>You&apos;re enrolled.</h2>
        <p style={{ marginTop: 12, fontSize: "0.95rem", lineHeight: 1.55, color: "#11212b" }}>
          Thank you, {first}. We charged ${lead.pricing.diagPrice} for{" "}
          {lead.student.first}&apos;s diagnostic and personalized plan, and
          weekly tutoring is queued up to begin 7 days from now.
        </p>
        <p style={{ marginTop: 10, fontSize: "0.88rem", lineHeight: 1.55, color: "#697078" }}>
          {lead.advisor.first} will email you within 1 business day with links
          to schedule {lead.student.first}&apos;s diagnostic and the first
          tutor introduction. A receipt is on its way to {email}.
        </p>
        <p
          style={{
            marginTop: 14,
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9aa29a"
          }}
        >
          Reference: {succeeded.paymentIntentId}
        </p>
      </section>
    );
  }

  return (
    <section className="std-pay">
      <div className="std-pricing">
        <div className="std-pricing-row">
          <div className="std-pricing-desc">
            Full Length Diagnostic &amp; Personalized Plan
          </div>
          <div className="std-pricing-amt">${lead.pricing.diagPrice}</div>
        </div>
        <div className="std-pricing-row">
          <div className="std-pricing-desc">
            Weekly Tutoring 2X/wk
            <span className="sub">Billing starts 7 days from checkout.</span>
          </div>
          <div className="std-pricing-amt">${lead.pricing.weeklyPrice}</div>
        </div>
      </div>

      <span className="std-section-label">Billing contact</span>
      <div className="std-combo">
        <div className="std-combo-row">
          <input
            className="std-combo-cell"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
          <input
            className="std-combo-cell"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            value={last}
            onChange={(e) => setLast(e.target.value)}
          />
        </div>
        <div className="std-combo-row">
          <input
            className="std-combo-cell"
            type="email"
            autoComplete="email"
            placeholder="Email for receipt"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <span className="std-section-label mt">Card details</span>
      <div className="std-card">
        <div className="std-cf-num">
          <div className="stripe-host">
            <CardNumberElement options={CARD_ELEMENT_STYLE} />
          </div>
          <span className="std-brands">
            <span className="std-brand mc">
              <i className="r" />
              <i className="y" />
            </span>
            <span className="std-brand visa">VISA</span>
            <span className="std-brand amex">AMEX</span>
            <span className="std-brand disc">DISC</span>
          </span>
        </div>
        <div className="std-cf-row">
          <div className="std-cf-cell">
            <div className="stripe-host">
              <CardExpiryElement options={CARD_ELEMENT_STYLE} />
            </div>
          </div>
          <div className="std-cf-cell">
            <div className="stripe-host">
              <CardCvcElement options={CARD_ELEMENT_STYLE} />
            </div>
            <svg
              className="icon"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        </div>
      </div>

      <div className="std-tos">
        <input
          type="checkbox"
          id="std-tos"
          checked={tos}
          onChange={(e) => setTos(e.target.checked)}
        />
        <label htmlFor="std-tos">
          I agree to Illuminairy&apos;s <a href="/terms">Terms</a>,{" "}
          <a href="/refund-policy">Refund Policy</a>, and{" "}
          <a href="/privacy">Privacy Policy</a>. I authorize the $
          {lead.pricing.diagPrice} charge today and weekly billing of $
          {lead.pricing.weeklyPrice} starting 7 days from now.
        </label>
      </div>

      <button
        type="button"
        className="std-paybtn"
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

      <div className="std-trustrow">
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
          <svg viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Secured by Stripe
        </span>
      </div>

      {error && (
        <div className="std-formnote err" role="alert">
          {error}
        </div>
      )}
    </section>
  );
}

function SessionShot() {
  return (
    <section className="std-session">
      <span className="eyebrow">Inside a session</span>
      <h3>What a session actually looks like</h3>
      <p>
        Live and one-on-one, working through a real problem together in real
        time.
      </p>
      <figure className="std-session-shot">
        <Image
          src="/photos/tutor-student-session-aayan.png"
          alt="A live one-on-one Illuminairy tutoring session: a tutor and student solving a system of equations together on a shared whiteboard."
          width={1024}
          height={576}
          priority={false}
          sizes="(min-width: 1080px) 1080px, 100vw"
        />
      </figure>
    </section>
  );
}

function ReviewsMarquee() {
  // Duplicate the list so the CSS marquee loops seamlessly via -50% translate.
  const cards = [...STANDARD_TESTIMONIALS, ...STANDARD_TESTIMONIALS];
  // Star sprinkles — deterministic so SSR + client agree.
  const stars: Array<{
    id: number;
    left: number;
    top: number;
    size: number;
    d: number;
    mn: number;
    mx: number;
  }> = [];
  for (let i = 0; i < 55; i++) {
    const seed = (i * 9301 + 49297) % 233280;
    const r = (n: number) => ((seed * (n + 1)) % 233280) / 233280;
    stars.push({
      id: i,
      left: Math.round(r(1) * 10000) / 100,
      top: Math.round(r(2) * 10000) / 100,
      size: r(3) < 0.2 ? 2.5 : 1.6,
      d: 2 + Math.round(r(4) * 50) / 10,
      mn: 0.05 + Math.round(r(5) * 10) / 100,
      mx: 0.3 + Math.round(r(6) * 50) / 100
    });
  }

  return (
    <section className="std-reviews" aria-label="What families say">
      <div className="std-rv-stars" aria-hidden="true">
        {stars.map((s) => (
          <i
            key={s.id}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              ["--d" as string]: `${s.d}s`,
              ["--mn" as string]: `${s.mn}`,
              ["--mx" as string]: `${s.mx}`
            }}
          />
        ))}
      </div>
      <div className="std-rv-head">
        <h3 className="std-rv-title">Client Testimonials</h3>
        <p className="std-rv-sub">
          <span className="rstars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>{" "}
          4.8 average tutor rating
        </p>
      </div>
      <div className="std-rv-marquee">
        <div
          className="std-rv-track"
          style={{
            animationDuration: `${Math.max(20, STANDARD_TESTIMONIALS.length * 9)}s`
          }}
        >
          {cards.map((t, i) => (
            <div className={`std-rv-card c${i % 3}`} key={i}>
              <div className="stars5">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="std-rv-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="std-rv-by">
                <b>{t.name}</b>
                {t.detail ? <span>{t.detail}</span> : null}
              </div>
              {t.gain ? <span className="std-rv-gain">{t.gain}</span> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ lead }: { lead: StandardEnrollLead }) {
  const groups = buildStandardFaq(
    lead.pricing.diagPrice,
    lead.pricing.weeklyPrice
  );
  return (
    <div className="std-faq">
      <h3>Frequently Asked Questions</h3>
      <div className="std-faq-list">
        {groups.map((g, gi) => (
          <details className="std-faq-group" key={g.label}>
            <summary className="std-faq-group-summary">
              <svg className="lbl-star" viewBox="0 0 24 24" aria-hidden="true">
                <use href="#std-star6" />
              </svg>
              <span className="lbl">{g.label}</span>
              <span className="plus" />
            </summary>
            <div className="std-faq-group-body">
              {g.items.map((f) => (
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
          </details>
        ))}
      </div>
    </div>
  );
}

function PageFooter() {
  return (
    <footer className="std-footer">
      <div className="std-footer-inner">
        <ul className="std-footer-links">
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
        <p className="std-footer-legal">
          © {new Date().getFullYear()} Illuminairy. Tutoring services billed
          weekly, cancel anytime. Results vary by student. SAT and PSAT are
          trademarks of the College Board, which is not affiliated with this
          page.
        </p>
      </div>
    </footer>
  );
}

type Props = { lead: StandardEnrollLead; init: StandardEnrollInit };

export function StandardEnrollPage({ lead, init }: Props) {
  useEffect(() => {
    captureAnalytics(AnalyticsEvents.standardEnrollPageViewed, {
      slug: lead.slug
    });
  }, [lead.slug]);

  return (
    <div className="std">
      <StarSymbol />
      <TopBar />
      <ProgressStrip />
      <div className="std-wrap">
        <div className="std-grid">
          <PlanCard />
          <PayCard lead={lead} init={init} />
        </div>
      </div>
      <SessionShot />
      <ReviewsMarquee />
      <FaqSection lead={lead} />
      <PageFooter />
    </div>
  );
}
