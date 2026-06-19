"use client";

import { useState } from "react";
import Link from "next/link";
import { LedgerRank } from "@/components/data-viz/ledger-rank";
import { MilestoneRibbon } from "@/components/data-viz/milestone-ribbon";
import {
  skyeMathLedgerRows,
  skyeMilestonePins,
  skyeMilestoneWeeks,
  skyeRwLedgerRows,
} from "@/lib/data-viz/adapters/skye-plan";
import { PLAN_TOTALS } from "@/lib/skye/plan-skill-data";
import { currentPlanWeek, SKYE_TARGET_TEST, SKYE_WEEKLY_PLAN } from "@/lib/skye/weekly-plan";

function WeekPlanCard({ week, isCurrent }: { week: (typeof SKYE_WEEKLY_PLAN)[number]; isCurrent: boolean }) {
  const [open, setOpen] = useState(isCurrent);
  const sectionTag =
    week.section === "rw"
      ? "Reading & Writing"
      : week.section === "math"
        ? "Math"
        : week.section === "diagnostic"
          ? "Diagnostic review"
          : "Review";

  return (
    <div
      className={`skye-plan__week-card${isCurrent ? " is-current" : ""}${week.phase === "review" ? " is-review" : ""}${week.phase === "diagnostic" ? " is-diagnostic" : ""}`}
    >
      <button
        type="button"
        className="skye-plan__week-head"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <p className="skye-plan__week-title">
            Week {week.week}: {week.skillLabel}
          </p>
          <p className="diag-report__lede" style={{ margin: "4px 0 0", fontSize: 13 }}>
            {week.dateLabel}
          </p>
        </div>
        <div className="skye-plan__week-meta">
          <span
            className={`skye-plan__week-tag skye-plan__week-tag--${week.section === "review" ? "review" : week.section}`}
          >
            {sectionTag}
          </span>
          {week.hasPracticeTest ? (
            <span className="skye-plan__week-tag skye-plan__week-tag--test">+ Practice test</span>
          ) : null}
        </div>
      </button>
      {open ? (
        <div className="skye-plan__week-body">
          {week.reviewFocus ? <p>{week.reviewFocus}</p> : null}
          {week.sessions?.map((session) => (
            <div key={session.n} className="skye-plan__session">
              <p className="skye-plan__session-label">Session {session.n}</p>
              <p className="skye-plan__session-focus">{session.focus}</p>
              <p className="skye-plan__session-hw">Homework: {session.homework}</p>
            </div>
          ))}
          {week.hasPracticeTest ? (
            <p className="skye-plan__week-addon">
              Also this week: full-length practice test (2 hr 14 min) after Session 2 homework.
            </p>
          ) : null}
          {week.volume ? <p className="diag-report__lede">{week.volume}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export function SkyePlanSkillContent() {
  const activeWeek = currentPlanWeek();

  return (
    <div className="skye-plan">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Improvement Plan</p>
        <h1 className="aurora-portal__title">Skye&apos;s SAT plan</h1>
        <p className="aurora-portal__lede">
          {PLAN_TOTALS.missCount} missed questions map to about {PLAN_TOTALS.recoverable} recoverable
          points from a {PLAN_TOTALS.baselineScore} baseline. Week 1 reviews the diagnostic: question
          types and what each item is asking for. Thirteen skill weeks follow (starting June 30), with a
          full-length practice test every fourth skill week, then two weeks of practice and mistake review
          before the {SKYE_TARGET_TEST.label}.
        </p>
      </header>

      <section className="skye-plan__section">
        <h2>Reading & Writing · ~{PLAN_TOTALS.rwSection} recoverable</h2>
        <p className="skye-plan__section-lede">Ranked by where the most movement is in this section.</p>
        <LedgerRank
          rows={skyeRwLedgerRows()}
          footerLeft="Section subtotal"
          footerTotal={PLAN_TOTALS.rwSection}
          ariaLabel="Reading and writing skills ranked by recoverable points"
        />
      </section>

      <section className="skye-plan__section">
        <h2>Math · ~{PLAN_TOTALS.mathSection} recoverable</h2>
        <p className="skye-plan__section-lede">Ranked by where the most movement is in this section.</p>
        <LedgerRank
          rows={skyeMathLedgerRows()}
          footerLeft="Section subtotal"
          footerTotal={PLAN_TOTALS.mathSection}
          ariaLabel="Math skills ranked by recoverable points"
        />
      </section>

      <section className="skye-plan__section">
        <h2>Sixteen-week schedule</h2>
        <p className="skye-plan__section-lede">
          Week 1 maps diagnostic misses to question types. Then one skill per week, alternating Reading
          &amp; Writing and Math, with two sessions and homework on each topic week.
        </p>
        <MilestoneRibbon
          weeks={skyeMilestoneWeeks()}
          pins={skyeMilestonePins()}
          ariaLabel="Sixteen week SAT improvement schedule"
        />
        <div className="skye-plan__week-list">
          {SKYE_WEEKLY_PLAN.map((week) => (
            <WeekPlanCard key={week.week} week={week} isCurrent={activeWeek === week.week} />
          ))}
        </div>
      </section>

      <p className="skye-plan__foot-link">
        For question-level misses and teaching notes, see the{" "}
        <Link href="/skye/diagnostic">Diagnostic Analysis</Link> tab.
      </p>
    </div>
  );
}
