#!/usr/bin/env node
/**
 * Export compact Meta LP (score ticker trust bar) as standalone HTML for design work.
 * Output: ~/Downloads/illuminairy-lp-compact-design.html
 */

import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const STORIES = [
  { name: "Ethan", hs: "Alpharetta High School", rwB: 610, rwA: 740, mB: 560, mA: 670, college: "UGA", verified: true },
  { name: "Sophia", hs: "Milton High School", rwB: 620, rwA: 740, mB: 600, mA: 700, college: "Georgia Tech" },
  { name: "Olivia", hs: "Johns Creek High School", rwB: 590, rwA: 700, mB: 540, mA: 650, college: "Emory" },
  { name: "Liam", hs: "Plano West Senior High School", rwB: 600, rwA: 750, mB: 560, mA: 690, college: "UT Austin" },
  { name: "Isabella", hs: "Highland Park High School", rwB: 640, rwA: 750, mB: 580, mA: 680, college: "SMU" },
  { name: "Noah", hs: "Frisco Liberty High School", rwB: 610, rwA: 730, mB: 530, mA: 660, college: "Texas A&M" },
  { name: "Emily", hs: "Carroll High School", rwB: 610, rwA: 720, mB: 580, mA: 700, college: "Vanderbilt" },
  { name: "Lucas", hs: "Cinco Ranch High School", rwB: 600, rwA: 720, mB: 550, mA: 680, college: "Rice" },
  { name: "Ava", hs: "Memorial High School", rwB: 640, rwA: 770, mB: 560, mA: 670, college: "UT Austin" },
  { name: "Jackson", hs: "Palmetto Senior High School", rwB: 630, rwA: 740, mB: 590, mA: 710, college: "University of Miami" },
  { name: "Emma", hs: "Coral Gables Senior High School", rwB: 600, rwA: 710, mB: 500, mA: 620, college: "UF" },
  { name: "Aiden", hs: "Myers Park High School", rwB: 600, rwA: 730, mB: 570, mA: 680, college: "UNC Chapel Hill" },
  { name: "Chloe", hs: "Chaparral High School", rwB: 580, rwA: 720, mB: 520, mA: 660, college: "Arizona State" },
  { name: "Benjamin", hs: "Langley High School", rwB: 610, rwA: 720, mB: 640, mA: 770, college: "UVA" },
  { name: "Grace", hs: "Brentwood High School", rwB: 640, rwA: 750, mB: 550, mA: 680, college: "Vanderbilt" },
  { name: "Charlotte", hs: "Westfield High School", rwB: 590, rwA: 710, mB: 640, mA: 770, college: "Boston University" }
];

