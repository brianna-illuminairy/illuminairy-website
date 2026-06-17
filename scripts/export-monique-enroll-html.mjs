#!/usr/bin/env node
/**
 * Export /enroll/monique-kylan as standalone HTML for offline design / sharing.
 * Output: ~/Downloads/monique-kylan-enrollment.html
 *
 * Run: node --experimental-strip-types scripts/export-monique-enroll-html.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildStandardFaq,
  getStandardEnrollLead,
  STANDARD_INCLUDED,
  STANDARD_POST_CALL_STEPS,
  STANDARD_TESTIMONIALS
} from "../lib/standard-enroll.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SLUG = "monique-kylan";
const lead = getStandardEnrollLead(SLUG);
if (!lead) {
  console.error(`Lead not found: ${SLUG}`);
  process.exit(1);
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toDataUri(relPath, mime) {
  const buf = readFileSync(join(root, relPath));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

const logoDataUri = toDataUri("public/brand/logo-horizontal.png", "image/png");
const sessionDataUri = toDataUri(
  "public/photos/tutor-student-session-aayan.png",
  "image/png"
);

const cssRaw = readFileSync(
  join(root, "components/standard-enroll/standard-enroll.css"),
  "utf8"
);
const css = cssRaw.replace(/@import url\([^)]+\);\s*/g, "");

const derivedLast =
  lead.parent.last ?? lead.parent.full.replace(lead.parent.first, "").trim();

function checkIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>`;
}

function arrowIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>`;
}

function progressStrip() {
  return STANDARD_POST_CALL_STEPS.map((s, i) => {
    const cls =
      "std-progress-step" +
      (s.state === "done" ? " done" : "") +
      (s.state === "active" ? " active" : "");
    const dot = s.state === "done" ? "&#10003;" : String(i + 1);
    return `<div class="${cls}"><span class="dot">${dot}</span><span class="lbl">${esc(s.label)}</span></div>`;
  }).join("\n");
}

function planCard() {
  const items = STANDARD_INCLUDED.map(
    (it) => `<li>
      <span class="check">${checkIcon()}</span>
      <div><b>${esc(it.nm)}</b><span>${esc(it.ds)}</span></div>
    </li>`
  ).join("\n");

  return `<aside class="std-summary">
    <h2>SAT Diagnostic Evaluation<br>&amp; Weekly Tutoring Program</h2>
    <p class="std-incl-label">What's included</p>
    <ul class="std-incl">${items}</ul>
  </aside>`;
}