const SCHOOLS = [
  "Lassiter High School",
  "Milton High School",
  "Lambert High School",
  "Northview High School",
  "Carroll High School",
  "Coppell High School",
  "The Woodlands High School"
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function scoreCard(s) {
  const totalB = s.rwB + s.mB;
  const totalA = s.rwA + s.mA;
  const gain = totalA - totalB;
  const verified = s.verified
    ? '<span class="il-trust-score-badge">Verified</span>'
    : "";

  return `<li class="il-trust-bar-item il-trust-bar-score">
  <div class="il-trust-score-card il-trust-score-card--ticker">
    <p class="il-trust-score-name">${esc(s.name)}</p>
    <p class="il-trust-score-hs">${esc(s.hs)}</p>
    <div class="il-trust-score-sections">
      <div class="il-trust-score-section-row">
        <span class="il-trust-score-section-label">Reading &amp; Writing</span>
        <span class="il-trust-score-section-move">
          <span class="il-trust-score-before">${s.rwB}</span>
          <span class="il-trust-score-arrow" aria-hidden="true">→</span>
          <span class="il-trust-score-after">${s.rwA}</span>
        </span>
      </div>
      <div class="il-trust-score-section-row">
        <span class="il-trust-score-section-label">Math</span>
        <span class="il-trust-score-section-move">
          <span class="il-trust-score-before">${s.mB}</span>
          <span class="il-trust-score-arrow" aria-hidden="true">→</span>
          <span class="il-trust-score-after">${s.mA}</span>
        </span>
      </div>
    </div>
    <p class="il-trust-score-total">
      <span class="il-trust-score-section-label">Total</span>
      <span class="il-trust-score-total-move">
        <span class="il-trust-score-before">${totalB}</span>
        <span class="il-trust-score-arrow" aria-hidden="true">→</span>
        <span class="il-trust-score-after">${totalA}</span>
        <span class="il-trust-score-gain">+${gain}</span>
        ${verified}
      </span>
    </p>
    <p class="il-trust-score-college"><span class="il-trust-score-college-label">College:</span> ${esc(s.college)}</p>
  </div>
</li>`;
}

const tickerStories = [...STORIES, ...STORIES].map(scoreCard).join("\n");
const tickerSchools = [...SCHOOLS, ...SCHOOLS]
  .map((school) => `<li class="il-trust-bar-item il-trust-school-marquee-item">${esc(school)}</li>`)
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Illuminairy · Compact LP design export</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; }
    .il-page {
      --brand-navy: #121a2b;
      --brand-aurora: #77c89a;
      --brand-white: #f5f8fa;
      --brand-display: "Schibsted Grotesk", system-ui, sans-serif;
      font-family: var(--brand-display);
      background: #f5f8fa;
      color: #121a2b;
      -webkit-font-smoothing: antialiased;
    }
    .design-note {
      padding: 10px 16px;
      background: #fff3cd;
      border-bottom: 1px solid #e6d48a;
      font-size: 12px;
      line-height: 1.4;
      color: #5c4a12;
    }
    .il-premium-chrome {
      background: linear-gradient(180deg, #121a2b 0%, #121a2b 100%);
      border-bottom: 1px solid rgba(119, 200, 154, 0.12);
    }
    .top-bar { padding: 12px 20px; text-align: center; }
    .wordmark {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #f5f8fa;
    }
    .il-premium-container {
      width: min(1120px, calc(100% - 40px));
      margin-inline: auto;
    }
    .il-premium-hero { padding: 16px 0 20px; background: #f5f8fa; }
    .il-hero-grid { max-width: 720px; margin-inline: auto; }
    .il-h1 {
      font-size: clamp(30px, 4.8vw, 44px);
      line-height: 1.1;
      letter-spacing: -0.03em;
      font-weight: 700;
      margin: 0;
    }
    .il-h1 .accent { color: #2f6e47; }
    .il-hero-subhead {
      margin-top: 12px;
      font-size: clamp(15px, 2vw, 17px);
      line-height: 1.5;
      color: rgba(18, 26, 43, 0.78);
      max-width: 38rem;
    }
    .il-hero-checklist-intro {
      margin: 16px 0 6px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: rgba(18, 26, 43, 0.52);
    }
    .checklist { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
    .checklist li {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      font-size: 14px;
      line-height: 1.45;
      color: rgba(18, 26, 43, 0.82);
    }
    .checklist .check {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #3e8b5a;
      border-radius: 999px;
      color: #3e8b5a;
      font-size: 11px;
      margin-top: 2px;
    }
    .il-hero-cta-wrap { margin-top: 18px; }
    .hero-cta {
      background: #121a2b;
      border: 1px solid rgba(119, 200, 154, 0.2);
      border-radius: 14px;
      padding: 16px 18px 14px;
      color: #f5f8fa;
    }
    .hero-cta .copy {
      font-size: 15px;
      line-height: 1.5;
      color: rgba(245, 248, 250, 0.92);
      margin-bottom: 16px;
    }
    .hero-cta .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      justify-content: center;
      padding: 14px 18px;
      border: none;
      border-radius: 10px;
      background: #77c89a;
      color: #121a2b;
      font: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
    }
    .il-hero-fine-print {
      margin-top: 8px;
      font-size: 10px;
      line-height: 1.35;
      color: rgba(18, 26, 43, 0.48);
    }
    .il-hero-disclaimer {
      margin-top: 4px;
      font-size: 10px;
      line-height: 1.35;
      color: rgba(18, 26, 43, 0.45);
    }
    .il-trust-bar {
      background: #121a2b;
      color: #f5f8fa;
      padding: 14px 0 12px;
      border-top: 1px solid rgba(245, 248, 250, 0.08);
    }
    .il-trust-bar-inner { text-align: center; }
    .il-trust-bar-eyebrow {
      margin: 0 0 4px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(125, 206, 160, 0.9);
    }
    .il-trust-bar-title {
      margin: 0 0 10px;
      font-size: clamp(15px, 2vw, 18px);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #f5f8fa;
    }
    .il-trust-bar-viewport {
      overflow: hidden;
      width: 100%;
      mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
    }
    .il-trust-bar-track {
      display: flex;
      flex-wrap: nowrap;
      align-items: stretch;
      gap: 16px;
      width: max-content;
      margin: 0;
      padding: 4px 0;
      list-style: none;
      animation: il-trust-marquee 65s linear infinite;
    }
    .il-trust-schools-track { animation-duration: 40s; margin-top: 8px; }
    @keyframes il-trust-marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    .il-trust-score-card--ticker {
      min-width: max-content;
      padding: 10px 14px;
      border: 1px solid rgba(245, 248, 250, 0.12);
      border-radius: 12px;
      background: rgba(245, 248, 250, 0.04);
      text-align: left;
    }
    .il-trust-score-name { margin: 0; font-size: 14px; font-weight: 700; }
    .il-trust-score-hs { margin: 0; font-size: 11px; color: rgba(245, 248, 250, 0.58); }
    .il-trust-score-sections { margin-top: 4px; display: grid; gap: 2px; }
    .il-trust-score-section-row {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: baseline;
    }
    .il-trust-score-section-label {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      color: rgba(245, 248, 250, 0.45);
    }
    .il-trust-score-section-move {
      font-size: 13px;
      font-weight: 700;
      display: inline-flex;
      gap: 6px;
      align-items: baseline;
    }
    .il-trust-score-before { color: rgba(245, 248, 250, 0.55); }
    .il-trust-score-after { color: #7dcea0; }
    .il-trust-score-total {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin: 4px 0 0;
      padding-top: 4px;
      border-top: 1px solid rgba(245, 248, 250, 0.1);
    }
    .il-trust-score-total-move { font-size: 15px; font-weight: 700; display: inline-flex; gap: 6px; align-items: baseline; }
    .il-trust-score-gain { font-size: 12px; color: rgba(125, 206, 160, 0.95); }
    .il-trust-score-badge {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      background: rgba(125, 206, 160, 0.18);
      color: #7dcea0;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .il-trust-score-college { margin: 4px 0 0; font-size: 10px; color: rgba(245, 248, 250, 0.82); }
    .il-trust-score-college-label { color: rgba(245, 248, 250, 0.45); font-weight: 500; }
    .il-trust-school-marquee-item {
      font-size: 14px;
      font-weight: 600;
      color: rgba(245, 248, 250, 0.72);
      white-space: nowrap;
    }
    .il-trust-bar-disclaimer {
      margin: 8px auto 0;
      max-width: 40rem;
      font-size: 10px;
      line-height: 1.35;
      color: rgba(245, 248, 250, 0.45);
    }
    .il-cold-footer {
      padding: 10px 0 16px;
      border-top: 1px solid rgba(18, 26, 43, 0.08);
      background: #f5f8fa;
    }
    .il-cold-footer .links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px 16px;
      margin: 0 0 6px;
      padding: 0;
      list-style: none;
    }
    .il-cold-footer .links a { font-size: 11px; color: rgba(18, 26, 43, 0.55); text-decoration: none; }
    .footer-legal, .footer-copy { margin: 0; font-size: 10px; line-height: 1.35; color: rgba(18, 26, 43, 0.45); text-align: center; }
  </style>
</head>
<body>
  <p class="design-note">Design export · Illuminairy compact Meta LP · score ticker trust bar · ${new Date().toISOString().slice(0, 10)} · Edit freely; not wired to production.</p>
  <div class="il-page il-brand light il-premium il-lp-cold il-layout-compact il-layout-hero-only" data-display="schibsted">
    <div class="il-premium-chrome">
      <header class="top-bar"><div class="wordmark">Illuminairy</div></header>
    </div>
    <div class="il-premium-hero">
      <div class="il-premium-container">
        <div class="il-hero-grid il-hero-grid--text-only">
          <div class="il-hero-main">
            <section class="il-hero-section">
              <h1 class="il-h1">
                SAT in the 1100s or 1200s.<br />
                <span class="accent">Target colleges expect scores around 1400?</span><br />
                Find out what's still realistic before their fall test.
              </h1>
              <p class="il-hero-subhead">Most students start in the 1100s or 1200s and finish in the 1400s — sometimes the 1300s or 1500s.</p>
              <p class="il-hero-checklist-intro">You'll see:</p>
              <ul class="checklist il-hero-checklist">
                <li><span class="check" aria-hidden="true">✓</span>Why their last SAT score is stuck (even with good grades)</li>
                <li><span class="check" aria-hidden="true">✓</span>Whether more Khan / Bluebook will actually move the official score</li>
                <li><span class="check" aria-hidden="true">✓</span>What score is realistic before August, September, or October</li>
                <li><span class="check" aria-hidden="true">✓</span>Whether 150–200+ points is still possible before applications</li>
                <li><span class="check" aria-hidden="true">✓</span>What to study first so the fall retake is not the same result</li>
              </ul>
            </section>
            <div class="il-hero-cta-wrap">
              <div class="hero-cta">
                <p class="copy">Answer a few questions about your child. We show you why their score is stuck, what's realistic before their next test, and what to focus on first.</p>
                <button type="button" class="btn">Build their free SAT Improvement Plan <span class="arrow">→</span></button>
              </div>
              <p class="il-hero-fine-print">Free for parents · about 2 minutes · no test for your child.</p>
              <p class="il-hero-disclaimer">Students who completed our 12-week program averaged +182 points (n=95). Results vary.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section class="il-trust-bar il-trust-bar--scores il-trust-bar--ticker il-trust-bar--national" aria-labelledby="il-trust-bar-heading">
      <div class="il-premium-container il-trust-bar-inner">
        <p class="il-trust-bar-eyebrow">We've helped hundreds of families get the SAT score they need.</p>
        <p id="il-trust-bar-heading" class="il-trust-bar-title">Verified score improvements from our customers</p>
        <div class="il-trust-scores-block">
          <div class="il-trust-bar-viewport">
            <ul class="il-trust-bar-track il-trust-scores-track" aria-label="Student outcomes">
${tickerStories}
            </ul>
          </div>
        </div>
        <div class="il-trust-bar-viewport il-trust-schools-marquee-wrap">
          <ul class="il-trust-bar-track il-trust-schools-track" aria-label="High schools">
${tickerSchools}
          </ul>
        </div>
        <p class="il-trust-bar-disclaimer">Results are not guaranteed and vary based on starting score, effort, consistency, and many other factors. Students who completed our 12-week program averaged +182 points.</p>
      </div>
    </section>
    <footer class="footer il-cold-footer">
      <div class="il-premium-container">
        <nav class="links" aria-label="Legal">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Refund Policy</a>
          <a href="#">Support Policy</a>
        </nav>
        <p class="footer-legal">SAT and PSAT are trademarks of the College Board, which is not affiliated with this site. Individual results vary.</p>
        <p class="footer-copy">© ${new Date().getFullYear()} Illuminairy.</p>
      </div>
    </footer>
  </div>
</body>
</html>
`;

const outPath = join(homedir(), "Downloads", "illuminairy-lp-compact-design.html");
writeFileSync(outPath, html, "utf8");
console.log(`Wrote ${outPath}`);