function payCard() {
  return `<section class="std-pay">
    <div class="std-pricing">
      <div class="std-pricing-row">
        <div class="std-pricing-desc">Full Length Diagnostic &amp; Personalized Plan</div>
        <div class="std-pricing-amt">$${lead.pricing.diagPrice}</div>
      </div>
      <div class="std-pricing-row">
        <div class="std-pricing-desc">
          Weekly Tutoring 2X/wk
          <span class="sub">Billing starts ${lead.pricing.weeklyTrialDays} days from checkout.</span>
        </div>
        <div class="std-pricing-amt">$${lead.pricing.weeklyPrice}</div>
      </div>
    </div>

    <span class="std-section-label">Billing contact</span>
    <div class="std-combo">
      <div class="std-combo-row">
        <input class="std-combo-cell" type="text" autocomplete="given-name" placeholder="First name" value="${esc(lead.parent.first)}" />
        <input class="std-combo-cell" type="text" autocomplete="family-name" placeholder="Last name" value="${esc(derivedLast)}" />
      </div>
      <div class="std-combo-row">
        <input class="std-combo-cell" type="email" autocomplete="email" placeholder="Email for receipt" value="${esc(lead.parent.email ?? "")}" />
      </div>
    </div>

    <span class="std-section-label mt">Card details</span>
    <div class="std-card">
      <div class="std-cf-num">
        <div class="stripe-host"><span style="color:#9aa29a;font-size:15px;">Card number</span></div>
        <span class="std-brands">
          <span class="std-brand mc"><i class="r"></i><i class="y"></i></span>
          <span class="std-brand visa">VISA</span>
          <span class="std-brand amex">AMEX</span>
          <span class="std-brand disc">DISC</span>
        </span>
      </div>
      <div class="std-cf-row">
        <div class="std-cf-cell"><span style="color:#9aa29a;font-size:15px;">MM / YY</span></div>
        <div class="std-cf-cell">
          <span style="color:#9aa29a;font-size:15px;">CVC</span>
          <svg class="icon" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        </div>
      </div>
    </div>

    <div class="std-tos">
      <input type="checkbox" id="std-tos" />
      <label for="std-tos">
        I agree to Illuminairy's <a href="https://illuminairy.com/terms">Terms</a>,
        <a href="https://illuminairy.com/refund-policy">Refund Policy</a>, and
        <a href="https://illuminairy.com/privacy">Privacy Policy</a>.
        I authorize the $${lead.pricing.diagPrice} charge today and weekly billing of
        $${lead.pricing.weeklyPrice} starting ${lead.pricing.weeklyTrialDays} days from now.
      </label>
    </div>

    <button type="button" class="std-paybtn" id="std-paybtn">
      <span id="std-paylabel">Purchase Diagnostic &amp; Enroll $${lead.pricing.diagPrice}</span>
      <span class="arrow">${arrowIcon()}</span>
    </button>

    <div class="std-trustrow">
      <span><svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>256-bit SSL</span>
      <span><svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/></svg>PCI compliant</span>
      <span><svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5"/></svg>Secured by Stripe</span>
    </div>

    <div class="std-formnote err" id="std-formnote" role="alert" hidden></div>
  </section>`;
}

function reviewStars() {
  const stars = [];
  for (let i = 0; i < 55; i++) {
    const seed = (i * 9301 + 49297) % 233280;
    const r = (n) => ((seed * (n + 1)) % 233280) / 233280;
    stars.push(
      `<i style="left:${Math.round(r(1) * 10000) / 100}%;top:${Math.round(r(2) * 10000) / 100}%;width:${r(3) < 0.2 ? 2.5 : 1.6}px;height:${r(3) < 0.2 ? 2.5 : 1.6}px;--d:${2 + Math.round(r(4) * 50) / 10}s;--mn:${0.05 + Math.round(r(5) * 10) / 100};--mx:${0.3 + Math.round(r(6) * 50) / 100};"></i>`
    );
  }
  return stars.join("\n");
}

function reviewsMarquee() {
  const cards = [...STANDARD_TESTIMONIALS, ...STANDARD_TESTIMONIALS];
  const duration = Math.max(20, STANDARD_TESTIMONIALS.length * 9);
  const html = cards
    .map((t, i) => {
      const gain = t.gain
        ? `<span class="std-rv-gain">${esc(t.gain)}</span>`
        : "";
      const detail = t.detail ? `<span>${esc(t.detail)}</span>` : "";
      return `<div class="std-rv-card c${i % 3}">
        <div class="stars5">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="std-rv-quote">&ldquo;${esc(t.quote)}&rdquo;</p>
        <div class="std-rv-by"><b>${esc(t.name)}</b>${detail}</div>
        ${gain}
      </div>`;
    })
    .join("\n");

  return `<section class="std-reviews" aria-label="What families say">
    <div class="std-rv-stars" aria-hidden="true">${reviewStars()}</div>
    <div class="std-rv-head">
      <h3 class="std-rv-title">Client Testimonials</h3>
      <p class="std-rv-sub"><span class="rstars">&#9733;&#9733;&#9733;&#9733;&#9733;</span> 4.8 average tutor rating</p>
    </div>
    <div class="std-rv-marquee">
      <div class="std-rv-track" style="animation-duration:${duration}s">${html}</div>
    </div>
  </section>`;
}

function faqSection() {
  const groups = buildStandardFaq(lead.pricing.diagPrice, lead.pricing.weeklyPrice);
  const html = groups
    .map((g) => {
      const items = g.items
        .map(
          (f) => `<details>
            <summary>${esc(f.q)}<span class="plus"></span></summary>
            <div class="answer">${f.a.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
          </details>`
        )
        .join("\n");
      return `<details class="std-faq-group">
        <summary class="std-faq-group-summary">
          <svg class="lbl-star" viewBox="0 0 24 24" aria-hidden="true"><use href="#std-star6"/></svg>
          <span class="lbl">${esc(g.label)}</span>
          <span class="plus"></span>
        </summary>
        <div class="std-faq-group-body">${items}</div>
      </details>`;
    })
    .join("\n");

  return `<div class="std-faq">
    <h3>Frequently Asked Questions</h3>
    <div class="std-faq-list">${html}</div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kylan's enrollment | Illuminairy</title>
  <meta name="robots" content="noindex,nofollow" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    .design-note {
      padding: 10px 16px;
      background: #fff3cd;
      border-bottom: 1px solid #e6d48a;
      font-size: 12px;
      line-height: 1.4;
      color: #5c4a12;
      font-family: system-ui, sans-serif;
    }
    ${css}
  </style>
</head>
<body>
  <p class="design-note">Standalone export for ${esc(lead.parent.full)} / ${esc(lead.student.full)} (${SLUG}) · ${new Date().toISOString().slice(0, 10)} · Card fields are visual only; Pay opens the Stripe checkout link.</p>
  <div class="std">
    <svg viewBox="0 0 24 24" width="0" height="0" style="position:absolute" aria-hidden="true">
      <symbol id="std-star6" viewBox="0 0 24 24">
        <path d="M12,0 L14.1,8.36 L22.39,6 L16.2,12 L22.39,18 L14.1,15.64 L12,24 L9.9,15.64 L1.61,18 L7.8,12 L1.61,6 L9.9,8.36 Z"/>
      </symbol>
    </svg>

    <div class="std-topbar">
      <div class="std-topbar-inner">
        <img src="${logoDataUri}" alt="Illuminairy" width="581" height="221" style="height:36px;width:auto" />
      </div>
    </div>

    <div class="std-progress">
      <div class="std-progress-inner">${progressStrip()}</div>
    </div>

    <div class="std-wrap">
      <div class="std-grid">
        ${planCard()}
        ${payCard()}
      </div>
    </div>

    <section class="std-session">
      <span class="eyebrow">Inside a session</span>
      <h3>What a session actually looks like</h3>
      <p>Live and one-on-one, working through a real problem together in real time.</p>
      <figure class="std-session-shot">
        <img src="${sessionDataUri}" alt="A live one-on-one Illuminairy tutoring session: a tutor and student solving a system of equations together on a shared whiteboard." width="1024" height="576" />
      </figure>
    </section>

    ${reviewsMarquee()}
    ${faqSection()}

    <footer class="std-footer">
      <div class="std-footer-inner">
        <ul class="std-footer-links">
          <li><a href="https://illuminairy.com/terms">Terms</a></li>
          <li><a href="https://illuminairy.com/privacy">Privacy</a></li>
          <li><a href="https://illuminairy.com/refund-policy">Refund policy</a></li>
          <li><a href="https://illuminairy.com/contact">Contact</a></li>
        </ul>
        <p class="std-footer-legal">&copy; ${new Date().getFullYear()} Illuminairy. Tutoring services billed weekly, cancel anytime. Results vary by student. SAT and PSAT are trademarks of the College Board, which is not affiliated with this page.</p>
      </div>
    </footer>
  </div>

  <script>
    (function () {
      var paymentLink = ${JSON.stringify(lead.pricing.stripeFallbackLink)};
      var note = document.getElementById("std-formnote");
      var btn = document.getElementById("std-paybtn");
      btn.addEventListener("click", function () {
        if (!document.getElementById("std-tos").checked) {
          note.hidden = false;
          note.textContent = "Please agree to the terms to continue.";
          return;
        }
        note.hidden = true;
        window.location.href = paymentLink;
      });
    })();
  </script>
</body>
</html>
`;

const outPath = join(homedir(), "Downloads", "monique-kylan-enrollment.html");
writeFileSync(outPath, html, "utf8");
console.log(`Wrote ${outPath}`);
